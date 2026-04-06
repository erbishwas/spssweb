from django.contrib import admin
from django.urls import path, include
from django.conf import settings
from django.conf.urls.static import static
#from two_factor.urls import urlpatterns as tf_urls

urlpatterns = [
   # path('', include(tf_urls)), 
    path('admin/', admin.site.urls),
    path('api/', include('main.public.urls')),
] 

handler404 = 'main.public.NotFound.views.custom_404_view'



if not settings.DEBUG:
    urlpatterns += static(settings.MEDIA_URL, document_root=settings.MEDIA_ROOT)
    urlpatterns += static(settings.STATIC_URL, document_root=settings.STATIC_ROOT)