import { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import axios from 'axios';
import Navbar from '../components/Navbar';
export default function RecruiterDashboard() {
    // 1. Khai báo biến để lưu trữ dữ liệu từ Backend
    const [jobs, setJobs] = useState([]);
    const [loading, setLoading] = useState(true);
    const user = JSON.parse(localStorage.getItem('userInfo')) || {};

    // 2. Gọi API ngay khi vào trang
    useEffect(() => {
        const fetchMyJobs = async () => {
            try {
                const token = localStorage.getItem('accessToken');
                const response = await axios.get('http://127.0.0.1:8000/jobs/my-jobs/', {
                    headers: {
                        'Authorization': `Token ${token}`
                    }
                });
                setJobs(response.data); // Lưu dữ liệu vào biến jobs
            } catch (error) {
                console.error("Lỗi tải danh sách việc làm:", error);
            } finally {
                setLoading(false);
            }
        };

        fetchMyJobs();
    }, []);

    return (
        <div className="min-h-screen bg-gray-50">
            <Navbar />
            <div className="max-w-6xl mx-auto">
                {/* --- PHẦN 1: HEADER & LỜI CHÀO --- */}
                <div className="flex justify-between items-center mb-10">
                    <div>
                        <h1 className="text-3xl font-bold text-[#3D4A7E]">Bảng điều khiển Nhà tuyển dụng</h1>
                        <p className="text-gray-500 mt-1">Xin chào, <span className="font-bold text-[#C04B59]">{user.last_name} {user.first_name}</span>!</p>
                    </div>
                </div>
                
                {/* --- PHẦN 2: CÁC CARD CHỨC NĂNG (Code cũ của bạn + Số liệu thật) --- */}
                <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-10">
                    {/* Card 1: Đăng tin */}
                    <div className="bg-white p-6 shadow-md rounded-lg border-t-4 border-[#C04B59] hover:shadow-xl transition">
                        <div className="flex items-center justify-between mb-4">
                            <h3 className="font-bold text-xl text-gray-800">Đăng tin mới</h3>
                            <i className="fa-solid fa-pen-to-square text-2xl text-[#C04B59] opacity-20"></i>
                        </div>
                        <p className="text-gray-600 mb-6 text-sm">Tạo tin tuyển dụng mới để tìm kiếm ứng viên.</p>
                        <Link to="/recruiter/post-job" className="inline-block w-full text-center bg-[#3D4A7E] text-white py-2 rounded hover:bg-opacity-90 transition font-bold text-sm">
                            + TẠO BÀI ĐĂNG
                        </Link>
                    </div>

                    {/* Card 2: Thống kê (Đã cập nhật số liệu thật) */}
                    <div className="bg-white p-6 shadow-md rounded-lg border-t-4 border-blue-500">
                        <div className="flex items-center justify-between mb-4">
                            <h3 className="font-bold text-xl text-gray-800">Tin đang hiển thị</h3>
                            <i className="fa-solid fa-briefcase text-2xl text-blue-500 opacity-20"></i>
                        </div>
                        <p className="text-gray-600 mb-2 text-sm">Tổng số bài viết bạn đã đăng:</p>
                        <p className="text-4xl font-bold text-[#3D4A7E]">{jobs.length}</p>
                    </div>
                </div>

                {/* --- PHẦN 3: BẢNG DANH SÁCH CÔNG VIỆC (Mới thêm vào) --- */}
                <div className="bg-white shadow rounded-lg overflow-hidden">
                    <div className="px-6 py-4 border-b border-gray-100">
                        <h3 className="font-bold text-lg text-[#3D4A7E]">Danh sách tin tuyển dụng của bạn</h3>
                    </div>

                    {loading ? (
                        <div className="p-10 text-center text-gray-500">Đang tải dữ liệu...</div>
                    ) : jobs.length === 0 ? (
                        <div className="p-10 text-center text-gray-500">
                            Bạn chưa đăng tin nào. Hãy bấm nút tạo bài đăng ở trên nhé!
                        </div>
                    ) : (
                        <div className="overflow-x-auto">
                            <table className="w-full text-left border-collapse">
                                <thead className="bg-gray-50">
                                    <tr>
                                        <th className="px-6 py-3 font-bold text-gray-600 text-sm">Tiêu đề</th>
                                        <th className="px-6 py-3 font-bold text-gray-600 text-sm">Ngày đăng</th>
                                        <th className="px-6 py-3 font-bold text-gray-600 text-sm">Trạng thái</th>
                                    </tr>
                                </thead>
                                <tbody>
                                    {jobs.map((job) => (
                                        <tr key={job.id} className="border-b last:border-0 hover:bg-gray-50">
                                            <td className="px-6 py-4">
                                                <div className="font-bold text-[#3D4A7E]">{job.title}</div>
                                                <div className="text-xs text-gray-500">{job.location}</div>
                                            </td>
                                            <td className="px-6 py-4 text-sm text-gray-600">
                                                {new Date(job.created_at).toLocaleDateString('vi-VN')}
                                            </td>
                                            <td className="px-6 py-4">
                                                <span className="px-2 py-1 bg-green-100 text-green-700 text-xs rounded-full font-bold">
                                                    Active
                                                </span>
                                            </td>
                                        </tr>
                                    ))}
                                </tbody>
                            </table>
                        </div>
                    )}
                </div>
            </div>
        </div>
    );
}