from rest_framework.decorators import api_view
from rest_framework.response import Response
from .serializers import FlashNotice
from .models import FlashNoticeSerializer

@api_view(['GET'])
def flash_notice(request):
    try:
        notice= FlashNotice.objects.latest('id')
        serializer = FlashNoticeSerializer(notice)
        return Response(serializer.data)
    except FlashNotice.DoesNotExist:
        return Response({"error": "Flash notice not found"}, status=404)
    except Exception as e:
        return Response({"error": str(e)}, status=500)