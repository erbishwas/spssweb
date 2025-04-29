from django.contrib import admin
from .models import Grade, AdmissionApplication


class AdmissionApplicationAdmin(admin.ModelAdmin):
    list_display = ('full_name', 'grade', 'status', 'registered_on')
    list_filter = ('status', 'grade', 'registered_on')
    search_fields = ('full_name', 'father_name', 'mother_name', 'phone')
    readonly_fields = ('registered_on',)
    ordering = ('-registered_on',)


class GradeAdmin(admin.ModelAdmin):
    list_display = ('class_level', 'medium', 'faculty', 'is_active', 'can_join')
    list_editable = ('is_active', 'can_join')
    list_filter = ('class_level', 'medium', 'faculty')

admin.site.register(Grade, GradeAdmin)
admin.site.register(AdmissionApplication)