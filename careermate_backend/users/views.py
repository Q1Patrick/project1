import PyPDF2
from rest_framework.views import APIView
from rest_framework.response import Response
from rest_framework import status
from django.views.decorators.csrf import csrf_exempt
from django.utils.decorators import method_decorator
from rest_framework.decorators import api_view
from rest_framework.permissions import AllowAny, IsAuthenticated
from rest_framework_simplejwt.tokens import RefreshToken
from rest_framework.parsers import MultiPartParser, FormParser
from django.contrib.auth import authenticate, login, logout
from django.contrib.auth import get_user_model
from .forms import SignUpForm, UserUpdateForm
from django.contrib.auth.forms import AuthenticationForm
from django.contrib.auth import logout, update_session_auth_hash
from django.contrib.auth.forms import PasswordChangeForm
from django.contrib.auth.decorators import login_required
from .serializers import SignupSerializer
from rest_framework.permissions import IsAuthenticated
from .models import CVAnalysis
from .serializers import CVAnalysisSerializer
from rest_framework.permissions import IsAdminUser
from .models import Post, CVTemplate
from .serializers import PostSerializer, CVTemplateSerializer
from django.utils.timezone import now
from django.shortcuts import render
from django.contrib.auth import login
from django.shortcuts import render, redirect
from django.contrib.auth import logout
from rest_framework.authtoken.models import Token
from django.db import IntegrityError
from .models import Profile, CVAnalysis, Post, CVTemplate
from .serializers import (
    UserSerializer,
    ProfileSerializer,
    CVAnalysisSerializer,
)

User = get_user_model()

# ===================== USER =====================
class UserListAPI(APIView):
    def get(self, request):
        users = User.objects.all()
        serializer = UserSerializer(users, many=True)
        return Response(serializer.data, status=status.HTTP_200_OK)


@method_decorator(csrf_exempt, name='dispatch')
class RegisterAPI(APIView):
    def post(self, request):
        username = request.data.get("username")
        email = request.data.get("email")
        password = request.data.get("password")

        if not username or not password:
            return Response(
                {"error": "username and password are required"},
                status=status.HTTP_400_BAD_REQUEST
            )

        if User.objects.filter(username=username).exists():
            return Response(
                {"error": "Username already exists"},
                status=status.HTTP_400_BAD_REQUEST
            )

        user = User.objects.create_user(
            username=username,
            email=email,
            password=password
        )

        login(request, user)

        return Response(
            {"message": "User registered successfully"},
            status=status.HTTP_201_CREATED
        )


class LoginAPI(APIView):
    permission_classes = [AllowAny]

    def post(self, request):
        username = request.data.get("username")
        password = request.data.get("password")

        try:
            user = User.objects.get(username=username)
            if not user.check_password(password):
                return Response({"error": "Invalid credentials"}, status=401)

            refresh = RefreshToken.for_user(user)
            return Response({
                "refresh": str(refresh),
                "access": str(refresh.access_token),
            })
        except User.DoesNotExist:
            return Response({"error": "User not found"}, status=404)


# ===================== PROFILE =====================
class ProfileAPI(APIView):
    permission_classes = [IsAuthenticated]

    def get(self, request):
        profile, _ = Profile.objects.get_or_create(user=request.user)
        serializer = ProfileSerializer(profile)
        return Response(serializer.data)

    def post(self, request):
        profile, _ = Profile.objects.get_or_create(user=request.user)
        serializer = ProfileSerializer(profile, data=request.data, partial=True)

        if serializer.is_valid():
            serializer.save(user=request.user)
            return Response(serializer.data)

        return Response(serializer.errors, status=400)


# ===================== CV ANALYSIS =====================
class CVUploadAnalyzeAPI(APIView):
    permission_classes = [IsAuthenticated]
    parser_classes = [MultiPartParser, FormParser]

    def post(self, request):
        if 'cv_file' not in request.FILES:
            return Response(
                {"error": "cv_file is required"},
                status=400
            )

        cv_file = request.FILES['cv_file']

        reader = PyPDF2.PdfReader(cv_file)
        text = ""
        for page in reader.pages:
            text += page.extract_text() or ""

        cv = CVAnalysis.objects.create(
            user=request.user,
            cv_file=cv_file,
            extracted_text=text,
            skills_found="Python, Django",
            score=20
        )

        analysis_result = {}
        return Response(
            {
                "message": "CV analyzed successfully",
                "analysis": analysis_result
            },
            status=status.HTTP_200_OK
        )

