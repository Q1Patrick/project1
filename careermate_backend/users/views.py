from rest_framework.views import APIView
from rest_framework.response import Response
from rest_framework import status
from django.contrib.auth.models import User
from django.views.decorators.csrf import csrf_exempt
from django.utils.decorators import method_decorator
from rest_framework.permissions import AllowAny
from rest_framework_simplejwt.tokens import RefreshToken
from .serializers import UserSerializer
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

        user = User.objects.create_user(
            username=data['username'],
            email=data['email'],
            password=data['password']
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


