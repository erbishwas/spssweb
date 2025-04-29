
from django.db import models
from django.utils import timezone


    
class ContactFeedback(models.Model):
    date = models.CharField(max_length=20)
    time = models.CharField(max_length=20)
    name = models.CharField(max_length=100)
    email = models.EmailField()
    message = models.TextField()
    created_at = models.DateTimeField(default=timezone.now)

    class Meta:
        ordering = ['-created_at']
        db_table = 'contact_feedback'
    
    def __str__(self):
        return f"{self.name} ({self.message})  ({self.date})"
