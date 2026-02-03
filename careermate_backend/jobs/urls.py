from django.urls import path
from .views import RecruiterJobListView, JobDetailView, PublicJobListView
from . import views
urlpatterns = [
    path('my-jobs/', RecruiterJobListView.as_view(), name='recruiter-job-list'),
    path('my-jobs/<int:pk>/', JobDetailView.as_view(), name='recruiter-job-detail'),
    path('public/', PublicJobListView.as_view(), name='public-job-list'),
    path('delete/<int:pk>/', views.delete_job, name='delete-job'),
]