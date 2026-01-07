// static/js/signup.js

document.addEventListener('DOMContentLoaded', function() {
    const signupForm = document.querySelector('form');
    
    if (signupForm) {
        signupForm.addEventListener('submit', async (e) => {
            e.preventDefault();

            const formData = new FormData(signupForm);
            const data = Object.fromEntries(formData.entries());

            // Chuẩn bị dữ liệu gửi lên RegisterAPI
            const payload = {
                username: data.email, // Dùng email làm username cho API
                email: data.email,
                password: data.password,
                first_name: data.first_name,
                last_name: data.last_name
            };

            try {
                // CSRF Token được lấy từ thẻ input ẩn trong form của Django
                const csrftoken = document.querySelector('[name=csrfmiddlewaretoken]').value;

                const response = await fetch('/api/users/signup/', {
                    method: 'POST',
                    headers: {
                        'Content-Type': 'application/json',
                        'X-CSRFToken': csrftoken
                    },
                    body: JSON.stringify(payload)
                });

                const result = await response.json();

                if (response.status === 201) {
                    // Đăng ký thành công -> Chuyển sang thành công
                    window.location.href = '/success/';
                } else {
                    alert("Lỗi đăng ký: " + (result.error || "Vui lòng kiểm tra lại thông tin"));
                }
            } catch (error) {
                console.error("Lỗi kết nối:", error);
                alert("Không thể kết nối đến server.");
            }
        });
    }
});