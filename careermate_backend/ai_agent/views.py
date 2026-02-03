from rest_framework.views import APIView
from rest_framework.response import Response
from rest_framework.parsers import MultiPartParser, FormParser
from rest_framework import permissions
from .models import CVAnalysis

# ⚠️ Tạm comment để tránh lỗi protobuf, sẽ uncomment sau
# from .utils import extract_text_from_pdf, analyze_cv, chat_with_cv

try:
    from .utils import extract_text_from_pdf, analyze_cv, chat_with_cv
except Exception as e:
    print(f"⚠️ Lỗi import AI utilities: {e}")
    # Fallback: Define dummy functions để migration chạy được
    def extract_text_from_pdf(file): return ""
    def analyze_cv(text): return {}
    def chat_with_cv(cv_id, msg): return ""

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
            extracted_text=text,
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
            
            cv_context = latest_analysis.extracted_text
            
        except Exception as e:
            return Response({"reply": "Lỗi hệ thống khi tìm CV."})

        # 2. Gửi cho AI trả lời
        bot_reply = chat_with_cv(cv_context, user_message)

        return Response({"reply": bot_reply})
    
class GetLatestCVView(APIView):
    permission_classes = [permissions.IsAuthenticated]

    def get(self, request):
        try:
            # Lấy bản ghi phân tích mới nhất của user
            latest_cv = CVAnalysis.objects.filter(user=request.user).order_by('-created_at').first()
            
            if latest_cv:
                # Trả về kết quả JSON (chứa score, summary...)
                return Response(latest_cv.analysis_result, status=200)
            else:
                # Nếu chưa phân tích lần nào
                return Response({"score": 0, "summary": "Chưa có dữ liệu"}, status=200)
                
        except Exception as e:
            return Response({"error": str(e)}, status=500)