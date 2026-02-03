from rest_framework import generics, permissions
from rest_framework.decorators import api_view, permission_classes
from rest_framework.response import Response
from .models import Job, Application
from .serializers import JobSerializer, ApplicationSerializer, ApplicationDetailSerializer
from rest_framework.permissions import AllowAny
from ai_agent.models import CVAnalysis
from django.utils import timezone
from datetime import date
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
        return Job.objects.filter(
            is_active=True, 
            deadline__gte=date.today() # __gte nghĩa là Greater Than or Equal (Lớn hơn hoặc bằng)
        ).order_by('-created_at')

class PublicJobDetailView(generics.RetrieveAPIView):
    queryset = Job.objects.filter(is_active=True, deadline__gte=date.today())
    serializer_class = JobSerializer
    permission_classes = [AllowAny]

class RecruiterJobDetailView(generics.RetrieveUpdateDestroyAPIView):
    serializer_class = JobSerializer
    permission_classes = [permissions.IsAuthenticated]

    def get_queryset(self):
        # Chỉ cho phép thao tác trên các Job do chính mình tạo ra
        return Job.objects.filter(recruiter=self.request.user)

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
    
@api_view(['POST'])
@permission_classes([permissions.IsAuthenticated])
def apply_job(request, job_id):
    try:
        job = Job.objects.get(pk=job_id)
    except Job.DoesNotExist:
        return Response({"error": "Công việc không tồn tại"}, status=404)

    # Kiểm tra xem đã apply chưa
    if Application.objects.filter(job=job, candidate=request.user).exists():
        return Response({"error": "Bạn đã ứng tuyển công việc này rồi!"}, status=400)

    # Tạo đơn ứng tuyển
    Application.objects.create(
        job=job,
        candidate=request.user,
        cover_letter=request.data.get('cover_letter', '')
        # CV có thể lấy từ CV mặc định của user hoặc upload mới (ở đây làm đơn giản trước)
    )
    return Response({"message": "Ứng tuyển thành công!"}, status=201)


# --- 2. API GỢI Ý VIỆC LÀM (RECOMMENDATION SYSTEM) ---
@api_view(['GET'])
@permission_classes([permissions.IsAuthenticated])
def recommended_jobs(request):
    """
    Gợi ý việc làm dựa trên độ trùng khớp giữa CV và Tags của Job
    """
    # 1. Lấy CV mới nhất của User
    latest_cv = CVAnalysis.objects.filter(user=request.user).order_by('-created_at').first()
    
    # Nếu chưa có CV, trả về danh sách job mới nhất (fallback)
    if not latest_cv or not latest_cv.extracted_text:
        recent_jobs = Job.objects.filter(is_active=True).order_by('-created_at')[:10]
        return Response(JobSerializer(recent_jobs, many=True).data)

    cv_text = latest_cv.extracted_text.lower() # Chuyển về chữ thường để so sánh
    
    # 2. Lấy tất cả Job đang tuyển
    all_jobs = Job.objects.filter(
        is_active=True, 
        deadline__gte=date.today()
    )
    
    scored_jobs = []
    
    for job in all_jobs:
        score = 0
        # Kiểm tra Job Title có trong CV không (Quan trọng nhất, +10 điểm)
        if job.title.lower() in cv_text:
            score += 10
            
        # Kiểm tra Tags (Kỹ năng) (Mỗi tag trùng +5 điểm)
        # Giả sử job.tags là list strings ["Python", "Django"] hoặc string "Python, Django"
        tags = job.tags if isinstance(job.tags, list) else str(job.tags).split(',')
        
        for tag in tags:
            clean_tag = tag.strip().lower()
            if clean_tag and clean_tag in cv_text:
                score += 5
                
        # Nếu có điểm > 0 thì thêm vào danh sách gợi ý
        if score > 0:
            scored_jobs.append({'job': job, 'score': score})
            
    # 3. Sắp xếp theo điểm số cao xuống thấp
    scored_jobs.sort(key=lambda x: x['score'], reverse=True)
    
    # Lấy ra danh sách job object
    final_jobs = [item['job'] for item in scored_jobs]
    
    # Nếu ít gợi ý quá (dưới 3), chèn thêm job mới nhất vào cho đỡ trống
    if len(final_jobs) < 3:
        remaining = 10 - len(final_jobs)
        extra_jobs = Job.objects.filter(is_active=True).exclude(id__in=[j.id for j in final_jobs]).order_by('-created_at')[:remaining]
        final_jobs.extend(extra_jobs)

    return Response(JobSerializer(final_jobs, many=True).data)

@api_view(['GET'])
@permission_classes([permissions.IsAuthenticated])
def job_applicants(request, job_id):
    try:
        # Kiểm tra xem Job này có phải của User đang đăng nhập không
        job = Job.objects.get(id=job_id, recruiter=request.user)
    except Job.DoesNotExist:
        return Response({"error": "Bạn không có quyền xem job này"}, status=403)

    applicants = Application.objects.filter(job=job).order_by('-created_at')
    return Response(ApplicationDetailSerializer(applicants, many=True).data)

# API: Cập nhật trạng thái ứng viên (Duyệt / Từ chối)
@api_view(['PATCH'])
@permission_classes([permissions.IsAuthenticated])
def update_application_status(request, application_id):
    try:
        # Lấy đơn ứng tuyển, đồng thời kiểm tra xem Recruiter có sở hữu Job của đơn này không
        application = Application.objects.get(id=application_id, job__recruiter=request.user)
    except Application.DoesNotExist:
        return Response({"error": "Không tìm thấy đơn ứng tuyển hoặc bạn không có quyền"}, status=403)

    status_val = request.data.get('status')
    if status_val not in ['REVIEWING', 'INTERVIEW', 'REJECTED', 'ACCEPTED']:
         return Response({"error": "Trạng thái không hợp lệ"}, status=400)

    application.status = status_val
    application.save()
    
    return Response({"message": "Đã cập nhật trạng thái", "status": application.status})