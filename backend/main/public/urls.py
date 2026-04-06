from django.urls import path, include
from .FlashNotice.views import flash_notice  # Import the flash_notice function from views
from .Staff.views import staff_list, staff_detail, staff_summary # Import the staff_list and staff_detail functions from views
from .ManagmentCommittee.views import committee  # Import the committee function from views
from .Gallery.views import get_albums, get_album_content  # Import the get_albums and get_album_content functions from views
from .Notice.views import notice_list, notice_detail  # Import the notice_list and notice_detail functions from views
from .Events.views import event_list, event_detail  # Import the event_list and event_detail functions from views
from .ClassExamRoutine.views import routine_list, routine_detail  # Import the routine_list and routine_detail functions from views
from .Feedback.views import submit_feedback  # Import the submit_feedback function from views
from .Admission.views import available_grades, submit_application, check_application_status  # Import the admission-related functions from views
from .Dashboard.views import public_holiday_banner_api, school_dashboard,teacher_attendance_portal # Import the required views including teacher_attendance_portal




urlpatterns = [
    path('flash-notice/', flash_notice, name='flash_notice'),
    path('staff/', staff_list, name='staff-list'),
    path('staff/<int:id>/', staff_detail, name='staff-detail'),
    path('staff-summary/', staff_summary, name='staff-summary'),
    path('committee/<str:committee_type>/', committee, name='committee'),
    path('albums/', get_albums, name='album_list'),
    path('album/<int:album_id>/', get_album_content, name='album_detail'),
    path('events/', event_list, name='event-list'),    
    path('events/<int:pk>/', event_detail, name='event-detail'),
    path('notices/', notice_list, name='notice-list'),
    path('notices/<int:pk>/', notice_detail, name='notice-detail'),
    path('routines/', routine_list, name='routine-list'),
    path('routine/<int:pk>/', routine_detail, name='routine-detail'),
    path('feedback/', submit_feedback, name='submit-feedback' ),  
    path('grades/', available_grades, name='available-grades'),
    path('admission/', submit_application, name='submit-application'),   
    path('admission/status/<int:application_id>/', check_application_status, name='check-application-status'), 
    path('dashboard/', school_dashboard, name='school-dashboard'),
    path('attendance/<uuid:access_key>/', teacher_attendance_portal, name='teacher_attendance_portal'),

    path('holiday/', public_holiday_banner_api, name='check_today_holiday'),  # Include the public holiday URLs
    ]