from django.contrib.auth import get_user_model
from django.views.decorators.csrf import csrf_exempt
from django.utils.decorators import method_decorator
from django.utils.timezone import now

from rest_framework.views import APIView
from rest_framework.response import Response
from rest_framework import status
from rest_framework.permissions import AllowAny, IsAuthenticated, IsAdminUser
from rest_framework.parsers import MultiPartParser, FormParser
from rest_framework_simplejwt.tokens import RefreshToken

from .models import Profile, CVAnalysis, Post, CVTemplate
from .serializers import (
    UserSerializer,
    ProfileSerializer,
    CVAnalysisSerializer,
    PostSerializer,
    CVTemplateSerializer,
)

User = get_user_model()


# ===================== USER =====================
class UserListAPI(APIView):
    def get(self, request):
        users = User.objects.all()
        serializer = UserSerializer(users, many=True)
        return Response(serializer.data, status=status.HTTP_200_OK)


@method_decorator(csrf_exempt, name="dispatch")
class RegisterAPI(APIView):
    permission_classes = [AllowAny]

    def post(self, request):
        username = request.data.get("username")
        email = request.data.get("email", "")
        password = request.data.get("password")

        if not username or not password:
            return Response(
                {"error": "username and password are required"},
                status=status.HTTP_400_BAD_REQUEST,
            )

        if User.objects.filter(username=username).exists():
            return Response(
                {"error": "Username already exists"},
                status=status.HTTP_400_BAD_REQUEST,
            )

        User.objects.create_user(username=username, email=email, password=password)

        return Response(
            {"message": "User registered successfully"},
            status=status.HTTP_201_CREATED,
        )


class LoginAPI(APIView):
    permission_classes = [AllowAny]

    def post(self, request):
        username = request.data.get("username")
        password = request.data.get("password")

        if not username or not password:
            return Response(
                {"error": "username and password are required"},
                status=status.HTTP_400_BAD_REQUEST,
            )

        try:
            user = User.objects.get(username=username)
            if not user.check_password(password):
                return Response({"error": "Invalid credentials"}, status=status.HTTP_401_UNAUTHORIZED)

            refresh = RefreshToken.for_user(user)
            return Response(
                {
                    "refresh": str(refresh),
                    "access": str(refresh.access_token),
                },
                status=status.HTTP_200_OK,
            )
        except User.DoesNotExist:
            return Response({"error": "User not found"}, status=status.HTTP_404_NOT_FOUND)


# ===================== PROFILE =====================
class ProfileAPI(APIView):
    permission_classes = [IsAuthenticated]

    def get(self, request):
        profile, _ = Profile.objects.get_or_create(user=request.user)
        serializer = ProfileSerializer(profile)
        return Response(serializer.data, status=status.HTTP_200_OK)

    def post(self, request):
        profile, _ = Profile.objects.get_or_create(user=request.user)
        serializer = ProfileSerializer(profile, data=request.data, partial=True)

        if serializer.is_valid():
            serializer.save(user=request.user)
            return Response(serializer.data, status=status.HTTP_200_OK)

        return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)


# ===================== CV ANALYSIS =====================
class CVUploadAnalyzeAPI(APIView):
    permission_classes = [IsAuthenticated]
    parser_classes = [MultiPartParser, FormParser]

    def post(self, request):
        if "cv_file" not in request.FILES:
            return Response(
                {"error": "cv_file is required"},
                status=status.HTTP_400_BAD_REQUEST,
            )

        cv_file = request.FILES["cv_file"]

        # Import ở runtime để tránh crash nếu thiếu PyPDF2
        try:
            import PyPDF2
        except ImportError:
            return Response(
                {"error": "Missing dependency: PyPDF2. Install: pip install PyPDF2"},
                status=status.HTTP_500_INTERNAL_SERVER_ERROR,
            )

        reader = PyPDF2.PdfReader(cv_file)
        text = ""
        for page in reader.pages:
            text += page.extract_text() or ""

        cv = CVAnalysis.objects.create(
            user=request.user,
            cv_file=cv_file,
            extracted_text=text,
            skills_found="Python, Django",
            score=20,
        )

        analysis_result = {
            "cv_id": cv.id,
            "skills": cv.skills_found,
            "score": cv.score,
            "extracted_text_preview": text[:300],
        }

        return Response(
            {
                "message": "CV analyzed successfully",
                "analysis": analysis_result,
            },
            status=status.HTTP_200_OK,
        )


