
from django.db import models

class ManagementCommittee(models.Model):
    COMMITTEE_TYPE_CHOICES = [
        ('Management Committee', 'Management Committee'),
        ('Parent Teacher Association', 'Parent Teacher Association'),
    ]

    POSITION_CHOICES = [
        ('Chairman', 'Chairman'),
        ('Secretary', 'Secretary'),
        ('Member', 'Member'),
    ]
    SITE_POSITION_CHOICES = [
        (0, 'Chairman'),
        (1, 'Secretary'),
        (2, 'Member - 1st'),
        (3, 'Member - 2nd'),
        (4, 'Member - 3rd'),
        (5, 'Member - 4th'),
        (6, 'Member - 5th'),
    ]

    name = models.CharField(max_length=30)
    position = models.CharField(max_length=50, choices=POSITION_CHOICES)
    contact_no = models.CharField(max_length=20)
    image = models.ImageField(upload_to='committee_images/')
    site_position = models.IntegerField(choices=SITE_POSITION_CHOICES, default=0)
    update_by = models.CharField(max_length=45, default='admin')
    committee_type = models.CharField(max_length=50, choices=COMMITTEE_TYPE_CHOICES, default='management')

    class Meta:
        db_table= 'management_committee'
    def __str__(self):
        return f"{self.name} - {self.position} ({self.committee_type})"
