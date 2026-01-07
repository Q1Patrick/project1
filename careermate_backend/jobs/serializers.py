from rest_framework import serializers
from .models import Job

class JobSerializer(serializers.ModelSerializer):
    # Xử lý trường tags: Chuyển từ chuỗi "A,B,C" thành mảng ["A", "B", "C"] để React dễ dùng
    tags = serializers.SerializerMethodField()

    class Meta:
        model = Job
        fields = '__all__'

    def get_tags(self, obj):
        if obj.tags:
            return [tag.strip() for tag in obj.tags.split(',')]
        return []