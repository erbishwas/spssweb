from django.urls import path
from .views import (
    event_list,    
    event_detail
)

urlpatterns = [
    path('api/events/', event_list, name='event-list'),    
    path('api/events/<int:pk>/', event_detail, name='event-detail'),
]