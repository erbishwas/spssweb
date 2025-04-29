from rest_framework import serializers
from .serializers import FlashNotice

class FlashNoticeSerializer(serializers.ModelSerializer):
    class Meta:
        model = FlashNotice
        fields = ['id', 'title', 'message', 'image', 'trun_flash_On']