import re

DEFAULT_DATA = {
    "profile": {
        "full_name": "Your Name",
        "title": "Your Title",
        "email": "you@email.com",
        "phone": "0123456789",
        "location": "Vietnam",
        "summary": "Short summary..."
    },
    "skills": ["Python", "Django"],
    "experience": [
        {
            "company": "Company A",
            "role": "Intern",
            "start": "2024",
            "end": "2025",
            "details": ["Did X", "Did Y"]
        }
    ],
    "education": [
        {
            "school": "Your University",
            "degree": "Software Engineering",
            "start": "2023",
            "end": "2027"
        }
    ]
}


def merge_default_data(existing: dict) -> dict:
    """
    Nếu user tạo CV mới mà chưa có data, mình đổ data mẫu vào để FE dễ edit.
    """
    if not existing:
        return DEFAULT_DATA.copy()
    return existing


def safe_get(d, path: str, default=""):
    """
    Lấy value từ JSON theo kiểu: profile.full_name
    """
    cur = d
    for key in path.split("."):
        if isinstance(cur, dict) and key in cur:
            cur = cur[key]
        else:
            return default
    return cur


def render_template_html(template_html: str, data: dict) -> str:
    """
    Render rất đơn giản bằng placeholder: {{profile.full_name}}
    (Không dùng Django Template engine để tránh lỗi / nhanh cho đồ án)
    """
    pattern = r"{{\s*([a-zA-Z0-9_.]+)\s*}}"

    def replacer(match):
        key = match.group(1)
        val = safe_get(data, key, default="")
        if isinstance(val, (dict, list)):
            return str(val)
        return str(val)

    return re.sub(pattern, replacer, template_html)
