import { useState } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';
export default function Signup() {
    const navigate = useNavigate();
    // 1. State lưu dữ liệu form
    const [formData, setFormData] = useState({
        email: '',
        password: '',
        confirm_password: '',
        first_name: '',
        last_name: '',
        phone_number: '',
        role: 'candidate'
    });

    const [error, setError] = useState('');

    // 2. Hàm xử lý nhập liệu
    const handleChange = (e) => {
        setFormData({
            ...formData,
            [e.target.name]: e.target.value
        });
    };

    // 3. Hàm xử lý Submit form
    const handleSubmit = async (e) => {
        e.preventDefault();
        setError('');

        // Kiểm tra pass
        if (formData.password !== formData.confirm_password) {
            setError("Mật khẩu xác nhận không khớp!");
            return;
        }
        console.log("Dữ liệu chuẩn bị gửi đi:", formData);
        try {
            // BƯỚC 1: CHỈ GỌI API ĐĂNG KÝ
            await axios.post('http://127.0.0.1:8000/users/api/signup/', {
                email: formData.email,
                password: formData.password,
                first_name: formData.first_name,
                last_name: formData.last_name,
                phone_number: formData.phone_number,
                role: formData.role
                // Không cần gửi username vì Backend đã tự xử lý rồi
            });

            // BƯỚC 2: THÔNG BÁO VÀ CHUYỂN TRANG
            // Không cố đăng nhập tự động nữa để tránh lỗi phát sinh
            alert("Đăng ký tài khoản thành công! Vui lòng đăng nhập.");
            navigate('/login'); // Chuyển ngay sang trang đăng nhập

        } catch (err) {
            console.error(err);
            // Xử lý hiển thị lỗi
            if (err.response && err.response.data) {
                // Nếu Backend trả về object lỗi (ví dụ {error: "Email trùng"})
                const errorData = err.response.data;
                // Lấy ra thông báo lỗi đầu tiên tìm thấy
                const errorMessage = errorData.error || errorData.detail || JSON.stringify(errorData);
                setError(errorMessage);
            } else {
                setError("Có lỗi xảy ra, vui lòng thử lại.");
            }
        }
    };

    return (
        <div className="font-sans text-gray-800 bg-white min-h-screen flex flex-col">
            
            {/* ================= HEADER ================= */}
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
                    <a href="/" className="hover:text-[#C04B59] transition">Home</a>
                    <a href="#" className="hover:text-[#C04B59] transition">Upload CV</a>
                    <a href="#" className="hover:text-[#C04B59] transition">Career Roadmap</a>
                    <a href="#" className="hover:text-[#C04B59] transition">Get a Quiz</a>
                    <a href="#" className="text-yellow-500"><i className="fa-solid fa-crown mr-1"></i>Premium</a>
                    <div className="flex items-center space-x-4 border-l pl-8">
                         <a href="#" className="bg-[#9E7F84] text-white px-5 py-2 rounded-sm hover:bg-opacity-90 transition">REGISTER</a>
                         <a href="#" className="hover:text-[#C04B59] transition">SIGN UP</a>
                    </div>
                </nav>
            </header>

            {/* ================= BLUE WELCOME BANNER ================= */}
            <div className="bg-[#3D4A7E] py-16 text-center text-white pb-24">
                <h1 className="text-5xl font-bold tracking-widest uppercase italic">WELCOME!</h1>
            </div>

            {/* ================= MAIN FORM (Overlapping) ================= */}
            <main className="max-w-4xl w-full mx-auto -mt-16 bg-white p-10 shadow-2xl rounded-lg mb-20 relative z-10 border-t-4 border-[#C04B59]">
                <h2 className="text-3xl font-light text-center mb-10 tracking-[0.2em] uppercase text-[#3D4A7E]">Create Your Account</h2>

                {/* Social Login Buttons */}
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

                {/* Divider */}
                <div className="relative flex py-5 items-center mb-10">
                    <div className="flex-grow border-t border-gray-200"></div>
                    <span className="flex-shrink mx-4 text-gray-400 text-xs uppercase tracking-widest">Or sign up with your email</span>
                    <div className="flex-grow border-t border-gray-200"></div>
                </div>

                {/* HIỂN THỊ LỖI NẾU CÓ */}
                {error && (
                    <div className="mb-6 bg-red-50 border border-red-200 text-red-600 px-4 py-3 rounded text-sm text-center">
                        <i className="fa-solid fa-triangle-exclamation mr-2"></i> {error}
                    </div>
                )}

                {/* Form Inputs */}
                <form onSubmit={handleSubmit} className="grid grid-cols-1 md:grid-cols-2 gap-x-12 gap-y-8">
                    
                    <div className="relative">
                        <label className="block text-sm font-bold text-gray-700 mb-2"><i className="fa-solid fa-user mr-2 text-gray-400 text-xs"></i>First Name</label>
                        <input type="text" name="first_name" required onChange={handleChange} 
                            className="w-full p-2 bg-gray-50 border-b-2 border-gray-200 focus:outline-none focus:border-[#C04B59] transition" />
                        <span className="absolute top-0 right-0 text-[#C04B59] font-bold text-lg">*</span>
                    </div>

                    <div className="relative">
                        <label className="block text-sm font-bold text-gray-700 mb-2">Last Name</label>
                        <input type="text" name="last_name" required onChange={handleChange}
                            className="w-full p-2 bg-gray-50 border-b-2 border-gray-200 focus:outline-none focus:border-[#C04B59] transition" />
                        <span className="absolute top-0 right-0 text-[#C04B59] font-bold text-lg">*</span>
                    </div>

                    <div className="relative">
                        <label className="block text-sm font-bold text-gray-700 mb-2"><i className="fa-regular fa-envelope mr-2 text-gray-400 text-xs"></i>Your Email</label>
                        <input type="email" name="email" placeholder="abc@gmail.com" required onChange={handleChange}
                            className="w-full p-2 bg-gray-50 border-b-2 border-gray-200 focus:outline-none focus:border-[#C04B59] transition" />
                        <span className="absolute top-0 right-0 text-[#C04B59] font-bold text-lg">*</span>
                    </div>
                    
                    <div className="relative">
                        <label className="block text-sm font-bold text-gray-700 mb-2">Your Phone</label>
                        <input type="tel" name="phone_number" onChange={handleChange}
                            className="w-full p-2 bg-gray-50 border-b-2 border-gray-200 focus:outline-none focus:border-[#C04B59] transition" />
                    </div>

                    <div className="relative">
                        <label className="block text-sm font-bold text-gray-700 mb-2"><i className="fa-solid fa-lock mr-2 text-gray-400 text-xs"></i>Password</label>
                        <input type="password" name="password" required onChange={handleChange}
                            className="w-full p-2 bg-gray-50 border-b-2 border-gray-200 focus:outline-none focus:border-[#C04B59] transition" />
                        <span className="absolute top-0 right-0 text-[#C04B59] font-bold text-lg">*</span>
                        <ul className="text-[10px] text-blue-400 mt-2 space-y-1 italic">
                            <li>✓ Password Strength: Weak</li>
                            <li>✓ Cannot contain your name or email address</li>
                        </ul>
<div className="md:col-span-2 mb-4">
                        <label className="block text-sm font-bold text-gray-700 mb-2">I am a:</label>
                        <div className="flex space-x-6">
                            <label className="flex items-center cursor-pointer">
                                <input 
                                    type="radio" 
                                    name="role" 
                                    value="candidate"
                                    checked={formData.role === 'candidate'}
                                    onChange={handleChange}
                                    className="mr-2 accent-[#C04B59]"
                                />
                                <span className="font-medium">Candidate (Job Seeker)</span>
                            </label>
                            <label className="flex items-center cursor-pointer">
                                <input 
                                    type="radio" 
                                    name="role" 
                                    value="recruiter"
                                    checked={formData.role === 'recruiter'}
                                    onChange={handleChange}
                                    className="mr-2 accent-[#C04B59]"
                                />
                                <span className="font-medium">Recruiter (Employer)</span>
                            </label>
                        </div>
                    </div>

                    </div>

                    <div className="relative">
                        <label className="block text-sm font-bold text-gray-700 mb-2"><i className="fa-solid fa-lock mr-2 text-gray-400 text-xs"></i>Confirm Password</label>
                        <input type="password" name="confirm_password" required onChange={handleChange}
                            className="w-full p-2 bg-gray-50 border-b-2 border-gray-200 focus:outline-none focus:border-[#C04B59] transition" />
                        <span className="absolute top-0 right-0 text-[#C04B59] font-bold text-lg">*</span>
                        
                        <div className="mt-4 text-right">
                             <span className="text-xs text-[#C04B59] font-bold">* : You need to fill</span>
                        </div>
                        
                    </div>

                    <div className="md:col-span-2 mt-2 space-y-3">
                        <label className="flex items-start text-[11px] text-blue-900 cursor-pointer font-bold">
                            <input type="checkbox" className="mt-0.5 mr-2 accent-[#C04B59]" required />
                            <span>I agree to <a href="#" className="underline">Terms of Service</a> and <a href="#" className="underline">Privacy policy</a></span>
                        </label>
                        <label className="flex items-start text-[11px] text-blue-900 cursor-pointer font-bold">
                            <input type="checkbox" className="mt-0.5 mr-2 accent-[#C04B59]" />
                            <span>Email me tailored resume advice & updates from MYS</span>
                        </label>
                    </div>
                    
                    <div className="md:col-span-2 text-center mt-8">
                        <button type="submit" className="bg-[#C04B59] text-white px-16 py-3 rounded shadow-md font-bold uppercase tracking-widest hover:bg-opacity-90 transition transform hover:scale-105">
                            CREATE AN ACCOUNT
                        </button>
                    
                        <p className="mt-6 text-sm text-gray-600">
                            Already have an account? <a href="/login" className="text-[#3D4A7E] font-bold italic tracking-wide hover:underline">SIGN IN</a>
                        </p>
                    </div>
                </form>
            </main>

            {/* ================= FOOTER ================= */}
            <footer className="bg-white border-t py-16 px-6 md:px-10 text-[13px] text-gray-600 mt-auto">
                <div className="max-w-7xl mx-auto grid grid-cols-2 md:grid-cols-5 gap-8 mb-16 tracking-wide leading-loose">
                    <div>
                        <h5 className="font-bold mb-6 uppercase text-gray-800">Get started</h5>
                        <ul className="space-y-3">
                            <li><a href="#" className="hover:text-[#C04B59] transition">Create account</a></li>
                            <li><a href="#" className="hover:text-[#C04B59] transition">Upload CV</a></li>
                            <li><a href="#" className="hover:text-[#C04B59] transition">Pricing</a></li>
                        </ul>
                    </div>
                    <div>
                        <h5 className="font-bold mb-6 uppercase text-gray-800">Career Tools</h5>
                        <ul className="space-y-3">
                            <li><a href="#" className="hover:text-[#C04B59] transition">CV Builder</a></li>
                            <li><a href="#" className="hover:text-[#C04B59] transition">AI Career Coach</a></li>
                        </ul>
                    </div>
                    <div>
                        <h5 className="font-bold mb-6 uppercase text-gray-800">Resources</h5>
                        <ul className="space-y-3">
                            <li><a href="#" className="hover:text-[#C04B59] transition">Career Guides</a></li>
                            <li><a href="#" className="hover:text-[#C04B59] transition">Blog</a></li>
                        </ul>
                    </div>
                    <div>
                        <h5 className="font-bold mb-6 uppercase text-gray-800">About</h5>
                        <ul className="space-y-3">
                            <li><a href="#" className="hover:text-[#C04B59] transition">About us</a></li>
                            <li><a href="#" className="hover:text-[#C04B59] transition">Contact us</a></li>
                        </ul>
                    </div>
                    <div>
                        <h5 className="font-bold mb-6 uppercase text-gray-800">Support</h5>
                        <ul className="space-y-3">
                            <li><a href="#" className="hover:text-[#C04B59] transition">Help Center</a></li>
                            <li><a href="#" className="hover:text-[#C04B59] transition">FAQs</a></li>
                        </ul>
                    </div>
                </div>

                <div className="max-w-7xl mx-auto border-t border-gray-200 pt-8 flex flex-col md:flex-row justify-between items-center text-xs text-gray-500">
                    <div className="flex space-x-4 mb-4 md:mb-0 order-2 md:order-1">
                        <a href="#" className="hover:text-[#3D4A7E] transition"><i className="fa-brands fa-facebook-f text-lg"></i></a>
                        <a href="#" className="hover:text-[#3D4A7E] transition"><i className="fa-brands fa-instagram text-lg"></i></a>
                        <a href="#" className="hover:text-[#3D4A7E] transition"><i className="fa-brands fa-x-twitter text-lg"></i></a>
                    </div>
                    <p className="order-1 md:order-2 mb-4 md:mb-0 font-medium">Built with care to help people grow their careers. © 2025 <i className="fa-solid fa-paper-plane text-[#3D4A7E] mx-1"></i> . All rights reserved.</p>
                </div>
            </footer>
        </div>
    );
}