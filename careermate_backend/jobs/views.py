from rest_framework import generics, permissions
from rest_framework.decorators import api_view, permission_classes
from rest_framework.response import Response
from .models import Job
from .serializers import JobSerializer
from rest_framework.permissions import AllowAny
# API: Xem danh sách bài đã đăng & Tạo bài mới
class RecruiterJobListView(generics.ListCreateAPIView):
    serializer_class = JobSerializer
    permission_classes = [permissions.IsAuthenticated] # Bắt buộc phải đăng nhập

    # 1. Chỉ lấy những bài Job do chính người này tạo ra
    def get_queryset(self):
        return Job.objects.filter(recruiter=self.request.user).order_by('-created_at')

    # 2. Khi tạo bài mới, tự động điền tên người tạo là User đang login
    def perform_create(self, serializer):
        serializer.save(recruiter=self.request.user)

# API: Xem chi tiết, Sửa, Xóa một bài cụ thể
class JobDetailView(generics.RetrieveUpdateDestroyAPIView):
    serializer_class = JobSerializer
    permission_classes = [permissions.IsAuthenticated]
    
    def get_queryset(self):
        return Job.objects.filter(recruiter=self.request.user)

class PublicJobListView(generics.ListAPIView):
    serializer_class = JobSerializer
    permission_classes = [AllowAny] # Quan trọng: Cho phép truy cập không cần login

    def get_queryset(self):
        # Chỉ lấy những bài đang Active (is_active=True) và mới nhất lên đầu
        return Job.objects.filter(is_active=True).order_by('-created_at')
    
@api_view(['DELETE'])
@permission_classes([permissions.IsAuthenticated])
def delete_job(request, pk):
    try:
        # Chỉ xóa nếu bài Job đó tồn tại VÀ người xóa là chủ sở hữu (recruiter=request.user)
        job = Job.objects.get(pk=pk, recruiter=request.user)
        job.delete()
        return Response({"message": "Đã xóa bài tuyển dụng thành công!"}, status=200)
    except Job.DoesNotExist:
        return Response({"error": "Không tìm thấy bài đăng hoặc bạn không có quyền xóa."}, status=404)