# CareerMate - AI-Powered Career Guidance Platform

![CareerMate](index.html)

## 📋 Mục lục
- [Giới thiệu](#giới-thiệu)
- [Công nghệ sử dụng](#công-nghệ-sử-dụng)
- [Cấu trúc dự án](#cấu-trúc-dự-án)
- [Cài đặt (Local Development)](#cài-đặt-local-development)
- [Cài đặt với Docker](#cài-đặt-với-docker)
- [Cách hoạt động](#cách-hoạt-động)
- [API Documentation](#api-documentation)
- [Troubleshooting](#troubleshooting)

---

## 📌 Giới thiệu

**CareerMate** là một nền tảng hỗ trợ định hướng nghề nghiệp cho sinh viên, sử dụng trí tuệ nhân tạo (AI) để:
- Phân tích CV và kỹ năng
- Đề xuất định hướng sự nghiệp
- Cung cấp quiz đánh giá năng lực
- Quản lý hồ sơ ứng tuyển
- Kết nối với cơ hội việc làm

**Stack công nghệ:**
- **Backend:** Django + Django REST Framework
- **Frontend:** React + Vite + Tailwind CSS
- **AI:** Google Gemini API
- **Database:** SQLite (phát triển) / PostgreSQL (production)
- **Deployment:** Docker + Docker Compose

---

## 🛠️ Công nghệ sử dụng

### Backend
| Công nghệ | Phiên bản | Mục đích |
|-----------|----------|---------|
| Django | 5.2.10 | Web framework chính |
| Django REST Framework | 3.16.1 | API builder |
| Django CORS Headers | 4.9.0 | Xử lý CORS |
| djangorestframework-simplejwt | 5.5.1 | JWT Authentication |
| google-generativeai | 0.3.0 | Google Gemini AI |
| pdfminer.six | 20221105 | PDF text extraction |
| pdfplumber | 0.10.3 | Advanced PDF processing |
| python-docx | 0.8.11 | Word document handling |
| Pillow | 12.1.0 | Image processing |
| psycopg2-binary | 2.9.11 | PostgreSQL adapter |

### Frontend
| Công nghệ | Phiên bản | Mục đích |
|-----------|----------|---------|
| React | 19.2.0 | UI library |
| Vite | 7.2.5 | Build tool |
| Tailwind CSS | 3.4.17 | CSS framework |
| React Router | 7.11.0 | Routing |
| Axios | 1.13.2 | HTTP client |

### DevOps
- Docker
- Docker Compose
- PostgreSQL (optional)

---

## 📁 Cấu trúc dự án

```
careermate/
├── careermate_backend/          # Django backend
│   ├── careermate_backend/      # Project settings
│   │   ├── settings.py          # Django configuration
│   │   ├── urls.py              # URL routing
│   │   ├── wsgi.py              # WSGI config
│   │   └── asgi.py              # ASGI config
│   │
│   ├── users/                   # User management app
│   │   ├── models.py            # Custom User model
│   │   ├── views.py             # Auth views
│   │   ├── serializers.py       # DRF serializers
│   │   └── urls.py              # User endpoints
│   │
│   ├── ai_agent/                # AI analysis app
│   │   ├── utils.py             # Google Gemini integration
│   │   ├── views.py             # CV analysis endpoints
│   │   ├── models.py            # Analysis results storage
│   │   └── urls.py              # AI endpoints
│   │
│   ├── jobs/                    # Job listing app
│   │   ├── models.py            # Job posting model
│   │   ├── views.py             # Job search endpoints
│   │   └── serializers.py
│   │
│   ├── cv_editor/               # CV editor app
│   │   ├── models.py            # CV model
│   │   ├── views.py             # CV endpoints
│   │   └── rendering.py         # CV rendering logic
│   │
│   ├── assessments/             # Skills assessment app
│   │   ├── models.py            # Assessment model
│   │   ├── services.py          # Assessment logic
│   │   └── views.py
│   │
│   ├── quiz/                    # Career quiz
│   │   ├── quiz_analysis.py     # Quiz logic
│   │   └── career_recommendation.py
│   │
│   ├── billing/                 # Premium billing
│   │   ├── models.py
│   │   ├── views.py
│   │   └── services.py
│   │
│   ├── premium/                 # Premium features
│   ├── cvs/                     # CV storage
│   ├── media/                   # Uploaded files
│   ├── static/                  # Static files (CSS, JS, images)
│   ├── templates/               # HTML templates
│   ├── manage.py                # Django CLI
│   ├── requirements.txt         # Python dependencies
│   ├── db.sqlite3               # SQLite database
│   └── .env                     # Environment variables
│
├── frontend-web/                # React + Vite frontend
│   ├── src/
│   │   ├── pages/               # Page components
│   │   │   ├── Home.jsx
│   │   │   ├── Login.jsx
│   │   │   ├── CV.jsx
│   │   │   └── Jobs.jsx
│   │   ├── components/          # Reusable components
│   │   ├── App.jsx              # Root component
│   │   └── main.jsx             # Entry point
│   ├── public/                  # Static assets
│   ├── index.html               # HTML template
│   ├── package.json             # NPM dependencies
│   ├── vite.config.js           # Vite config
│   ├── tailwind.config.js       # Tailwind config
│   └── eslint.config.js         # Linting config
│
├── docker-compose.yml           # Docker Compose config
├── Dockerfile.backend           # Backend Docker image
├── Dockerfile.frontend          # Frontend Docker image
├── requirements.txt             # Backend dependencies
├── .env                         # Environment variables
├── .env.example                 # Example env file
├── .gitignore                   # Git ignore rules
└── README.md                    # This file
```

---

## 🚀 Cài đặt (Local Development)

### 📋 Yêu cầu
- Python 3.9+
- Node.js 16+
- Git
- Google API Key (for AI features)

### 1️⃣ Clone repository
```bash
git clone https://github.com/your-username/careermate.git
cd careermate
```

### 2️⃣ Setup Backend (Django)

#### Tạo virtual environment
```bash
cd careermate_backend
python -m venv .venv

# On Windows (PowerShell)
.venv\Scripts\activate.ps1

# On macOS/Linux
source .venv/bin/activate
```

#### Cài đặt dependencies
```bash
pip install -r requirements.txt
```

#### Tạo file `.env`
```bash
# Copy example file
cp .env.example .env

# Edit .env với thông tin của bạn
# IMPORTANT: Thêm Google API Key
GOOGLE_API_KEY=your_api_key_here
SECRET_KEY=your-secret-key
DEBUG=True
ALLOWED_HOSTS=localhost,127.0.0.1
```

#### Chạy migrations
```bash
python manage.py migrate
```

#### Tạo superuser (admin)
```bash
python manage.py createsuperuser
```
Nhập username, email, password khi được hỏi.

#### Chạy development server
```bash
python manage.py runserver
```
Backend sẽ chạy tại: `http://localhost:8000`
Admin panel: `http://localhost:8000/admin`

---

### 3️⃣ Setup Frontend (React)

#### Mở terminal mới, navigate tới frontend
```bash
cd frontend-web
```

#### Cài đặt dependencies
```bash
npm install
```

#### Chạy development server
```bash
npm run dev
```
Frontend sẽ chạy tại: `http://localhost:5173`

#### Build for production
```bash
npm run build
```
Output sẽ nằm trong thư mục `dist/`

---

### ✅ Kiểm tra installation

1. Backend API: `http://localhost:8000` (Status 404 là bình thường)
2. Frontend: `http://localhost:5173` (Trang home hiển thị)
3. Admin: `http://localhost:8000/admin` (Đăng nhập với superuser)

---

## 🐳 Cài đặt với Docker

### 📋 Yêu cầu
- Docker
- Docker Compose

### 1️⃣ Chuẩn bị

#### Tạo `.env` file từ example
```bash
cp .env.example .env
```

#### Chỉnh sửa `.env` với thông tin của bạn
```env
GOOGLE_API_KEY=your_api_key_here
SECRET_KEY=your-secret-key
DEBUG=False
ALLOWED_HOSTS=localhost,127.0.0.1,yourdomain.com
DATABASE_URL=postgresql://user:password@db:5432/careermate_db
```

### 2️⃣ Build và khởi động containers

#### Build images
```bash
docker-compose build
```

#### Chạy containers
```bash
docker-compose up -d
```

#### Chạy migrations
```bash
docker-compose exec backend python manage.py migrate
```

#### Tạo superuser
```bash
docker-compose exec backend python manage.py createsuperuser
```

#### Kiểm tra logs
```bash
docker-compose logs -f backend
docker-compose logs -f frontend
```

### 3️⃣ Truy cập ứng dụng
- Frontend: `http://localhost:3000` hoặc `http://localhost:5173`
- Backend: `http://localhost:8000`
- Admin: `http://localhost:8000/admin`
- PostgreSQL: `localhost:5432`

### 4️⃣ Quản lý containers

```bash
# Xem các containers đang chạy
docker-compose ps

# Dừng containers
docker-compose down

# Xem logs
docker-compose logs -f

# Restart containers
docker-compose restart

# Xóa volumes (cảnh báo: mất dữ liệu)
docker-compose down -v
```

---

## 🔄 Cách hoạt động

### Architecture Overview

```
┌─────────────────────────────────────────────────────────┐
│                    Browser (Client)                      │
│                  React + Vite (Port 5173)               │
└────────────────────────┬────────────────────────────────┘
                         │ HTTP/REST
                         ▼
┌─────────────────────────────────────────────────────────┐
│            Django Backend API (Port 8000)               │
├─────────────────────────────────────────────────────────┤
│                     Middleware                           │
│  (CORS, Auth, Session, Request/Response processing)    │
├─────────────────────────────────────────────────────────┤
│                    Django Apps                          │
│  • Users (Auth, Profile)                               │
│  • AI Agent (CV Analysis, Career Recommendations)      │
│  • Jobs (Job Listings, Search)                         │
│  • CV Editor (Create, Edit CVs)                        │
│  • Assessments (Skills Assessment)                     │
│  • Quiz (Career Path Quiz)                             │
│  • Billing (Payment Processing)                        │
│  • Premium (Premium Features)                          │
├─────────────────────────────────────────────────────────┤
│                   Google Gemini API                     │
│           (CV Analysis, Recommendations)               │
└────────────────┬────────────────────────────────────────┘
                 │
        ┌────────┴────────┐
        ▼                 ▼
    ┌──────────┐    ┌──────────────┐
    │ SQLite   │    │ PostgreSQL   │
    │(Dev DB)  │    │ (Prod DB)    │
    └──────────┘    └──────────────┘
```

### Luồng dữ liệu chính

#### 1️⃣ **Authentication Flow**
```
User Login → Django Auth → JWT Token → Frontend Store → API Requests with Token
```

#### 2️⃣ **CV Analysis Flow**
```
User Upload CV → Backend Receives File → Extract Text (pdfminer) → 
Send to Google Gemini → Get AI Analysis → Store in Database → 
Return Results to Frontend
```

#### 3️⃣ **Job Matching Flow**
```
User Skills/CV → Backend Analysis → Match with Job DB → 
Rank Matches → Return Recommendations to Frontend
```

#### 4️⃣ **Quiz & Assessment Flow**
```
User Answers Quiz → Backend Processes Responses → 
AI Analyzes Results → Generate Career Recommendations → 
Store Results → Display to User
```

---

## 🔧 API Documentation

### Base URL
- **Local:** `http://localhost:8000`
- **Production:** `https://api.careermate.com`

### Authentication
Sử dụng JWT Token:
```
Header: Authorization: Bearer <token>
```

### User Endpoints
```
POST   /api/users/register/          # Register new user
POST   /api/users/login/             # Login
POST   /api/users/logout/            # Logout
GET    /api/users/profile/           # Get user profile
PUT    /api/users/profile/           # Update profile
```

### AI Agent Endpoints
```
POST   /api/ai/analyze/              # Analyze CV
POST   /api/ai/chat/                 # Chat with AI
GET    /api/ai/latest/               # Get latest analysis
GET    /api/ai/recommendations/      # Get career recommendations
```

### Jobs Endpoints
```
GET    /api/jobs/                    # List all jobs
GET    /api/jobs/<id>/               # Get job details
GET    /api/jobs/search/             # Search jobs
POST   /api/jobs/<id>/apply/         # Apply for job
```

### CV Editor Endpoints
```
POST   /api/cv/                      # Create CV
GET    /api/cv/                      # List CVs
PUT    /api/cv/<id>/                 # Update CV
DELETE /api/cv/<id>/                 # Delete CV
GET    /api/cv/<id>/export/          # Export CV (PDF)
```

### Assessment Endpoints
```
POST   /api/assessments/             # Create assessment
GET    /api/assessments/             # List assessments
GET    /api/assessments/<id>/        # Get assessment details
POST   /api/assessments/<id>/submit/ # Submit assessment
```

---

## 🎯 Key Features

### 1. **CV Analysis & Parsing** 📄
- Upload CV (PDF, DOCX)
- Automatic text extraction
- AI-powered skill extraction
- Career path recommendations

### 2. **AI-Powered Recommendations** 🤖
- Analyze user skills
- Suggest suitable careers
- Job recommendations
- Skill gap analysis

### 3. **CV Editor** ✏️
- Create/edit CV online
- Multiple templates
- Export to PDF
- Real-time preview

### 4. **Job Matching** 💼
- Browse job listings
- Smart job matching based on skills
- Application tracking
- Salary insights

### 5. **Career Quiz** 📝
- Interactive career assessment
- Skills evaluation
- Personalized recommendations
- Progress tracking

### 6. **User Management** 👤
- User registration & login
- Profile management
- Saved preferences
- Application history

### 7. **Premium Features** ⭐
- Advanced analytics
- Exclusive job listings
- Priority support
- CV templates

---

## 🔐 Environment Variables

### Backend (`.env`)
```env
# Django
SECRET_KEY=your-secret-key-here
DEBUG=True
ALLOWED_HOSTS=localhost,127.0.0.1

# Database
DATABASE_URL=sqlite:///db.sqlite3
# atau untuk PostgreSQL:
# DATABASE_URL=postgresql://user:password@localhost:5432/careermate_db

# Google AI
GOOGLE_API_KEY=your-google-api-key

# CORS
CORS_ALLOWED_ORIGINS=http://localhost:5173,http://localhost:3000

# JWT
JWT_SECRET=your-jwt-secret
```

### Frontend (`.env`)
```env
VITE_API_URL=http://localhost:8000
VITE_API_TIMEOUT=30000
```

---

## 📊 Database Schema

### Key Models

#### User Model
```python
class User(AbstractBaseUser):
    email
    first_name
    last_name
    avatar
    bio
    skills
    is_active
    is_staff
    date_joined
```

#### CV Model
```python
class CV:
    user (FK)
    title
    file_url
    extracted_text
    created_at
    updated_at
```

#### Job Model
```python
class Job:
    title
    description
    company
    location
    salary_min
    salary_max
    required_skills
    created_at
```

#### Analysis Result Model
```python
class AnalysisResult:
    user (FK)
    cv (FK)
    analysis_result (JSONField)
    recommendations
    created_at
```

---

## 🐛 Troubleshooting

### 1. **"GOOGLE_API_KEY not found" Error**
```bash
# Giải pháp: Thêm GOOGLE_API_KEY vào .env
GOOGLE_API_KEY=your-actual-api-key
```
- Lấy API key từ: https://ai.google.dev/

### 2. **CORS Error**
```bash
# Giải pháp: Cập nhật CORS_ALLOWED_ORIGINS trong settings.py
CORS_ALLOWED_ORIGINS = [
    "http://localhost:5173",
    "http://localhost:3000",
]
```

### 3. **Database Connection Error**
```bash
# Chạy migrations
python manage.py migrate

# Nếu vẫn lỗi, xóa db.sqlite3 và tạo lại
rm db.sqlite3
python manage.py migrate
```

### 4. **Port Already in Use**
```bash
# Backend (port 8000)
python manage.py runserver 8001

# Frontend (port 5173)
npm run dev -- --port 5174
```

### 5. **PDF Upload Error**
```bash
# Cài đặt lại pdfminer
pip install --upgrade pdfminer.six pdfplumber
```

### 6. **Frontend Node Modules Issue**
```bash
# Xóa node_modules và cài lại
rm -r node_modules package-lock.json
npm install
```

### 7. **Docker Container Won't Start**
```bash
# Xem logs chi tiết
docker-compose logs backend

# Rebuild images
docker-compose down
docker-compose build --no-cache
docker-compose up
```

---

## 📚 Hướng dẫn Development

### Tạo Django App mới
```bash
cd careermate_backend
python manage.py startapp myapp
```

### Tạo Model & Migration
```bash
# Tạo migration file
python manage.py makemigrations

# Áp dụng migrations
python manage.py migrate
```

### Tạo React Component
```bash
# Component file structure
frontend-web/src/components/
  ├── MyComponent.jsx
  ├── MyComponent.css (optional)
  └── MyComponent.test.jsx (optional)
```

### Testing

**Backend (Django)**
```bash
python manage.py test
python manage.py test users.tests
```

**Frontend (React)**
```bash
npm test
npm run lint
```

---

## 🚢 Deployment

### AWS Deployment
1. EC2 instance setup
2. Install Docker & Docker Compose
3. Pull code from GitHub
4. Configure `.env` for production
5. Run `docker-compose up -d`

### Heroku Deployment
```bash
# Login
heroku login

# Create app
heroku create careermate-app

# Set environment variables
heroku config:set GOOGLE_API_KEY=xxx

# Deploy
git push heroku main
```

### DigitalOcean Deployment
1. Create Droplet
2. Install Docker
3. Clone repository
4. Configure environment
5. Run Docker Compose

---

## 📞 Support & Contact

- **Email:** support@careermate.com
- **GitHub:** https://github.com/your-username/careermate
- **Issues:** https://github.com/your-username/careermate/issues

---

## 📄 License

This project is licensed under the MIT License - see the LICENSE file for details.

---

## 👥 Contributors

- Your Name (@username)
- Other contributors

---

## 🎉 Changelog

### v1.0.0 (2025-02-03)
- Initial release
- CV analysis with Google Gemini
- Job matching system
- User authentication
- CV editor
- Career quiz

---

**Last Updated:** February 3, 2025

Made with ❤️ by CareerMate Team
