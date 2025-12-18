import PyPDF2
from rest_framework.views import APIView
from rest_framework.response import Response
from rest_framework import status
from django.contrib.auth.models import User
from django.views.decorators.csrf import csrf_exempt
from django.utils.decorators import method_decorator
from rest_framework.permissions import AllowAny
from rest_framework_simplejwt.tokens import RefreshToken
from .serializers import UserSerializer
from rest_framework.parsers import MultiPartParser, FormParser
from rest_framework.permissions import IsAuthenticated
from .models import CVAnalysis
from .serializers import CVAnalysisSerializer

#User
class UserListAPI(APIView):
    def get(self, request):
        users = User.objects.all()
        serializer = UserSerializer(users, many=True)
        return Response(serializer.data, status=status.HTTP_200_OK)
## Register
@method_decorator(csrf_exempt, name='dispatch')
class RegisterAPI(APIView):
    def post(self, request):
        data = request.data
        username = data.get("username")
        email = data.get("email")
        password = data.get("password")

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

        return Response(
            {"message": "User registered successfully"},
            status=status.HTTP_201_CREATED
        )
## Login
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


class CVUploadAnalyzeAPI(APIView):
    permission_classes = [IsAuthenticated]

    def post(self, request):
        if 'cv_file' not in request.FILES:
            return Response(
                {"error": "cv_file is required"},
                status=status.HTTP_400_BAD_REQUEST
            )

        cv_file = request.FILES['cv_file']

        # đọc PDF
        reader = PyPDF2.PdfReader(cv_file)
        text = ""
        for page in reader.pages:
            text += page.extract_text() or ""

        # demo phân tích
        analysis_result = {
            "skills": ["Python", "Django"],
            "summary": "Demo CV analysis"
        }

        
        user = request.user

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

