from django.contrib import admin
from django.contrib.auth.admin import UserAdmin
from .models import User

class CustomUserAdmin(UserAdmin):
    model = User
    # 1. Hiển thị cột 'role' ở danh sách User bên ngoài (để bạn nhìn thấy ngay)
    list_display = ['username', 'email', 'first_name', 'last_name', 'role', 'is_staff']
    
    # 2. Thêm 'role' vào form chỉnh sửa chi tiết bên trong
    # (Django chia form thành các khối fieldsets, mình sẽ nối thêm khối 'role' vào cuối)
    fieldsets = UserAdmin.fieldsets + (
        ('Thông tin bổ sung (Role)', {'fields': ('role',)}),
    )
    
    # 3. Thêm 'role' vào cả form tạo mới User
    add_fieldsets = UserAdmin.add_fieldsets + (
        ('Thông tin bổ sung (Role)', {'fields': ('role',)}),
    )

# Đăng ký Model User với cấu hình mới này
admin.site.register(User, CustomUserAdmin)