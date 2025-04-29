# admin.py
from django.contrib import admin
from .models import ContactFeedback


class FeedbackAdmin(admin.ModelAdmin):
    list_display = ('name', 'short_message', 'date')

    def short_message(self, obj):
        return (obj.message[:50] + "...") if len(obj.message) > 50 else obj.message
    short_message.short_description = "Message"

admin.site.register(ContactFeedback, FeedbackAdmin)