# 🧪 HƯỚNG DẪN TEST & KIỂM CHỨNG CÁC LỖI ĐÃ SỬA

## 📌 **CHUẨN BỊ**

### **1. Chạy Backend:**
```bash
cd c:\Code\Test\test\project1-main\careermate_backend
python manage.py runserver
```

### **2. Chạy Frontend (Optional):**
```bash
cd c:\Code\Test\test\project1-main\frontend-web
npm run dev
```

### **3. Lấy Access Token (Admin User):**
```bash
# Đầu tiên, tạo superuser nếu chưa có
python manage.py createsuperuser

# Sau đó login via API:
curl -X POST http://127.0.0.1:8000/users/api/login/ \
  -H "Content-Type: application/json" \
  -d '{"username":"admin@example.com","password":"password"}'

# Response sẽ chứa: "access": "YOUR_TOKEN_HERE"
```

---

## ✅ **TEST 1: USER MANAGEMENT (LỖI #1)**

### **A. Test API GET User List (Admin):**
```bash
TOKEN="your_admin_token_here"

curl -X GET \
  -H "Authorization: Token $TOKEN" \
  http://127.0.0.1:8000/users/api/admin/list/
```

**Expected Response:**
```json
[
  {
    "id": 1,
    "email": "admin@example.com",
    "first_name": "Admin",
    "last_name": "User",
    "role": "admin",
    "is_active": true,
    "date_joined": "2026-02-02T10:00:00Z"
  },
  {
    "id": 2,
    "email": "user@example.com",
    "first_name": "Test",
    "last_name": "User",
    "role": "candidate",
    "is_active": true,
    "date_joined": "2026-02-02T11:00:00Z"
  }
]
```

### **B. Test via Frontend (AdminDashboard):**
1. Đăng nhập tài khoản Admin
2. Vào Admin Dashboard (`/admin`)
3. Click tab "User Management"
4. ✅ Bảng User phải hiển thị danh sách users với các cột: ID, Email, Name, Role, Status, Action

**Nếu lỗi 403 Forbidden:**
- Kiểm tra user có `is_staff=True` và `is_superuser=True`
- Hoặc tạo superuser mới: `python manage.py createsuperuser`

---

## ✅ **TEST 2: CV TEMPLATE UPLOAD (LỖI #2)**

### **A. Test Upload Template (Admin via API):**

#### **Option 1: Upload với HTML Text:**
```bash
TOKEN="your_admin_token_here"

curl -X POST \
  -H "Authorization: Token $TOKEN" \
  -F "name=Modern Blue Template" \
  -F "description=A modern CV template with blue accent" \
  -F "html_content=<html><body><h1>{{profile.full_name}}</h1></body></html>" \
  http://127.0.0.1:8000/cv_editor/admin/templates/
```

#### **Option 2: Upload với HTML File:**
```bash
TOKEN="your_admin_token_here"

# Tạo file HTML test
echo "<html><body><h1>Test Template</h1></body></html>" > template.html

curl -X POST \
  -H "Authorization: Token $TOKEN" \
  -F "name=Professional Template" \
  -F "description=Professional CV template" \
  -F "html_file=@template.html" \
  -F "thumbnail=@path/to/image.png" \
  http://127.0.0.1:8000/cv_editor/admin/templates/
```

**Expected Response:**
```json
{
  "message": "✅ Tạo template thành công!",
  "id": 1,
  "name": "Modern Blue Template"
}
```

### **B. Test via Frontend (AdminTemplates Component):**
1. Đăng nhập Admin
2. Admin Dashboard → CV Templates tab
3. Click "+ Thêm Mẫu Mới"
4. Nhập:
   - Tên: "Modern Blue"
   - HTML Code: Dán code HTML mẫu
   - Thumbnail: Chọn file ảnh
5. Click "Lưu Template"
6. ✅ Template phải xuất hiện trong danh sách bên dưới

**Nếu lỗi "Multipart parse error":**
- Kiểm tra header `Content-Type: multipart/form-data`
- Hoặc thử upload via Frontend form (tự động xử lý)

### **C. Verify Template Saved Correctly:**
```bash
curl -X GET \
  -H "Authorization: Token $TOKEN" \
  http://127.0.0.1:8000/cv_editor/admin/templates/
```

**Expected:** Danh sách templates với field: id, name, description, thumbnail, html_content, html_file, is_active, created_at

---

## ✅ **TEST 3: USE CV TEMPLATE (LỖI #3)**

### **A. Test Create CV from Template (User via API):**
```bash
USER_TOKEN="your_user_token_here"

curl -X POST \
  -H "Authorization: Token $USER_TOKEN" \
  -H "Content-Type: application/json" \
  -d '{
    "template_id": 1,
    "name": "My First CV"
  }' \
  http://127.0.0.1:8000/cv_editor/cvs/
```

**Expected Response:**
```json
{
  "id": 1,
  "message": "Tạo CV thành công",
  "html_content": "<html><body><h1>{{profile.full_name}}</h1></body></html>"
}
```

