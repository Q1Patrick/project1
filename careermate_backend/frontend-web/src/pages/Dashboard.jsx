import { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import axios from 'axios';
export default function Dashboard() {
    const [user, setUser] = useState(null);
    const [activeTab, setActiveTab] = useState('suggested'); // 'suggested' | 'saved' | 'companies'
    const [isMenuOpen, setIsMenuOpen] = useState(false);

    // 2. KHAI BÁO STATE ĐỂ CHỨA DỮ LIỆU THẬT
    const [jobs, setJobs] = useState([]); // Khởi tạo là mảng rỗng
    const [isLoading, setIsLoading] = useState(true); // Trạng thái đang tải

    const navigate = useNavigate();

    // Dữ liệu Top Companies (Có thể giữ mock hoặc làm API tương tự Jobs nếu muốn)
    const topCompanies = [
        { name: "FPT Software", industry: "Technology", jobs: 120 },
        { name: "VinGroup", industry: "Real Estate", jobs: 50 },
        { name: "Shopee", industry: "E-commerce", jobs: 34 },
    ];

    // 3. GỌI API KHI TRANG VỪA LOAD
    useEffect(() => {
        const fetchData = async () => {
            // Lấy thông tin User từ LocalStorage (Code cũ)
            const storedUser = localStorage.getItem('userInfo');
            const token = localStorage.getItem('accessToken');
            
            if (!token || !storedUser) {
                navigate('/login');
                return;
            }
            setUser(JSON.parse(storedUser));

            // --- PHẦN MỚI: GỌI API LẤY JOB TỪ DJANGO ---
            try {
                // Thay IP 127.0.0.1 bằng IP máy bạn nếu test trên điện thoại
                const response = await axios.get('http://127.0.0.1:8000/jobs/api/list/');
                setJobs(response.data); // Lưu dữ liệu thật vào State
            } catch (error) {
                console.error("Lỗi không lấy được danh sách việc làm:", error);
            } finally {
                setIsLoading(false); // Tắt trạng thái loading dù thành công hay thất bại
            }
        };

        fetchData();
    }, [navigate]);

    const handleLogout = () => {
        localStorage.clear();
        navigate('/login');
    };

    if (!user) return <div className="min-h-screen flex items-center justify-center">Loading...</div>;

    return (
        <div className="bg-gray-50 min-h-screen font-sans text-gray-800">

            {/* ================= HEADER (Giữ nguyên style cũ nhưng gọn hơn) ================= */}
            <header className="bg-white border-b h-16 px-4 md:px-10 flex justify-between items-center sticky top-0 z-50 shadow-sm">
                <div className="flex items-center space-x-2 cursor-pointer" onClick={() => navigate('/')}>
                    <span className="text-2xl font-bold text-[#3D4A7E] italic flex items-center">
                        <i className="fa-solid fa-cloud text-xl mr-2"></i> MYS
                    </span>
                </div>

                <nav className="hidden md:flex space-x-6 text-sm font-bold text-gray-600 uppercase">
                    <Link to="/jobs" className="text-[#C04B59]">Find Jobs</Link>
                    <Link to="/cv-analyzer" className="text-[#C04B59] flex items-center">
                    <i className="fa-solid fa-wand-magic-sparkles mr-2"></i> AI Analyzer
    </Link>
                    <Link to="/cv-builder" className="hover:text-[#C04B59]">CV Builder</Link>
                    <Link to="/career-coach" className="hover:text-[#C04B59] flex items-center">
                        <i className="fa-solid fa-robot mr-1"></i> AI Coach
                    </Link>
                    <Link to="/quizzes" className="hover:text-[#C04B59]">Quizzes</Link>
                    <Link to="/challenges" className="hover:text-[#C04B59]">Challenges</Link>
                </nav>

                <div className="flex items-center space-x-4">
                    {/* Nút dành cho Nhà Tuyển Dụng */}
                    <Link to="#" className="hidden md:block bg-gray-800 text-white text-xs px-3 py-2 rounded hover:bg-gray-700 transition">
                        FOR EMPLOYERS
                    </Link>

                    <div className="relative">
                        <button onClick={() => setIsMenuOpen(!isMenuOpen)} className="w-9 h-9 rounded-full bg-gray-200 border hover:border-[#C04B59] overflow-hidden">
                            <img src={user.avatar || `https://ui-avatars.com/api/?name=${user.last_name}+${user.first_name}&background=3D4A7E&color=fff`} alt="User" />
                        </button>
                        {isMenuOpen && (
                            <div className="absolute right-0 mt-2 w-56 bg-white rounded shadow-xl py-2 z-50 border">
                                <div className="px-4 py-3 border-b bg-gray-50">
                                    <p className="font-bold text-[#3D4A7E] truncate">{user.last_name} {user.first_name}</p>
                                    <p className="text-xs text-gray-500">{user.email}</p>
                                </div>
                                <Link to="#" className="block px-4 py-2 text-sm hover:bg-gray-100">My Profile</Link>
                                <Link to="#" className="block px-4 py-2 text-sm hover:bg-gray-100">Applied Jobs</Link>
                                <button onClick={handleLogout} className="w-full text-left px-4 py-2 text-sm text-red-600 hover:bg-red-50 font-bold">Sign Out</button>
                            </div>
                        )}
                        {isMenuOpen && <div className="fixed inset-0 z-40" onClick={() => setIsMenuOpen(false)}></div>}
                    </div>
                </div>
            </header>

            {/* ================= SEARCH BAR SECTION (Màu Gradient đẹp) ================= */}
            <div className="bg-gradient-to-r from-[#3D4A7E] to-[#2b355e] py-10 px-4">
                <div className="max-w-6xl mx-auto">
                    <h1 className="text-white text-2xl md:text-3xl font-bold mb-6 text-center">
                        Find your dream job among <span className="text-[#C04B59]">10,000+</span> vacancies
                    </h1>
                    
                    <div className="bg-white p-2 rounded-lg shadow-lg flex flex-col md:flex-row gap-2">
                        <div className="flex-1 flex items-center px-4 border-b md:border-b-0 md:border-r border-gray-200 py-2 md:py-0">
                            <i className="fa-solid fa-magnifying-glass text-gray-400 mr-3"></i>
                            <input type="text" placeholder="Job title, keywords, or company..." className="w-full outline-none text-gray-700 placeholder-gray-400" />
                        </div>
                        <div className="md:w-1/4 flex items-center px-4 border-b md:border-b-0 md:border-r border-gray-200 py-2 md:py-0">
                            <i className="fa-solid fa-location-dot text-gray-400 mr-3"></i>
                            <select className="w-full outline-none text-gray-700 bg-transparent cursor-pointer">
                                <option>All Locations</option>
                                <option>Ho Chi Minh</option>
                                <option>Ha Noi</option>
                                <option>Da Nang</option>
                            </select>
                        </div>
                        <button className="bg-[#C04B59] text-white px-8 py-3 rounded font-bold hover:bg-rose-700 transition uppercase tracking-wide">
                            Search
                        </button>
                    </div>
                    
                    {/* Hot Keywords */}
                    <div className="mt-4 text-white text-xs md:text-sm flex flex-wrap gap-2 justify-center opacity-80">
                        <span>Trending:</span>
                        <a href="#" className="underline hover:text-[#C04B59]">Java</a>
                        <a href="#" className="underline hover:text-[#C04B59]">ReactJS</a>
                        <a href="#" className="underline hover:text-[#C04B59]">Business Analyst</a>
                        <a href="#" className="underline hover:text-[#C04B59]">Tester</a>
                    </div>
                </div>
            </div>

            {/* ================= MAIN LAYOUT (2 Columns) ================= */}
            <div className="max-w-6xl mx-auto py-8 px-4 grid grid-cols-1 md:grid-cols-12 gap-6">

                {/* LEFT COLUMN (User Stats & Sidebar) - 3/12 */}
                <div className="md:col-span-3 space-y-6">
                    {/* Profile Card */}
                    <div className="bg-white rounded-lg shadow p-6 text-center">
                        <div className="w-20 h-20 rounded-full bg-gray-100 mx-auto mb-3 overflow-hidden">
                            <img src={`https://ui-avatars.com/api/?name=${user.last_name}&background=random`} alt="Avt" />
                        </div>
                        <h3 className="font-bold text-lg text-[#3D4A7E]">{user.last_name} {user.first_name}</h3>
                        <p className="text-xs text-gray-500 mb-4">Web Developer</p>
                        
                        <div className="text-left text-sm space-y-2 border-t pt-4">
                            <div className="flex justify-between">
                                <span className="text-gray-600">Profile Strength</span>
                                <span className="text-green-600 font-bold">Good</span>
                            </div>
                            <div className="w-full bg-gray-200 rounded-full h-1.5 dark:bg-gray-200">
                                <div className="bg-green-600 h-1.5 rounded-full" style={{width: "70%"}}></div>
                            </div>
                            <div className="flex justify-between pt-2">
                                <span className="text-gray-600">Profile Views</span>
                                <span className="font-bold">12</span>
                            </div>
                            <div className="flex justify-between">
                                <span className="text-gray-600">Applied Jobs</span>
                                <span className="font-bold">5</span>
                            </div>
                        </div>
                        
                        <button className="w-full mt-4 border border-[#C04B59] text-[#C04B59] py-1.5 rounded text-sm font-bold hover:bg-rose-50">
                            Update CV
                        </button>
                    </div>

                    {/* CV Templates Promo */}
                    <div className="bg-[#3D4A7E] rounded-lg shadow p-4 text-white text-center">
                        <div className="w-12 h-12 bg-white/20 rounded-full flex items-center justify-center mx-auto mb-3">
                            <i className="fa-solid fa-robot text-2xl text-yellow-400"></i>
                        </div>
                        <h4 className="font-bold mb-1">AI CV Reviewer</h4>
                        <p className="text-xs opacity-80 mb-4">Chấm điểm & sửa lỗi CV với trí tuệ nhân tạo.</p>
    
                        <Link to="/cv-analyzer">
                            <button className="bg-white text-[#3D4A7E] text-xs px-4 py-2 rounded font-bold hover:bg-gray-100 w-full">
                                Thử ngay
                            </button>
                        </Link>
                    </div>
                </div>

                {/* RIGHT COLUMN (Jobs Feed) - 9/12 */}
                <div className="md:col-span-9">
                    
                    {/* Tabs */}
                    <div className="flex space-x-6 border-b mb-6">
                        <button 
                            onClick={() => setActiveTab('suggested')}
                            className={`pb-3 font-bold text-sm ${activeTab === 'suggested' ? 'text-[#C04B59] border-b-2 border-[#C04B59]' : 'text-gray-500 hover:text-gray-800'}`}
                        >
                            Suggested Jobs
                        </button>
                        <button 
                            onClick={() => setActiveTab('companies')}
                            className={`pb-3 font-bold text-sm ${activeTab === 'companies' ? 'text-[#C04B59] border-b-2 border-[#C04B59]' : 'text-gray-500 hover:text-gray-800'}`}
                        >
                            Top Companies
                        </button>
                        <button 
                            onClick={() => setActiveTab('saved')}
                            className={`pb-3 font-bold text-sm ${activeTab === 'saved' ? 'text-[#C04B59] border-b-2 border-[#C04B59]' : 'text-gray-500 hover:text-gray-800'}`}
                        >
                            Saved Jobs
                        </button>
                    </div>

                    {/* Content Area */}
                    {activeTab === 'suggested' && (
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                            {jobs.map(job => (
                                <div key={job.id} className={`bg-white p-4 rounded-lg shadow hover:shadow-md transition border border-gray-100 relative ${job.isHot ? 'border-l-4 border-l-[#C04B59]' : ''}`}>
                                    {job.isHot && <span className="absolute top-2 right-2 bg-red-100 text-red-600 text-[10px] px-2 py-0.5 rounded font-bold">HOT</span>}
                                    <div className="flex items-start space-x-3">
                                        <img src={job.logo} alt="Logo" className="w-12 h-12 rounded border" />
                                        <div>
                                            <h3 className="font-bold text-[#3D4A7E] text-base leading-tight hover:text-[#C04B59] cursor-pointer">{job.title}</h3>
                                            <p className="text-xs text-gray-500 mt-1 uppercase font-semibold">{job.company}</p>
                                            
                                            <div className="flex items-center space-x-4 mt-3 text-xs text-gray-600">
                                                <span className="flex items-center text-green-600 font-bold"><i className="fa-solid fa-dollar-sign mr-1"></i>{job.salary}</span>
                                                <span className="flex items-center"><i className="fa-solid fa-location-dot mr-1"></i>{job.location}</span>
                                            </div>
                                        </div>
                                    </div>
                                    <div className="mt-3 flex flex-wrap gap-2">
                                        {job.tags.map((tag, idx) => (
                                            <span key={idx} className="bg-gray-100 text-gray-600 px-2 py-1 rounded text-[10px]">{tag}</span>
                                        ))}
                                    </div>
                                </div>
                            ))}
                        </div>
                    )}

                    {activeTab === 'companies' && (
                         <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                            {topCompanies.map((comp, index) => (
                                <div key={index} className="bg-white p-4 rounded-lg shadow text-center hover:-translate-y-1 transition duration-300 cursor-pointer">
                                    <div className="w-16 h-16 bg-gray-50 rounded mx-auto mb-3 flex items-center justify-center border">
                                        <i className="fa-solid fa-building text-2xl text-gray-400"></i>
                                    </div>
                                    <h4 className="font-bold text-[#3D4A7E]">{comp.name}</h4>
                                    <p className="text-xs text-gray-500 mb-3">{comp.industry}</p>
                                    <span className="bg-blue-50 text-blue-600 px-3 py-1 rounded-full text-xs font-bold">{comp.jobs} Open Jobs</span>
                                </div>
                            ))}
                         </div>
                    )}
                </div>
            </div>

            {/* ================= RECRUITER BANNER (Phần cho Nhà tuyển dụng) ================= */}
            <div className="bg-gray-800 py-12 px-4 mt-10">
                <div className="max-w-5xl mx-auto flex flex-col md:flex-row items-center justify-between">
                    <div className="mb-6 md:mb-0">
                        <h2 className="text-white text-2xl font-bold mb-2">Are you an Employer?</h2>
                        <p className="text-gray-400 text-sm">Post jobs, find talent, and build your dream team with MYS Recruitment Solutions.</p>
                    </div>
                    <div className="flex space-x-4">
                        <button className="bg-[#C04B59] text-white px-6 py-3 rounded font-bold hover:bg-rose-700 transition">
                            Post a Job for Free
                        </button>
                        <button className="border border-white text-white px-6 py-3 rounded font-bold hover:bg-white hover:text-gray-800 transition">
                            Contact Sales
                        </button>
                    </div>
                </div>
            </div>

            {/* FOOTER MINI */}
            <div className="text-center py-6 text-xs text-gray-400 border-t">
                © 2025 MYS Recruitment Platform. All rights reserved.
            </div>

        </div>
    );
}