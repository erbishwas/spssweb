from django.db import models

class Staff(models.Model):

    POST_CHOICES = [
        ('Principal', 'Principal'),
        ('Vice Principal', 'Vice Principal'),
        ('Teacher', 'Teacher'),
        ('Instructor', 'Instructor'), 
        ('Lab Assistant', 'Lab Assistant'),           
        ('Nurse', 'Nurse'),
        ('Accountant', 'Accountant'),
        ('Assistant', 'Assistant'),
        ('Helper', 'Helper'),
        ('Other', 'Other'),
    ]
    GENDER_CHOICES = [
        ('male', 'Male'),
        ('female', 'Female'),
        ('other', 'Other'),
    ]

    STATUS_CHOICES = [
        ('active', 'Active'),
        ('inactive', 'Inactive'),
        ('on_leave', 'On Leave'),
        ('retired', 'Retired'),
    ]

    SITE_POSITION_CHOICES = [
        (0, 'Principal'),
        (1, 'Vice Principal'),
        (2, 'Secondary - 1st'),
        (3, 'Secondary - 2nd'),
        (4, 'Secondary - 3rd'),
        (5, 'Lower - 1st'),
        (6, 'Lower - 2nd'),
        (7, 'Lower - 3rd'),
        (8, 'Primary - 1st'),
        (9, 'Primary - 2nd'),
        (10, 'Primary - 3rd'),
        (11, 'Nursery Teacher'),
        (12, 'Staff Nurse'),
        (13, 'Accountant'),
        (14, 'Office Assistant'),
        (15, 'Helpers'),
    ]

    name = models.CharField(max_length=100)
    post = models.CharField(max_length=50, choices=POST_CHOICES)
    qualification = models.CharField(max_length=100)
    department = models.CharField(max_length=100, null=True, blank=True)
    contact = models.CharField(max_length=100, null=True, blank=True)
    email = models.EmailField(max_length=100, null=True, blank=True)
    gender = models.CharField(max_length=6, choices=GENDER_CHOICES, null=True, blank=True)
    doj = models.DateField(null=True, blank=True)
    bio = models.TextField(null=True, blank=True)
    image = models.ImageField(upload_to='staff_images/', null=True, blank=True)
    site_position = models.IntegerField(choices=SITE_POSITION_CHOICES)
    status = models.CharField(max_length=10, choices=STATUS_CHOICES, default='active')
    staff_code = models.CharField(max_length=20, unique=True, null=True, blank=True)
    update_by = models.CharField(max_length=45, default='admin')
    created_at = models.DateTimeField(auto_now_add=True)
    updated_at = models.DateTimeField(auto_now=True)

    class Meta:
        db_table = 'staffs'

    def __str__(self):
         return f"{self.name} ({self.status})"
