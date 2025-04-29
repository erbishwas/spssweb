from rest_framework.decorators import api_view, permission_classes
from rest_framework.permissions import IsAuthenticated
from rest_framework.response import Response
from rest_framework import status
from .models import Routine
from .serializers import RoutineSerializer

@api_view(['GET'])
def routine_list(request):
    routines = Routine.objects.all().order_by('-updated_at')
    serializer = RoutineSerializer(routines, many=True, context={'request': request})
    return Response(serializer.data)

@api_view(['GET'])
def routine_detail(request, pk):
    try:
        routine = Routine.objects.get(pk=pk)
    except Routine.DoesNotExist:
        return Response({'error': 'Routine not found'}, status=status.HTTP_404_NOT_FOUND)

    serializer = RoutineSerializer(routine, context={'request': request})
    return Response(serializer.data)
