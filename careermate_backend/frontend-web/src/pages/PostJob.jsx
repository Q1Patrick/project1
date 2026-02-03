import { useState } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';

export default function PostJob() {
    const navigate = useNavigate();
    const [formData, setFormData] = useState({
        title: '',
        company_name: '',
        location: '',
        salary_range: '',
        description: '',
        requirements: '',
        deadline: ''
    });

    const handleChange = (e) => {
        setFormData({ ...formData, [e.target.name]: e.target.value });
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        const token = localStorage.getItem('accessToken'); // Lấy token để xác thực

        try {
            await axios.post('http://127.0.0.1:8000/jobs/my-jobs/', formData, {
                headers: {
                    'Authorization': `Token ${token}` // Gửi token kèm theo
                }
            });
            alert("Đăng tin tuyển dụng thành công!");
            navigate('/recruiter'); // Quay về Dashboard
        } catch (error) {
            console.error(error);
            alert("Có lỗi xảy ra, vui lòng thử lại!");
        }
    };

    return (
        <div className="max-w-3xl mx-auto mt-10 p-8 bg-white shadow-lg rounded-lg">
            <h2 className="text-2xl font-bold text-[#3D4A7E] mb-6 text-center">ĐĂNG TIN TUYỂN DỤNG MỚI</h2>
            
            <form onSubmit={handleSubmit} className="space-y-4">
                <div className="grid grid-cols-2 gap-4">
                    <div>
                        <label className="block text-sm font-bold mb-1">Chức danh công việc</label>
                        <input type="text" name="title" required onChange={handleChange} 
                            className="w-full p-2 border rounded focus:border-[#C04B59] outline-none" />
                    </div>
                    <div>
                        <label className="block text-sm font-bold mb-1">Tên công ty</label>
                        <input type="text" name="company_name" required onChange={handleChange} 
                            className="w-full p-2 border rounded focus:border-[#C04B59] outline-none" />
                    </div>
                </div>

                <div className="grid grid-cols-2 gap-4">
                    <div>
                        <label className="block text-sm font-bold mb-1">Địa điểm</label>
                        <input type="text" name="location" required onChange={handleChange} 
                            className="w-full p-2 border rounded focus:border-[#C04B59] outline-none" />
                    </div>
                    <div>
                        <label className="block text-sm font-bold mb-1">Mức lương</label>
                        <input type="text" name="salary_range" placeholder="VD: 10-15 triệu" required onChange={handleChange} 
                            className="w-full p-2 border rounded focus:border-[#C04B59] outline-none" />
                    </div>
                </div>

                <div>
                    <label className="block text-sm font-bold mb-1">Mô tả công việc</label>
                    <textarea name="description" rows="4" required onChange={handleChange}
                        className="w-full p-2 border rounded focus:border-[#C04B59] outline-none"></textarea>
                </div>

                <div>
                    <label className="block text-sm font-bold mb-1">Yêu cầu ứng viên</label>
                    <textarea name="requirements" rows="4" required onChange={handleChange}
                        className="w-full p-2 border rounded focus:border-[#C04B59] outline-none"></textarea>
                </div>

                <div>
                    <label className="block text-sm font-bold mb-1">Hạn nộp hồ sơ</label>
                    <input type="date" name="deadline" required onChange={handleChange} 
                        className="w-full p-2 border rounded focus:border-[#C04B59] outline-none" />
                </div>

                <button type="submit" className="w-full bg-[#C04B59] text-white py-3 rounded font-bold hover:bg-opacity-90 transition">
                    ĐĂNG TIN NGAY
                </button>
            </form>
        </div>
    );
}