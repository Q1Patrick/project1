from django.urls import path
from .views import UserListAPI

urlpatterns = [
    path('', UserListAPI.as_view()),
]
