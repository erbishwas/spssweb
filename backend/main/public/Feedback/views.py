# views.py
from rest_framework.decorators import api_view
from rest_framework.response import Response
from rest_framework import status
from django.utils import timezone
from .models import  ContactFeedback
from .serializers import  ContactFeedbackSerializer
import pytz



@api_view(['POST'])
def submit_feedback(request):
    kathmandu_tz = pytz.timezone('Asia/Kathmandu')
    current_time = timezone.now().astimezone(kathmandu_tz)
    
    data = {
        'date': current_time.strftime("%d/%m/%Y"),
        'time': current_time.strftime("%I:%M %p"),
        'name': request.data.get('name'),
        'email': request.data.get('email'),
        'message': request.data.get('message')
    }
    
    serializer = ContactFeedbackSerializer(data=data)
    if serializer.is_valid():
        serializer.save()
        return Response({'success': True}, status=status.HTTP_201_CREATED)
    return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)