class PostAdminAPI(APIView):
    permission_classes = [IsAdminUser]

    def get(self, request):
        posts = Post.objects.all()
        return Response(PostSerializer(posts, many=True).data)

    def post(self, request):
        serializer = PostSerializer(data=request.data)
        if serializer.is_valid():
            serializer.save()
            return Response(serializer.data, status=201)
        return Response(serializer.errors, status=400)
    
class PostDetailAdminAPI(APIView):
    permission_classes = [IsAdminUser]

    def put(self, request, pk):
        post = Post.objects.get(pk=pk)
        serializer = PostSerializer(post, data=request.data, partial=True)
        if serializer.is_valid():
            serializer.save()
            return Response(serializer.data)
        return Response(serializer.errors, status=400)

    def delete(self, request, pk):
        Post.objects.get(pk=pk).delete()
        return Response(status=204)
    
class PostPublicAPI(APIView):
    permission_classes = [AllowAny]

    def get(self, request):
        posts = Post.objects.filter(is_published=True)
        return Response(PostSerializer(posts, many=True).data)

class CVTemplateAdminAPI(APIView):
    permission_classes = [IsAdminUser]
    parser_classes = [MultiPartParser, FormParser]

    def get(self, request):
        templates = CVTemplate.objects.all()
        return Response(CVTemplateSerializer(templates, many=True).data)

    def post(self, request):
        serializer = CVTemplateSerializer(data=request.data)
        if serializer.is_valid():
            serializer.save()
            return Response(serializer.data, status=201)
        return Response(serializer.errors, status=400)

class CVTemplateDetailAdminAPI(APIView):
    permission_classes = [IsAdminUser]

    def delete(self, request, pk):
        CVTemplate.objects.get(pk=pk).delete()
        return Response(status=204)

class CVTemplatePublicAPI(APIView):
    permission_classes = [AllowAny]

    def get(self, request):
        templates = CVTemplate.objects.filter(is_active=True)
        return Response(CVTemplateSerializer(templates, many=True).data)


class SystemStatusAPI(APIView):
    permission_classes = [IsAdminUser]

    def get(self, request):
        data = {
            "total_users": User.objects.count(),
            "total_posts": Post.objects.count(),
            "total_cv_templates": CVTemplate.objects.count(),
            "total_cv_uploaded": CVAnalysis.objects.count(),
            "server_time": now()
        }
        return Response(data)


class ReportSummaryAPI(APIView):
    permission_classes = [IsAdminUser]

    def get(self, request):
        today = now().date()

        data = {
            "new_users_today": User.objects.filter(date_joined__date=today).count(),
            "cv_uploaded_today": CVAnalysis.objects.filter(created_at__date=today).count(),
            "posts_published": Post.objects.filter(created_at__date=today).count(),
        }
        return Response(data)

        serializer = CVAnalysisSerializer(cv)
        return Response(serializer.data, status=201)
    
    

def home_view(request):
    # KIỂM TRA: Nếu đã đăng nhập thì vào thẳng Dashboard thành công
    if request.user.is_authenticated:
        return redirect('home_success')

    if request.method == 'POST':
        email = request.POST.get('email')
        password = request.POST.get('password')
        
        if User.objects.filter(username=email).exists():
            return render(request, 'home.html', {'error': 'Email đã tồn tại'})
        
        # Tạo User
        user = User.objects.create_user(username=email, email=email, password=password)
        # TỰ ĐỘNG tạo Profile cho user mới
        Profile.objects.create(user=user)
        
        login(request, user)
        return redirect('success')

    return render(request, 'home.html')
def signup_view(request):
    if request.method == 'POST':
        form = SignUpForm(request.POST)
        if form.is_valid():
            # 1. Lưu user nhưng chưa commit để xử lý password trước
            user = form.save(commit=False)
            
            # 2. Mã hóa mật khẩu (Quan trọng)
            user.set_password(form.cleaned_data['password'])
            
            # 3. Gán username là email (nếu logic của bạn dùng email làm ID chính)
            user.username = form.cleaned_data['email'] 
            
            user.save()

            # 4. TỰ ĐỘNG ĐĂNG NHẬP NGAY LẬP TỨC
            login(request, user)

            # 5. Chuyển hướng sang trang Dashboard (home_success)
            return redirect('home_success')
    else:
        form = SignUpForm()

    return render(request, 'signup.html', {'form': form})

