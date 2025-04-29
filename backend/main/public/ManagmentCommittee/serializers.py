from rest_framework import serializers
from .models import ManagementCommittee

class ManagementCommitteeSerializer(serializers.ModelSerializer):
    image_url = serializers.SerializerMethodField()  

    class Meta:
        model = ManagementCommittee
        fields = '__all__'
        read_only_fields = ('update_by',)

    def get_image_url(self, obj):
        if obj.image:
            return self.context['request'].build_absolute_uri(obj.image.url)
        return None