from django.utils import timezone
from django.contrib import admin
from .models import ClassDemographics, ClassAttendance,PublicHoliday,AttendanceAccessLink
from ..Admission.models import Grade
from django.core.exceptions import ValidationError

from django.utils.translation import gettext_lazy as _
from django.urls import path
from django.shortcuts import render, redirect
from django import forms
from django.contrib import messages
from django.http import HttpResponse
import csv
from django.utils.html import format_html
from io import TextIOWrapper

class Media:
    css = {
        'all': ('admin/css/attendance.css',)
    }

class ClassAttendanceInline(admin.TabularInline):
    model = ClassAttendance
    extra = 0
    fields = ('date', 'present_count', 'absent_count', 'attendance_percentage')
    readonly_fields = ('present_count', 'absent_count', 'attendance_percentage')

    def present_count(self, obj):
        return obj.present_count
    present_count.short_description = 'Present'

    def absent_count(self, obj):
        return obj.absent_count
    absent_count.short_description = 'Absent'

    def attendance_percentage(self, obj):
        return f"{obj.attendance_percentage}%"
    attendance_percentage.short_description = 'Attendance %'

class CsvImportForm(forms.Form):
    csv_file = forms.FileField()

@admin.register(ClassDemographics)
class ClassDemographicsAdmin(admin.ModelAdmin):
    list_display = (
        'grade_display', 
        'total_students',
        'boys_count',
        'girls_count',
        'other_gender_count',
        'gender_ratio',
        'last_updated'
    )
    list_filter = (
        'grade__class_level',
        'grade__faculty',
        'grade__medium',
    )
    search_fields = (
        'grade__class_level',
        'grade__section',
        'grade__faculty',
    )
    #inlines = [ClassAttendanceInline]
    
    def grade_display(self, obj):
        return obj.grade.get_display_name()
    grade_display.short_description = 'Class'
    grade_display.admin_order_field = 'grade'

    def gender_ratio(self, obj):
        return f"{obj.boys_count}:{obj.girls_count}:{obj.other_gender_count}"
    gender_ratio.short_description = 'Gender Ratio'