### **B. Test via Frontend (TemplateGallery):**
1. Đăng nhập user thường
2. Vào Template Gallery (`/templates`)
3. ✅ Phải thấy các template được hiển thị (thumbnail, tên, nút "Dùng mẫu này")
4. Click nút "Dùng mẫu này" trên một template
5. ✅ Phải được chuyển sang trang CV Editor với CV mới được tạo

### **C. Test Get User's CV List:**
```bash
USER_TOKEN="your_user_token_here"

curl -X GET \
  -H "Authorization: Token $USER_TOKEN" \
  http://127.0.0.1:8000/cv_editor/cvs/
```

**Expected Response:**
```json
[
  {
    "id": 1,
    "user": 2,
    "name": "My First CV",
    "html_content": "...",
    "css_content": "",
    "created_at": "2026-02-02T12:00:00Z",
    "updated_at": "2026-02-02T12:00:00Z"
  }
]
```

### **D. Test Update CV:**
```bash
USER_TOKEN="your_user_token_here"

curl -X PATCH \
  -H "Authorization: Token $USER_TOKEN" \
  -H "Content-Type: application/json" \
  -d '{
    "name": "Updated CV Name",
    "html_content": "<html><body><h1>Updated</h1></body></html>"
  }' \
  http://127.0.0.1:8000/cv_editor/cvs/1/
```

**Expected:** Updated CV object

---

## 🐛 **TROUBLESHOOTING**

| Lỗi | Nguyên nhân | Giải pháp |
|-----|-----------|----------|
| `401 Unauthorized` | Token không hợp lệ | Kiểm tra token có tồn tại, chưa hết hạn |
| `403 Forbidden` | Không có quyền | Kiểm tra permission_classes, user có is_staff=True |
| `404 Not Found` | Template/CV không tồn tại | Kiểm tra ID có đúng |
| `400 Bad Request` | Dữ liệu sai | Kiểm tra fields trong request body |
| `500 Internal Error` | Lỗi server | Kiểm tra terminal Django có lỗi gì |

### **Common Errors & Fixes:**

**Error: "CVTemplate matching query does not exist"**
```python
# ✅ Fix: Kiểm tra ID template tồn tại
SELECT * FROM users_cvtemplate;  # In SQLite shell
```

**Error: "No 'X-CSRFToken' in headers"**
```bash
# ✅ Fix: Thêm CSRF token (nếu gọi từ form)
# Hoặc disable CSRF cho API (đã config CORS)
```

**Error: "Multipart parse error"**
```bash
# ✅ Fix: Đảm bảo:
# 1. Content-Type header KHÔNG set (curl tự set)
# 2. Hoặc set: Content-Type: multipart/form-data
curl -X POST \
  -H "Authorization: Token $TOKEN" \
  -F "name=Test" \  # curl tự set Content-Type đúng
  http://...
```

---

## 📊 **QUICK REFERENCE - API Endpoints**

| Endpoint | Method | Auth | Purpose |
|----------|--------|------|---------|
| `/users/api/admin/list/` | GET | Admin | Lấy danh sách users |
| `/cv_editor/admin/templates/` | POST | Admin | Tạo template |
| `/cv_editor/admin/templates/` | GET | Admin | Lấy danh sách templates |
| `/cv_editor/admin/templates/<id>/` | DELETE | Admin | Xóa template |
| `/cv_editor/templates/` | GET | Public | Lấy active templates |
| `/cv_editor/cvs/` | POST | User | Tạo CV từ template |
| `/cv_editor/cvs/` | GET | User | Lấy CV list |
| `/cv_editor/cvs/<id>/` | GET | User | Lấy chi tiết CV |
| `/cv_editor/cvs/<id>/` | PATCH | User | Update CV |
| `/cv_editor/cvs/<id>/render/` | POST | User | Render CV |

---

## 💡 **TIPS**

1. **Dùng Postman/Thunder Client** để test API dễ hơn curl
2. **Kiểm tra Django terminal** để thấy request logs
3. **Dùng `python manage.py shell`** để query database trực tiếp
4. **Dùng `python manage.py dumpdata --format=json > data.json`** để backup data

---

## 📝 **TEST RESULT CHECKLIST**

- [ ] Test 1A: User Management API - GET list ✅
- [ ] Test 1B: User Management Frontend - Danh sách hiển thị ✅
- [ ] Test 2A: Template Upload - HTML text ✅
- [ ] Test 2A: Template Upload - HTML file ✅
- [ ] Test 2B: Template Upload - Frontend form ✅
- [ ] Test 2C: Template Saved - Verify in DB ✅
- [ ] Test 3A: Create CV from Template - API ✅
- [ ] Test 3B: Create CV from Template - Frontend ✅
- [ ] Test 3C: Get User's CV List ✅
- [ ] Test 3D: Update CV ✅

**Khi tất cả tests pass = CÓ THỂ XÓA BUG REPORT** ✅

