from django.contrib import admin
from .models import Notice



class NoticeAdmin(admin.ModelAdmin):
    exclude = ('created_by', 'updated_by')

    def save_model(self, request, obj, form, change):
        if not obj.pk:
            obj.created_by = request.user
        obj.updated_by = request.user
        super().save_model(request, obj, form, change)


admin.site.register(Notice, NoticeAdmin)