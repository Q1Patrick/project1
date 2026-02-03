from rest_framework.views import APIView
from rest_framework.response import Response
from rest_framework import status
from rest_framework.permissions import IsAuthenticated, IsAdminUser, AllowAny
from rest_framework.parsers import MultiPartParser, FormParser
from django.conf import settings

from .models import UserCV
from .serializers import UserCVSerializer

from users.models import CVTemplate, User
from .rendering import merge_default_data, render_template_html


class UserCVListCreateAPI(APIView):
    """
    ✅ API TẠOV CV MỚI TỪĐƠN TEMPLATE
    - POST: Tạo UserCV mới từ template
    """
    permission_classes = [IsAuthenticated]
    # ✅ KHÔNG cần MultiPartParser vì chỉ gửi JSON, không upload file
    # parser_classes mặc định sẽ handle JSON

    def post(self, request):
        try:
            user = request.user
            data = request.data
            
            # 1. Lấy Template ID từ request
            template_id = data.get('template_id')
            
            if template_id:
                template = CVTemplate.objects.get(pk=template_id)
                # ✅ QUAN TRỌNG: Dùng hàm get_html_content() từ CVTemplate model
                initial_html = template.get_html_content() 
                cv_name = f"CV - {template.name}"
            else:
                initial_html = ""
                cv_name = "CV Mới"

            # 2. Tạo UserCV mới
            new_cv = UserCV.objects.create(
                user=user,
                name=data.get('name', cv_name),
                html_content=initial_html,
                css_content="" 
            )

            return Response({
                "id": new_cv.id, 
                "message": "Tạo CV thành công",
                "html_content": new_cv.html_content
            }, status=201)

        except CVTemplate.DoesNotExist:
            return Response({"error": "Mẫu CV không tồn tại"}, status=404)
        except Exception as e:
            print("❌ Lỗi tạo CV:", str(e))
            return Response({"error": "Lỗi server: " + str(e)}, status=500)
    
    def get(self, request):
        """Lấy danh sách CV của user"""
        try:
            cvs = UserCV.objects.filter(user=request.user)
            serializer = UserCVSerializer(cvs, many=True)
            return Response(serializer.data, status=200)
        except Exception as e:
            return Response({"error": str(e)}, status=400)


class UserCVDetailAPI(APIView):
    """
    ✅ API LẤY/CẬP NHẬT CHI TIẾT CV
    """
    permission_classes = [IsAuthenticated]

    def get_object(self, request, pk):
        return UserCV.objects.get(pk=pk, user=request.user)

    def get(self, request, pk):
        try:
            cv = self.get_object(request, pk)
        except UserCV.DoesNotExist:
            return Response({"error": "CV not found"}, status=404)
        return Response(UserCVSerializer(cv).data)

    def patch(self, request, pk):
        """
        ✅ CẬP NHẬT MỚI: data, tên CV, nội dung,...
        """
        try:
            cv = self.get_object(request, pk)
        except UserCV.DoesNotExist:
            return Response({"error": "CV not found"}, status=404)

        serializer = UserCVSerializer(cv, data=request.data, partial=True)
        if serializer.is_valid():
            serializer.save()
            return Response(serializer.data)
        return Response(serializer.errors, status=400)


class UserCVRenderAPI(APIView):
    """
    ✅ API RENDER CV SAU KHI CẬP NHẬT
    """
    permission_classes = [IsAuthenticated]

    def post(self, request, pk):
        try:
            cv = UserCV.objects.get(pk=pk, user=request.user)
        except UserCV.DoesNotExist:
            return Response({"error": "CV not found"}, status=404)

        try:
            # Render HTML từ template nội dung
            html = render_template_html(cv.html_content, {})
            
            cv.html_content = html
            cv.save()

            return Response({
                "message": "Render thành công",
                "html_content": html
            }, status=200)
        except Exception as e:
            return Response({"error": str(e)}, status=400)


class TemplateListAPI(APIView):
    permission_classes = [] # Cho phép xem danh sách thoải mái

    def get(self, request):
        # Lấy tất cả template đang active
        templates = CVTemplate.objects.filter(is_active=True)
        data = []
        
        for t in templates:
            # Xử lý URL ảnh thumbnail
            if t.thumbnail:
                img_url = request.build_absolute_uri(t.thumbnail.url)
            else:
                img_url = ""

            # 👇 QUAN TRỌNG: Gọi hàm get_html_content() để đọc nội dung từ File
            # (Hàm này mình đã hướng dẫn bạn thêm vào models.py ở bước trước)
            html_content = t.get_html_content() 

            # Nếu nội dung rỗng (do chưa có file hoặc file lỗi), dùng tạm nội dung mặc định
            if not html_content:
                html_content = "<div style='padding:20px; text-align:center'>⚠️ Mẫu này chưa có nội dung HTML. Vui lòng kiểm tra lại file upload.</div>"

            data.append({
                "id": t.id,
                "name": t.name,
                "thumbnail": img_url,
                "html_content": html_content # Gửi nội dung đã đọc được xuống Frontend
            })
            
        return Response(data)


class AdminTemplateAPI(APIView):
    """
    ✅ API ADMIN: Thêm/Sửa/Xóa template
    - Chỉ Admin mới dùng được
    - Hỗ trợ upload file HTML + thumbnail
    """
    permission_classes = [IsAuthenticated, IsAdminUser]
    parser_classes = (MultiPartParser, FormParser)

    def get(self, request):
        """Lấy danh sách tất cả template"""
        templates = CVTemplate.objects.all().values(
            'id', 'name', 'description', 'thumbnail', 'is_active', 'created_at'
        )
        return Response(list(templates))

    def post(self, request):
        """Tạo template mới"""
        try:
            data = request.data
            
            # Lấy HTML từ file hoặc từ text
            html_file = request.FILES.get('html_file')
            html_content = data.get('html_content', '')
            
            template = CVTemplate.objects.create(
                name=data.get('name'),
                description=data.get('description', ''),
                thumbnail=request.FILES.get('thumbnail'),
                html_file=html_file if html_file else None,
                html_content=html_content if not html_file else '',
                is_active=True
            )
            
            return Response({
                "message": "✅ Tạo template thành công!",
                "id": template.id,
                "name": template.name
            }, status=201)
        except Exception as e:
            return Response({"error": str(e)}, status=400)

    def put(self, request, pk):
        """Cập nhật template"""
        try:
            template = CVTemplate.objects.get(pk=pk)
            
            if 'name' in request.data:
                template.name = request.data.get('name')
            if 'description' in request.data:
                template.description = request.data.get('description')
            if 'html_content' in request.data:
                template.html_content = request.data.get('html_content')
            if 'html_file' in request.FILES:
                template.html_file = request.FILES.get('html_file')
            if 'thumbnail' in request.FILES:
                template.thumbnail = request.FILES.get('thumbnail')
            if 'is_active' in request.data:
                template.is_active = request.data.get('is_active')
            
            template.save()
            return Response({"message": "✅ Cập nhật thành công!", "id": template.id})
        except CVTemplate.DoesNotExist:
            return Response({"error": "Template không tìm thấy"}, status=404)
        except Exception as e:
            return Response({"error": str(e)}, status=400)

    def delete(self, request, pk):
        """Xóa template"""
        try:
            template = CVTemplate.objects.get(pk=pk)
            template.delete()
            return Response({"message": "✅ Đã xóa template"}, status=204)
        except CVTemplate.DoesNotExist:
            return Response({"error": "Template không tìm thấy"}, status=404)