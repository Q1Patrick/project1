from django.db import models

class Job(models.Model):
    title = models.CharField(max_length=255)         # Tên công việc
    company = models.CharField(max_length=255)       # Tên công ty
    salary = models.CharField(max_length=100)        # Mức lương (VD: $1000 - $2000)
    location = models.CharField(max_length=100)      # Địa điểm (Hồ Chí Minh, Hà Nội...)
    # Tags lưu dưới dạng text, cách nhau bởi dấu phẩy (VD: "Python,React,JS")
    tags = models.CharField(max_length=255, help_text="Nhập các kỹ năng cách nhau bằng dấu phẩy") 
    logo_url = models.URLField(default="https://via.placeholder.com/60") # Link ảnh logo
    is_hot = models.BooleanField(default=False)      # Có phải tin Hot không?
    created_at = models.DateTimeField(auto_now_add=True) # Ngày tạo

    def __str__(self):
        return self.title