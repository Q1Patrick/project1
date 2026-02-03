from django.db import models
from django.contrib.auth.models import AbstractUser
from django.conf import settings

# 1. Định nghĩa User đầu tiên và KHÔNG import bất kỳ cái gì tên User ở trên
class User(AbstractUser):
    ROLE_CHOICES = (
        ('candidate', 'Candidate'),
        ('recruiter', 'Recruiter'),
        ('admin', 'Admin'),
    )

    role = models.CharField(max_length=20, choices=ROLE_CHOICES, default='candidate')

    is_premium = models.BooleanField(default=False)
    avatar = models.ImageField(upload_to='avatars/', null=True, blank=True)
    phone_number = models.CharField(max_length=15, blank=True)
    cv_file = models.FileField(upload_to='resumes/', null=True, blank=True)
    class Meta:
        db_table = 'auth_user'

# 2. Các model khác phải dùng chuỗi 'users.User' hoặc settings.AUTH_USER_MODEL
class Profile(models.Model):
    user = models.OneToOneField(settings.AUTH_USER_MODEL, on_delete=models.CASCADE, related_name='profile')
    role = models.CharField(max_length=20, choices=[('student', 'Student'), ('recruiter', 'Recruiter')], default='student')
    full_name = models.CharField(max_length=100, blank=True)
    phone = models.CharField(max_length=20, blank=True)
    major = models.CharField(max_length=100, blank=True)
    skills = models.TextField(blank=True)
    cv_file = models.FileField(upload_to='cvs/', null=True, blank=True)
    created_at = models.DateTimeField(auto_now_add=True)

class CVAnalysis(models.Model):
    user = models.ForeignKey(settings.AUTH_USER_MODEL, on_delete=models.CASCADE, related_name="cv_analyses")
    cv_file = models.FileField(upload_to="cvs/")
    extracted_text = models.TextField(blank=True)
    skills_found = models.TextField(blank=True)
    score = models.IntegerField(default=0)
    created_at = models.DateTimeField(auto_now_add=True)

class Post(models.Model):
    title = models.CharField(max_length=255)
    content = models.TextField()
    is_published = models.BooleanField(default=True)
    created_at = models.DateTimeField(auto_now_add=True)

class CVTemplate(models.Model):
    """
    🟢 CHỈNH SỬA HOÀN CẢ MODEL - KẾT HỢP CẢ 2 ĐỊNH NGHĨA CŨ
    - Gồm tất cả field cần thiết
    - Có method get_html_content() để lấy nội dung HTML
    """
    name = models.CharField(max_length=255)
    description = models.TextField(blank=True)
    thumbnail = models.ImageField(upload_to='cv_thumbnails/', blank=True, null=True)
    
    # 2 cách lưu HTML: từ file hoặc từ trường text
    html_content = models.TextField(blank=True, null=True)
    html_file = models.FileField(upload_to='cv_templates_source/', null=True, blank=True)
    
    is_active = models.BooleanField(default=True)
    created_at = models.DateTimeField(auto_now_add=True)

    def get_html_content(self):
        """
        ✅ PHƯƠNG THỨC QUAN TRỌNG
        - Ưu tiên đọc từ File upload (nếu có)
        - Nếu không file thì lấy từ text
        - Trả về chuỗi HTML sạch
        """
        if self.html_file:
            try:
                with open(self.html_file.path, 'r', encoding='utf-8') as f:
                    return f.read()
            except Exception as e:
                print(f"⚠️ Lỗi đọc file template: {e}")
                return self.html_content or ""
        
        return self.html_content or ""
    
    def __str__(self):
        return f"Template: {self.name}"


class CV(models.Model):
    user = models.ForeignKey(settings.AUTH_USER_MODEL, on_delete=models.CASCADE)
    title = models.CharField(max_length=255)
    file_pdf = models.FileField(upload_to='cvs/')
    created_at = models.DateTimeField(auto_now_add=True)
    
    def __str__(self):
        return f"CV: {self.title} ({self.user.email})"


class UserCV(models.Model):
    """
    ✅ Model lưu CV từng user sau khi chọn template
    """
    user = models.ForeignKey(settings.AUTH_USER_MODEL, on_delete=models.CASCADE, related_name="user_cvs")
    name = models.CharField(max_length=255, default="CV Mới")
    html_content = models.TextField(blank=True, null=True)
    css_content = models.TextField(blank=True, null=True)
    
    created_at = models.DateTimeField(auto_now_add=True)
    updated_at = models.DateTimeField(auto_now=True)

    def __str__(self):
        return f"UserCV: {self.user.email} - {self.name}"