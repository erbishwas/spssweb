from rest_framework import serializers
from .models import Event
from ..Gallery.serializers import GalleryAlbumSerializer  
import nepali_datetime

class EventSerializer(serializers.ModelSerializer):
    formatted_bs_date = serializers.ReadOnlyField()
    is_upcoming = serializers.ReadOnlyField()
    is_past = serializers.ReadOnlyField()
    gallery_album_details = serializers.SerializerMethodField()
    cover_image_url = serializers.SerializerMethodField()

    class Meta:
        model = Event
        fields = [
            'id',
            'title',
            'details',
            'cover_image',
            'cover_image_url',
            'event_date_bs',
            'formatted_bs_date',
            'event_date_ad',
            'is_upcoming',
            'is_past',
            'gallery_album',
            'gallery_album_details'
        ]
        extra_kwargs = {
            'gallery_album': {'write_only': True}
        }

    def get_cover_image_url(self, obj):
        if obj.cover_image:
            return self.context['request'].build_absolute_uri(obj.cover_image.url)
        return None

    def get_gallery_album_details(self, obj):
        if obj.gallery_album:
            return GalleryAlbumSerializer(obj.gallery_album, context=self.context).data
        return None

    def validate_event_date_bs(self, value):
        try:
            parts = value.split('-')
            if len(parts) != 3:
                raise serializers.ValidationError("Date must be in YYYY-MM-DD format")
            year, month, day = map(int, parts)
            nepali_datetime.date(year, month, day)  # Validate the date
            return value
        except ValueError as e:
            raise serializers.ValidationError(f"Invalid BS date: {e}")