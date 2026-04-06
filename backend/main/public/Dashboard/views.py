from rest_framework.decorators import api_view, permission_classes
from rest_framework.response import Response
from rest_framework import status
from django.db.models import Sum, F
from django.utils import timezone
from datetime import date, timedelta
from rest_framework.permissions import AllowAny
from .models import ClassDemographics, ClassAttendance, PublicHoliday, AttendanceAccessLink
from .serializers import PublicHolidaySerializer, AttendanceSerializer
from django.shortcuts import render, redirect
from .forms import AttendanceEntryForm
from django.contrib import messages
from django.utils.translation import gettext as _
from nepali_datetime import date as nepali_date
from datetime import time, date
import nepali_datetime

@api_view(['GET'])
@permission_classes([AllowAny])
def school_dashboard(request):
    selected_date = request.query_params.get('date', None)
    if selected_date:
        try:
            selected_date = date.fromisoformat(selected_date)
        except (ValueError, TypeError):
            return Response(
                {"error": "Invalid date format. Use YYYY-MM-DD."},
                status=status.HTTP_400_BAD_REQUEST
            )
    else:
        selected_date = timezone.now().date()
    attendance_records = ClassAttendance.objects.filter(date=selected_date)
    if not attendance_records.exists():
        prev_date = selected_date - timedelta(days=1)
        attendance_records = ClassAttendance.objects.filter(date=prev_date)
        if attendance_records.exists():
            selected_date = prev_date

    all_demographics = ClassDemographics.objects.select_related('grade').all()
    attendance_agg = attendance_records.aggregate(
        total_present=Sum(F('boys_present') + F('girls_present') + F('other_gender_present')),
        boys_present=Sum('boys_present'),
        girls_present=Sum('girls_present'),
        other_gender_present=Sum('other_gender_present'),
    )
    demo_agg = all_demographics.aggregate(
        total_students=Sum(F('boys_count') + F('girls_count') + F('other_gender_count')),
        boys_total=Sum('boys_count'),
        girls_total=Sum('girls_count'),
        other_gender_total=Sum('other_gender_count'),
    )
    school_totals = {
        'date': selected_date,
        'total_students': demo_agg['total_students'] or 0,
        'total_present': attendance_agg['total_present'] or 0,
        'total_absent': 0,
        'boys_total': demo_agg['boys_total'] or 0,
        'boys_present': attendance_agg['boys_present'] or 0,
        'boys_absent': 0,
        'girls_total': demo_agg['girls_total'] or 0,
        'girls_present': attendance_agg['girls_present'] or 0,
        'girls_absent': 0,
        'other_gender_total': demo_agg['other_gender_total'] or 0,
        'other_gender_present': attendance_agg['other_gender_present'] or 0,
        'other_gender_absent': 0
    }
    school_totals['total_absent'] = school_totals['total_students'] - school_totals['total_present']
    school_totals['boys_absent'] = school_totals['boys_total'] - school_totals['boys_present']
    school_totals['girls_absent'] = school_totals['girls_total'] - school_totals['girls_present']
    school_totals['other_gender_absent'] = school_totals['other_gender_total'] - school_totals['other_gender_present']
    classes_data = []
    for demo in all_demographics:
        attendance = attendance_records.filter(demographics=demo).aggregate(
            boys_present=Sum('boys_present'),
            girls_present=Sum('girls_present'),
            other_gender_present=Sum('other_gender_present'),
        )
        boys_present = attendance['boys_present'] or 0
        girls_present = attendance['girls_present'] or 0
        other_gender_present = attendance['other_gender_present'] or 0
        total_students = demo.boys_count + demo.girls_count + demo.other_gender_count
        present_count = boys_present + girls_present + other_gender_present
        class_data = {
            'grade_id': demo.grade.id,
            'grade_name': demo.grade.get_display_name(),
            'total_students': total_students,
            'total_present': present_count,
            'total_absent': total_students - present_count,
            'boys_total': demo.boys_count,
            'boys_present': boys_present,
            'boys_absent': demo.boys_count - boys_present,
            'girls_total': demo.girls_count,
            'girls_present': girls_present,
            'girls_absent': demo.girls_count - girls_present,
            'other_gender_total': demo.other_gender_count,
            'other_gender_present': other_gender_present,
            'other_gender_absent': demo.other_gender_count - other_gender_present,
            'attendance_percentage': round((present_count / total_students) * 100, 2) if total_students > 0 else 0
        }
        classes_data.append(class_data)
    date_limit = timezone.now().date() - timedelta(days=30)
    available_dates = ClassAttendance.objects.filter(date__gte=date_limit) \
        .dates('date', 'day') \
        .order_by('-date')[:30]
    response_data = {
        'date': selected_date.strftime('%Y-%m-%d'),
        'nepali_date': nepali_date.from_datetime_date(selected_date).strftime('%Y-%m-%d'),
        'is_holiday': PublicHoliday.today_is_holiday(),
        'school_totals': school_totals,
        'classes': classes_data,
        'available_dates': [d.strftime('%Y-%m-%d') for d in available_dates],
        'last_updated': timezone.now().isoformat()
    }
    return Response(response_data, status=status.HTTP_200_OK)




