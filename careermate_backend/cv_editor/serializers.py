from rest_framework import serializers
from .models import UserCV


class UserCVSerializer(serializers.ModelSerializer):
    """
    ✅ SERIALIZER CHO USERCV
    - Cho phép read/write tất cả fields quan trọng
    - Tự động xác định user từ request
    """
    
    class Meta:
        model = UserCV
        fields = [
            "id",
            "user",
            "name",
            "html_content",
            "css_content",
            "created_at",
            "updated_at",
        ]
        read_only_fields = ["id", "user", "created_at", "updated_at"]

    def create(self, validated_data):
        """Tự động thêm user vào khi tạo"""
        # Lấy request từ context (Django REST tự đưa vào)
        request = self.context.get('request')
        if request and hasattr(request, 'user'):
            validated_data['user'] = request.user
        return super().create(validated_data)
