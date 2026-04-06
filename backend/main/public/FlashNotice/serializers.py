from rest_framework import serializers
from .models import FlashNotice

class FlashNoticeSerializer(serializers.ModelSerializer):
    image = serializers.SerializerMethodField()

    class Meta:
        model = FlashNotice
        fields = ['id', 'title', 'message', 'image', 'trun_flash_On']

    def get_image(self, obj):
        request = self.context.get('request')
        if obj.image:
            return request.build_absolute_uri(obj.image.url) if request else obj.image.url
        return None