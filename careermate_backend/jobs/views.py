from rest_framework import generics
from .models import Job
from .serializers import JobSerializer

# API Lấy danh sách tất cả công việc
class JobListAPI(generics.ListAPIView):
    queryset = Job.objects.all().order_by('-created_at') # Mới nhất lên đầu
    serializer_class = JobSerializer