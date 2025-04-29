from django.contrib import admin
from django.utils.html import format_html
from .models import GalleryAlbum, Photo, Video

class PhotoInline(admin.TabularInline):
    model = Photo
    extra = 1
    fields = ['image', 'caption', 'image_preview']
    readonly_fields = ['image_preview']

    def image_preview(self, obj):
        if obj.image:
            return format_html('<img src="{}" style="max-height: 100px;"/>', obj.image.url)
        return "No Image"
    image_preview.short_description = 'Preview'

class VideoInline(admin.TabularInline):
    model = Video
    extra = 1
    fields = ['video_file', 'caption']

@admin.register(GalleryAlbum)
class AlbumAdmin(admin.ModelAdmin):
    list_display = ['title', 'created_date', 'is_published']
    list_filter = ['is_published', 'created_date']
    search_fields = ['title', 'description']
    inlines = [PhotoInline, VideoInline]
    fieldsets = (
        (None, {
            'fields': ('title', 'description', 'coverPhoto', 'is_published')
        }),
    )
    readonly_fields = ['cover_photo_preview']

    def cover_photo_preview(self, obj):
        if obj.coverPhoto:
            return format_html('<img src="{}" style="max-height: 200px;"/>', obj.coverPhoto.url)
        return "No Cover Photo"
    cover_photo_preview.short_description = 'Cover Photo Preview'

@admin.register(Photo)
class PhotoAdmin(admin.ModelAdmin):
    list_display = ['album', 'uploaded_date', 'image_preview']
    list_filter = ['album', 'uploaded_date']
    search_fields = ['caption']
    date_hierarchy = 'uploaded_date'
    fields = ['album', 'image', 'caption', 'image_preview']
    readonly_fields = ['image_preview']

    def image_preview(self, obj):
        if obj.image:
            return format_html('<img src="{}" style="max-height: 200px;"/>', obj.image.url)
        return "No Image"
    image_preview.short_description = 'Preview'

@admin.register(Video)
class VideoAdmin(admin.ModelAdmin):
    list_display = ['album', 'uploaded_date']
    list_filter = ['album', 'uploaded_date']
    search_fields = ['caption']
    date_hierarchy = 'uploaded_date'