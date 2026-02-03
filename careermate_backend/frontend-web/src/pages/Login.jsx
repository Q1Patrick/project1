import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import axios from 'axios';

export default function Login() {
    const [formData, setFormData] = useState({ username: '', password: '' });
    const [error, setError] = useState('');
    const navigate = useNavigate();

    const handleChange = (e) => {
        setFormData({ ...formData, [e.target.name]: e.target.value });
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        setError('');

        try {
            // 1. Gọi API Login
            const response = await axios.post('http://127.0.0.1:8000/users/api/login/', {
                username: formData.username, // Input name="username" chứa email
                password: formData.password
            });

            // 2. Nếu thành công -> Lưu Token và Info vào LocalStorage (Bộ nhớ trình duyệt)
            const { token, user } = response.data;
            
            localStorage.setItem('accessToken', token);       // Lưu chìa khóa
            localStorage.setItem('userInfo', JSON.stringify(user)); // Lưu thông tin cơ bản

            alert("Xin chào, " + user.last_name + " " + user.first_name);

            console.log("Check User Info:", user); 
            console.log("Check User Role:", user.role);
            // 3. Chuyển hướng vào Dashboard
            if (user.role === 'recruiter') {
                navigate('/recruiter'); // Nhà tuyển dụng -> Vào Dashboard tuyển dụng
            } else if (user.role === 'admin' || user.is_superuser) {
                navigate('/admin');     // Admin -> Vào trang quản trị
            } else {
                navigate('/'); // Còn lại (Candidate) -> Vào trang tìm việc
            }

        } catch (err) {
            console.error(err);
            if (err.response && err.response.data) {
                const errorData = err.response.data;
                setError(errorData.detail || errorData.error || "Tên đăng nhập hoặc mật khẩu không đúng!");
            } else {
                setError("Không thể kết nối đến server");
            }
        }
    };

    return (
        <div className="bg-white font-sans text-gray-800 flex flex-col min-h-screen">
             {/* Header Login (Giống Signup) */}
            <header className="bg-white border-b py-4 px-6 md:px-10 flex justify-between items-center sticky top-0 z-50">
                <div className="flex items-center space-x-2">
                    <div className="flex flex-col">
                        <span className="text-3xl font-bold text-[#3D4A7E] italic leading-none flex items-center">
                            <i className="fa-solid fa-cloud text-xl mr-1"></i> MYS
                        </span>
                        <span className="text-[10px] text-gray-500 block uppercase leading-tight tracking-widest">make your selection</span>
                    </div>
                </div>
                <nav className="hidden md:flex space-x-8 text-[13px] font-bold text-gray-600 uppercase items-center tracking-wide">
                    <Link to="/" className="hover:text-[#C04B59] transition">Home</Link>
                    <div className="flex items-center space-x-4 border-l pl-8">
                         <Link to="/signup" className="hover:text-[#C04B59] transition">Register</Link>
                         <Link to="/signup" className="bg-[#9E7F84] text-white px-5 py-2 rounded-sm hover:bg-opacity-90 transition">SIGN UP</Link>
                    </div>
                </nav>
            </header>

            <main className="flex-grow flex items-center justify-center py-16 px-4">
                <div className="max-w-xl w-full">
                    <h1 className="text-4xl text-center mb-12 uppercase tracking-[0.2em] text-[#3D4A7E] font-medium">SIGN IN</h1>

                    {/* Social Buttons */}
                    <div className="flex justify-center space-x-6 mb-10">
                        <button className="border border-gray-200 p-3 rounded w-24 flex justify-center hover:bg-gray-50 shadow-sm transition">
                            <img src="https://www.svgrepo.com/show/475656/google-color.svg" className="h-6" alt="Google" />
                        </button>
                        <button className="border border-gray-200 p-3 rounded w-24 flex justify-center hover:bg-gray-50 shadow-sm transition">
                            <img src="https://www.svgrepo.com/show/475637/apple-black.svg" className="h-6" alt="Apple" />
                        </button>
                        <button className="border border-gray-200 p-3 rounded w-24 flex justify-center hover:bg-gray-50 shadow-sm transition">
                            <img src="https://www.svgrepo.com/show/475664/microsoft.svg" className="h-6" alt="Microsoft" />
                        </button>
                    </div>

                    <div className="relative flex py-5 items-center mb-10">
                        <div className="flex-grow border-t border-gray-200"></div>
                        <span className="flex-shrink mx-4 text-gray-400 text-xs uppercase tracking-widest">Or sign in with your email</span>
                        <div className="flex-grow border-t border-gray-200"></div>
                    </div>

                    <form onSubmit={handleSubmit} className="space-y-8">
                        {error && <div className="text-red-500 text-center text-sm">{error}</div>}
                        
                        <div>
                            <label className="block text-sm font-bold text-gray-700 mb-3">
                                <i className="fa-regular fa-envelope mr-2 text-gray-500"></i>Your Email
                            </label>
                            <input type="text" name="username" onChange={handleChange}
                                className="w-full p-3 bg-gray-50 border-b-2 border-gray-200 focus:outline-none focus:border-[#C04B59] transition text-gray-600" 
                                placeholder="abc@gmail.com" required />
                        </div>

                        <div>
                            <label className="block text-sm font-bold text-gray-700 mb-3">
                                <i className="fa-solid fa-lock mr-2 text-gray-500"></i>Password
                            </label>
                            <input type="password" name="password" onChange={handleChange}
                                className="w-full p-3 bg-gray-50 border-b-2 border-gray-200 focus:outline-none focus:border-[#C04B59] transition" 
                                required />
                        </div>

                        <div className="flex justify-between items-center text-xs text-gray-600 mt-4">
                            <label className="flex items-center cursor-pointer font-bold">
                                <input type="checkbox" className="mr-2 accent-[#C04B59]" />
                                Remember Me
                            </label>
                            <a href="#" className="text-[#C04B59] font-bold hover:underline">Forgot Password?</a>
                        </div>

                        <div className="text-center mt-12">
                            <button type="submit" className="bg-[#C04B59] text-white px-16 py-3 rounded-sm shadow-md font-bold uppercase tracking-widest hover:bg-opacity-90 transition text-sm">
                                SIGN IN
                            </button>
                        </div>
                    </form>
                </div>
            </main>
        </div>
    );
}