from django.contrib import admin
from .models import Routine

@admin.register(Routine)
class RoutineAdmin(admin.ModelAdmin):
    list_display = ('title', 'type', 'get_updated_by_full_name', 'updated_at')
    list_filter = ('type',)
    search_fields = ('title', 'description')

    def get_updated_by_full_name(self, obj):
        if obj.updated_by:
            return f"{obj.updated_by.first_name} {obj.updated_by.last_name}".strip()
        return "-"
    get_updated_by_full_name.short_description = 'Updated By'  # Sets column header
    get_updated_by_full_name.admin_order_field = 'updated_by'  # Allows sorting

    def save_model(self, request, obj, form, change):
        obj.updated_by = request.user
        super().save_model(request, obj, form, change)
