from rest_framework.views import APIView
from rest_framework.response import Response
from rest_framework.parsers import MultiPartParser, FormParser
from rest_framework import permissions
from .models import CVAnalysis
from .utils import extract_text_from_pdf, analyze_cv, chat_with_cv

class AnalyzeCVView(APIView):
    permission_classes = [permissions.IsAuthenticated] # Phải đăng nhập mới được upload
    parser_classes = (MultiPartParser, FormParser)     # Để nhận file upload

    def post(self, request):
        # 1. Nhận file từ Frontend
        cv_file = request.FILES.get('file')
        if not cv_file:
            return Response({"error": "Vui lòng chọn file PDF"}, status=400)

        # 2. Đọc nội dung file
        text = extract_text_from_pdf(cv_file)
        if len(text) < 50:
             return Response({"error": "File quá ngắn hoặc không đọc được chữ"}, status=400)

        # 3. Gọi AI phân tích
        ai_result = analyze_cv(text)

        # 4. Lưu vào Database (Quan trọng cho Giai đoạn 2 - Chatbot)
        CVAnalysis.objects.create(
            user=request.user,
            cv_text=text,
            analysis_result=ai_result
        )

        # 5. Trả kết quả về Frontend
        return Response(ai_result)
    
class ChatCVView(APIView):
    permission_classes = [permissions.IsAuthenticated] # Bắt buộc đăng nhập

    def post(self, request):
        user_message = request.data.get('message')
        if not user_message:
            return Response({"reply": "Bạn chưa nhập câu hỏi!"}, status=400)

        # 1. Lấy CV mới nhất của User này từ Database (Cái đã lưu ở Bước 1)
        try:
            # Lấy bản ghi mới nhất (order_by created_at giảm dần)
            latest_analysis = CVAnalysis.objects.filter(user=request.user).order_by('-created_at').first()
            
            if not latest_analysis:
                return Response({"reply": "Tôi chưa thấy CV của bạn. Hãy qua trang 'Phân tích CV' và upload trước nhé!"})
            
            cv_context = latest_analysis.cv_text
            
        except Exception as e:
            return Response({"reply": "Lỗi hệ thống khi tìm CV."})

        # 2. Gửi cho AI trả lời
        bot_reply = chat_with_cv(cv_context, user_message)

        return Response({"reply": bot_reply})