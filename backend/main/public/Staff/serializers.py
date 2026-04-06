from rest_framework import serializers
from .models import Staff

class BasicStaffSerializer(serializers.ModelSerializer):
    # For staff listing page (basic info)
    class Meta:
        model = Staff
        fields = [
            'id',
            'name',
            'post',
            'department',
            'image',
            'site_position',
            'staff_code',
            'status',
        ]
        
        
    def get_image(self, obj):
        request = self.context.get('request')  # Safely get request from context
        if obj.image and request:
            return request.build_absolute_uri(obj.image.url)
        return None

class StaffProfileSerializer(serializers.ModelSerializer):
    image = serializers.SerializerMethodField()
    
    class Meta:
        model = Staff
        fields = [
            'id',
            'name',
            'post',
            'qualification',
            'department',
            'contact',
            'email',
            'gender',
            'doj',
            'bio',
            'image',
            'site_position',
            'status',
            'staff_code',
            'update_by',
            'created_at',
            'updated_at'
        ]
        read_only_fields = ['created_at', 'updated_at']
    
    def get_image(self, obj):
        request = self.context.get('request')  # Safely get request from context
        if obj.image and request:
            return request.build_absolute_uri(obj.image.url)
        return None