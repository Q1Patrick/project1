from rest_framework import serializers
from .models import Job

class JobSerializer(serializers.ModelSerializer):
    class Meta:
        model = Job
        fields = '__all__'
        # Recruiter sẽ được tự động gán là người đang đăng nhập, không cần gửi lên
        read_only_fields = ['recruiter', 'created_at']