from rest_framework.decorators import api_view
from rest_framework.response import Response
from django.shortcuts import get_object_or_404
from .models import GalleryAlbum, Photo, Video
from .serializers import PhotoSerializer, VideoSerializer
from .serializers import GalleryAlbumSerializer

@api_view(['GET'])
def get_albums(request):
    albums = GalleryAlbum.objects.filter(is_published=True).prefetch_related('photos', 'videos')
    serializer = GalleryAlbumSerializer(albums, many=True, context={'request': request})
    return Response({'albums': serializer.data})


@api_view(['GET'])
def get_album_content(request, album_id):
    album = get_object_or_404(GalleryAlbum, id=album_id, is_published=True)
    photos = Photo.objects.filter(album=album)
    videos = Video.objects.filter(album=album)
    
    photo_serializer = PhotoSerializer(photos, many=True, context={'request': request})
    video_serializer = VideoSerializer(videos, many=True, context={'request': request})
    
    return Response({
        'album': {
            'id': album.id,
            'title': album.title,
            'description': album.description,
            'coverPhoto': request.build_absolute_uri(album.coverPhoto.url) if album.coverPhoto else None,
            'created_date': album.created_date,
            'is_published': album.is_published
        },
        'media': photo_serializer.data + video_serializer.data
    })