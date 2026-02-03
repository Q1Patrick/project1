import Navbar from '../components/Navbar';
import { useEffect, useState } from 'react';
import axios from 'axios';
import { Link, useNavigate } from 'react-router-dom';

export default function Home() {
    const navigate = useNavigate();
    const [jobs, setJobs] = useState([]);
    const [loading, setLoading] = useState(true);
    const [keyword, setKeyword] = useState('');
    const [location, setLocation] = useState('All Locations');
    // Gọi API lấy danh sách việc làm công khai
    useEffect(() => {
        const fetchJobs = async () => {
            try {
                // Không cần token ở đây vì API này là public
                const res = await axios.get('http://127.0.0.1:8000/jobs/public/');
                setJobs(res.data);
            } catch (error) {
                console.error("Lỗi tải việc làm:", error);
            } finally {
                setLoading(false);
            }
        };
        fetchJobs();
    }, []);
    
    // Hàm xử lý khi bấm nút SEARCH
    const handleSearch = (e) => {
        e.preventDefault();
        // Chuyển hướng sang trang Jobs kèm tham số trên URL
        // Ví dụ: /jobs?search=ReactJS&location=Ha Noi
        navigate(`/jobs?search=${encodeURIComponent(keyword)}&location=${encodeURIComponent(location)}`);
    };

    return (
        <div className="bg-gray-50 min-h-screen flex flex-col font-sans">
            <Navbar />

            {/* --- HERO SECTION (SEARCH BAR) --- */}
            <div className="bg-[#3D4A7E] py-16 px-4">
                <div className="max-w-4xl mx-auto text-center">
                    <h1 className="text-3xl md:text-4xl font-bold text-white mb-8">
                        Find your dream job among <span className="text-[#C04B59]">10,000+</span> vacancies
                    </h1>
                    
                    {/* Search Box */}
                    <div className="bg-white p-2 rounded flex flex-col md:flex-row shadow-lg">
                        <input 
                            type="text" 
                            placeholder="Job title, keywords, or company..." 
                            className="flex-grow p-3 outline-none text-gray-700" 
                            value={keyword}
                            onChange={(e) => setKeyword(e.target.value)}
                        />
                        <div className="border-l border-gray-300 mx-2 hidden md:block"></div>
                        <select 
                            className="p-3 outline-none bg-transparent text-gray-500 w-full md:w-48"
                            value={location}
                            onChange={(e) => setLocation(e.target.value)}
                        >
                            <option value="All Locations">All Locations</option>
                            <option value="Ho Chi Minh">Ho Chi Minh</option>
                            <option value="Ha Noi">Ha Noi</option>
                            <option value="Da Nang">Da Nang</option>
                            <option value="Remote">Remote</option>
                        </select>
                        <button 
                            onClick={handleSearch}
                            className="bg-[#C04B59] text-white px-8 py-3 rounded font-bold hover:bg-opacity-90 transition mt-2 md:mt-0"
                        >
                            SEARCH
                        </button>
                    </div>
                    
                    <div className="mt-4 text-gray-300 text-xs text-left ml-2">
                        Trending: <span className="underline cursor-pointer hover:text-white">Java</span>, <span className="underline cursor-pointer hover:text-white">ReactJS</span>, <span className="underline cursor-pointer hover:text-white">Tester</span>
                    </div>
                </div>
            </div>

            {/* --- DANH SÁCH VIỆC LÀM (SUGGESTED JOBS) --- */}
            <div className="max-w-6xl mx-auto py-12 px-6 w-full">
                <div className="flex space-x-8 border-b border-gray-200 mb-8 pb-1">
                    <button className="text-[#C04B59] font-bold border-b-2 border-[#C04B59] pb-3">Suggested Jobs</button>
                    <button className="text-gray-500 font-bold hover:text-[#3D4A7E] pb-3 transition">Top Companies</button>
                </div>

                {loading ? (
                    <div className="text-center py-10 text-gray-500">Đang tải danh sách việc làm...</div>
                ) : jobs.length === 0 ? (
                    <div className="text-center py-10">
                        <p className="text-gray-500 italic">Chưa có tin tuyển dụng nào.</p>
                    </div>
                ) : (
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                        {jobs.map((job) => (
                            <div key={job.id} 
                                onClick={() => navigate(`/jobs/${job.id}`)} 
                                className="bg-white p-5 rounded-xl border border-gray-100 shadow-sm hover:shadow-md hover:border-blue-200 transition cursor-pointer group"
                            >
                                {/* 1. Header: Tiêu đề & Ngày đăng */}
                                <div className="flex justify-between items-start mb-1">
                                    <Link to={`/jobs/${job.id}`} className="font-bold text-lg text-[#3D4A7E] group-hover:text-[#C04B59] transition cursor-pointer">{job.title}</Link>
                
                                    <span className="text-xs text-gray-400 whitespace-nowrap ml-2 mt-1">
                                        {new Date(job.created_at).toLocaleDateString('vi-VN')}
                                    </span>
                                </div>

                                {/* 👇 2. MỚI: TÊN CÔNG TY (Thêm vào đây) */}
                                <div className="text-sm text-gray-500 font-medium mb-3 flex items-center">
                                    <i className="fa-regular fa-building mr-1.5 text-xs text-gray-400"></i>
                                    <span className="truncate">{job.company_name || job.company || "Công ty ẩn danh"}</span>
                                </div>

                                {/* 3. Body: Địa điểm & Lương */}
                                <div className="flex items-center gap-3 mb-4">
                                    {/* Địa điểm */}
                                    <span className="text-xs font-bold text-gray-500 uppercase bg-gray-50 px-2 py-1 rounded">
                                        {job.location}
                                    </span>
                                    {/* Lương (Màu xanh nổi bật) */}
                                    <span className="text-sm font-bold text-green-600">
                                        {job.salary_range}
                                    </span>
                                </div>

                                {/* 4. Footer: Tags (Loại việc, Urgent...) */}
                                <div className="flex gap-2">
                                    <span className="bg-gray-100 text-gray-600 px-2 py-1 rounded text-[10px] font-bold uppercase border">
                                        {job.job_type}
                                    </span>
                                </div>
                            </div>
                        ))}
                    </div>
                )}
                
                <div className="text-center mt-10">
                     <button className="border border-[#3D4A7E] text-[#3D4A7E] px-6 py-2 rounded font-bold hover:bg-[#3D4A7E] hover:text-white transition">
                        View All Jobs
                    </button>
                </div>
            </div>
        </div>
    );
}