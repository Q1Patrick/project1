from django.urls import path
from .views import AdminTemplateAPI, TemplateListAPI, UserCVListCreateAPI, UserCVDetailAPI, UserCVRenderAPI

urlpatterns = [
    path("cvs/", UserCVListCreateAPI.as_view()),
    path("cvs/<int:pk>/", UserCVDetailAPI.as_view()),
    path("cvs/<int:pk>/render/", UserCVRenderAPI.as_view()),
    path("templates/", TemplateListAPI.as_view()),
    path('admin/templates/', AdminTemplateAPI.as_view()),
    path('admin/templates/<int:pk>/', AdminTemplateAPI.as_view()),
]
