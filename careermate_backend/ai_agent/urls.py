from django.urls import path
from .views import AnalyzeCVView, ChatCVView, GetLatestCVView

urlpatterns = [
    path('analyze/', AnalyzeCVView.as_view()),
    path('chat/', ChatCVView.as_view()),
    path('latest/', GetLatestCVView.as_view(), name='latest-cv'),
]