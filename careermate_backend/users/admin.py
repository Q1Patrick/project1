from django.contrib import admin
from django.contrib.auth.admin import UserAdmin
from .models import User

# Đăng ký model User để quản lý
admin.site.register(User, UserAdmin)