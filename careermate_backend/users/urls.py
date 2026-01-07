from django.urls import path
from . import views
from django.contrib import admin
from django.urls import path
from django.views.generic import TemplateView
from users import views

urlpatterns = [
    path('', views.home_view, name='home'),
    path('users/api/signup/', views.signup_api, name='signup_api'),
    path('users/api/login/', views.login_api, name='login_api'),
    path('signup/', views.signup_view, name='signup'),
    path('login/', views.login_view, name='login'),
    path('logout/', views.logout_view, name='logout'),
    path('profile/', views.ProfileAPI.as_view()),
    path('cv/analyze/', views.CVUploadAnalyzeAPI.as_view()),
    path('success/', views.success_view, name='success'),
    path('home_success/', views.home_success_view, name='home_success'),
    path('admin/', admin.site.urls),
    path('logout/', views.logout_view, name='logout'),
    path('profile/edit/', views.edit_profile, name='edit_profile'),
    path('profile/password/', views.change_password, name='change_password'),
    ## POSTS
    path("admin/posts/", views.PostAdminAPI.as_view()),
    path("admin/posts/<int:pk>/", views.PostDetailAdminAPI.as_view()),
    path("posts/", views.PostPublicAPI.as_view()),

    ## CV template
    path("admin/cv-templates/", views.CVTemplateAdminAPI.as_view()),
    path("admin/cv-templates/<int:pk>/", views.CVTemplateDetailAdminAPI.as_view()),
    path("cv-templates/", views.CVTemplatePublicAPI.as_view()),

    ## status & summary
    path("admin/system/status/", views.SystemStatusAPI.as_view()),
    path("admin/report/summary/", views.ReportSummaryAPI.as_view()),
]





