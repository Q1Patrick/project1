from django.db import models
from django.conf import settings
from users.models import CVTemplate


class UserCV(models.Model):
    """
    ✅ MODEL CHÍNH: Lưu CV của từng user
    - user: Người tạo CV
    - name: Tên CV (ví dụ: "CV - Modern Blue")
    - html_content: HTML được render từ template
    - css_content: CSS tùy chỉnh (nếu có)
    """
    user = models.ForeignKey(settings.AUTH_USER_MODEL, on_delete=models.CASCADE, related_name="cvs")
    name = models.CharField(max_length=255, default="CV Mới")
    html_content = models.TextField(blank=True, null=True)
    css_content = models.TextField(blank=True, null=True)
    
    created_at = models.DateTimeField(auto_now_add=True)
    updated_at = models.DateTimeField(auto_now=True)

    class Meta:
        ordering = ['-created_at']

    def __str__(self):
        return f"{self.user.email} - {self.name}"
    
class CVTemplate(models.Model):
    # ... các field khác ...
    html_file = models.FileField(upload_to='cv_templates_source/', null=True, blank=True)
    
    # 👇 HÀM NÀY PHẢI CÓ
    def get_html_content(self):
        if self.html_file:
            try:
                with open(self.html_file.path, 'r', encoding='utf-8') as f:
                    return f.read()
            except Exception as e:
                print(f"Lỗi đọc file: {e}")
                return ""
        return self.html_content or ""