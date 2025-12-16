from django.urls import path
from .views import RegisterAPI, LoginAPI, UserListAPI, ProfileAPI

urlpatterns = [
    path('', UserListAPI.as_view()),
    path('register/', RegisterAPI.as_view()),
    path('login/', LoginAPI.as_view()),
    path('profile/', ProfileAPI.as_view()),
]
