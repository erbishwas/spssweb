from rest_framework import serializers
from .models import Grade, AdmissionApplication
from django.utils.translation import gettext_lazy as _

class GradeSerializer(serializers.ModelSerializer):
    class_level_display = serializers.CharField(source='get_class_level_display', read_only=True)
    medium_display = serializers.CharField(source='get_medium_display', read_only=True)
    faculty_display = serializers.CharField(source='get_faculty_display', read_only=True)

    class Meta:
        model = Grade
        fields = [
            'id',
            'class_level',
            'class_level_display',
            'medium',
            'medium_display',
            'faculty',
            'faculty_display',
            'section',
            'description',
            'is_active',
            'can_join'
        ]
        extra_kwargs = {
            'faculty': {'required': False}
        }

    def validate(self, data):
        class_level = data.get('class_level', self.instance.class_level if self.instance else None)
        faculty = data.get('faculty')

        if class_level in ['9', '10', '11', '12']:
            if not faculty:
                raise serializers.ValidationError(
                    {'faculty': _('Faculty is required for grades 9-12')}
                )
        elif faculty:
            raise serializers.ValidationError(
                {'faculty': _('Faculty can only be specified for grades 9-12')}
            )
        return data


class AdmissionApplicationSerializer(serializers.ModelSerializer):
    grade_details = serializers.SerializerMethodField()
    status_display = serializers.CharField(source='get_status_display', read_only=True)
    gender_display = serializers.CharField(source='get_gender_display', read_only=True)

    class Meta:
        model = AdmissionApplication
        fields = [
            'id',
            'full_name',
            'address',
            'gender',
            'gender_display',
            'dob',
            'father_name',
            'mother_name',
            'grade',
            'grade_details',
            'previous_school',
            'email',
            'phone',
            'intro',
            'image',
            'status',
            'status_display',
            'registered_on',
            'notes'
        ]
        read_only_fields = ['status', 'registered_on']
        extra_kwargs = {
            'image': {'required': True},
            'phone': {'required': True}
        }

    def get_grade_details(self, obj):
        return {
            'description': obj.grade.description,
            'class_level': obj.grade.get_class_level_display(),
            'medium': obj.grade.get_medium_display(),
            'faculty': obj.grade.get_faculty_display()
        }

    def validate(self, data):
        grade = data.get('grade') or (self.instance.grade if self.instance else None)
        
        if grade:
            # Previous school validation
            if grade.class_level == 'Nursery' and data.get('previous_school'):
                raise serializers.ValidationError(
                    {'previous_school': _('Nursery applicants should not provide previous school')}
                )
            elif grade.class_level not in ['Nursery', 'KG'] and not data.get('previous_school'):
                raise serializers.ValidationError(
                    {'previous_school': _('Previous school is required for this grade level')}
                )
            
            # Parent info validation for younger grades
            if grade.class_level in ['Nursery', 'KG', '1', '2', '3', '4', '5']:
                if not data.get('father_name') or not data.get('mother_name'):
                    raise serializers.ValidationError({
                        'father_name': _('Required for grades Nursery-5'),
                        'mother_name': _('Required for grades Nursery-5')
                    })
        
        return data