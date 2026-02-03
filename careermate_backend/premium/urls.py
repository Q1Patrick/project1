from django.urls import path
from .views import PremiumPlansView

urlpatterns = [
    # Đường dẫn API sẽ là: http://127.0.0.1:8000/premium/plans/
    path('plans/', PremiumPlansView.as_view(), name='premium-plans'),
    
]