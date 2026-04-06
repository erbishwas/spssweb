from django import forms
from django.utils.translation import gettext_lazy as _
from ..Admission.models import Grade
from .models import ClassDemographics, ClassAttendance
from datetime import date

class AttendanceEntryForm(forms.Form):
    grade = forms.ModelChoiceField(
        queryset=Grade.objects.filter(demographics__isnull=False).exclude(
            demographics__attendance_records__date=date.today()
        ).distinct(),
        label=_('Class'),
        empty_label=None,
        to_field_name='id',
        widget=forms.Select(attrs={'class': 'form-control', 'id': 'grade-select'})
    )
    class_total_students = forms.IntegerField(
        label=_('Class Total Students'),
        min_value=0,
        initial=0,
        widget=forms.NumberInput(attrs={'class': 'form-control', 'id': 'class-total-students'})
    )
    boys_present = forms.IntegerField(
        label=_('Boys Present'),
        min_value=0,
        initial=0,
        widget=forms.NumberInput(attrs={'class': 'form-control', 'id': 'boys-present'})
    )
    girls_present = forms.IntegerField(
        label=_('Girls Present'),
        min_value=0,
        initial=0,
        widget=forms.NumberInput(attrs={'class': 'form-control', 'id': 'girls-present'})
    )
    other_gender_present = forms.IntegerField(
        label=_('Other Genders Present'),
        min_value=0,
        initial=0,
        widget=forms.NumberInput(attrs={'class': 'form-control', 'id': 'other-gender-present'})
    )
    remarks = forms.CharField(
        label=_('Remarks'),
        required=False,
        widget=forms.Textarea(attrs={'rows': 4, 'class': 'form-control', 'id': 'remarks'})
    )

    def clean(self):
        cleaned_data = super().clean()
        grade = cleaned_data.get('grade')
        class_total_students = cleaned_data.get('class_total_students')
        boys_present = cleaned_data.get('boys_present')
        girls_present = cleaned_data.get('girls_present')
        other_gender_present = cleaned_data.get('other_gender_present')

        if grade:
            try:
                demographics = ClassDemographics.objects.get(grade=grade)
                # Validate class_total_students for authentication
                if class_total_students != demographics.total_students:
                    self.add_error('class_total_students', _('Incorrect class total students. Please enter the exact number of students in the class.'))

                # Validate gender counts against demographics
                if boys_present > demographics.boys_count:
                    self.add_error('boys_present', _('Boys present cannot exceed total boys in class (%(count)s).') % {'count': demographics.boys_count})
                if girls_present > demographics.girls_count:
                    self.add_error('girls_present', _('Girls present cannot exceed total girls in class (%(count)s).') % {'count': demographics.girls_count})
                if other_gender_present > demographics.other_gender_count:
                    self.add_error('other_gender_present', _('Other genders present cannot exceed total count (%(count)s).') % {'count': demographics.other_gender_count})

                # Validate total present against class total
                total_present = boys_present + girls_present + other_gender_present
                if total_present > demographics.total_students:
                    self.add_error(None, _('Total present students (%(present)s) cannot exceed class total (%(total)s).') % {
                        'present': total_present,
                        'total': demographics.total_students
                    })

                # Check for existing attendance record
                if ClassAttendance.objects.filter(demographics=demographics, date=date.today()).exists():
                    self.add_error('grade', _('Attendance for this class has already been submitted today.'))
            except ClassDemographics.DoesNotExist:
                self.add_error('grade', _('No demographics data available for this class.'))
        return cleaned_data