def login_view(request):
    if request.method == 'POST':
        # 1. Đưa dữ liệu POST vào form xác thực của Django
        form = AuthenticationForm(data=request.POST)
        
        # 2. Kiểm tra tài khoản/mật khẩu có đúng không
        if form.is_valid():
            # Lấy user object từ form
            user = form.get_user()
            
            # Đăng nhập vào hệ thống
            login(request, user)
            
            # 3. Xử lý "Remember Me" (Ghi nhớ đăng nhập)
            if request.POST.get('remember_me'):
                # Nếu tích: Giữ session trong 2 tuần (mặc định Django)
                request.session.set_expiry(1209600) 
            else:
                # Nếu không tích: Xóa session khi tắt trình duyệt
                request.session.set_expiry(0)

            # Chuyển hướng sang Dashboard
            return redirect('home_success')
    else:
        form = AuthenticationForm()

    # Render giao diện login.html
    return render(request, 'login.html', {'form': form})
def restore_password_view(request):
    # Trả về trang khôi phục mật khẩu (ảnh image_d1aadc.png)
    return render(request, 'restore_password.html')

def upload_modal_view(request):
    # Trả về trang tải CV (ảnh image_d1aa9b.png)
    return render(request, 'upload_modal.html')

def success_view(request):
    return render(request, 'success.html')

def home_success_view(request):
    return render(request, 'home_success.html')

def upload_modal_view(request):
    if not request.user.is_authenticated:
        # Nếu chưa đăng nhập, đá về trang Login
        return redirect('login') 
    
    return render(request, 'upload_modal.html')

def logout_view(request):
    logout(request) # Xóa session của người dùng
    return redirect('home') # Quay về trang chủ

@login_required
def logout_view(request):
    logout(request)
    return redirect('login') # Quay về trang đăng nhập sau khi thoát

@login_required
def edit_profile(request):
    if request.method == 'POST':
        form = UserUpdateForm(request.POST, request.FILES, instance=request.user)
        if form.is_valid():
            form.save()
            return redirect('home_success') # Sửa xong quay về dashboard
    else:
        # Load dữ liệu hiện tại của user lên form
        form = UserUpdateForm(instance=request.user)
    
    return render(request, 'users/profile_edit.html', {'form': form})

@login_required
def change_password(request):
    if request.method == 'POST':
        form = PasswordChangeForm(request.user, request.POST)
        if form.is_valid():
            user = form.save()
            # Quan trọng: Giữ user ở trạng thái đăng nhập sau khi đổi pass
            update_session_auth_hash(request, user) 
            return redirect('home_success')
    else:
        form = PasswordChangeForm(request.user)
    
    return render(request, 'users/password_change.html', {'form': form})

@api_view(['POST'])
def signup_api(request):

    data = request.data.copy()

    if 'email' in data:
        data['username'] = data['email']

    try:
        # 1. Kiểm tra dữ liệu đầu vào
        serializer = UserSerializer(data=request.data)
        if serializer.is_valid():
            serializer.save()
            return Response({"message": "Đăng ký thành công!"}, status=201)
        
        # 2. Nếu dữ liệu sai (thiếu pass, sai định dạng email...)
        return Response(serializer.errors, status=400)

    except IntegrityError:
        # 3. NẾU LỖI TRÙNG TÊN/EMAIL -> Báo lỗi thân thiện thay vì sập server
        return Response({"error": "Tài khoản hoặc Email này đã tồn tại!"}, status=400)
    except Exception as e:
        # 4. Các lỗi khác
        return Response({"error": str(e)}, status=500)

@api_view(['POST'])
def login_api(request):
    # Lấy email và password từ React gửi lên
    email = request.data.get('username') # React gửi field name="username" nhưng giá trị là email
    password = request.data.get('password')
    
    # Kiểm tra xem user có tồn tại không
    # Lưu ý: Hàm authenticate mặc định dùng username, nếu bạn dùng email làm username thì code này chạy OK.
    # Nếu hệ thống bạn tách riêng email/username thì cần query User.objects.get(email=email) để check.
    print(f"DEBUG: Đang thử login với Email/User: {email}")
    print(f"DEBUG: Password nhận được: {password}")

    user = authenticate(username=email, password=password)
    
    print(f"DEBUG: Kết quả authenticate: {user}")
    if user is not None:
        # Nếu đúng -> Tạo (hoặc lấy) Token cho user đó
        token, _ = Token.objects.get_or_create(user=user)
        
        serializer = UserSerializer(user)

        return Response({
            "message": "Đăng nhập thành công",
            "token": token.key, # <--- Đây là chìa khóa quan trọng
            "user": serializer.data
        }, status=200)
    else:
        return Response({"error": "Email hoặc mật khẩu không đúng!"}, status=400)