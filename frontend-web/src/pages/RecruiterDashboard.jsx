import { useState, useEffect } from 'react';
import Navbar from '../components/Navbar';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';

export default function RecruiterDashboard() {
    const [jobs, setJobs] = useState([]);
    const [isLoading, setIsLoading] = useState(true);
    const navigate = useNavigate();

    // Lấy danh sách job (Code cũ của bạn)
    useEffect(() => {
        const fetchMyJobs = async () => {
            const token = localStorage.getItem('accessToken');
            if (!token) {
                navigate('/login');
                return;
            }
            try {
                const response = await axios.get('http://127.0.0.1:8000/jobs/recruiter-list/', {
                    headers: { 'Authorization': `Token ${token}` }
                });
                setJobs(response.data);
            } catch (error) {
                console.error("Lỗi lấy danh sách job:", error);
            } finally {
                setIsLoading(false);
            }
        };
        fetchMyJobs();
    }, [navigate]);

    // 👇 1. CHỨC NĂNG XÓA
    const handleDelete = async (jobId) => {
        if (!window.confirm("Bạn có chắc chắn muốn xóa tin tuyển dụng này không? Hành động này không thể hoàn tác.")) {
            return;
        }

        try {
            const token = localStorage.getItem('accessToken');
            await axios.delete(`http://127.0.0.1:8000/jobs/recruiter/${jobId}/`, {
                headers: { 'Authorization': `Token ${token}` }
            });
            
            // Xóa thành công thì loại bỏ job đó khỏi danh sách trên màn hình luôn (đỡ phải F5)
            setJobs(jobs.filter(job => job.id !== jobId));
            alert("Đã xóa tin tuyển dụng.");
        } catch (error) {
            console.error("Lỗi khi xóa:", error);
            alert("Có lỗi xảy ra khi xóa.");
        }
    };

    // 👇 2. CHỨC NĂNG SỬA (Chuyển trang)
    const handleEdit = (jobId) => {
        navigate(`/recruiter/edit-job/${jobId}`);
    };

    const isExpired = (deadlineStr) => {
        const deadline = new Date(deadlineStr);
        const today = new Date();
        // Reset giờ về 0 để chỉ so sánh ngày
        today.setHours(0, 0, 0, 0);
        return deadline < today;
    };

    return (
        <div className="bg-gray-50 min-h-screen font-sans text-gray-800">
            <Navbar />

            <div className="max-w-6xl mx-auto px-4 py-10">
                <div className="flex justify-between items-center mb-8">
                    <div>
                        <h1 className="text-3xl font-bold text-[#3D4A7E]">Bảng điều khiển Nhà tuyển dụng</h1>
                        <p className="text-gray-500 mt-1">Quản lý các tin đăng và hồ sơ ứng tuyển.</p>
                    </div>
                    <button 
                        onClick={() => navigate('/recruiter/post-job')}
                        className="bg-[#C04B59] text-white px-6 py-3 rounded-lg font-bold shadow hover:bg-[#a03542] transition"
                    >
                        <i className="fa-solid fa-plus mr-2"></i> Đăng tin mới
                    </button>
                </div>

                {/* Thống kê nhanh */}
                <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-10">
                    <div className="bg-white p-6 rounded-xl shadow-sm border border-l-4 border-l-[#3D4A7E]">
                        <h3 className="text-gray-500 font-bold text-sm uppercase">Tin đang hiển thị</h3>
                        <p className="text-3xl font-bold text-[#3D4A7E] mt-2">{jobs.length}</p>
                    </div>
                    {/* Các box thống kê khác nếu muốn... */}
                </div>

                <div className="bg-white rounded-xl shadow-sm border border-gray-200 overflow-hidden">
                    <div className="p-6 border-b bg-gray-50 flex justify-between items-center">
                        <h3 className="font-bold text-lg text-[#3D4A7E]">Danh sách tin tuyển dụng</h3>
                    </div>

                    {isLoading ? (
                        <div className="p-10 text-center text-gray-500">Đang tải dữ liệu...</div>
                    ) : jobs.length === 0 ? (
                        <div className="p-10 text-center text-gray-500">
                            Bạn chưa đăng tin nào. Hãy bấm nút "Đăng tin mới" ở trên nhé!
                        </div>
                    ) : (
                        <div className="divide-y">
                            {jobs.map(job => (
                                <div key={job.id} className="p-6 hover:bg-gray-50 transition flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
                                    <div className="flex-1">
                                        <div className="flex items-center gap-3 mb-1">
                                            <h4 className="font-bold text-lg text-[#3D4A7E]">{job.title}</h4>
                                            {isExpired(job.deadline) ? (
                                                <span className="bg-red-100 text-red-700 text-xs px-2 py-1 rounded font-bold uppercase border border-red-200">
                                                    Expired (Hết hạn)
                                                </span>
                                            ) : (
                                                <span className="bg-green-100 text-green-700 text-xs px-2 py-1 rounded font-bold uppercase border border-green-200">
                                                    Active (Đang tuyển)
                                                </span>
                                            )}
                                        </div>
                                        <p className="text-sm text-gray-500 mb-2">
                                            <i className="fa-regular fa-building mr-1"></i> {job.company_name} &bull; 
                                            <i className="fa-solid fa-location-dot mx-2"></i> {job.location} &bull; 
                                            <i className="fa-regular fa-clock mx-2"></i> {new Date(job.created_at).toLocaleDateString()}
                                        </p>
                                        <div className="flex gap-2">
                                            <span className="text-xs bg-gray-100 px-2 py-1 rounded text-gray-600 font-bold">{job.job_type}</span>
                                            <span className="text-xs bg-gray-100 px-2 py-1 rounded text-gray-600 font-bold">{job.salary_range}</span>
                                        </div>
                                        <div className="flex gap-4 mt-3">
                                            {/* 👇 HIỂN THỊ SỐ LƯỢNG ỨNG VIÊN 👇 */}
                                            <div className="flex items-center text-sm font-bold text-gray-600 bg-gray-100 px-3 py-1.5 rounded-lg border">
                                                <i className="fa-solid fa-users mr-2 text-[#3D4A7E]"></i>
                                                {job.application_count} Ứng viên
                                            </div>
                                        </div>
                                    </div>

                                    {/* 👇 3. CÁC NÚT THAO TÁC (SỬA / XÓA) */}
                                    <div className="flex items-center gap-3">
                                        <button 
                                            onClick={() => handleEdit(job.id)}
                                            className="text-blue-600 bg-blue-50 hover:bg-blue-100 px-4 py-2 rounded-lg font-bold text-sm transition"
                                        >
                                            <i className="fa-solid fa-pen-to-square mr-1"></i> Sửa
                                        </button>
                                        <button 
                                            onClick={() => handleDelete(job.id)}
                                            className="text-red-600 bg-red-50 hover:bg-red-100 px-4 py-2 rounded-lg font-bold text-sm transition"
                                        >
                                            <i className="fa-solid fa-trash mr-1"></i> Xóa
                                        </button>
                                        <button 
                                            onClick={() => navigate(`/recruiter/job/${job.id}/applicants`)}
                                            className="text-[#C04B59] bg-rose-50 hover:bg-rose-100 px-4 py-2 rounded-lg font-bold text-sm transition border border-rose-100"
                                        >
                                            <i className="fa-solid fa-address-book mr-1"></i> Xem hồ sơ
                                        </button>
                                    </div>
                                </div>
                            ))}
                        </div>
                    )}
                </div>
            </div>
        </div>
    );
}