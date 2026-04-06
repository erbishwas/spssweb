from rest_framework import serializers
from .models import  PublicHoliday






class AttendanceSerializer(serializers.Serializer):
    class_id = serializers.IntegerField()
    date = serializers.DateField()
    boys_present = serializers.IntegerField(min_value=0)
    girls_present = serializers.IntegerField(min_value=0)
    other_gender_present = serializers.IntegerField(min_value=0)
    remarks = serializers.CharField(required=False, allow_blank=True)
    
class PublicHolidaySerializer(serializers.ModelSerializer):
    duration_days = serializers.SerializerMethodField()
    
    class Meta:
        model = PublicHoliday
        fields = [
            'id',
            'name',
            'start_date',
            'end_date',
            'duration_days',
            'description',
            'is_recurring',
            'published'
        ]
        read_only_fields = ['id', 'duration_days']
    
    def get_duration_days(self, obj):
        return (obj.end_date - obj.start_date).days + 1
    
