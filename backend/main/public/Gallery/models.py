from django.db import models
from django.utils import timezone
from django.core.validators import FileExtensionValidator

class GalleryAlbum(models.Model):
    title = models.CharField(max_length=200)
    description = models.TextField(blank=True)
    coverPhoto = models.ImageField(
        upload_to='gallery/cover/',
        validators=[FileExtensionValidator(allowed_extensions=['jpg', 'jpeg', 'png', 'gif'])]
    )
    created_date = models.DateTimeField(default=timezone.now)
    is_published = models.BooleanField(default=True)

    class Meta:
        ordering = ['-created_date']
        db_table = 'gallery_album'

    def __str__(self):
        return self.title
    
    def photo_count(self):
        return self.photos.count()
    
    def video_count(self):
        return self.videos.count()
    
    @property
    def media_count(self):
         return self.photo_count() + self.video_count()

class Photo(models.Model):
    album = models.ForeignKey(GalleryAlbum, on_delete=models.CASCADE, related_name='photos')
    image = models.ImageField(
        upload_to='gallery/photos/%Y/%m/%d/',
        validators=[FileExtensionValidator(allowed_extensions=['jpg', 'jpeg', 'png', 'gif'])]
    )
    caption = models.TextField(blank=True)
    uploaded_date = models.DateTimeField(default=timezone.now)

    class Meta:
        ordering = ['-uploaded_date']
        db_table = 'gallery_photos'

    def __str__(self):
        return f"Photo in {self.album.title} - {self.uploaded_date}"
    
    

class Video(models.Model):
    album = models.ForeignKey(GalleryAlbum, on_delete=models.CASCADE, related_name='videos')
    video_file = models.FileField(
        upload_to='gallery/videos/%Y/%m/%d/',
        validators=[FileExtensionValidator(allowed_extensions=['mp4', 'mov', 'avi', 'mkv', 'webm', 'flv', 'wmv', 'mpeg','m4v'])]
    )
    caption = models.TextField(blank=True)
    uploaded_date = models.DateTimeField(default=timezone.now)

    class Meta:
        ordering = ['-uploaded_date']
        db_table = 'gallery_videos'

    def __str__(self):
        return f"Video in {self.album.title} - {self.uploaded_date}"


    

