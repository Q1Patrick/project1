import google.generativeai as genai
from pdfminer.high_level import extract_text
import json
import os
import io
from dotenv import load_dotenv # 2. Import dotenv

load_dotenv()

# --- CẤU HÌNH API KEY ---
# Dán cái Key AIzaSy... bạn vừa lấy vào đây
GOOGLE_API_KEY = os.getenv("GOOGLE_API_KEY")

if not GOOGLE_API_KEY:
    raise ValueError("Chưa cấu hình GOOGLE_API_KEY trong file .env")

genai.configure(api_key=GOOGLE_API_KEY)


def extract_text_from_pdf(pdf_file):
    """Hàm đọc chữ từ file PDF"""
    try:
        # 2. Bọc file của Django vào BytesIO để pdfminer đọc được
        # pdf_file.read() sẽ đọc toàn bộ dữ liệu file ra
        file_stream = io.BytesIO(pdf_file.read())
        
        text = extract_text(file_stream)
        return text
    except Exception as e:
        print(f"Lỗi đọc PDF: {e}") # Đây là dòng in ra lỗi màu trắng bạn thấy trong Terminal
        return ""

def analyze_cv(cv_text):
    """Hàm gửi CV cho Gemini chấm điểm (Trả về JSON)"""
    
    generation_config = {
        "temperature": 0.3,          # 0.0 = Logic tuyệt đối (Kết quả giống nhau)
        "top_p": 1,
        "top_k": 1,
        "max_output_tokens": 2048,
    }
    # Chọn Model miễn phí: gemini-2.0-flash
    model = genai.GenerativeModel(
        model_name='gemini-flash-latest',
        generation_config=generation_config
    )

    prompt = f"""
    Bạn là chuyên gia tuyển dụng (HR). Hãy phân tích CV dưới đây.
    
    NỘI DUNG CV:
    {cv_text}
    
    YÊU CẦU QUAN TRỌNG:
    Chỉ trả về kết quả dưới dạng JSON thuần túy (không được có markdown ```json).
    Cấu trúc JSON bắt buộc:
    {{
        "score": (số nguyên 0-100),
        "summary": "Nhận xét tổng quan ngắn gọn (Tiếng Việt)",
        "strengths": ["Điểm mạnh 1", "Điểm mạnh 2", "Điểm mạnh 3"],
        "weaknesses": ["Điểm yếu 1", "Điểm yếu 2", "Điểm yếu 3"],
        "suggestion": "Lời khuyên cải thiện cụ thể"
    }}
    """

    try:
        response = model.generate_content(prompt)
        text_response = response.text
        
        # Làm sạch chuỗi JSON (đôi khi AI thêm ```json vào đầu)
        clean_json = text_response.replace('```json', '').replace('```', '').strip()
        
        return json.loads(clean_json)
        
    except Exception as e:
        print("LỖI AI CHI TIẾT:", str(e)) 
        print("KEY HIỆN TẠI:", os.getenv("GOOGLE_API_KEY"))
        return {
            "score": 0,
            "summary": "Lỗi khi gọi AI Gemini. Kiểm tra lại Key.",
            "error": str(e)
        }

def chat_with_cv(cv_text, user_question):
    """Hàm chat với Gemini dựa trên ngữ cảnh CV"""
    generation_config = {
        "temperature": 0.7, 
        "max_output_tokens": 1024,
    }
    model = genai.GenerativeModel('gemini-flash-latest', generation_config=generation_config)
    
    prompt = f"""
    Bạn là Career Coach. Dưới đây là CV của người dùng:
    ---
    {cv_text}
    ---
    
    Câu hỏi: "{user_question}"
    
    Hãy trả lời ngắn gọn, thân thiện, dựa trên CV.
    """

    try:
        response = model.generate_content(prompt)
        return response.text
    except Exception as e:
        return "Xin lỗi, Gemini đang bận. Thử lại sau nhé!"

