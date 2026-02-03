# 🚀 CareerMate - Docker Setup Guide

Hướng dẫn chạy CareerMate (Django Backend + React Frontend) với Docker Compose.

## 📋 Yêu cầu

- **Docker**: >= 20.10
- **Docker Compose**: >= 2.0
- **RAM**: Tối thiểu 2GB
- **Disk**: 2GB trống

## 📁 Cấu trúc thư mục

```
project1-main/
├── docker-compose.yml        # Main Docker Compose file
├── Dockerfile.backend        # Django backend image
├── Dockerfile.frontend       # React frontend image
├── .env.example              # Environment template
├── README_DOCKER.md          # File hướng dẫn này
├── careermate_backend/       # Django backend
│   ├── requirements.txt
│   ├── manage.py
│   ├── careermate_backend/
│   ├── ai_agent/
│   ├── users/
│   ├── jobs/
│   ├── billing/
│   ├── premium/
│   └── ...
└── frontend-web/             # React Vite frontend
    ├── package.json
    ├── src/
    ├── vite.config.js
    └── ...
```

## 🔧 Setup Ban Đầu

### 1️⃣ Tạo file `.env`

```bash
cp .env.example .env
```

**Nội dung `.env`:**
```env
DEBUG=True
SECRET_KEY=django-insecure-r_f5p+91xen5xksj#x+iq492e@p^_ldyyv8%a3az7p^npi8jmn
ALLOWED_HOSTS=localhost,127.0.0.1,backend,0.0.0.0

# PostgreSQL
POSTGRES_DB=careermate
POSTGRES_USER=careermate_user
POSTGRES_PASSWORD=careermate_password_123
DATABASE_URL=postgresql://careermate_user:careermate_password_123@db:5432/careermate

# Google AI (lấy từ Google Cloud Console)
GOOGLE_API_KEY=your_google_api_key_here

# CORS
CORS_ALLOWED_ORIGINS=http://localhost:5173,http://localhost:3000,http://127.0.0.1:5173

# Frontend
VITE_API_URL=http://localhost:8000
VITE_APP_NAME=CareerMate
```

### 2️⃣ Build Docker Images

```bash
cd project1-main
docker-compose build
```

**Output mong đợi:**
```
[+] Building 45.3s (20/20) FINISHED
 => careermate-backend  
 => careermate-frontend
```

### 3️⃣ Chạy Services

**Option A: Foreground (xem logs realtime)**
```bash
docker-compose up
```

**Option B: Background**
```bash
docker-compose up -d
```

### 4️⃣ Khởi tạo Database

Chạy migrations:
```bash
docker-compose exec backend python manage.py migrate
```

Tạo superuser (admin):
```bash
docker-compose exec backend python manage.py createsuperuser
```

### 5️⃣ Truy cập ứng dụng

| Dịch vụ | URL | Mô tả |
|---------|-----|-------|
| **Frontend** | http://localhost:5173 | React App |
| **Backend API** | http://localhost:8000 | Django REST API |
| **Admin** | http://localhost:8000/admin | Django Admin Panel |
| **Database** | localhost:5432 | PostgreSQL |

**Thông tin đăng nhập Database:**
```
Host: localhost
Port: 5432
Database: careermate
Username: careermate_user
Password: careermate_password_123
```

## 🛠️ Các Lệnh Hữu Ích

### Quản lý Services

```bash
# Dừng tất cả services
docker-compose down

# Dừng + xóa volumes (reset database)
docker-compose down -v

# Restart services
docker-compose restart

# Xem logs (tất cả)
docker-compose logs -f

# Xem logs của 1 service
docker-compose logs -f backend
docker-compose logs -f frontend
docker-compose logs -f db

# Kiểm tra status services
docker-compose ps
```

### Database Operations

