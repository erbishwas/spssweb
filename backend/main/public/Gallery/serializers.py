from rest_framework import serializers
from .models import GalleryAlbum, Photo, Video

class PhotoSerializer(serializers.ModelSerializer):
    image_url = serializers.SerializerMethodField()
    type = serializers.SerializerMethodField()

    class Meta:
        model = Photo
        fields = ['id', 'image', 'image_url', 'caption', 'uploaded_date', 'type']
        read_only_fields = ['uploaded_date']

    def get_image_url(self, obj):
        request = self.context.get('request')
        if obj.image:
            return request.build_absolute_uri(obj.image.url)
        return None

    def get_type(self, obj):
        return 'photo'

class VideoSerializer(serializers.ModelSerializer):
    video_url = serializers.SerializerMethodField()
    type = serializers.SerializerMethodField()

    class Meta:
        model = Video
        fields = ['id', 'video_file', 'video_url', 'caption', 'uploaded_date', 'type']
        read_only_fields = ['uploaded_date']

    def get_video_url(self, obj):
        request = self.context.get('request')
        if obj.video_file:
            return request.build_absolute_uri(obj.video_file.url)
        return None

    def get_type(self, obj):
        return 'video'

class GalleryAlbumSerializer(serializers.ModelSerializer):
    cover_photo_url = serializers.SerializerMethodField()
    media_count = serializers.SerializerMethodField()
    media = serializers.SerializerMethodField()

    class Meta:
        model = GalleryAlbum
        fields = [
            'id', 'title', 'description', 'coverPhoto', 'cover_photo_url',
            'created_date', 'is_published', 'media_count', 'media'
        ]
        read_only_fields = ['created_date']

    def get_cover_photo_url(self, obj):
        request = self.context.get('request')
        if obj.coverPhoto:
            return request.build_absolute_uri(obj.coverPhoto.url)
        return None

    def get_media_count(self, obj):
        return obj.media_count

    def get_media(self, obj):
        photos = obj.photos.all()
        videos = obj.videos.all()
        photo_data = PhotoSerializer(photos, many=True, context=self.context).data
        video_data = VideoSerializer(videos, many=True, context=self.context).data
        return photo_data + video_data