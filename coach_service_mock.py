import re

CAREER_ROADMAPS = {
    "backend": [
        "Learn HTTP, REST, JSON, Auth (JWT/OAuth2)",
        "Python + Flask/Django (or Java Spring Boot)",
        "Database: SQL (PostgreSQL) + indexing",
        "Caching/Queue: Redis + Celery/RQ",
        "Docker, CI/CD basics",
        "Build 2 projects: API + auth, CRUD + search",
        "Prepare interview: system design basics (junior)"
    ],
    "data": [
        "Python fundamentals + Pandas/Numpy",
        "SQL for analytics (joins, window functions)",
        "Data visualization (matplotlib/plotly)",
        "Basic statistics + A/B testing",
        "Mini project: dashboard + dataset analysis",
        "Practice interview: case questions"
    ],
    "frontend": [
        "HTML/CSS + responsive layout",
        "JavaScript ES6 + async",
        "React fundamentals + state management",
        "API integration + auth",
        "Build 2 projects: landing + job board UI",
        "Prepare interview: UI + JS questions"
    ]
}

INTERVIEW_QUESTIONS = {
    "backend": [
        "Explain REST and HTTP status codes.",
        "How would you design a login system with JWT?",
        "Describe a time you optimized a slow query.",
        "How do you handle errors and logging in APIs?"
    ],
    "data": [
        "Explain the difference between mean and median.",
        "How do you validate a dataset quality?",
        "Describe an analysis project you did and the result.",
        "What is overfitting? How to avoid it?"
    ],
    "frontend": [
        "Explain React state vs props.",
        "How do you optimize performance in React?",
        "Describe how you handle forms and validation.",
        "What is CORS and how to deal with it?"
    ]
}

def _guess_track(message: str, profile: dict):
    text = (message or "").lower() + " " + str(profile).lower()
    if any(k in text for k in ["backend", "api", "django", "flask", "spring", "sql", "server"]):
        return "backend"
    if any(k in text for k in ["data", "analytics", "ml", "machine learning", "pandas", "numpy"]):
        return "data"
    if any(k in text for k in ["frontend", "react", "ui", "javascript", "css"]):
        return "frontend"
    return "backend"

def _skill_gap(profile: dict, track: str):
    skills = [s.lower() for s in profile.get("skills", [])] if isinstance(profile, dict) else []
    must_have = {
        "backend": ["sql", "api", "git", "docker"],
        "data": ["sql", "python", "statistics"],
        "frontend": ["javascript", "react", "css"]
    }.get(track, [])
    missing = [s for s in must_have if s not in skills]
    return missing

def generate_response(message: str, profile: dict = None):
    profile = profile or {}
    name = profile.get("name", "Bạn")
    major = profile.get("major", "N/A")
    track = _guess_track(message, profile)
    missing = _skill_gap(profile, track)

    # Simple intents
    msg = (message or "").lower().strip()

    if "roadmap" in msg or "lộ trình" in msg:
        steps = CAREER_ROADMAPS.get(track, CAREER_ROADMAPS["backend"])
        bullet = "\n".join([f"- {i+1}. {s}" for i, s in enumerate(steps)])
        extra = ""
        if missing:
            extra = "\n\nGợi ý skill cần bổ sung sớm: " + ", ".join(missing)
        return (
            f"{name}, mình đề xuất lộ trình hướng **{track.upper()}** (dựa trên profile: major={major}).\n\n"
            f"{bullet}{extra}\n\n"
            "Nếu bạn muốn, gửi JD (job description) để mình tinh chỉnh lộ trình theo đúng công việc."
        )

    if "mock" in msg or "phỏng vấn" in msg or "interview" in msg:
        qs = INTERVIEW_QUESTIONS.get(track, INTERVIEW_QUESTIONS["backend"])
        bullet = "\n".join([f"- Q{i+1}: {q}" for i, q in enumerate(qs)])
        return (
            f"Ok {name}! Mình sẽ mock interview cho hướng **{track.upper()}**. Đây là 4 câu hỏi:\n\n"
            f"{bullet}\n\n"
            "Bạn trả lời lần lượt Q1 trước nhé, mình sẽ chấm & feedback."
        )

    # Default guidance
    tips = [
        "Chuẩn hóa CV: 1 trang, dự án nổi bật, số liệu (impact).",
        "Tập trung 1 hướng chính (Backend/Data/Frontend) và 1–2 dự án đúng hướng.",
        "Mỗi dự án ghi: Tech stack + vai trò + kết quả + link GitHub.",
        "Luyện phỏng vấn: 30 phút/ngày (Q&A + dự án)."
    ]
    tip_text = "\n".join([f"- {t}" for t in tips])
    missing_text = f"\n\nSkill bạn đang thiếu cho hướng {track.upper()}: {', '.join(missing)}" if missing else ""

    return (
        f"Chào {name}! Dựa trên thông tin hiện có, mình thấy bạn hợp với hướng **{track.upper()}**.\n\n"
        f"Gợi ý nhanh để tăng cơ hội pass fresher/junior:\n{tip_text}"
        f"{missing_text}\n\n"
        "Bạn muốn mình tạo **roadmap** hay làm **mock interview**?"
    )

def interview_feedback(answer: str):
    answer = (answer or "").strip()
    length_score = min(len(answer) // 40, 10)

    has_example = bool(re.search(r"\b(ví dụ|example|project|dự án)\b", answer.lower()))
    has_structure = bool(re.search(r"\b(star|situation|task|action|result)\b", answer.lower()))

    score = length_score
    feedback = []

    if len(answer) < 60:
        feedback.append("Câu trả lời hơi ngắn. Nên thêm bối cảnh + hành động + kết quả.")
    if not has_example:
        feedback.append("Nên thêm ví dụ/dự án cụ thể để tăng thuyết phục.")
    if not has_structure:
        feedback.append("Bạn có thể dùng khung STAR (Situation–Task–Action–Result).")

    if not feedback:
        feedback.append("Tốt! Câu trả lời có độ dài ổn và có ví dụ. Hãy thêm số liệu (impact) nếu có.")

    return {"score": score, "feedback": " ".join(feedback)}
