from django.db import models
from django.contrib.auth.models import User

class Routine(models.Model):
    ROUTINE_TYPES = [
        ('Class', 'Class Routine'),
        ('Exam', 'Exam Routine'),
    ]

    type = models.CharField(max_length=10, choices=ROUTINE_TYPES)
    title = models.CharField(max_length=200)
    description = models.TextField(blank=True)
    image = models.ImageField(upload_to='routine_images/')
    updated_by = models.ForeignKey(User, on_delete=models.SET_NULL, null=True, blank=True)
    updated_at = models.DateTimeField(auto_now=True)

    def __str__(self):
        return f"{self.get_type_display()} - {self.title}"