```bash
# Chạy migrations
docker-compose exec backend python manage.py migrate

# Rollback migration
docker-compose exec backend python manage.py migrate [app] [number]

# Tạo migration mới
docker-compose exec backend python manage.py makemigrations

# Tạo superuser
docker-compose exec backend python manage.py createsuperuser

# Access PostgreSQL shell
docker-compose exec db psql -U careermate_user -d careermate

# Backup database
docker-compose exec db pg_dump -U careermate_user careermate > backup.sql

# Restore database
docker-compose exec -T db psql -U careermate_user careermate < backup.sql

# Collect static files
docker-compose exec backend python manage.py collectstatic --noinput

# Clear cache
docker-compose exec backend python manage.py clear_cache
```

### Frontend Commands

```bash
# Build production
docker-compose exec frontend npm run build

# Run linter
docker-compose exec frontend npm run lint

# Install new package
docker-compose exec frontend npm install [package-name]
```

### Backend Commands

```bash
# Django shell
docker-compose exec backend python manage.py shell

# Create test data
docker-compose exec backend python manage.py seed_data

# Check migrations
docker-compose exec backend python manage.py showmigrations
```

## 📊 Architecture

```
┌─────────────────────────────────────────────┐
│        Docker Compose Network                │
│      (careermate-network)                    │
└─────────────────────────────────────────────┘
         ↓              ↓              ↓
    ┌─────────┐   ┌─────────┐   ┌─────────┐
    │Frontend │   │ Backend │   │Database │
    │         │   │         │   │         │
    │ Vite    │   │ Django  │   │Postgres │
    │ :5173   │   │ :8000   │   │ :5432   │
    └─────────┘   └─────────┘   └─────────┘
        ↓              ↓              ↓
      React        Django REST    PostgreSQL
      Routes       API Endpoints  Tables
```

### Services:

1. **Frontend (Vite)**
   - Port: 5173
   - Framework: React 19 + Vite
   - Dependencies: Axios, React Router
   - API: Calls backend at `http://localhost:8000`

2. **Backend (Django)**
   - Port: 8000
   - Framework: Django 5.2 + DRF
   - Database: PostgreSQL (hoặc SQLite fallback)
   - Features:
     - Authentication (JWT)
     - CV Analysis (Google Gemini AI)
     - Job Management
     - User Management
     - Billing System

3. **Database (PostgreSQL)**
   - Port: 5432
   - Database: careermate
   - Persistence: `postgres_data` volume
   - Healthcheck: 10s interval

## 🔐 Security Notes

### Development
- ✅ OK DEBUG=True
- ✅ OK insecure SECRET_KEY
- ✅ OK no authentication required

### Production
- ❌ Set DEBUG=False
- ❌ Generate secure SECRET_KEY
- ❌ Use environment variables for secrets
- ❌ Enable HTTPS/SSL
- ❌ Restrict ALLOWED_HOSTS
- ❌ Use strong POSTGRES_PASSWORD
- ❌ Setup rate limiting
- ❌ Enable CSRF protection

## 🐛 Troubleshooting

### 1. Port đã bị sử dụng

```bash
# Tìm process sử dụng port
lsof -i :5173  # Frontend
lsof -i :8000  # Backend
lsof -i :5432  # Database

# Hoặc thay đổi port trong docker-compose.yml
# "8001:8000" để backend chạy trên 8001
```

### 2. Database connection error

```bash
# Kiểm tra database health
docker-compose ps
# Nếu db không healthy, restart
docker-compose restart db
docker-compose exec backend python manage.py migrate
```

### 3. "npm ERR! code ERESOLVE"

```bash
# Frontend dependency issue
docker-compose exec frontend npm install --legacy-peer-deps
```

### 4. "ModuleNotFoundError" ở Backend

```bash
# Rebuild backend image
docker-compose build --no-cache backend
docker-compose up backend
```

### 5. CORS Error

Kiểm tra `.env`:
```env
CORS_ALLOWED_ORIGINS=http://localhost:5173,http://127.0.0.1:5173
```

### 6. API calls timed out

```bash
# Kiểm tra backend logs
docker-compose logs -f backend

# Restart backend
docker-compose restart backend
```

### 7. Database mất dữ liệu

