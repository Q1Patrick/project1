from django.urls import path
from .views import AnalyzeCVView, ChatCVView

urlpatterns = [
    path('analyze/', AnalyzeCVView.as_view()),
    path('chat/', ChatCVView.as_view()),
]