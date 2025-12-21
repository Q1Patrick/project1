from django.db import models
from django.contrib.auth.models import User


class CVAnalysis(models.Model):
    user = models.ForeignKey(
        User,
        on_delete=models.CASCADE,
        related_name="cv_analyses"
    )
    cv_file = models.FileField(upload_to="cvs/")
    extracted_text = models.TextField(blank=True)
    skills_found = models.TextField(blank=True)
    score = models.IntegerField(default=0)
    created_at = models.DateTimeField(auto_now_add=True)

class Profile(models.Model):
    ROLE_CHOICES = (
        ('student', 'Student'),
        ('recruiter', 'Recruiter'),
    )

    user = models.OneToOneField(User, on_delete=models.CASCADE)
    role = models.CharField(max_length=20, choices=ROLE_CHOICES)

    full_name = models.CharField(max_length=100, blank=True)
    phone = models.CharField(max_length=20, blank=True)
    major = models.CharField(max_length=100, blank=True)
    skills = models.TextField(blank=True)
    cv_file = models.FileField(upload_to='cvs/', null=True, blank=True)

    created_at = models.DateTimeField(auto_now_add=True)

    def __str__(self):
        return self.user.username

