from django.contrib import admin
from django.apps import apps
from django.contrib.admin.sites import AlreadyRegistered
from .public.Events.models import Event
from .public.Notice.models import Notice
from .public.ClassExamRoutine.models import Routine



from .public.ManagmentCommittee.models import ManagementCommittee
from .public.Staff import admin as StaffAdmin
from .public.FlashNotice import admin as FlashNoticeAdmin
from .public.Gallery import admin as GalleryAdmin
from .public.Events import admin as EventsAdmin
from .public.Notice import admin as NoticeAdmin
from .public.ClassExamRoutine import admin as ClassExamRoutineAdmin
from .public.Feedback import admin as FeedbackAdmin
from .public.Admission import admin as AdmissionAdmin




admin.site.register(ManagementCommittee)





for model in apps.get_models():
    try:
        admin.site.register(model)
    except AlreadyRegistered:
        pass

# Register your models here.

admin.site.site_header = "SPSS Admin Panel"
admin.site.site_title = "SPSS Admin Portal"
admin.site.index_title = "Welcome to the Dashboard"