@admin.register(ClassAttendance)
class ClassAttendanceAdmin(admin.ModelAdmin):
    list_display = (
        'grade_display',
        'date',
        'present_count_display',
        'absent_count_display',
        'attendance_percentage_display',
        'gender_breakdown'
    )
    list_filter = (
        'demographics__grade__class_level',
        'date',
    )
    search_fields = (
        'demographics__grade__class_level',
        'date',
    )
    change_list_template = 'admin/dashboard/change_list.html'
    
    def get_urls(self):
        urls = super().get_urls()
        custom_urls = [
            path('import-csv/', self.admin_site.admin_view(self.import_csv), name='import_csv'),
            path('export-csv/', self.admin_site.admin_view(self.export_csv), name='export_csv'),
            path('bulk-update/', self.admin_site.admin_view(self.bulk_update_view), name='bulk_update_attendance'),
        ]
        return custom_urls + urls

    def grade_display(self, obj):
        return obj.demographics.grade.get_display_name()
    grade_display.short_description = 'Class'
    grade_display.admin_order_field = 'demographics__grade'

    def present_count_display(self, obj):
        return f"{obj.present_count}/{obj.total_students}"
    present_count_display.short_description = 'Present/Total'

    def absent_count_display(self, obj):
        return obj.absent_count
    absent_count_display.short_description = 'Absent'

    def attendance_percentage_display(self, obj):
        return f"{obj.attendance_percentage}%"
    attendance_percentage_display.short_description = 'Attendance %'

    def gender_breakdown(self, obj):
        return f"B:{obj.boys_present} G:{obj.girls_present} O:{obj.other_gender_present}"
    gender_breakdown.short_description = 'Gender Breakdown'

    def import_csv(self, request):
        if request.method == "POST":
            form = CsvImportForm(request.POST, request.FILES)
            if not form.is_valid():
                messages.error(request, "Invalid form submission")
                return redirect("..")
                
            if 'csv_file' not in request.FILES:
                messages.error(request, "No file uploaded")
                return redirect("..")
                
            csv_file = request.FILES['csv_file']
            
            # Verify file is CSV
            if not csv_file.name.endswith('.csv'):
                messages.error(request, "Please upload a CSV file")
                return redirect("..")
            
            try:
                # Read file content safely
                file_data = csv_file.read().decode('utf-8')
                csv_data = csv.DictReader(file_data.splitlines())
                
                if not csv_data.fieldnames:  # Check if file has headers
                    messages.error(request, "CSV file has no headers")
                    return redirect("..")
                    
                success_count = 0
                error_rows = []
                
                for row_num, row in enumerate(csv_data, start=2):  # Start at row 2 (1=header)
                    try:
                        # Validate required fields exist
                        required_fields = ['class_level', 'date', 'boys_present', 'girls_present']
                        missing_fields = [f for f in required_fields if f not in row or not row[f]]
                        if missing_fields:
                            raise ValidationError(f"Missing fields: {', '.join(missing_fields)}")
                        
                        # Get grade and demographics
                        grade = Grade.objects.get(
                            class_level=row['class_level'],
                            medium=row.get('medium') or None,
                            faculty=row.get('faculty') or None,
                            section=row.get('section', 'A')
                        )
                        demographics = ClassDemographics.objects.get(grade=grade)
                        
                        # Update or create attendance
                        attendance, created = ClassAttendance.objects.update_or_create(
                            demographics=demographics,
                            date=row['date'],
                            defaults={
                                'boys_present': int(row['boys_present']),
                                'girls_present': int(row['girls_present']),
                                'other_gender_present': int(row.get('other_gender_present', 0))
                            }
                        )
                        
                        success_count += 1
                        
                    except Exception as e:
                        error_rows.append(f"Row {row_num}: {str(e)}")
                        continue
                
                # Show results
                if error_rows:
                    messages.warning(request, 
                        f"Completed with {len(error_rows)} errors. " + 
                        f"Successfully processed {success_count} rows. " +
                        f"First error: {error_rows[0]}")
                else:
                    messages.success(request, f"Successfully processed all {success_count} rows")
                    
                return redirect("..")
                
            except Exception as e:
                messages.error(request, f"Failed to process file: {str(e)}")
                return redirect("..")
        
        # GET request - show form
        form = CsvImportForm()
        context = {
            **self.admin_site.each_context(request),
            'form': form,
            'opts': self.model._meta,
            'title': 'Import Attendance CSV',
        }
        return render(request, "admin/dashboard/csv_import.html", context)
        
    def export_csv(self, request):
        response = HttpResponse(content_type='text/csv')
        today_str = timezone.now().date().strftime('%Y-%m-%d')
        response['Content-Disposition'] = f'attachment; filename="attendance_import_{today_str}.csv"'
        
        writer = csv.writer(response)
        # Header row with all necessary fields
        writer.writerow([
            'class_level', 
            'medium', 
            'faculty', 
            'section',
            'date',
            'boys_present',
            'girls_present',
            'other_gender_present',
            'total_students',
            'boys_count',
            'girls_count',
            'other_gender_count'
        ])
        
        # Export all classes with their complete demographic data
        for demo in ClassDemographics.objects.all().select_related('grade'):
            grade = demo.grade
            writer.writerow([
                grade.class_level,
                grade.medium or '',
                grade.faculty or '',
                grade.section,
                today_str,  # Pre-filled with today's date
                0,  # boys_present (to be filled)
                0,  # girls_present (to be filled)
                0,  # other_gender_present (to be filled)
                demo.total_students,  # For reference
                demo.boys_count,  # For validation
                demo.girls_count,  # For validation
                demo.other_gender_count  # For validation
            ])
        
        return response
    

    def bulk_update_view(self, request):
        today = timezone.now().date()
        demographics_list = ClassDemographics.objects.all()        

        if request.method == 'POST':
            updated = 0
            for demo in demographics_list:
                prefix = f"{demo.grade_id}_"
                boys_present = request.POST.get(f"{prefix}boys_present")
                girls_present = request.POST.get(f"{prefix}girls_present")
                other_present = request.POST.get(f"{prefix}other_present")

                if boys_present is None or girls_present is None:
                    continue  # skip if fields are missing

                try:
                    _, created = ClassAttendance.objects.update_or_create(
                        demographics=demo,
                        date=today,
                        defaults={
                            'boys_present': int(boys_present),
                            'girls_present': int(girls_present),
                            'other_gender_present': int(other_present or 0),
                        }
                    )
                    updated += 1
                except Exception as e:
                    messages.error(request, f"Error for {demo.grade.get_display_name()}: {e}")

            messages.success(request, f"Bulk attendance updated for {updated} classes.")
            return redirect("..")
        
        def sort_key(demo):
            grade = demo.grade
            level_part = grade.class_level
            try:
                level_num = int(''.join(filter(str.isdigit, str(level_part))))
            except ValueError:
                level_num = 0

            # Priority: class level (numeric), then medium, then faculty
            return (
                level_num,
                grade.medium or '',
                grade.faculty or '',
            )

        demographics_list = sorted(demographics_list, key=sort_key)

        context = {
            **self.admin_site.each_context(request),
            'demographics_list': demographics_list,
            'today': today,
            'opts': self.model._meta,
            'title': 'Bulk Update Attendance',
        }
        return render(request, "admin/dashboard/bulk_attendance_update.html", context)


class YearFilter(admin.SimpleListFilter):
    title = 'Year'
    parameter_name = 'year'

    def lookups(self, request, model_admin):
        years = PublicHoliday.objects.dates('start_date', 'year')
        return [(y.year, str(y.year)) for y in years]

    def queryset(self, request, queryset):
        if self.value():
            return queryset.filter(start_date__year=self.value())
        return queryset

@admin.register(PublicHoliday)
class PublicHolidayAdmin(admin.ModelAdmin):
    list_display = ('name', 'start_date', 'end_date', 'is_recurring', 'published')
    list_filter = (YearFilter, 'is_recurring', 'published')
    search_fields = ('name',)
    ordering = ('-start_date',)

    fieldsets = (
        (None, {
            'fields': ('name', 'start_date', 'end_date', 'description')
        }),
        ('Status', {
            'fields': ('is_recurring', 'published')
        }),
    )

@admin.register(AttendanceAccessLink)
class AttendanceAccessLinkAdmin(admin.ModelAdmin):
    list_display = ('name', 'is_active', 'created_at', 'expires_at', 'access_url_link')
    readonly_fields = ('access_key', 'created_at', 'access_url_link')
    fields = (
        'name',
        'is_active',
        'access_key',
        'created_at',
        'expires_at',
        'available_from',     # <-- add this
        'available_until',    # <-- add this
        'access_url_link',
    )

    def access_url_link(self, obj):
        return format_html(
            '<a href="{}" target="_blank" style="word-break: break-all;">{}</a>',
            obj.get_absolute_url(),
            obj.get_absolute_url()
        )
    access_url_link.short_description = "Shareable Link"


