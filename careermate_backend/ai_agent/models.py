from django.db import models
from django.conf import settings

class CVAnalysis(models.Model):
    # Liên kết với người dùng
    user = models.ForeignKey(settings.AUTH_USER_MODEL, on_delete=models.CASCADE)
    
    # Lưu nội dung thô của CV (để Chatbot đọc sau này)
    cv_text = models.TextField()
    
    # Lưu kết quả phân tích từ AI (Điểm số, lỗi sai...) dưới dạng JSON
    analysis_result = models.JSONField(default=dict)
    
    created_at = models.DateTimeField(auto_now_add=True)

    def __str__(self):
        return f"Phân tích CV của {self.user.username} lúc {self.created_at}"