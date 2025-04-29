from rest_framework.decorators import api_view
from rest_framework.response import Response
from .models import Staff
from .serializers import BasicStaffSerializer, StaffProfileSerializer

@api_view(['GET'])
def staff_list(request):
    try:
        staff_members = Staff.objects.filter(status__in=['active', 'on_leave']).order_by('site_position')
        serializer = BasicStaffSerializer(staff_members, many=True)
        return Response({
            'success': True,
            'data': serializer.data,
            'count': staff_members.count()
        })
    except Exception as e:
        return Response({
            'success': False,
            'error': str(e)
        }, status=500)

@api_view(['GET'])
def staff_detail(request, id):
    try:
        staff_member = Staff.objects.get(id=id)
        serializer = StaffProfileSerializer(
            staff_member,
            context={'request': request}  # This is the critical line
        )
        return Response({
            'success': True,
            'data': serializer.data
        })
    except Staff.DoesNotExist:
        return Response({
            'success': False,
            'error': f'Staff member with ID {id} not found'
        }, status=404)
    except Exception as e:
        return Response({
            'success': False,
            'error': str(e)
        }, status=500)