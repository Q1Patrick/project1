from django import forms
from django.contrib.auth import get_user_model

User = get_user_model()

class SignUpForm(forms.ModelForm):
    # Khai báo các trường password để Django xử lý ẩn ký tự
    password = forms.CharField(widget=forms.PasswordInput)
    confirm_password = forms.CharField(widget=forms.PasswordInput)

    class Meta:
        model = User
        # Các trường khớp với input name trong signup.html của bạn
        fields = ['first_name', 'last_name', 'email', 'phone_number'] 

    def clean(self):
        cleaned_data = super().clean()
        password = cleaned_data.get("password")
        confirm_password = cleaned_data.get("confirm_password")

        if password != confirm_password:
            raise forms.ValidationError("Mật khẩu xác nhận không khớp!")
        return cleaned_data
    
class UserUpdateForm(forms.ModelForm):
    class Meta:
        model = User
        # Chỉ cho phép sửa những trường này
        fields = ['first_name', 'last_name', 'phone_number'] 
        