# ===================== POSTS =====================
class PostAdminAPI(APIView):
    permission_classes = [IsAdminUser]

    def get(self, request):
        posts = Post.objects.all()
        return Response(PostSerializer(posts, many=True).data, status=status.HTTP_200_OK)

    def post(self, request):
        serializer = PostSerializer(data=request.data)
        if serializer.is_valid():
            serializer.save()
            return Response(serializer.data, status=status.HTTP_201_CREATED)
        return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)


class PostDetailAdminAPI(APIView):
    permission_classes = [IsAdminUser]

    def put(self, request, pk):
        try:
            post = Post.objects.get(pk=pk)
        except Post.DoesNotExist:
            return Response({"error": "Post not found"}, status=status.HTTP_404_NOT_FOUND)

        serializer = PostSerializer(post, data=request.data, partial=True)
        if serializer.is_valid():
            serializer.save()
            return Response(serializer.data, status=status.HTTP_200_OK)
        return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)

    def delete(self, request, pk):
        deleted, _ = Post.objects.filter(pk=pk).delete()
        if deleted == 0:
            return Response({"error": "Post not found"}, status=status.HTTP_404_NOT_FOUND)
        return Response(status=status.HTTP_204_NO_CONTENT)


class PostPublicAPI(APIView):
    permission_classes = [AllowAny]

    def get(self, request):
        posts = Post.objects.filter(is_published=True)
        return Response(PostSerializer(posts, many=True).data, status=status.HTTP_200_OK)


# ===================== CV TEMPLATES =====================
class CVTemplateAdminAPI(APIView):
    permission_classes = [IsAdminUser]
    parser_classes = [MultiPartParser, FormParser]

    def get(self, request):
        templates = CVTemplate.objects.all()
        return Response(CVTemplateSerializer(templates, many=True).data, status=status.HTTP_200_OK)

    def post(self, request):
        serializer = CVTemplateSerializer(data=request.data)
        if serializer.is_valid():
            serializer.save()
            return Response(serializer.data, status=status.HTTP_201_CREATED)
        return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)


class CVTemplateDetailAdminAPI(APIView):
    permission_classes = [IsAdminUser]

    def delete(self, request, pk):
        deleted, _ = CVTemplate.objects.filter(pk=pk).delete()
        if deleted == 0:
            return Response({"error": "CVTemplate not found"}, status=status.HTTP_404_NOT_FOUND)
        return Response(status=status.HTTP_204_NO_CONTENT)


class CVTemplatePublicAPI(APIView):
    permission_classes = [AllowAny]

    def get(self, request):
        templates = CVTemplate.objects.filter(is_active=True)
        return Response(CVTemplateSerializer(templates, many=True).data, status=status.HTTP_200_OK)


# ===================== STATUS & REPORT =====================
class SystemStatusAPI(APIView):
    permission_classes = [IsAdminUser]

    def get(self, request):
        data = {
            "total_users": User.objects.count(),
            "total_posts": Post.objects.count(),
            "total_cv_templates": CVTemplate.objects.count(),
            "total_cv_uploaded": CVAnalysis.objects.count(),
            "server_time": now(),
        }
        return Response(data, status=status.HTTP_200_OK)


class ReportSummaryAPI(APIView):
    permission_classes = [IsAdminUser]

    def get(self, request):
        today = now().date()
        data = {
            "new_users_today": User.objects.filter(date_joined__date=today).count(),
            "cv_uploaded_today": CVAnalysis.objects.filter(created_at__date=today).count(),
            "posts_published_today": Post.objects.filter(created_at__date=today).count(),
        }
        return Response(data, status=status.HTTP_200_OK)
