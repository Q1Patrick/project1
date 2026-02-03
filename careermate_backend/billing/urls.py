from django.urls import path
from . import views

urlpatterns = [
    path("plans/", views.list_plans),
    path("checkout/preview/", views.checkout_preview),
    path("checkout/confirm/", views.checkout_confirm),
    path("me/subscription/", views.my_subscription),
]
