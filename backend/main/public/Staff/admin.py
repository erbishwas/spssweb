from django.contrib import admin
from .models import Staff

        # Add a sidebar filter by status

@admin.action(description="Mark selected staff as Active")
def make_active(modeladmin, request, queryset):
    queryset.update(status='active')

@admin.action(description="Mark selected staff as On Leave")
def make_inactive(modeladmin, request, queryset):
    queryset.update(status='on_leave')

class StaffAdmin(admin.ModelAdmin):
    list_display = ('name', 'status')     # Display in list view
    list_filter = ('status',)  
    actions = [make_active, make_inactive]   

admin.site.register(Staff, StaffAdmin)