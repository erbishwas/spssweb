

from django.db import models
from django.core.exceptions import ValidationError
from django.utils import timezone
from django.utils.translation import gettext_lazy as _
import os
from uuid import uuid4
from datetime import datetime

class Grade(models.Model):
    CLASS_LEVELS = [
        ('Nursery', _('Nursery')),
        ('KG', _('KG')),
        ('1', _('Grade 1')),
        ('2', _('Grade 2')),
        ('3', _('Grade 3')),
        ('4', _('Grade 4')),
        ('5', _('Grade 5')),
        ('6', _('Grade 6')),
        ('7', _('Grade 7')),
        ('8', _('Grade 8')),
        ('9', _('Grade 9')),
        ('10', _('Grade 10')),
        ('11', _('Grade 11')),
        ('12', _('Grade 12')),
    ]
    
    MEDIUM_CHOICES = [
        ('English', _('English Medium')),
        ('Nepali', _('Nepali Medium')),
    ]
    
    FACULTY_CHOICES = [
        ('General', _('General')),
        ('Engineering', _('Engineering')),
    ]
    
    class_level = models.CharField(
        max_length=20,
        choices=CLASS_LEVELS,
        verbose_name=_('Class Level')
    )
    medium = models.CharField(
        max_length=20,
        choices=MEDIUM_CHOICES,
        blank=True,
        null=True,
        verbose_name=_('Medium of Instruction')
    )
    faculty = models.CharField(
        max_length=20,
        choices=FACULTY_CHOICES,
        blank=True,
        null=True,
        verbose_name=_('Faculty')
    )
    section = models.CharField(
        max_length=10,
        default='A',
        verbose_name=_('Section')
    )
    description = models.CharField(
        max_length=100,
        blank=True,
        null=True,
        verbose_name=_('Description')
    )
    is_active = models.BooleanField(
        default=True,
        verbose_name=_('Is Active'),
        help_text=_('Whether this grade is currently active')
    )
    can_join = models.BooleanField(
        default=True,
        verbose_name=_('Can Join'),
        help_text=_('Whether new admissions are open for this grade')
    )
    
    class Meta:
        unique_together = ('class_level', 'medium', 'faculty', 'section')
        ordering = ['class_level', 'medium', 'faculty']
        verbose_name = _('Grade')
        verbose_name_plural = _('Grades')
        db_table = 'grades'
    
    def __str__(self):
        parts = [self.get_class_level_display()]
        if self.medium:
            parts.append(f"({self.get_medium_display()})")
        if self.faculty:
            parts.append(f"- {self.get_faculty_display()}")
        if self.section:
            parts.append(f"- Section {self.section}")
        return ' '.join(parts)

    def clean(self):
        """Validate that faculty is only set for higher grades"""
        if self.faculty and self.class_level not in ['9','10','11', '12']:
            raise ValidationError({
                'faculty': _('Faculty can only be specified for grades 9-12')
            })

class AdmissionApplication(models.Model):
    GENDER_CHOICES = [
        ('Male', _('Male')),
        ('Female', _('Female')),
        ('Others', _('Others')),
    ]
    
    # Personal Information
    full_name = models.CharField(
        max_length=100,
        verbose_name=_('Full Name')
    )
    address = models.CharField(
        max_length=255,
        verbose_name=_('Address')
    )
    gender = models.CharField(
        max_length=10,
        choices=GENDER_CHOICES,
        verbose_name=_('Gender')
    )
    dob = models.DateField(
        verbose_name=_('Date of Birth')
    )
    
    # Parent Information
    father_name = models.CharField(
        max_length=100,
        blank=True,
        null=True,
        verbose_name=_("Father's Name")
    )
    mother_name = models.CharField(
        max_length=100,
        blank=True,
        null=True,
        verbose_name=_("Mother's Name")
    )
    
    # Academic Information
    grade = models.ForeignKey(
        Grade,
        on_delete=models.PROTECT,
        related_name='applications',
        limit_choices_to={'can_join': True},
        verbose_name=_('Grade Applying For')
    )
    previous_school = models.CharField(
        max_length=100,
        blank=True,
        null=True,
        verbose_name=_('Previous School')
    )
    
    # Contact Information
    email = models.EmailField(
        blank=True,
        null=True,
        verbose_name=_('Email Address')
    )
    phone = models.CharField(
        max_length=15,
        verbose_name=_('Phone Number')
    )
    
    # Additional Information
    intro = models.TextField(
        help_text=_('Short introduction about yourself'),
        blank=True,
        null=True,
        verbose_name=_('Introduction')
    )
    image = models.ImageField(
        upload_to='admission_applications/%Y/',
        verbose_name=_('Passport Photo')
    )
    
    # Status Information
    STATUS_CHOICES = [
        ('pending', _('Pending')),
        ('under_review', _('Under Review')),
        ('accepted', _('Accepted')),
        ('rejected', _('Rejected')),
    ]
    
    status = models.CharField(
        max_length=20,
        choices=STATUS_CHOICES,
        default='pending',
        verbose_name=_('Application Status')
    )
    registered_on = models.DateTimeField(
        default=timezone.now,
        verbose_name=_('Registration Date')
    )
    notes = models.TextField(
        blank=True,
        null=True,
        help_text=_('Internal notes about the application'),
        verbose_name=_('Admin Notes')
    )
    
    class Meta:
        verbose_name = _('Admission Application')
        verbose_name_plural = _('Admission Applications')
        ordering = ['-registered_on']
        db_table = 'admission_applications'
    
    def __str__(self):
        return f"{self.full_name} - {self.grade} ({self.get_status_display()})"

    def clean(self):
        """Custom validation logic"""
        super().clean()
        
        # Validate previous_school based on grade level
        if self.grade.class_level in ['Nursery'] and self.previous_school:
            raise ValidationError({
                'previous_school': _('Previous school should not be provided for Nursery/KG applicants')
            })
        elif self.grade.class_level not in ['Nursery', 'KG'] and not self.previous_school:
            raise ValidationError({
                'previous_school': _('Previous school is required for this grade level')
            })
        
        # Validate parent information for younger students
        if self.grade.class_level in ['Nursery', 'KG', '1', '2', '3', '4', '5']:
            if not self.father_name or not self.mother_name:
                raise ValidationError({
                    'father_name': _('Parent names are required for this grade level'),
                    'mother_name': _('Parent names are required for this grade level')
                })

    def save(self, *args, **kwargs):
        """Ensure validation is run on save"""
        self.full_clean()
        super().save(*args, **kwargs)