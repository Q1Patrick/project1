from django.db import models
from django.conf import settings # Để lấy thông tin User đang đăng nhập

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

    def __str__(self):
        return self.title