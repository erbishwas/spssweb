from rest_framework.decorators import api_view
from rest_framework.response import Response
from .models import ManagementCommittee
from .serializers import ManagementCommitteeSerializer
from rest_framework import status

@api_view(['GET'])
def committee(request, committee_type):
    
    # Map URL-friendly values to actual choice values
    COMMITTEE_TYPE_MAP = {
        'MANAGEMENT_COMMITTEE': 'Management Committee',
        'PTA': 'Parent Teacher Association'
    }
    
    try:
        # Get the proper committee type from the mapping
        proper_committee_type = COMMITTEE_TYPE_MAP.get(committee_type.upper())
        
        if not proper_committee_type:
            valid_types = ", ".join(COMMITTEE_TYPE_MAP.keys())
            return Response(
                {"error": f"Invalid committee type. Valid types are: {valid_types}"},
                status=status.HTTP_400_BAD_REQUEST
            )
        
        members = ManagementCommittee.objects.filter(
            committee_type=proper_committee_type
        ).order_by('site_position')
        
        serializer = ManagementCommitteeSerializer(
            members, 
            many=True, 
            context={'request': request}
        )
        
        return Response({
            "committee_type": proper_committee_type,
            "members": serializer.data
        })
        
    except Exception as e:
        return Response(
            {"error": str(e)},
            status=status.HTTP_500_INTERNAL_SERVER_ERROR
        )