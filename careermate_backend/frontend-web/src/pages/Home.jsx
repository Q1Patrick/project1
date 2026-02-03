import Navbar from '../components/Navbar';
import { useEffect, useState } from 'react';
import axios from 'axios';
import { Link } from 'react-router-dom';

export default function Home() {
    const [jobs, setJobs] = useState([]);
    const [loading, setLoading] = useState(true);

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
                        <input type="text" placeholder="Job title, keywords, or company..." className="flex-grow p-3 outline-none text-gray-700" />
                        <div className="border-l border-gray-300 mx-2 hidden md:block"></div>
                        <select className="p-3 outline-none bg-transparent text-gray-500 w-full md:w-48">
                            <option>All Locations</option>
                            <option>Hồ Chí Minh</option>
                            <option>Hà Nội</option>
                        </select>
                        <button className="bg-[#C04B59] text-white px-8 py-3 rounded font-bold hover:bg-opacity-90 transition mt-2 md:mt-0">
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
                            <div key={job.id} className="bg-white p-6 rounded-lg shadow-sm border border-gray-100 hover:shadow-md transition flex justify-between items-start group cursor-pointer">
                                <div>
                                    <h3 className="text-lg font-bold text-[#3D4A7E] group-hover:text-[#C04B59] transition">{job.title}</h3>
                                    <p className="text-gray-600 font-medium text-sm mt-1">{job.company_name}</p>
                                    
                                    <div className="flex items-center space-x-4 mt-3 text-xs text-gray-500 font-bold uppercase tracking-wide">
                                        <span className="flex items-center"><i className="fa-solid fa-location-dot mr-1"></i> {job.location}</span>
                                        <span className="flex items-center text-green-600"><i className="fa-solid fa-money-bill mr-1"></i> {job.salary_range}</span>
                                    </div>
                                    
                                    <div className="mt-4 flex space-x-2">
                                        <span className="bg-gray-100 text-gray-600 px-2 py-1 rounded text-[10px]">Full-time</span>
                                        <span className="bg-gray-100 text-gray-600 px-2 py-1 rounded text-[10px]">Urgent</span>
                                    </div>
                                </div>
                                
                                {/* Nút Ứng tuyển nhanh (Giả lập) */}
                                <div className="flex flex-col items-end space-y-2">
                                    <button className="text-gray-300 hover:text-[#C04B59] transition">
                                        <i className="fa-regular fa-heart text-xl"></i>
                                    </button>
                                    <span className="text-[10px] text-gray-400">{new Date(job.created_at).toLocaleDateString('vi-VN')}</span>
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