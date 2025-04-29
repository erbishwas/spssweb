from rest_framework.decorators import api_view
from rest_framework.response import Response
from rest_framework import status
from .models import Grade, AdmissionApplication
from .serializers import GradeSerializer, AdmissionApplicationSerializer
from django.utils.translation import gettext_lazy as _

@api_view(['GET'])
def available_grades(request):
    """Public endpoint to list joinable grades"""
    grades = Grade.objects.filter(is_active=True, can_join=True)
    serializer = GradeSerializer(grades, many=True)
    return Response(serializer.data)

@api_view(['POST'])
def submit_application(request):
    """Public endpoint for admission form submission"""
    serializer = AdmissionApplicationSerializer(data=request.data)
    
    if serializer.is_valid():
        # Set default status to pending
        application = serializer.save(status='pending')
        
        # Return minimal success response
        return Response({
            'success': True,
            'application_id': application.id,
            'message': _('Application submitted successfully')
        }, status=status.HTTP_201_CREATED)
    
    # Return detailed validation errors
    return Response({
        'success': False,
        'errors': serializer.errors
    }, status=status.HTTP_400_BAD_REQUEST)

@api_view(['GET'])
def check_application_status(request, application_id):
    """Public endpoint to check application status"""
    try:
        application = AdmissionApplication.objects.get(pk=application_id)
        return Response({
            'status': application.status,
            'status_display': application.get_status_display(),
            'registered_on': application.registered_on
        })
    except AdmissionApplication.DoesNotExist:
        return Response(
            {'error': _('Application not found')},
            status=status.HTTP_404_NOT_FOUND
        )