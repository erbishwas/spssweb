from django.db import models
from django.core.exceptions import ValidationError
from django.utils.translation import gettext_lazy as _
from django.utils import timezone
from ..Admission.models import Grade
from django.urls import reverse
import uuid


class ClassDemographics(models.Model):
    grade = models.OneToOneField(
        Grade,
        on_delete=models.CASCADE,
        related_name='demographics',
        primary_key=True,
        verbose_name=_('Grade')
    )
    boys_count = models.PositiveIntegerField(
        default=0,
        verbose_name=_('Number of Boys')
    )
    girls_count = models.PositiveIntegerField(
        default=0,
        verbose_name=_('Number of Girls')
    )
    other_gender_count = models.PositiveIntegerField(
        default=0,
        verbose_name=_('Other Genders')
    )
    last_updated = models.DateTimeField(
        auto_now=True,
        verbose_name=_('Last Updated')
    )

    class Meta:
        verbose_name = _('Class Demographics')
        verbose_name_plural = _('Class Demographics')

    @property
    def total_students(self):
        """Dynamically calculate total from gender counts"""
        return self.boys_count + self.girls_count + self.other_gender_count

    def save(self, *args, **kwargs):
        """No validation, just save"""
        super().save(*args, **kwargs)

    @property
    def gender_ratio(self):
        """Return formatted gender ratio string"""
        return f"{self.boys_count}:{self.girls_count}:{self.other_gender_count}"

    @property
    def attendance_rate(self):
        """Calculate average attendance percentage"""
        from django.db.models import Avg
        if not self.total_students:
            return 0
        result = self.attendance_records.aggregate(
            avg_attendance=Avg('present_count') / self.total_students * 100
        )
        return round(result['avg_attendance'], 2) if result['avg_attendance'] else 0

    def __str__(self):
        return _("Demographics for %(grade)s") % {'grade': self.grade.get_display_name()}
    

class ClassAttendance(models.Model):
    demographics = models.ForeignKey( 
        ClassDemographics,
        on_delete=models.CASCADE,
        related_name='attendance_records',
        verbose_name=_('Class Demographics')
    )
    date = models.DateField(
        default=timezone.now,
        verbose_name=_('Date')
    )
    boys_present = models.PositiveIntegerField(
        default=0,
        verbose_name=_('Boys Present')
    )
    girls_present = models.PositiveIntegerField(
        default=0,
        verbose_name=_('Girls Present')
    )
    other_gender_present = models.PositiveIntegerField(
        default=0,
        verbose_name=_('Other Genders Present')
    )
    remarks = models.TextField(
        blank=True,
        null=True,
        verbose_name=_('Remarks')
    )

    class Meta:
        verbose_name = _('Class Attendance')
        verbose_name_plural = _('Class Attendance Records')
        unique_together = ('demographics', 'date')  # Updated to use demographics
        ordering = ['-date', 'demographics']

    @property
    def grade(self):
        """Convenience property to access the grade"""
        return self.demographics.grade

    @property
    def present_count(self):
        return self.boys_present + self.girls_present + self.other_gender_present

    @property
    def total_students(self):
        return self.demographics.total_students

    @property
    def absent_count(self):
        return self.total_students - self.present_count

    def __str__(self):
        return _("Attendance for %(grade)s on %(date)s") % {
            'grade': self.demographics.grade.get_display_name(),
            'date': self.date
        }
    
   

    @property
    def attendance_percentage(self):
        if self.demographics.total_students == 0:
            return 0
        return round((self.present_count / self.demographics.total_students) * 100, 2)

    def clean(self):
        # Validate present counts don't exceed demographic counts
        if self.boys_present > self.demographics.boys_count:
            raise ValidationError(_("Boys present cannot exceed total boys in class"))
            
        if self.girls_present > self.demographics.girls_count:
            raise ValidationError(_("Girls present cannot exceed total girls in class"))
            
        if self.other_gender_present > self.demographics.other_gender_count:
            raise ValidationError(_("Other genders present cannot exceed total count"))
        
        if self.present_count > self.total_students:
            raise ValidationError(_("Total present students cannot exceed class total"))
        


class AttendanceAccessLink(models.Model):
    name = models.CharField(max_length=100, help_text="Description of this link")
    is_active = models.BooleanField(default=True)
    access_key = models.UUIDField(default=uuid.uuid4, editable=False, unique=True)
    created_at = models.DateTimeField(auto_now_add=True)
    expires_at = models.DateTimeField(null=True, blank=True)
    
    # New fields: only time of day
    available_from = models.TimeField(null=True, blank=True, help_text="Time of day when the link becomes valid")
    available_until = models.TimeField(null=True, blank=True, help_text="Time of day when the link becomes invalid")

    class Meta:
        verbose_name = "Attendance Access Link"
        verbose_name_plural = "Attendance Access Links"
    
    def __str__(self):
        return f"{self.name} ({'Active' if self.is_active else 'Inactive'})"
    
    def get_absolute_url(self):
        domain = 'http://localhost:8000'
        path = reverse('teacher_attendance_portal', args=[str(self.access_key)])
        return f"{domain}{path}"





class PublicHoliday(models.Model):
    name = models.CharField(max_length=100)
    start_date = models.DateField(default=timezone.now)
    end_date = models.DateField(default=timezone.now)
    description = models.TextField(blank=True, null=True)
    is_recurring = models.BooleanField(
        default=False,
        help_text="If true, this holiday occurs every year but may have different dates (needs annual update)"
    )
    published = models.BooleanField(
        default=False,
        help_text="If true, this holiday is published and visible to users."
    )

    class Meta:
        ordering = ['start_date']
        verbose_name = "Public Holiday"
        verbose_name_plural = "Public Holidays"

    def __str__(self):
        return f"{self.name} ({self.start_date} to {self.end_date})"

    def clean(self):
        """Validate that end_date is not before start_date"""
        if self.end_date < self.start_date:
            raise ValidationError("End date cannot be before start date.")

    def save(self, *args, **kwargs):
        """Ensure validation is run on every save"""
        self.full_clean()
        super().save(*args, **kwargs)

    @classmethod
    def today_is_holiday(cls, date_check=None):
        
        if date_check is None:
            date_check = timezone.now().date()
        
        # Check if it's Saturday (weekday() returns 5 for Saturday)
        is_saturday = date_check.weekday() == 5
        
        # Check if it's a published holiday
        is_holiday = cls.objects.filter(
            start_date__lte=date_check,
            end_date__gte=date_check
        ).exists()
        
        return is_holiday or is_saturday

    @classmethod
    def get_holidays_for_date(cls, date_check=None):
        """
        Get all holidays that apply to the given date (or today if None).
        
        Args:
            date_check (date, optional): Date to check. Defaults to today.
            
        Returns:
            QuerySet: All published holidays that include this date
        """
        if date_check is None:
            date_check = timezone.now().date()
            
        return cls.objects.filter(
            start_date__lte=date_check,
            end_date__gte=date_check
        )
    
class StaffAttendanceSummary(models.Model):
    date = models.DateField(unique=True)
    total_staff = models.PositiveIntegerField()
    active_staff = models.PositiveIntegerField()

    class Meta:
        verbose_name = "Staff Attendance Summary"
        verbose_name_plural = "Staff Attendance Summaries"
        ordering = ['-date']

    def __str__(self):
        return f"{self.date} - Total: {self.total_staff}, Active: {self.active_staff}"

   