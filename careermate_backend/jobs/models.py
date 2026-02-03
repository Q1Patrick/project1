from django.db import models
from django.conf import settings # Để lấy thông tin User đang đăng nhập
from users.models import User
class Job(models.Model):
    # Ai là người đăng bài này? (Liên kết với bảng User)
    recruiter = models.ForeignKey(settings.AUTH_USER_MODEL, on_delete=models.CASCADE, related_name='jobs')
    
    title = models.CharField(max_length=255, verbose_name="Chức danh công việc")
    company_name = models.CharField(max_length=255, verbose_name="Tên công ty")
    location = models.CharField(max_length=255, verbose_name="Địa điểm làm việc")
    salary_range = models.CharField(max_length=100, verbose_name="Mức lương")
    
    description = models.TextField(verbose_name="Mô tả công việc")
    requirements = models.TextField(verbose_name="Yêu cầu ứng viên")
    benefits = models.TextField(verbose_name="Quyền lợi", blank=True, null=True)
    
    deadline = models.DateField(verbose_name="Hạn nộp hồ sơ")
    created_at = models.DateTimeField(auto_now_add=True)
    is_active = models.BooleanField(default=True) # Để ẩn/hiện bài đăng
    JOB_TYPES = [
        ('Full-time', 'Toàn thời gian'),
        ('Part-time', 'Bán thời gian'),
        ('Freelance', 'Freelance'),
        ('Internship', 'Thực tập'),
    ]
    job_type = models.CharField(max_length=50, choices=JOB_TYPES, default='Full-time')

    # Thêm Ngành nghề (Category)
    category = models.CharField(max_length=100, default='IT Software') 

    # Thêm Kinh nghiệm (Experience)
    experience = models.CharField(max_length=100, default='Không yêu cầu')

    tags = models.CharField(max_length=255, help_text="Ngăn cách bằng dấu phẩy")

    logo = models.CharField(max_length=500, blank=True, null=True, default="https://via.placeholder.com/150")
    def __str__(self):
        return self.title
    
class Application(models.Model):
    STATUS_CHOICES = [ 
        ('APPLIED', 'Đã nộp'),
        ('REVIEWING', 'Đang xem xét'),
        ('INTERVIEW', 'Phỏng vấn'),
        ('REJECTED', 'Từ chối'),
        ('ACCEPTED', 'Được nhận'),
    ]

    job = models.ForeignKey(Job, on_delete=models.CASCADE, related_name='applications')
    candidate = models.ForeignKey(settings.AUTH_USER_MODEL, on_delete=models.CASCADE, related_name='applications')
    cv_file = models.FileField(upload_to='applications_cvs/', null=True, blank=True) # CV dùng để apply
    cover_letter = models.TextField(blank=True, null=True)
    status = models.CharField(max_length=20, choices=STATUS_CHOICES, default='APPLIED')
    created_at = models.DateTimeField(auto_now_add=True)

    class Meta:
        unique_together = ('job', 'candidate') # Một người chỉ apply 1 lần cho 1 job

    def __str__(self):
        return f"{self.candidate.email} -> {self.job.title}"