Database được mount dưới `postgres_data` volume. Nếu muốn reset:

```bash
# ⚠️ Cảnh báo: Xóa tất cả dữ liệu!
docker-compose down -v
docker-compose up
docker-compose exec backend python manage.py migrate
```

## 📈 Performance Tips

### 1. Optimize Images

```bash
# Multi-stage builds (tự động)
docker-compose build --no-cache
```

### 2. Caching

```bash
# Django cache
docker-compose exec backend python manage.py clear_cache

# Frontend caching (Vite)
# Configured in vite.config.js
```

### 3. Database Query Optimization

```python
# Trong Django code
from django.db.models import Prefetch

# Sử dụng select_related/prefetch_related
Job.objects.select_related('user').all()
User.objects.prefetch_related('jobs').all()
```

## 📚 API Endpoints

### Backend API (Django REST)

```
GET  /api/users/              - List users
POST /api/users/              - Create user
GET  /api/jobs/               - List jobs
POST /api/jobs/               - Create job
GET  /api/ai/analyze/         - Analyze CV
POST /api/ai/chat/            - AI chat
GET  /api/admin/              - Django admin
```

Docs:
```
http://localhost:8000/api/schema/    # API Schema
http://localhost:8000/admin/         # Admin panel
```

## 🔄 CI/CD Integration

### GitHub Actions (Optional)

```yaml
name: Test & Build
on: [push]
jobs:
  test:
    runs-on: ubuntu-latest
    services:
      postgres:
        image: postgres:16
        env:
          POSTGRES_PASSWORD: postgres
    steps:
      - uses: actions/checkout@v3
      - name: Build & Test
        run: docker-compose -f docker-compose.yml -f docker-compose.test.yml up
```

## 📝 Environment Variables Reference

| Variable | Default | Mô tả |
|----------|---------|-------|
| `DEBUG` | True | Django debug mode |
| `SECRET_KEY` | (insecure) | Django secret key |
| `ALLOWED_HOSTS` | localhost,... | Allowed hosts |
| `DATABASE_URL` | postgresql://... | DB connection string |
| `GOOGLE_API_KEY` | (required) | Google Generative AI |
| `POSTGRES_DB` | careermate | PostgreSQL database name |
| `POSTGRES_USER` | careermate_user | PostgreSQL user |
| `POSTGRES_PASSWORD` | careermate_password_123 | PostgreSQL password |
| `CORS_ALLOWED_ORIGINS` | localhost:5173,... | CORS whitelist |
| `VITE_API_URL` | http://localhost:8000 | Backend URL cho frontend |

## 🚀 Production Deployment

### 1. Prepare Production Image

```dockerfile
# production.dockerfile
FROM careermate-backend:latest
ENV DEBUG=False
ENV ALLOWED_HOSTS=yourdomain.com
```

### 2. Use Docker Secrets

```yaml
secrets:
  db_password:
    external: true
  api_key:
    external: true
```

### 3. Setup Nginx Reverse Proxy

```nginx
server {
    listen 80;
    server_name yourdomain.com;
    
    location / {
        proxy_pass http://frontend:5173;
    }
    
    location /api {
        proxy_pass http://backend:8000;
    }
}
```

## 📞 Hỗ trợ

Nếu gặp vấn đề:
1. Kiểm tra logs: `docker-compose logs -f`
2. Kiểm tra `.env` configuration
3. Kiểm tra ports: `docker-compose ps`
4. Reset và thử lại:
   ```bash
   docker-compose down -v
   docker-compose build --no-cache
   docker-compose up
   ```

## 📄 Tài liệu

- [Django Documentation](https://docs.djangoproject.com/)
- [React Documentation](https://react.dev/)
- [Docker Compose Reference](https://docs.docker.com/compose/reference/)
- [PostgreSQL Documentation](https://www.postgresql.org/docs/)
- [Vite Documentation](https://vitejs.dev/)

---

**Chúc bạn sử dụng CareerMate vui vẻ! 🎉**
