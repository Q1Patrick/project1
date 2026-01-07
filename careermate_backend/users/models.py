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
    name = models.CharField(max_length=255)
    description = models.TextField(blank=True)
    template_file = models.FileField(upload_to="cv_templates/")
    is_active = models.BooleanField(default=True)
    created_at = models.DateTimeField(auto_now_add=True)

class CV(models.Model):
    user = models.ForeignKey(settings.AUTH_USER_MODEL, on_delete=models.CASCADE)
    title = models.CharField(max_length=255)
    file_pdf = models.FileField(upload_to='cvs/')
    created_at = models.DateTimeField(auto_now_add=True)

