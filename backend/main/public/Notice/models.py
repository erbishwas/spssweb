from django.db import models
from django.core.exceptions import ValidationError
from django.contrib.auth.models import User
import os

def validate_file_type(value):
    ext = os.path.splitext(value.name)[1].lower()
    allowed_extensions = ['.pdf', '.jpg', '.jpeg', '.png']
    if ext not in allowed_extensions:
        raise ValidationError('Only PDF and image files (PDF, JPG, JPEG, PNG) are allowed.')

class Notice(models.Model):
    title = models.CharField(max_length=255)
    content = models.TextField(null=True, blank=True)
    file = models.FileField(upload_to='notices/', validators=[validate_file_type], null=True, blank=True)
    published_date = models.DateTimeField(auto_now_add=True)
    created_by = models.ForeignKey(User, related_name='notices_created', on_delete=models.SET_NULL, null=True)
    updated_by = models.ForeignKey(User, related_name='notices_updated', on_delete=models.SET_NULL, null=True, blank=True)
    updated_at = models.DateTimeField(auto_now=True)

    class Meta:
        ordering = ['-published_date']
        db_table = 'notice'

    def __str__(self):
        return self.title