@api_view(['GET'])
def public_holiday_banner_api(request):
    today = timezone.now().date()

    holidays = PublicHoliday.objects.filter(
        start_date__lte=today,
        end_date__gte=today,
        published=True
    ).order_by('start_date')

    holidays_data = []
    for holiday in holidays:
        start_nepali = nepali_datetime.date.from_datetime_date(holiday.start_date)
        end_nepali = nepali_datetime.date.from_datetime_date(holiday.end_date)

        holidays_data.append({
            "id": holiday.id,
            "name": holiday.name,
            "description": holiday.description or f"Best wishes on {holiday.name}!",
            "start_date_nepali": start_nepali.strftime('%K-%n-%D'),
            "end_date_nepali": end_nepali.strftime('%K-%n-%D'),
            "start_date": holiday.start_date.isoformat(),
            "end_date": holiday.end_date.isoformat(),
        })

    return Response({"holidays": holidays_data})





def is_within_time_window(start_time, end_time):
    now = timezone.localtime().time()
    return start_time <= now <= end_time

def teacher_attendance_portal(request, access_key):
    form = AttendanceEntryForm()
    today = timezone.localtime().date()

    # Check if it's a holiday
    if PublicHoliday.today_is_holiday():
        messages.error(request, _("Access not allowed today. It's a holiday."))
        return render(request, 'attendance/attendance_form.html', {
            'form': form,
            'access_key': access_key,
            'is_valid_link': False
        })

    # Try to retrieve the access link
    try:
        access_link = AttendanceAccessLink.objects.get(
            access_key=access_key,
            is_active=True
        )

        # Check for expiry
        if access_link.expires_at and access_link.expires_at < timezone.now():
            messages.error(request, _("This access link has expired."))
            return render(request, 'attendance/attendance_form.html', {
                'form': form,
                'access_key': access_key,
                'is_valid_link': False
            })

        # Check allowed time window from model fields
        if access_link.available_from and access_link.available_until:
            if not is_within_time_window(access_link.available_from, access_link.available_until):
                messages.error(
                    request,
                    _(f"Access is allowed only between {access_link.available_from.strftime('%I:%M %p')} "
                      f"and {access_link.available_until.strftime('%I:%M %p')}.")
                )
                return render(request, 'attendance/attendance_form.html', {
                    'form': form,
                    'access_key': access_key,
                    'is_valid_link': False
                })

    except AttendanceAccessLink.DoesNotExist:
        messages.error(request, _("Invalid or inactive access link."))
        return render(request, 'attendance/attendance_form.html', {
            'form': form,
            'access_key': access_key,
            'is_valid_link': False
        })

    # Handle form submission
    if request.method == 'POST':
        form = AttendanceEntryForm(request.POST)
        if form.is_valid():
            try:
                grade = form.cleaned_data['grade']
                demographics = ClassDemographics.objects.get(grade=grade)
                attendance_data = {
                    'class_id': grade.id,
                    'date': date.today(),
                    'boys_present': form.cleaned_data['boys_present'],
                    'girls_present': form.cleaned_data['girls_present'],
                    'other_gender_present': form.cleaned_data['other_gender_present'],
                    'remarks': form.cleaned_data['remarks']
                }
                serializer = AttendanceSerializer(data=attendance_data)
                if serializer.is_valid():
                    ClassAttendance.objects.create(
                        demographics=demographics,
                        date=attendance_data['date'],
                        boys_present=attendance_data['boys_present'],
                        girls_present=attendance_data['girls_present'],
                        other_gender_present=attendance_data['other_gender_present'],
                        remarks=attendance_data['remarks']
                    )
                    messages.success(request, _("Attendance recorded successfully."))
                    return redirect('teacher_attendance_portal', access_key=access_key)
                else:
                    for error in serializer.errors:
                        form.add_error(None, serializer.errors[error])
            except Exception as e:
                form.add_error(None, str(e))

    return render(request, 'attendance/attendance_form.html', {
        'form': form,
        'access_key': access_key,
        'is_valid_link': True
    })
