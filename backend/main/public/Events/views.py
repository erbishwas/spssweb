from rest_framework.decorators import api_view
from rest_framework.response import Response
from rest_framework import status
from .models import Event
from .serializers import EventSerializer
from django.db import models
import nepali_datetime
from datetime import date

@api_view(['GET'])
def event_list(request):
    """
    Get all events with optional filtering
    Query params:
    - type: 'upcoming', 'past', or 'current_month'
    - search: search term for title/details
    """
    try:
        events = Event.objects.all().order_by('-event_date_ad')
        
        # Filter by type if specified
        event_type = request.query_params.get('type')
        if event_type == 'upcoming':
            events = events.filter(event_date_ad__gte=date.today())
        elif event_type == 'past':
            events = events.filter(event_date_ad__lt=date.today())
        elif event_type == 'current_month':
            today = nepali_datetime.date.today()
            events = events.filter(
                event_date_bs__startswith=f"{today.year}-{today.month:02d}"
            )
            
        # Search functionality
        search_term = request.query_params.get('search')
        if search_term:
            events = events.filter(
                models.Q(title__icontains=search_term) | 
                models.Q(details__icontains=search_term)
            )
            
        serializer = EventSerializer(events, many=True, context={'request': request})
        return Response(serializer.data)
    
    except Exception as e:
        return Response({"error": str(e)}, status=status.HTTP_500_INTERNAL_SERVER_ERROR)





@api_view(['GET'])
def event_detail(request, pk):
    """Get single event details"""
    try:
        event = Event.objects.get(pk=pk)
        serializer = EventSerializer(event, context={'request': request})
        return Response(serializer.data)
    except Event.DoesNotExist:
        return Response({"error": "Event not found"}, status=status.HTTP_404_NOT_FOUND)
    except Exception as e:
        return Response({"error": str(e)}, status=status.HTTP_500_INTERNAL_SERVER_ERROR)