import { useState, useEffect, useRef } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import axios from 'axios';
import Navbar from '../components/Navbar';

export default function Dashboard() {
    const navigate = useNavigate();
    const fileInputRef = useRef(null);

    const [user, setUser] = useState(null);
    const [stats, setStats] = useState({ applied: 0, interview: 0, saved: 0 }); // State lưu số liệu thật
    const [latestCV, setLatestCV] = useState(null);
    const [loading, setLoading] = useState(true);
    const [uploading, setUploading] = useState(false);

    useEffect(() => {
        fetchData();
    }, [navigate]);

    const fetchData = async () => {
        const token = localStorage.getItem('accessToken');
        if (!token) {
            navigate('/login');
            return;
        }

        try {
            // 1. Lấy User Profile
            const profileRes = await axios.get('http://127.0.0.1:8000/users/profile/', {
                headers: { Authorization: `Token ${token}` }
            });
            setUser(profileRes.data);

            // 2. 👇 LẤY SỐ LIỆU THỐNG KÊ (REAL DATA)
            const statsRes = await axios.get('http://127.0.0.1:8000/users/dashboard-stats/', {
                headers: { Authorization: `Token ${token}` }
            });
            setStats(statsRes.data);

            // 3. Lấy CV Online
            const cvRes = await axios.get('http://127.0.0.1:8000/editor/cvs/', {
                headers: { Authorization: `Token ${token}` }
            });
            if (cvRes.data && cvRes.data.length > 0) {
                setLatestCV(cvRes.data[0]); 
            }

        } catch (err) {
            console.error("Lỗi tải dữ liệu:", err);
        } finally {
            setLoading(false);
        }
    };

    const handleFileUpload = async (event) => {
        const file = event.target.files[0];
        if (!file) return;
        if (file.type !== 'application/pdf') {
            alert("Vui lòng chỉ tải lên file PDF!");
            return;
        }

        const formData = new FormData();
        formData.append('cv_file', file);
        setUploading(true);
        const token = localStorage.getItem('accessToken');

        try {
            await axios.patch('http://127.0.0.1:8000/users/profile/edit/', formData, {
                headers: { Authorization: `Token ${token}`, 'Content-Type': 'multipart/form-data' }
            });
            alert("✅ Tải CV lên thành công!");
            fetchData();
        } catch (error) {
            alert("Lỗi khi tải file.");
        } finally {
            setUploading(false);
        }
    };

    if (loading) return <div className="text-center py-20">Đang tải Dashboard...</div>;
    if (!user) return null;

    return (
        <div className="bg-gray-50 min-h-screen font-sans text-gray-800">
            <Navbar />

            <div className="max-w-7xl mx-auto px-4 py-8 grid grid-cols-1 md:grid-cols-4 gap-8">
                
                {/* --- CỘT TRÁI (SIDEBAR) --- */}
                <div className="md:col-span-1 space-y-6">
                    
                    {/* 1. PROFILE CARD */}
                    <div className="bg-white p-6 rounded-xl shadow-sm border text-center">
                        <div className="w-20 h-20 bg-[#C04B59] rounded-full mx-auto flex items-center justify-center text-white text-2xl font-bold mb-3 shadow-lg overflow-hidden">
                            {user.avatar ? <img src={user.avatar} className="w-full h-full object-cover"/> : (user.first_name ? user.first_name[0] : 'U')}
                        </div>
                        <h2 className="font-bold text-lg text-[#3D4A7E]">{user.last_name} {user.first_name}</h2>
                        <p className="text-gray-500 text-sm mb-4">{user.title || "Web Developer"}</p>
                        <Link to="/profile" className="text-sm font-bold text-[#C04B59] hover:underline">
                            Cập nhật hồ sơ
                        </Link>
                    </div>

                    {/* 2. CV ĐANG DÙNG (Thay cho Profile Strength) */}
                    <div className="bg-white p-5 rounded-xl shadow-sm border">
                        <h3 className="font-bold text-gray-800 mb-4 border-b pb-2">CV Đang Dùng</h3>
                        
                        {/* Option 1: CV Online */}
                        <div className="mb-4">
                            <p className="text-xs font-bold text-gray-400 mb-2">CV ONLINE</p>
                            {latestCV ? (
                                <div className="bg-blue-50 border border-blue-200 rounded-lg p-3">
                                    <div className="font-bold text-[#3D4A7E] text-sm truncate">{latestCV.name}</div>
                                    <div className="text-xs text-gray-500 mb-2">Cập nhật: {new Date(latestCV.updated_at).toLocaleDateString()}</div>
                                    <div className="flex gap-2">
                                        <button onClick={() => navigate(`/editor/${latestCV.id}`)} className="flex-1 bg-[#3D4A7E] text-white text-xs py-1.5 rounded font-bold hover:bg-[#2c355b]">Sửa</button>
                                        <button onClick={() => window.open(`http://127.0.0.1:8000/editor/cvs/${latestCV.id}/`, '_blank')} className="flex-1 bg-white text-[#3D4A7E] border border-[#3D4A7E] text-xs py-1.5 rounded font-bold hover:bg-gray-50">Xem</button>
                                    </div>
                                </div>
                            ) : (
                                <button onClick={() => navigate('/cv-templates')} className="w-full border-2 border-dashed border-gray-300 py-2 rounded text-xs font-bold text-gray-500 hover:border-blue-500 hover:text-blue-500">+ Tạo CV Mới</button>
                            )}
                        </div>

                        {/* Option 2: CV Upload */}
                        <div>
                            <p className="text-xs font-bold text-gray-400 mb-2">CV UPLOAD (PDF)</p>
                            {user.cv_file ? (
                                <div className="flex items-center justify-between bg-red-50 border border-red-200 p-2 rounded-lg">
                                    <div className="flex items-center gap-2 overflow-hidden">
                                        <i className="fa-solid fa-file-pdf text-red-500"></i>
                                        <a href={`http://127.0.0.1:8000${user.cv_file}`} target="_blank" className="text-xs font-bold text-gray-700 truncate hover:text-red-500 hover:underline">
                                            File đính kèm
                                        </a>
                                    </div>
                                    <button onClick={() => fileInputRef.current.click()} className="text-gray-400 hover:text-gray-600"><i className="fa-solid fa-pen"></i></button>
                                </div>
                            ) : (
                                <button onClick={() => fileInputRef.current.click()} className="w-full bg-gray-100 py-2 rounded text-xs font-bold text-gray-600 hover:bg-gray-200 flex items-center justify-center gap-2">
                                    <i className="fa-solid fa-upload"></i> Tải PDF lên
                                </button>
                            )}
                            <input type="file" ref={fileInputRef} className="hidden" accept="application/pdf" onChange={handleFileUpload} />
                        </div>
                    </div>

                    {/* 3. MENU BÊN TRÁI (Như ảnh bạn gửi) */}
                    <div className="bg-white rounded-xl shadow-sm border overflow-hidden">
                        <Link to="/applied-jobs" className="block p-4 text-sm font-medium text-gray-700 hover:bg-gray-50 border-b transition">
                            Việc làm đã ứng tuyển
                        </Link>
                        <Link to="/saved-jobs" className="block p-4 text-sm font-medium text-gray-700 hover:bg-gray-50 border-b transition">
                            Việc làm đã lưu
                        </Link>
                        <button onClick={() => { localStorage.clear(); navigate('/login'); }} className="w-full text-left p-4 text-sm font-medium text-red-600 hover:bg-red-50 transition">
                            Đăng xuất
                        </button>
                    </div>
                </div>

                {/* --- CỘT PHẢI (MAIN CONTENT) --- */}
                <div className="md:col-span-3 space-y-8">
                    
                    {/* Welcome Banner */}
                    <div className="bg-gradient-to-r from-[#3D4A7E] to-[#556399] rounded-2xl p-8 text-white shadow-lg relative overflow-hidden">
                        <div className="relative z-10">
                            <h1 className="text-3xl font-bold mb-2">Chào, {user.last_name}! 👋</h1>
                            <p className="opacity-90">Sẵn sàng bứt phá sự nghiệp ngay hôm nay.</p>
                        </div>
                        <div className="absolute right-0 bottom-0 w-40 h-40 bg-white opacity-10 rounded-full translate-x-10 translate-y-10"></div>
                    </div>

                    {/* 4. STATS GRID (Giữ nguyên style ảnh cũ nhưng dùng Real Data) */}
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                        {/* Card 1: Việc đã nộp */}
                        <div className="bg-white p-6 rounded-xl shadow-sm border border-l-4 border-l-blue-500">
                            <div className="text-gray-500 text-sm font-bold uppercase mb-2">VIỆC ĐÃ NỘP</div>
                            <div className="text-4xl font-bold text-gray-800">{stats.applied}</div>
                        </div>

                        {/* Card 2: Phỏng vấn */}
                        <div className="bg-white p-6 rounded-xl shadow-sm border border-l-4 border-l-green-500">
                            <div className="text-gray-500 text-sm font-bold uppercase mb-2">PHỎNG VẤN</div>
                            <div className="text-4xl font-bold text-gray-800">{stats.interview}</div>
                        </div>

                        {/* Card 3: Tin đã lưu */}
                        <div className="bg-white p-6 rounded-xl shadow-sm border border-l-4 border-l-orange-500">
                            <div className="text-gray-500 text-sm font-bold uppercase mb-2">TIN ĐÃ LƯU</div>
                            <div className="text-4xl font-bold text-gray-800">{stats.saved}</div>
                        </div>
                    </div>

                    {/* 5. AI RECOMMENDATION (Giữ nguyên style ảnh cũ) */}
                    <div>
                        <div className="flex justify-between items-center mb-4">
                            <h3 className="font-bold text-xl text-[#3D4A7E]">
                                <i className="fa-solid fa-wand-magic-sparkles mr-2 text-yellow-500"></i>
                                Việc làm phù hợp với bạn
                            </h3>
                            <Link to="/jobs" className="text-sm text-blue-500 hover:underline">Xem tất cả</Link>
                        </div>
                    {stats.recommended_jobs && stats.recommended_jobs.length > 0 ? (
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                {stats.recommended_jobs.map(job => (
                                    <div key={job.id} className="bg-white p-4 rounded-xl shadow-sm border hover:shadow-md transition flex gap-3 group">
                                        <img 
                                            src={job.company_logo || "https://via.placeholder.com/60"} 
                                            alt="Logo" 
                                            className="w-14 h-14 object-contain rounded border p-1"
                                        />
                                        <div className="flex-1 min-w-0">
                                            <h4 className="font-bold text-[#3D4A7E] truncate group-hover:text-[#C04B59] transition cursor-pointer" onClick={() => navigate(`/jobs/${job.id}`)}>
                                                {job.title}
                                            </h4>
                                            <p className="text-xs text-gray-500 mb-2 truncate">{job.company_name}</p>
                                            <div className="flex gap-2">
                                                <span className="text-xs bg-green-50 text-green-700 px-2 py-0.5 rounded font-bold">
                                                    {job.salary_range}
                                                </span>
                                                <span className="text-xs bg-gray-100 text-gray-600 px-2 py-0.5 rounded">
                                                    {job.location}
                                                </span>
                                            </div>
                                        </div>
                                    </div>
                                ))}
                            </div>
                        ) : (
                            <div className="bg-white p-8 rounded-xl border shadow-sm text-center">
                                <p className="text-gray-400">
                                    Chưa có dữ liệu để phân tích. Hãy cập nhật CV của bạn!
                                </p>
                            </div>
                        )}
                    </div>
                    
                </div>
            </div>
        </div>
    );
}