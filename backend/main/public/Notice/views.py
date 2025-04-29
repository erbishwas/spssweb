from rest_framework.decorators import api_view
from rest_framework.response import Response
from rest_framework import status
from django.core.paginator import Paginator
from .models import Notice
from .serializers import NoticeSerializer
from django.shortcuts import get_object_or_404

@api_view(['GET'])
def notice_list(request):
    # Get all notices ordered by published_date (newest first)
    notices = Notice.objects.all().order_by('-published_date')
    
    # Pagination - 20 items per page
    page_number = request.GET.get('page', 1)
    paginator = Paginator(notices, 20)
    
    try:
        page_obj = paginator.page(page_number)
    except:
        return Response(
            {"detail": "Invalid page."},
            status=status.HTTP_404_NOT_FOUND
        )
    
    serializer = NoticeSerializer(page_obj.object_list, many=True, context={'request': request})
    
    return Response({
        'count': paginator.count,
        'total_pages': paginator.num_pages,
        'current_page': page_obj.number,
        'results': serializer.data
    })

@api_view(['GET'])
def notice_detail(request, pk):
    notice = get_object_or_404(Notice, pk=pk)
    serializer = NoticeSerializer(notice, context={'request': request})
    return Response(serializer.data)