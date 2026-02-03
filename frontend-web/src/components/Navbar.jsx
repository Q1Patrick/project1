import { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';

export default function Navbar() {
    const [user, setUser] = useState(null);
    const [isMenuOpen, setIsMenuOpen] = useState(false);
    const navigate = useNavigate();

    useEffect(() => {
        const storedUser = localStorage.getItem('userInfo');
        if (storedUser) {
            setUser(JSON.parse(storedUser));
        }
    }, []);

    const handleLogout = () => {
        localStorage.clear();
        navigate('/login');
        window.location.reload(); 
    };

    const handleRecruiterAccess = (e) => {
        if (user && user.role === 'candidate') {
            e.preventDefault();
            setIsMenuOpen(false);
            const confirmSwitch = window.confirm(
                "⚠️ KHU VỰC DÀNH CHO NHÀ TUYỂN DỤNG\n\nBạn có muốn ĐĂNG XUẤT để chuyển sang tài khoản Nhà tuyển dụng không?"
            );
            if (confirmSwitch) handleLogout();
        }
    };

    // Kiểm tra xem có phải Admin không (dựa vào role hoặc cờ is_superuser)
    const isAdmin = user && (user.role === 'admin' || user.is_superuser);

    return (
        <header className="bg-white border-b h-16 px-4 md:px-10 flex justify-between items-center sticky top-0 z-50 shadow-sm">
            {/* Logo */}
            <div className="flex items-center space-x-2 cursor-pointer" onClick={() => navigate('/')}>
                <span className="text-2xl font-bold text-[#3D4A7E] italic flex items-center">
                    <i className="fa-solid fa-cloud text-xl mr-2"></i> MYS
                </span>
            </div>

            {/* MAIN MENU (Giữa trang) */}
            <nav className="hidden md:flex space-x-6 text-sm font-bold text-gray-600 uppercase items-center">
                {/* Nếu là Admin thì ẩn bớt các menu tìm việc, chỉ hiện cái cần thiết hoặc ẩn hết */}
                {!isAdmin && (
                    <>
                        <Link to="/jobs" className="hover:text-[#C04B59] transition">Find Jobs</Link>
                        <Link to="/cv-templates" className="text-[#C04B59] flex items-center hover:bg-red-50 px-3 py-1 rounded transition">
                            <i className="fa-solid fa-pen-nib mr-2"></i> CV Builder
                        </Link>
                        <Link to="/cv-analyzer" className="hover:text-[#C04B59] flex items-center transition">
                            <i className="fa-solid fa-magnifying-glass-chart mr-2"></i> AI Analyzer
                        </Link>
                        <Link to="/career-roadmap" className="hover:text-[#C04B59] flex items-center transition">
                            <i className="fa-solid fa-robot mr-2"></i> AI Coach
                        </Link>
                        <Link to="/pricing" className="text-yellow-600 hover:text-yellow-700 flex items-center transition"> 
                            <i className="fa-solid fa-crown mr-2"></i> Premium 
                        </Link>
                        <Link to="/career-quiz" className="hover:text-[#C04B59] flex items-center transition">
                            <i className="fa-solid fa-crown mr-2"></i> Career Quiz 
                        </Link>
                    </>
                )}
                {/* Nếu là Admin thì có thể hiện menu riêng ở đây (nếu muốn), hoặc để trống */}
            </nav>

            {/* USER MENU (Góc phải) */}
            <div className="flex items-center space-x-4">
                {user ? (
                    <div className="relative">
                        <button onClick={() => setIsMenuOpen(!isMenuOpen)} className="w-9 h-9 rounded-full bg-gray-200 border hover:border-[#C04B59] overflow-hidden transition">
                            <img src={user.avatar || `https://ui-avatars.com/api/?name=${user.last_name}+${user.first_name}&background=3D4A7E&color=fff`} alt="User" />
                        </button>
                        
                        {/* Dropdown Menu */}
                        {isMenuOpen && (
                            <div className="absolute right-0 mt-2 w-64 bg-white rounded-lg shadow-xl py-2 z-50 border ring-1 ring-black ring-opacity-5 animate-fade-in-down">
                                
                                <div className="px-4 py-3 border-b bg-gray-50">
                                    <p className="font-bold text-[#3D4A7E] truncate">{user.last_name} {user.first_name}</p>
                                    <p className="text-xs text-gray-500">{user.email}</p>
                                    <span className={`text-[10px] font-bold px-2 py-0.5 rounded-full mt-1 inline-block uppercase text-white 
                                        ${isAdmin ? 'bg-red-600' : (user.role === 'recruiter' ? 'bg-[#C04B59]' : 'bg-blue-500')}`}>
                                        {isAdmin ? 'Administrator' : user.role}
                                    </span>
                                </div>
                                
                                {/* 👇 PHÂN QUYỀN MENU DROPDOWN */}
                                {isAdmin ? (
                                    // --- MENU CỦA ADMIN ---
                                    <Link 
                                        to="/admin" 
                                        className="block px-4 py-3 text-sm text-gray-800 hover:bg-gray-100 font-bold"
                                        onClick={() => setIsMenuOpen(false)}
                                    >
                                        <i className="fa-solid fa-user-shield mr-2 text-red-600"></i> System Administration
                                    </Link>
                                ) : (
                                    // --- MENU CỦA USER THƯỜNG (Candidate / Recruiter) ---
                                    <>
                                        <Link 
                                            to={user.role === 'recruiter' ? "/recruiter" : "/dashboard"} 
                                            className="block px-4 py-2 text-sm text-gray-700 hover:bg-gray-100"
                                            onClick={() => setIsMenuOpen(false)}
                                        >
                                            <i className="fa-solid fa-gauge-high mr-2"></i> 
                                            {user.role === 'recruiter' ? "Recruiter Dashboard" : "My Dashboard"}
                                        </Link>

                                        {user.role !== 'recruiter' && (
                                            <Link 
                                                to="/cv-templates" 
                                                className="block px-4 py-2 text-sm text-gray-700 hover:bg-gray-100"
                                                onClick={() => setIsMenuOpen(false)}
                                            >
                                                <i className="fa-regular fa-file-lines mr-2"></i> My CVs
                                            </Link>
                                        )}

                                        {user.role !== 'recruiter' && (
                                            <Link 
                                                to="/recruiter" 
                                                className="block px-4 py-2 text-sm text-gray-700 hover:bg-gray-100 border-t"
                                                onClick={handleRecruiterAccess}
                                            >
                                                <i className="fa-solid fa-briefcase mr-2"></i> For Employers
                                            </Link>
                                        )}
                                    </>
                                )}
                                
                                <button onClick={handleLogout} className="w-full text-left px-4 py-2 text-sm text-red-600 hover:bg-red-50 font-bold border-t mt-1">
                                    <i className="fa-solid fa-arrow-right-from-bracket mr-2"></i> Sign Out
                                </button>
                            </div>
                        )}
                        
                        {isMenuOpen && <div className="fixed inset-0 z-40" onClick={() => setIsMenuOpen(false)}></div>}
                    </div>
                ) : (
                    <div className="space-x-2">
                        <Link to="/login" className="text-[#3D4A7E] font-bold text-sm hover:underline">Login</Link>
                        <Link to="/signup" className="bg-[#C04B59] text-white px-4 py-2 rounded font-bold text-sm hover:bg-[#a03542] shadow-md transition">Sign Up</Link>
                    </div>
                )}
            </div>
        </header>
    );
}