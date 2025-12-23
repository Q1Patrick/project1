from django.urls import path
from .views import (
    RegisterAPI,
    LoginAPI,
    UserListAPI,

    CVUploadAnalyzeAPI,
    PostAdminAPI,
    PostDetailAdminAPI,
    PostPublicAPI,
    CVTemplateAdminAPI,
    CVTemplateDetailAdminAPI,
    CVTemplatePublicAPI,

    SystemStatusAPI,
    ReportSummaryAPI,


    ProfileAPI,
    CVUploadAnalyzeAPI


)

urlpatterns = [
    path('', UserListAPI.as_view()),
    path('register/', RegisterAPI.as_view()),
    path('login/', LoginAPI.as_view()),
    path('profile/', ProfileAPI.as_view()),
    path('cv/analyze/', CVUploadAnalyzeAPI.as_view()),

    ## POSTS
    path("admin/posts/", PostAdminAPI.as_view()),
    path("admin/posts/<int:pk>/", PostDetailAdminAPI.as_view()),
    path("posts/", PostPublicAPI.as_view()),
    ## CV teamplate
    path("admin/cv-templates/", CVTemplateAdminAPI.as_view()),
    path("admin/cv-templates/<int:pk>/", CVTemplateDetailAdminAPI.as_view()),
    path("cv-templates/", CVTemplatePublicAPI.as_view()),

    ## status & summary
    path("admin/system/status/", SystemStatusAPI.as_view()),
    path("admin/report/summary/", ReportSummaryAPI.as_view()),   
]





