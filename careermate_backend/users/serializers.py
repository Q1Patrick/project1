from rest_framework import serializers
from django.contrib.auth import get_user_model
from .models import CVAnalysis
from .models import Post, CVTemplate

from .models import Profile, CVAnalysis
from .models import User
User = get_user_model()


class UserSerializer(serializers.ModelSerializer):
    class Meta:
        model = User
        fields = ['id', 'username', 'email', 'first_name', 'last_name', 'avatar', 'password', 'role']
        extra_kwargs = {
            'password': {'write_only': True},
            # --- DÒNG QUAN TRỌNG NHẤT: ---
            'username': {'required': False}, # Cho phép Frontend không cần gửi Username
            # -----------------------------
        }

    def create(self, validated_data):
        # 1. Lấy username từ dữ liệu gửi lên
        username = validated_data.get('username')
        email = validated_data.get('email')
        password = validated_data.get('password')
        # 2. Nếu không có username -> Lấy luôn email làm username
        if not username:
            username = email

        if not password:
            raise serializers.ValidationError({"password": "Mật khẩu không được để trống!"})

        # 3. Tạo User mới với thông tin đã chuẩn hóa
        user = User.objects.create_user(
            username=username,
            email=email,
            password=validated_data['password'],
            first_name=validated_data.get('first_name', ''),
            last_name=validated_data.get('last_name', ''),
            role=validated_data.get('role', 'candidate')
        )
        return user

class SignupSerializer(serializers.ModelSerializer):
    password = serializers.CharField(write_only=True)

    class Meta:
        model = User
        fields = ['email', 'password', 'first_name', 'last_name', 'phone_number', 'role']
    
    def create(self, validated_data):
        user = User.objects.create_user(
            username=validated_data['email'],
            email=validated_data['email'],
            password=validated_data['password'],
            first_name=validated_data.get('first_name', ''),
            last_name=validated_data.get('last_name', ''),
            phone_number=validated_data.get('phone_number', ''),
            role=validated_data.get('role', 'candidate')
        )
        return user


class ProfileSerializer(serializers.ModelSerializer):
    class Meta:
        model = Profile
        fields = '__all__'
        read_only_fields = ['user']


class CVAnalysisSerializer(serializers.ModelSerializer):
    class Meta:
        model = CVAnalysis
        fields = '__all__'

        read_only_fields = ['user', 'extracted_text', 'skills_found', 'score', 'created_at']

class PostSerializer(serializers.ModelSerializer):
    class Meta:
        model = Post
        fields = "__all__"


class CVTemplateSerializer(serializers.ModelSerializer):
    class Meta:
        model = CVTemplate
        fields = "__all__"

        read_only_fields = [
            'user',
            'extracted_text',
            'skills_found',
            'score',
            'created_at'
        ]

