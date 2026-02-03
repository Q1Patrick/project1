# careermate_backend/users/urls.py

from django.urls import path
from . import views
from .views import AdminUserListAPI, UserDetailAdminAPI, DashboardStatsAPI
from cv_editor.views import TemplateListAPI # Chỉ import TemplateListAPI (Public API)

urlpatterns = [
    # --- 1. AUTHENTICATION (Đăng nhập/Đăng ký) ---
    path('api/signup/', views.signup_api, name='signup_api'),
    path('api/login/', views.login_api, name='login_api'),
    path('logout/', views.logout_view, name='logout'),

    # --- 2. USER PROFILE ---
    path('profile/', views.ProfileAPI.as_view()),
    path('profile/edit/', views.edit_profile, name='edit_profile'),
    path('profile/password/', views.change_password, name='change_password'),
    path('dashboard-stats/', DashboardStatsAPI.as_view()),
    # --- 3. ADMIN MANAGEMENT (Quản lý User) ---
    # URL đầy đủ sẽ là: http://127.0.0.1:8000/users/api/admin/list/
    path('api/admin/list/', AdminUserListAPI.as_view(), name='admin-user-list'),
    path("api/admin/users/<int:pk>/", UserDetailAdminAPI.as_view()),
    # --- 4. CV TEMPLATES (PUBLIC - Lấy danh sách mẫu) ---
    # URL public lấy active templates: /users/cv-templates/
    path('cv-templates/', TemplateListAPI.as_view(), name='template-list'),
    # ✅ Lưu ý: Admin API cho templates sẽ ở /editor/admin/templates/

    # --- 5. CÁC API KHÁC (Giữ lại để tránh lỗi code cũ) ---
    path('cv/analyze/', views.CVUploadAnalyzeAPI.as_view()),
    path("admin/posts/", views.PostAdminAPI.as_view()),
    path("admin/posts/<int:pk>/", views.PostDetailAdminAPI.as_view()),
    path("posts/", views.PostPublicAPI.as_view()),
    path("admin/system/status/", views.SystemStatusAPI.as_view()),
    path("admin/report/summary/", views.ReportSummaryAPI.as_view()),
]