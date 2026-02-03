from rest_framework.views import APIView
from rest_framework.response import Response
from rest_framework.permissions import IsAuthenticated, AllowAny
from .services import analyze_quiz_results, recommend_career_path

# 1. Dữ liệu câu hỏi cứng (Hoặc bạn có thể lưu vào DB nếu muốn xịn hơn)
QUIZ_QUESTIONS = [
    # --- NHÓM 1: PHONG CÁCH LÀM VIỆC & TƯ DUY ---
    {
        "id": 1,
        "question": "Khi bắt đầu một dự án mới, điều gì làm bạn hứng thú nhất?",
        "options": [
            {"text": "Được phân tích yêu cầu và vẽ sơ đồ hệ thống logic", "category": "analytical", "score": 5},
            {"text": "Được tự do lên ý tưởng thiết kế giao diện, hình ảnh", "category": "creative", "score": 5},
            {"text": "Được lựa chọn công nghệ và viết những dòng code đầu tiên", "category": "technical", "score": 5},
            {"text": "Được họp team, phân chia công việc và đốc thúc mọi người", "category": "leadership", "score": 5},
        ]
    },
    {
        "id": 2,
        "question": "Bạn thường giải quyết vấn đề khó khăn như thế nào?",
        "options": [
            {"text": "Tìm kiếm dữ liệu, so sánh các phương án dựa trên số liệu", "category": "analytical", "score": 5},
            {"text": "Thử nghiệm các cách tiếp cận mới lạ, chưa ai làm", "category": "creative", "score": 5},
            {"text": "Trao đổi với đồng nghiệp để tìm lời khuyên", "category": "communication", "score": 5},
            {"text": "Tự mình mày mò, debug, đọc tài liệu kỹ thuật", "category": "technical", "score": 5},
        ]
    },
    {
        "id": 3,
        "question": "Trong một cuộc họp nhóm, vai trò của bạn thường là?",
        "options": [
            {"text": "Người ghi chép và tổng hợp ý kiến logic", "category": "analytical", "score": 5},
            {"text": "Người đưa ra các ý tưởng 'điên rồ' và đột phá", "category": "creative", "score": 5},
            {"text": "Người kết nối mọi người và giải quyết mâu thuẫn", "category": "communication", "score": 5},
            {"text": "Người chốt phương án và phân công nhiệm vụ", "category": "leadership", "score": 5},
        ]
    },
    {
        "id": 4,
        "question": "Bạn thích sử dụng công cụ nào nhất trong công việc?",
        "options": [
            {"text": "Excel, PowerBI, SQL", "category": "analytical", "score": 5},
            {"text": "Photoshop, Figma, Illustrator", "category": "creative", "score": 5},
            {"text": "Email, Slack, Zoom, PowerPoint", "category": "communication", "score": 5},
            {"text": "VS Code, Terminal, Git, Docker", "category": "technical", "score": 5},
        ]
    },
    {
        "id": 5,
        "question": "Bạn cảm thấy thế nào khi phải thuyết trình trước đám đông?",
        "options": [
            {"text": "Rất tự tin, tôi thích truyền cảm hứng cho người khác", "category": "leadership", "score": 5},
            {"text": "Thoải mái, tôi coi đó là cơ hội để giao tiếp", "category": "communication", "score": 5},
            {"text": "Hơi lo lắng, tôi thích thể hiện qua sản phẩm hơn lời nói", "category": "technical", "score": 5},
            {"text": "Tôi chỉ thích trình bày các số liệu và sự thật logic", "category": "analytical", "score": 5},
        ]
    },

    # --- NHÓM 2: SỞ THÍCH & THÓI QUEN ---
    {
        "id": 6,
        "question": "Vào thời gian rảnh, bạn thường làm gì?",
        "options": [
            {"text": "Giải các câu đố logic, cờ vua, sudoku", "category": "analytical", "score": 5},
            {"text": "Vẽ tranh, chụp ảnh, thiết kế, trang trí nhà cửa", "category": "creative", "score": 5},
            {"text": "Tham gia các câu lạc bộ, tụ tập bạn bè", "category": "communication", "score": 5},
            {"text": "Học ngôn ngữ lập trình mới, vọc vạch máy tính", "category": "technical", "score": 5},
        ]
    },
    {
        "id": 7,
        "question": "Bạn muốn được đồng nghiệp nhận xét mình là người như thế nào?",
        "options": [
            {"text": "Sắc sảo, tư duy mạch lạc, chính xác", "category": "analytical", "score": 5},
            {"text": "Sáng tạo, có gu thẩm mỹ tốt", "category": "creative", "score": 5},
            {"text": "Thân thiện, dễ gần, hiểu chuyện", "category": "communication", "score": 5},
            {"text": "Chuyên gia công nghệ, cái gì cũng biết sửa", "category": "technical", "score": 5},
        ]
    },
    {
        "id": 8,
        "question": "Nếu được chọn một cuốn sách để đọc, bạn sẽ chọn?",
        "options": [
            {"text": "Sách về kinh tế, tư duy phản biện, khoa học dữ liệu", "category": "analytical", "score": 5},
            {"text": "Sách nghệ thuật, tiểu thuyết giả tưởng", "category": "creative", "score": 5},
            {"text": "Sách Đắc nhân tâm, nghệ thuật giao tiếp", "category": "communication", "score": 5},
            {"text": "Sách hướng dẫn lập trình, công nghệ mới", "category": "technical", "score": 5},
        ]
    },
    {
        "id": 9,
        "question": "Mục tiêu nghề nghiệp 5 năm tới của bạn là gì?",
        "options": [
            {"text": "Trở thành chuyên gia phân tích cấp cao", "category": "analytical", "score": 5},
            {"text": "Giám đốc sáng tạo (Creative Director)", "category": "creative", "score": 5},
            {"text": "Quản lý dự án hoặc Giám đốc điều hành (CEO)", "category": "leadership", "score": 5},
            {"text": "Kiến trúc sư phần mềm (Software Architect)", "category": "technical", "score": 5},
        ]
    },
    {
        "id": 10,
        "question": "Bạn ghét nhất điều gì trong công việc?",
        "options": [
            {"text": "Sự mơ hồ, thiếu số liệu chứng minh", "category": "analytical", "score": 5},
            {"text": "Sự nhàm chán, lặp đi lặp lại, thiếu đổi mới", "category": "creative", "score": 5},
            {"text": "Làm việc một mình, không được tương tác", "category": "communication", "score": 5},
            {"text": "Phải làm việc thủ công thay vì tự động hóa", "category": "technical", "score": 5},
        ]
    },

    # --- NHÓM 3: XỬ LÝ TÌNH HUỐNG (SCENARIO) ---
    {
        "id": 11,
        "question": "Khách hàng phàn nàn về sản phẩm lỗi, bạn sẽ làm gì?",
        "options": [
            {"text": "Xem xét dữ liệu log để tìm nguyên nhân gốc rễ", "category": "analytical", "score": 5},
            {"text": "Đề xuất một giải pháp đền bù độc đáo để họ vui vẻ", "category": "creative", "score": 5},
            {"text": "Gọi điện xin lỗi và lắng nghe họ chia sẻ", "category": "communication", "score": 5},
            {"text": "Chỉ đạo nhân viên xử lý ngay lập tức", "category": "leadership", "score": 5},
        ]
    },
    {
        "id": 12,
        "question": "Deadline sắp đến nhưng team không kịp hoàn thành, bạn sẽ?",
        "options": [
            {"text": "Tính toán lại tiến độ và cắt giảm tính năng thừa", "category": "analytical", "score": 5},
            {"text": "Tìm cách trình bày demo thật đẹp để 'cứu cánh'", "category": "creative", "score": 5},
            {"text": "Trực tiếp code thâu đêm cùng anh em để kịp tiến độ", "category": "technical", "score": 5},
            {"text": "Họp gấp, động viên tinh thần và phân lại task", "category": "leadership", "score": 5},
        ]
    },
    {
        "id": 13,
        "question": "Bạn được giao nhiệm vụ tổ chức tiệc công ty, bạn sẽ lo phần nào?",
        "options": [
            {"text": "Lên dự trù kinh phí và danh sách khách mời", "category": "analytical", "score": 5},
            {"text": "Thiết kế thiệp mời và trang trí sân khấu", "category": "creative", "score": 5},
            {"text": "Làm MC dẫn chương trình", "category": "communication", "score": 5},
            {"text": "Làm tổng đạo diễn, chỉ đạo mọi khâu", "category": "leadership", "score": 5},
        ]
    },
    {
        "id": 14,
        "question": "Khi tranh luận về một vấn đề kỹ thuật, bạn thường?",
        "options": [
            {"text": "Dùng logic và bằng chứng để chứng minh mình đúng", "category": "analytical", "score": 5},
            {"text": "Vẽ sơ đồ hoặc mockup để mọi người dễ hình dung", "category": "creative", "score": 5},
            {"text": "Lắng nghe hết ý kiến rồi mới phát biểu", "category": "communication", "score": 5},
            {"text": "Dựa vào kinh nghiệm chuyên sâu để chốt hạ", "category": "technical", "score": 5},
        ]
    },
    {
        "id": 15,
        "question": "Bạn thích không gian làm việc như thế nào?",
        "options": [
            {"text": "Yên tĩnh, ngăn nắp để tập trung suy nghĩ", "category": "analytical", "score": 5},
            {"text": "Nhiều màu sắc, tranh ảnh, không gian mở", "category": "creative", "score": 5},
            {"text": "Nơi mọi người có thể dễ dàng quay sang nói chuyện", "category": "communication", "score": 5},
            {"text": "Nhiều màn hình, thiết bị công nghệ hiện đại", "category": "technical", "score": 5},
        ]
    },

    # --- NHÓM 4: KỸ NĂNG CỤ THỂ ---
    {
        "id": 16,
        "question": "Bạn đánh giá cao kỹ năng nào nhất ở bản thân?",
        "options": [
            {"text": "Tư duy phản biện (Critical Thinking)", "category": "analytical", "score": 5},
            {"text": "Tư duy thiết kế (Design Thinking)", "category": "creative", "score": 5},
            {"text": "Kỹ năng đàm phán và thuyết phục", "category": "communication", "score": 5},
            {"text": "Kỹ năng lập trình và cấu trúc dữ liệu", "category": "technical", "score": 5},
        ]
    },
    {
        "id": 17,
        "question": "Khi lướt web, bạn thường chú ý đến điều gì?",
        "options": [
            {"text": "Cấu trúc thông tin và tốc độ tải trang", "category": "analytical", "score": 5},
            {"text": "Giao diện đẹp, màu sắc hài hòa, font chữ", "category": "creative", "score": 5},
            {"text": "Nội dung bài viết, cách hành văn", "category": "communication", "score": 5},
            {"text": "Các tính năng tương tác, hiệu ứng JS, API", "category": "technical", "score": 5},
        ]
    },
    {
        "id": 18,
        "question": "Nếu phải học một khóa học ngắn hạn ngay bây giờ, bạn chọn?",
        "options": [
            {"text": "Phân tích dữ liệu với Python/R", "category": "analytical", "score": 5},
            {"text": "Thiết kế UI/UX cơ bản", "category": "creative", "score": 5},
            {"text": "Kỹ năng lãnh đạo và quản lý đội nhóm", "category": "leadership", "score": 5},
            {"text": "Lập trình AI/Machine Learning", "category": "technical", "score": 5},
        ]
    },
    {
        "id": 19,
        "question": "Bạn định nghĩa thế nào là thành công?",
        "options": [
            {"text": "Giải quyết được những bài toán hóc búa", "category": "analytical", "score": 5},
            {"text": "Tạo ra những sản phẩm được mọi người yêu thích", "category": "creative", "score": 5},
            {"text": "Xây dựng được mạng lưới quan hệ rộng lớn", "category": "communication", "score": 5},
            {"text": "Trở thành chuyên gia số 1 trong lĩnh vực của mình", "category": "technical", "score": 5},
        ]
    },
    {
        "id": 20,
        "question": "Câu hỏi cuối: Bạn nghĩ mình phù hợp nhất với vị trí nào?",
        "options": [
            {"text": "Data Scientist / Business Analyst", "category": "analytical", "score": 5},
            {"text": "Designer / Marketing / Content Creator", "category": "creative", "score": 5},
            {"text": "HR / Sales / Consultant", "category": "communication", "score": 5},
            {"text": "Software Engineer / IT Specialist", "category": "technical", "score": 5},
        ]
    },
    
]

class QuizQuestionsAPI(APIView):
    permission_classes = [AllowAny] # Ai cũng được xem câu hỏi

    def get(self, request):
        return Response(QUIZ_QUESTIONS)

class QuizSubmitAPI(APIView):
    permission_classes = [IsAuthenticated] # Phải đăng nhập mới được lưu kết quả

    def post(self, request):
        # Data gửi lên dạng: { "answers": [ {"category": "technical", "score": 5, "max_score": 5}, ... ] }
        data = request.data.get("answers", [])
        
        if not data:
            return Response({"error": "Chưa có câu trả lời"}, status=400)

        # 1. Chấm điểm
        results_percent = analyze_quiz_results(data)
        
        # 2. Gợi ý nghề
        careers = recommend_career_path(results_percent)

        # 3. (Optional) Lưu vào Database UserQuizHistory ở đây nếu cần

        return Response({
            "analysis": results_percent,
            "recommendations": careers
        })