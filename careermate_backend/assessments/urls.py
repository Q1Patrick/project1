from django.urls import path
from .views import QuizQuestionsAPI, QuizSubmitAPI

urlpatterns = [
    path('questions/', QuizQuestionsAPI.as_view()),
    path('submit/', QuizSubmitAPI.as_view()),
]