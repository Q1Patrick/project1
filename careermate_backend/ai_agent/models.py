from django.db import models
from django.conf import settings

class CVAnalysis(models.Model):
    user = models.ForeignKey(settings.AUTH_USER_MODEL, on_delete=models.CASCADE)
    
    # Tên trường phải khớp với views.py
    extracted_text = models.TextField(verbose_name="Nội dung trích xuất từ PDF")  # Bạn đang gọi là cv_text
    analysis_result = models.JSONField(verbose_name="Kết quả JSON từ AI")         # Bạn đang gọi là analysis_result
    
    created_at = models.DateTimeField(auto_now_add=True)

    def __str__(self):
        return f"CV Analysis for {self.user.username} at {self.created_at}"