from rest_framework import serializers
from .models import Routine

class RoutineSerializer(serializers.ModelSerializer):
    type_display = serializers.CharField(source='get_type_display', read_only=True)
    updated_by_full_name = serializers.SerializerMethodField(read_only=True)
    updated_by_username = serializers.CharField(source='updated_by.username', read_only=True)

    class Meta:
        model = Routine
        fields = [
            'id', 
            'type', 
            'type_display', 
            'title', 
            'description', 
            'image', 
            'updated_by', 
            'updated_by_username',
            'updated_by_full_name',
            'updated_at'
        ]
        read_only_fields = ['updated_by', 'updated_by_username', 'updated_by_full_name', 'updated_at']

    def get_updated_by_full_name(self, obj):
        if obj.updated_by:
            full_name = f"{obj.updated_by.first_name} {obj.updated_by.last_name}".strip()
            return full_name if full_name else obj.updated_by.username
        return None