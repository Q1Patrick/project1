import { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';

export default function Navbar() {
    const navigate = useNavigate();
    const [user, setUser] = useState(null);
    const [isMenuOpen, setIsMenuOpen] = useState(false);

    // Lấy thông tin user khi vào trang
    useEffect(() => {
        const storedUser = localStorage.getItem('userInfo');
        if (storedUser) {
            setUser(JSON.parse(storedUser));
        }
    }, []);

    const handleLogout = () => {
        localStorage.removeItem('accessToken');
        localStorage.removeItem('userInfo');
        setUser(null);
        navigate('/login');
    };

    return (
        <header className="bg-white border-b h-16 px-4 md:px-10 flex justify-between items-center sticky top-0 z-50 shadow-sm font-sans">
            {/* Logo */}
            <div className="flex items-center space-x-2 cursor-pointer" onClick={() => navigate('/')}>
                <span className="text-2xl font-bold text-[#3D4A7E] italic flex items-center">
                    <i className="fa-solid fa-cloud text-xl mr-2"></i> MYS
                </span>
            </div>

            {/* Menu giữa */}
            <nav className="hidden md:flex space-x-6 text-sm font-bold text-gray-600 uppercase">
                <Link to="/" className="hover:text-[#C04B59]">Find Jobs</Link>
                
                <Link to="/cv-analyzer" className="hover:text-[#C04B59] flex items-center">
                    <i className="fa-solid fa-wand-magic-sparkles mr-2 text-yellow-500"></i> AI Analyzer
                </Link>
                
                {/* Lưu ý: Đường dẫn này trỏ tới trang Chatbot chúng ta vừa làm */}
                <Link to="/career-roadmap" className="hover:text-[#C04B59] flex items-center">
                    <i className="fa-solid fa-robot mr-1 text-blue-500"></i> AI Coach
                </Link>
                
                <Link to="#" className="hover:text-[#C04B59]">Quizzes</Link>
                <Link to="#" className="hover:text-[#C04B59]">Challenges</Link>
            </nav>

            {/* Menu phải (User) */}
            <div className="flex items-center space-x-4">
                {/* Nút dành cho Nhà Tuyển Dụng */}
                <Link to="#" className="hidden md:block bg-gray-800 text-white text-xs px-3 py-2 rounded hover:bg-gray-700 transition font-bold">
                    FOR EMPLOYERS
                </Link>

                {user ? (
                    // Trạng thái ĐÃ ĐĂNG NHẬP
                    <div className="relative">
                        <button onClick={() => setIsMenuOpen(!isMenuOpen)} className="w-9 h-9 rounded-full bg-gray-200 border hover:border-[#C04B59] overflow-hidden transition focus:outline-none focus:ring-2 focus:ring-[#C04B59]">
                            {/* Nếu không có avatar thì tạo avatar chữ cái */}
                            <img 
                                src={user.avatar || `https://ui-avatars.com/api/?name=${user.last_name}+${user.first_name}&background=3D4A7E&color=fff`} 
                                alt="User" 
                                className="w-full h-full object-cover"
                            />
                        </button>
                        
                        {/* Dropdown Menu */}
                        {isMenuOpen && (
                            <>
                                <div className="absolute right-0 mt-2 w-56 bg-white rounded shadow-xl py-2 z-50 border border-gray-100 animate-fade-in-up">
                                    <div className="px-4 py-3 border-b bg-gray-50">
                                        <p className="font-bold text-[#3D4A7E] truncate">{user.last_name} {user.first_name}</p>
                                        <p className="text-xs text-gray-500 truncate">{user.email}</p>
                                    </div>
                                    <Link to="/dashboard" className="block px-4 py-2 text-sm text-gray-700 hover:bg-gray-100 hover:text-[#C04B59]">
                                        <i className="fa-regular fa-user mr-2"></i> My Profile
                                    </Link>
                                    <Link to="#" className="block px-4 py-2 text-sm text-gray-700 hover:bg-gray-100 hover:text-[#C04B59]">
                                        <i className="fa-solid fa-briefcase mr-2"></i> Applied Jobs
                                    </Link>
                                    <div className="border-t my-1"></div>
                                    <button onClick={handleLogout} className="w-full text-left px-4 py-2 text-sm text-red-600 hover:bg-red-50 font-bold">
                                        <i className="fa-solid fa-right-from-bracket mr-2"></i> Sign Out
                                    </button>
                                </div>
                                {/* Lớp phủ vô hình để click ra ngoài thì đóng menu */}
                                <div className="fixed inset-0 z-40" onClick={() => setIsMenuOpen(false)}></div>
                            </>
                        )}
                    </div>
                ) : (
                    // Trạng thái CHƯA ĐĂNG NHẬP
                    <div className="flex space-x-3 text-sm font-bold">
                        <Link to="/login" className="text-[#3D4A7E] hover:underline">Login</Link>
                        <span className="text-gray-300">|</span>
                        <Link to="/signup" className="text-[#C04B59] hover:underline">Sign Up</Link>
                    </div>
                )}
            </div>
        </header>
    );
}