import { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import Navbar from '../components/Navbar';
import axios from 'axios';

export default function JobDetail() {
    const { id } = useParams(); // Lấy ID từ URL (vd: /jobs/15)
    const navigate = useNavigate();
    
    const [job, setJob] = useState(null);
    const [isLoading, setIsLoading] = useState(true);

    useEffect(() => {
        const fetchJobDetail = async () => {
            try {
                // Gọi API Public Detail vừa tạo
                const response = await axios.get(`http://127.0.0.1:8000/jobs/api/public/${id}/`);
                setJob(response.data);
            } catch (error) {
                console.error("Lỗi không tìm thấy job:", error);
            } finally {
                setIsLoading(false);
            }
        };
        fetchJobDetail();
    }, [id]);

    const handleApply = async () => {
        const token = localStorage.getItem('accessToken');
        
        // 1. Nếu chưa đăng nhập -> Đá về trang Login
        if (!token) {
            if(window.confirm("Bạn cần đăng nhập để ứng tuyển. Đi đến trang đăng nhập ngay?")) {
                navigate('/login');
            }
            return;
        }

        // 2. Hỏi xác nhận
        if(!window.confirm(`Bạn có chắc chắn muốn nộp đơn cho vị trí "${job.title}" tại ${job.company} không?`)) return;

        // 3. Gọi API Apply
        try {
            await axios.post(`http://127.0.0.1:8000/jobs/apply/${job.id}/`, {}, {
                headers: { 'Authorization': `Token ${token}` }
            });
            alert("🎉 Ứng tuyển thành công! Nhà tuyển dụng sẽ sớm liên hệ với bạn.");
        } catch (error) {
            const errorMsg = error.response?.data?.error || "Có lỗi xảy ra.";
            alert("⚠️ " + errorMsg);
        }
    };

    if (isLoading) return <div className="text-center py-20"><i className="fa-solid fa-spinner fa-spin text-3xl text-[#3D4A7E]"></i></div>;
    if (!job) return <div className="text-center py-20 text-xl font-bold">Không tìm thấy công việc này.</div>;

    const isJobExpired = job && new Date(job.deadline) < new Date().setHours(0,0,0,0);

    return (
        <div className="bg-gray-50 min-h-screen font-sans text-gray-800">
            <Navbar />

            {/* --- TOP BANNER INFO --- */}
            <div className="bg-[#3D4A7E] text-white py-12">
                <div className="max-w-6xl mx-auto px-4">
                    <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-6">
                        <div className="flex items-start gap-6">
                            <img 
                                src={job.logo || "https://via.placeholder.com/100"} 
                                alt="Company Logo" 
                                className="w-20 h-20 bg-white rounded-xl object-contain p-1"
                            />
                            <div>
                                <h1 className="text-3xl font-bold mb-2">{job.title}</h1>
                                <div className="flex flex-wrap gap-4 text-sm opacity-90">
                                    <span className="flex items-center"><i className="fa-solid fa-building mr-2"></i> {job.company_name || job.company}</span>
                                    <span className="flex items-center"><i className="fa-solid fa-location-dot mr-2"></i> {job.location}</span>
                                    <span className="flex items-center"><i className="fa-solid fa-clock mr-2"></i> {job.posted_date}</span>
                                </div>
                            </div>
                        </div>

                        <div className="flex flex-col items-end gap-3 w-full md:w-auto">
                            <span className="text-2xl font-bold text-[#4ade80]">{job.salary_range || "Thỏa thuận"}</span>
                            {/* Ở chỗ nút Apply Now trên Header */}
                            {isJobExpired ? (
                            <button 
                                disabled
                                className="bg-gray-400 text-white px-8 py-3 rounded-lg font-bold cursor-not-allowed w-full md:w-auto"
                            >
                                Đã hết hạn ứng tuyển
                            </button>
                        ) : (
                            <button 
                                onClick={handleApply}
                                className="bg-[#C04B59] hover:bg-[#a03542] text-white px-8 py-3 rounded-lg font-bold shadow-lg transition ..."
                            >
                                Apply Now <i className="fa-solid fa-paper-plane ml-2"></i>
                            </button>
                            )}
                        </div>
                    </div>
                </div>
            </div>

            {/* --- MAIN CONTENT --- */}
            <div className="max-w-6xl mx-auto px-4 py-10 grid grid-cols-1 md:grid-cols-3 gap-8">
                
                {/* CỘT TRÁI: Nội dung chi tiết (Chiếm 2 phần) */}
                <div className="md:col-span-2 space-y-8">
                    
                    {/* Mô tả công việc */}
                    <div className="bg-white p-8 rounded-xl shadow-sm border border-gray-100">
                        <h2 className="text-xl font-bold text-[#3D4A7E] mb-6 border-b pb-2">Job Description</h2>
                        <div className="prose max-w-none text-gray-600 leading-relaxed whitespace-pre-line">
                            {job.description || "Chưa có mô tả chi tiết cho công việc này."}
                        </div>
                    </div>

                    {/* Yêu cầu công việc */}
                    <div className="bg-white p-8 rounded-xl shadow-sm border border-gray-100">
                        <h2 className="text-xl font-bold text-[#3D4A7E] mb-6 border-b pb-2">Requirements</h2>
                        <div className="prose max-w-none text-gray-600 leading-relaxed whitespace-pre-line">
                            {job.requirements || "Chưa có yêu cầu cụ thể."}
                        </div>
                    </div>

                </div>

                {/* CỘT PHẢI: Thông tin tóm tắt (Chiếm 1 phần) */}
                <div className="space-y-6">
                    <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-100">
                        <h3 className="font-bold text-gray-800 mb-4">Job Overview</h3>
                        <ul className="space-y-4 text-sm text-gray-600">
                            <li className="flex justify-between border-b pb-2">
                                <span><i className="fa-solid fa-calendar mr-2 text-blue-500"></i> Posted date:</span>
                                <span className="font-semibold">{job.posted_date}</span>
                            </li>
                            <li className="flex justify-between border-b pb-2">
                                <span><i className="fa-solid fa-hourglass-half mr-2 text-blue-500"></i> Hạn nộp hồ sơ:</span>
                                <span className="font-bold text-red-500">
                                {job.deadline ? new Date(job.deadline).toLocaleDateString('vi-VN') : "Không giới hạn"}
                                </span>
                            </li>
                            <li className="flex justify-between border-b pb-2">
                                <span><i className="fa-solid fa-location-dot mr-2 text-blue-500"></i> Location:</span>
                                <span className="font-semibold">{job.location}</span>
                            </li>
                            <li className="flex justify-between border-b pb-2">
                                <span><i className="fa-solid fa-briefcase mr-2 text-blue-500"></i> Job Type:</span>
                                <span className="bg-blue-50 text-blue-700 px-2 py-0.5 rounded font-bold text-xs">{job.job_type}</span>
                            </li>
                            <li className="flex justify-between pb-2">
                                <span><i className="fa-solid fa-dollar-sign mr-2 text-blue-500"></i> Salary:</span>
                                <span className="font-bold text-green-600">{job.salary_range || "Thỏa thuận"}</span>
                            </li>
                        </ul>
                    </div>

                    <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-100">
                        <h3 className="font-bold text-gray-800 mb-4">Required Skills</h3>
                        <div className="flex flex-wrap gap-2">
                            {job.tags ? (
                                // 👇 LOGIC MỚI: Kiểm tra nếu là chuỗi thì cắt ra, nếu là mảng thì giữ nguyên
                                (typeof job.tags === 'string' ? job.tags.split(',') : job.tags).map((tag, idx) => (
                                    <span key={idx} className="bg-gray-100 text-gray-600 px-3 py-1 rounded-full text-xs font-bold border">
                                        {tag.trim()} {/* .trim() để xóa khoảng trắng thừa */}
                                    </span>
                                ))
                            ) : (
                                    <span className="text-gray-400 text-sm">No specific tags</span>
                            )}
                        </div>
                    </div>

                    <div className="bg-[#FFF4F6] p-6 rounded-xl border border-[#FFE0E6]">
                        <h3 className="font-bold text-[#C04B59] mb-2">Safety Tips</h3>
                        <p className="text-xs text-gray-600">
                            Không bao giờ chuyển tiền cho nhà tuyển dụng. Nếu bạn thấy công việc này đáng ngờ, hãy báo cáo ngay cho chúng tôi.
                        </p>
                    </div>
                </div>
            </div>
        </div>
    );
}