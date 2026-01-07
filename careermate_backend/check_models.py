import google.generativeai as genai
import os
from dotenv import load_dotenv

# 1. Nạp Key
load_dotenv()
api_key = os.getenv("GOOGLE_API_KEY")

if not api_key:
    print("LỖI: Chưa tìm thấy API Key trong file .env")
else:
    print(f"Key đang dùng: {api_key[:5]}... (Đã ẩn)")
    genai.configure(api_key=api_key)

    print("\n--- DANH SÁCH MODEL KHẢ DỤNG ---")
    try:
        # 2. Liệt kê tất cả model mà Key này được phép dùng
        for m in genai.list_models():
            if 'generateContent' in m.supported_generation_methods:
                print(f"- {m.name}")
    except Exception as e:
        print("LỖI KẾT NỐI:", e)