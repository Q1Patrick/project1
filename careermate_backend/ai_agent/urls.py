from django.urls import path
from .views import AnalyzeCVView, ChatCVView

urlpatterns = [
    path('api/analyze/', AnalyzeCVView.as_view()),
    path('api/chat/', ChatCVView.as_view()),
]