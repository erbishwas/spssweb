from django.urls import path, include
from .FlashNotice.views import flash_notice  # Import the flash_notice function from views
from .Staff.views import staff_list, staff_detail  # Import the staff_list and staff_detail functions from views
from .ManagmentCommittee.views import committee  # Import the committee function from views
from .Gallery.views import get_albums, get_album_content  # Import the get_albums and get_album_content functions from views
from .Notice.views import notice_list, notice_detail  # Import the notice_list and notice_detail functions from views
from .Events.views import event_list, event_detail  # Import the event_list and event_detail functions from views
from .ClassExamRoutine.views import routine_list, routine_detail  # Import the routine_list and routine_detail functions from views
from .Feedback.views import submit_feedback  # Import the submit_feedback function from views
from .Admission.views import available_grades, submit_application, check_application_status  # Import the admission-related functions from views

urlpatterns = [
    path('api/flash-notice/', flash_notice, name='flash_notice'),
    path('api/staff/', staff_list, name='staff-list'),
    path('api/staff/<int:id>/', staff_detail, name='staff-detail'),
    path('api/committee/<str:committee_type>/', committee, name='committee'),
    path('api/albums/', get_albums, name='album_list'),
    path('api/album/<int:album_id>/', get_album_content, name='album_detail'),
    path('api/events/', event_list, name='event-list'),    
    path('api/events/<int:pk>/', event_detail, name='event-detail'),
    path('api/notices/', notice_list, name='notice-list'),
    path('api/notices/<int:pk>/', notice_detail, name='notice-detail'),
    path('api/routines/', routine_list, name='routine-list'),
    path('api/routine/<int:pk>/', routine_detail, name='routine-detail'),
    path('api/feedback/', submit_feedback, name='submit-feedback' ),  
    path('api/grades/', available_grades, name='available-grades'),
    path('api/admission/', submit_application, name='submit-application'),   
    path('api/admission/status/<int:application_id>/', check_application_status, name='check-application-status'), 
]