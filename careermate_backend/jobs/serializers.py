from rest_framework import serializers
from .models import Job, Application
from users.serializers import UserSerializer
class JobSerializer(serializers.ModelSerializer):
    # Lấy tên công ty từ bảng Company (nếu bạn dùng khóa ngoại)
    # Nếu trong bảng Job đã có cột company_name thì không cần dòng này
    company_name = serializers.CharField(source='company.name', read_only=True)
    
    # Lấy logo công ty (để hiển thị cho đẹp)
    company_logo = serializers.ImageField(source='company.logo', read_only=True)
    posted_date = serializers.SerializerMethodField()
    class Meta:
        model = Job
        
        fields = [
            'id', 'title','description','requirements','benefits','company_name', 'company_logo', 
            'location', 'job_type', 'salary_range', # <-- QUAN TRỌNG: Phải có salary
            'created_at', 'posted_date', 'deadline', 'tags'
        ]
    def get_posted_date(self, obj):
        return obj.created_at.strftime("%d/%m/%Y")

class ApplicationSerializer(serializers.ModelSerializer):
    class Meta:
        model = Application
        fields = ['id', 'job', 'cv_file', 'cover_letter', 'status', 'created_at']
        read_only_fields = ['status', 'created_at']

class ApplicationDetailSerializer(serializers.ModelSerializer):
    # Lấy full thông tin của Candidate (Tên, Email, Avatar...)
    candidate = UserSerializer(read_only=True) 

    class Meta:
        model = Application
        fields = ['id', 'candidate', 'cv_file', 'cover_letter', 'status', 'created_at']