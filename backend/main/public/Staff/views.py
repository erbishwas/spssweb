
from rest_framework.decorators import api_view
from rest_framework.response import Response
from .models import Staff
from .serializers import BasicStaffSerializer, StaffProfileSerializer
import requests
from bs4 import BeautifulSoup
from django.utils import timezone
from django.core.cache import cache
from datetime import date, datetime
from ..Dashboard.models import PublicHoliday, StaffAttendanceSummary


username="651107"
password="@gpw@p@23"
base_url = "https://attendance.gov.np/"
extended="/Home/PresentHREmployeeAsync"




@api_view(['GET'])
def staff_list(request):
    if should_fetch_attendance():
        fetch_and_update_attendance()
        update_staff_attendance_summary()
    if (cache.get('attendance_last_reset_date')) is None:
        cache.set('attendance_last_reset_date', (timezone.now()-timezone.timedelta(days=1)).date())
    print(cache.get('attendance_last_reset_date'))
    try:
        staff_members = Staff.objects.filter(status__in=['active', 'on_leave']).order_by('site_position')
        serializer = BasicStaffSerializer(staff_members,context={'request': request}, many=True)
        return Response({
            'success': True,
            'data': serializer.data,
            'count': staff_members.count()
        })
    except Exception as e:
        return Response({
            'success': False,
            'error': str(e)
        }, status=500)

@api_view(['GET'])
def staff_detail(request, id):
    try:
        staff_member = Staff.objects.get(id=id)
        serializer = StaffProfileSerializer(
            staff_member,
            context={'request': request}  # This is the critical line
        )
        return Response({
            'success': True,
            'data': serializer.data
        })
    except Staff.DoesNotExist:
        return Response({
            'success': False,
            'error': f'Staff member with ID {id} not found'
        }, status=404)
    except Exception as e:
        return Response({
            'success': False,
            'error': str(e)
        }, status=500)
    
def should_fetch_attendance():
    main = timezone.now()
    now=timezone.localtime(main)
    
    # Skip entirely on Saturdays
    if PublicHoliday.today_is_holiday():
        print("holyday123")
        return False
    
    hour = now.hour
    print("Current hour:", hour)
    # Sync intervals
    if 9 <= hour < 10:
        interval = 10
    elif 10 <= hour < 11:
        interval = 5
    elif 11 <= hour < 12:
        interval = 10
    elif 12 <= hour < 16:
        interval = 5
    elif hour>16:
        interval = 1
    else:
        return False  # outside allowed range

    last_run = cache.get('attendance_last_run')
    if last_run and (now - last_run).total_seconds() < interval * 60:
        return False  # too soon

    return True

def fetch_and_update_attendance():
    session = requests.Session()

    try:
        # Daily reset check
        today = timezone.now().date()
        last_reset_date = cache.get('attendance_last_reset_date')
        
        if last_reset_date != today:
            Staff.objects.all().update(status='on_leave')
            cache.set('attendance_last_reset_date', today)

        # Login process
        login_page = session.get(base_url)
        soup = BeautifulSoup(login_page.text, 'html.parser')

        token_input = soup.find('input', {'name': '__RequestVerificationToken'})
        if not token_input:
            return False

        token = token_input['value']

        login_data = {
            '__RequestVerificationToken': token,
            'DataModel.UserName': username,
            'DataModel.Password': password,
        }

        login_response = session.post(base_url, data=login_data)
        if "Dashboard" not in login_response.text:
            return False

        # Fetch attendance data
        dashboard_response = session.get(base_url + extended, params={"PageSize": 100})
        soup = BeautifulSoup(dashboard_response.text, 'html.parser')
        
        tbody = soup.find('tbody')
        if not tbody:
            return False

        present_staff_codes = set()
        for row in tbody.find_all('tr'):
            cols = row.find_all('td')
            if len(cols) >= 2:
                en_span = cols[1].find('span', {'data-lang': 'en'})
                if en_span:
                    code = en_span.get_text(strip=True)
                    if code:
                        present_staff_codes.add(code)
       
        # Update only staff who are currently on_leave
        updated_count = Staff.objects.filter(
            staff_code__in=present_staff_codes,
            status='on_leave'
        ).update(status='active')

        cache.set('attendance_last_run', timezone.now())
        return True

    except Exception:
        return False
    

    
@api_view(['GET'])
def staff_summary(request):
    # Get date from query params or default to today
    if should_fetch_attendance():
        fetch_and_update_attendance()
        update_staff_attendance_summary()
    date_str = request.query_params.get('date')
    if date_str:
        try:
            requested_date = datetime.strptime(date_str, '%Y-%m-%d').date()
        except ValueError:
            return Response({"error": "Invalid date format. Use YYYY-MM-DD."}, status=400)
    else:
        requested_date = date.today()

    # Try to get summary only
    summary = StaffAttendanceSummary.objects.filter(date=requested_date).first()
    if not summary:
        # If not found, return 204 No Content (empty response)
        return Response(0)

    return Response({
        'date': summary.date,
        'total_staff': summary.total_staff,
        'active_staff': summary.active_staff
    })



def update_staff_attendance_summary():
    today = date.today()
    total_staff = Staff.objects.count()
    active_staff = Staff.objects.filter(status='active').count()
    
    StaffAttendanceSummary.objects.update_or_create(
        date=today,
        defaults={
            'total_staff': total_staff,
            'active_staff': active_staff
        }
    )