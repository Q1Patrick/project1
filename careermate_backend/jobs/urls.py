from django.urls import path
from .views import RecruiterJobListView, JobDetailView, PublicJobListView
from . import views
urlpatterns = [
    path('recruiter-list/', views.RecruiterJobListView.as_view(), name='recruiter-job-list'),
    path('my-jobs/<int:pk>/', JobDetailView.as_view(), name='recruiter-job-detail'),
    path('public/', PublicJobListView.as_view(), name='public-job-list'),
    path('api/public/', views.PublicJobListView.as_view(), name='public-job-list'),
    path('delete/<int:pk>/', views.delete_job, name='delete-job'),
    path('apply/<int:job_id>/', views.apply_job, name='apply-job'),
    path('recommendations/', views.recommended_jobs, name='recommended-jobs'),
    path('api/public/<int:pk>/', views.PublicJobDetailView.as_view(), name='public-job-detail'),
    path('recruiter/<int:pk>/', views.RecruiterJobDetailView.as_view(), name='recruiter-job-detail'),
    path('recruiter/job/<int:job_id>/applicants/', views.job_applicants, name='job-applicants'),
    path('recruiter/application/<int:application_id>/status/', views.update_application_status, name='update-app-status'),
]