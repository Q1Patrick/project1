from rest_framework.views import APIView
from rest_framework.response import Response
from rest_framework import permissions

class PremiumPlansView(APIView):
    # Cho phép tất cả mọi người xem bảng giá (kể cả chưa đăng nhập)
    permission_classes = [permissions.AllowAny] 

    def get(self, request):
        # Dữ liệu giả lập các gói cước để hiển thị frontend
        # (Sau này bạn có thể import Plan từ billing.models để lấy dữ liệu thật nếu muốn)
        plans = [
            {
                "id": "free",
                "code": "FREE",
                "name": "Free Starter",
                "price": 0,
                "currency": "VND",
                "description": "Dành cho sinh viên mới ra trường",
                "features": ["Tạo 1 CV chuẩn ATS", "Xem 3 việc làm/ngày", "AI gợi ý cơ bản"]
            },
            {
                "id": "pro",
                "code": "PRO_MONTHLY",
                "name": "Pro Career",
                "price": 99000,
                "currency": "VND",
                "description": "Tăng tốc sự nghiệp của bạn",
                "features": ["Tạo CV không giới hạn", "AI Chatbot Career Coach 24/7", "Huy hiệu Pro nổi bật", "Xem việc làm không giới hạn"]
            },
            {
                "id": "enterprise",
                "code": "ENTERPRISE",
                "name": "VIP Mentoring",
                "price": 299000,
                "currency": "VND",
                "description": "Đồng hành 1:1 cùng chuyên gia",
                "features": ["Tất cả tính năng Pro", "Kết nối trực tiếp HR Manager", "Review CV 1-1 với chuyên gia", "Mock Interview (Phỏng vấn thử)"]
            }
        ]
        return Response(plans)