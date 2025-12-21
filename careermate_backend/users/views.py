import PyPDF2
from rest_framework.views import APIView
from rest_framework.response import Response
from rest_framework import status
from django.contrib.auth.models import User
from django.views.decorators.csrf import csrf_exempt
from django.utils.decorators import method_decorator
from rest_framework.permissions import AllowAny, IsAuthenticated
from rest_framework_simplejwt.tokens import RefreshToken
from rest_framework.parsers import MultiPartParser, FormParser

from rest_framework.permissions import IsAuthenticated
from .models import CVAnalysis
from .serializers import CVAnalysisSerializer
from rest_framework.permissions import IsAdminUser
from .models import Post, CVTemplate
from .serializers import PostSerializer, CVTemplateSerializer



from .models import Profile, CVAnalysis
from .serializers import (
    UserSerializer,
    ProfileSerializer,
    CVAnalysisSerializer,
)

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

        User.objects.create_user(
            username=username,
            email=email,
            password=password
        )

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

        serializer = CVAnalysisSerializer(cv)
        return Response(serializer.data, status=201)

