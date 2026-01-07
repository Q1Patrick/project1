from django.urls import path
from . import views

urlpatterns = [
    path('api/list/', views.JobListAPI.as_view(), name='job_list'),
]