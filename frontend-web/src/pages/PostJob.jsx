import { useState } from 'react';
import Navbar from '../components/Navbar';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';

export default function PostJob() {
    const navigate = useNavigate();
    const [isLoading, setIsLoading] = useState(false);

    // State lưu dữ liệu form
    const [formData, setFormData] = useState({
        title: '',
        company_name: '',
        location: 'Ho Chi Minh', // Default
        job_type: 'Full-time',
        category: 'IT Software',
        experience: '1 năm',
        salary_range: '',
        deadline: '',
        description: '',
        requirements: '',
        benefits: '', // Phúc lợi
        logo: 'https://via.placeholder.com/150' // Logo mặc định
    });

    // State riêng cho Tags (Kỹ năng)
    const [tags, setTags] = useState([]);
    const [tagInput, setTagInput] = useState('');

    const handleChange = (e) => {
        setFormData({ ...formData, [e.target.name]: e.target.value });
    };

    // Xử lý nhập Tags (Nhấn Enter để thêm tag)
    const handleTagKeyDown = (e) => {
        if (e.key === 'Enter') {
            e.preventDefault();
            const val = tagInput.trim();
            if (val && !tags.includes(val)) {
                setTags([...tags, val]);
                setTagInput('');
            }
        }
    };

    // Xóa tag
    const removeTag = (indexToRemove) => {
        setTags(tags.filter((_, index) => index !== indexToRemove));
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        setIsLoading(true);

        try {
            const token = localStorage.getItem('accessToken');
            
            // Gộp mảng tags thành chuỗi cách nhau dấu phẩy để gửi về backend
            const finalData = {
                ...formData,
                tags: tags.join(',') 
            };

            await axios.post('http://127.0.0.1:8000/jobs/recruiter-list/', finalData, {
                headers: { 'Authorization': `Token ${token}` }
            });

            alert("Đăng tin tuyển dụng thành công!");
            navigate('/recruiter'); // Về dashboard
        } catch (error) {
            console.error("Lỗi đăng tin:", error);
            if (error.response && error.response.data) {
                // In chi tiết lỗi ra màn hình để dễ sửa
                alert("Lỗi: " + JSON.stringify(error.response.data));
            } else {
                alert("Có lỗi xảy ra. Vui lòng thử lại.");
            }
        } finally {
            setIsLoading(false);
        }
    };

    return (
        <div className="bg-gray-50 min-h-screen font-sans text-gray-800">
            <Navbar />

            <div className="max-w-5xl mx-auto px-4 py-10">
                <div className="text-center mb-10">
                    <h1 className="text-3xl font-bold text-[#3D4A7E]">Đăng Tin Tuyển Dụng Mới</h1>
                    <p className="text-gray-500 mt-2">Tiếp cận hàng nghìn ứng viên tiềm năng ngay hôm nay.</p>
                </div>

                <form onSubmit={handleSubmit} className="grid grid-cols-1 md:grid-cols-3 gap-8">
                    
                    {/* --- CỘT TRÁI: THÔNG TIN CHUNG (Chiếm 1 phần) --- */}
                    <div className="md:col-span-1 space-y-6">
                        {/* Box 1: Info */}
                        <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-200">
                            <h3 className="font-bold text-[#3D4A7E] mb-4 border-b pb-2">Thông tin chung</h3>
                            
                            <div className="space-y-4">
                                <div>
                                    <label className="block text-sm font-bold text-gray-700 mb-1">Tiêu đề công việc <span className="text-red-500">*</span></label>
                                    <input required name="title" value={formData.title} onChange={handleChange} placeholder="VD: Senior React Developer" className="w-full border rounded-lg p-2.5 focus:ring-2 focus:ring-[#3D4A7E] outline-none" />
                                </div>

                                <div>
                                    <label className="block text-sm font-bold text-gray-700 mb-1">Ngành nghề</label>
                                    <select name="category" value={formData.category} onChange={handleChange} className="w-full border rounded-lg p-2.5 bg-white">
                                        <option>IT Software</option>
                                        <option>Marketing / Truyền thông</option>
                                        <option>Kế toán / Kiểm toán</option>
                                        <option>Hành chính / Nhân sự</option>
                                        <option>Kinh doanh / Bán hàng</option>
                                    </select>
                                </div>

                                <div>
                                    <label className="block text-sm font-bold text-gray-700 mb-1">Hình thức làm việc</label>
                                    <select name="job_type" value={formData.job_type} onChange={handleChange} className="w-full border rounded-lg p-2.5 bg-white">
                                        <option value="Full-time">Toàn thời gian</option>
                                        <option value="Part-time">Bán thời gian</option>
                                        <option value="Freelance">Freelance</option>
                                        <option value="Internship">Thực tập</option>
                                    </select>
                                </div>

                                <div>
                                    <label className="block text-sm font-bold text-gray-700 mb-1">Kinh nghiệm</label>
                                    <select name="experience" value={formData.experience} onChange={handleChange} className="w-full border rounded-lg p-2.5 bg-white">
                                        <option>Không yêu cầu</option>
                                        <option>Dưới 1 năm</option>
                                        <option>1 - 3 năm</option>
                                        <option>3 - 5 năm</option>
                                        <option>Trên 5 năm</option>
                                    </select>
                                </div>

                                <div>
                                    <label className="block text-sm font-bold text-gray-700 mb-1">Địa điểm</label>
                                    <select name="location" value={formData.location} onChange={handleChange} className="w-full border rounded-lg p-2.5 bg-white">
                                        <option>Ho Chi Minh</option>
                                        <option>Ha Noi</option>
                                        <option>Da Nang</option>
                                        <option>Remote</option>
                                    </select>
                                </div>

                                <div>
                                    <label className="block text-sm font-bold text-gray-700 mb-1">Mức lương</label>
                                    <input required name="salary_range" value={formData.salary_range} onChange={handleChange} placeholder="VD: 15 - 20 triệu" className="w-full border rounded-lg p-2.5 outline-none" />
                                </div>

                                <div>
                                    <label className="block text-sm font-bold text-gray-700 mb-1">Hạn nộp hồ sơ</label>
                                    <input required type="date" name="deadline" value={formData.deadline} onChange={handleChange} className="w-full border rounded-lg p-2.5 outline-none" />
                                </div>
                            </div>
                        </div>

                         {/* Box 2: Company Info */}
                         <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-200">
                            <h3 className="font-bold text-[#3D4A7E] mb-4 border-b pb-2">Về công ty</h3>
                            <div className="space-y-4">
                                <div>
                                    <label className="block text-sm font-bold text-gray-700 mb-1">Tên công ty <span className="text-red-500">*</span></label>
                                    <input required name="company_name" value={formData.company_name} onChange={handleChange} placeholder="VD: FPT Software" className="w-full border rounded-lg p-2.5 outline-none" />
                                </div>
                                <div>
                                    <label className="block text-sm font-bold text-gray-700 mb-1">Link Logo (URL)</label>
                                    <input name="logo" value={formData.logo} onChange={handleChange} placeholder="https://..." className="w-full border rounded-lg p-2.5 outline-none text-xs" />
                                </div>
                            </div>
                        </div>
                    </div>

                    {/* --- CỘT PHẢI: CHI TIẾT CÔNG VIỆC (Chiếm 2 phần) --- */}
                    <div className="md:col-span-2 space-y-6">
                        <div className="bg-white p-8 rounded-xl shadow-sm border border-gray-200">
                            
                            {/* Mô tả */}
                            <div className="mb-6">
                                <label className="block text-base font-bold text-[#3D4A7E] mb-2">Mô tả công việc (JD)</label>
                                <textarea required name="description" value={formData.description} onChange={handleChange} rows="6" placeholder="- Mô tả trách nhiệm công việc..." className="w-full border rounded-lg p-4 outline-none focus:border-[#3D4A7E] bg-gray-50"></textarea>
                            </div>

                            {/* Yêu cầu */}
                            <div className="mb-6">
                                <label className="block text-base font-bold text-[#3D4A7E] mb-2">Yêu cầu ứng viên</label>
                                <textarea required name="requirements" value={formData.requirements} onChange={handleChange} rows="5" placeholder="- Các kỹ năng chuyên môn cần thiết..." className="w-full border rounded-lg p-4 outline-none focus:border-[#3D4A7E] bg-gray-50"></textarea>
                            </div>

                            {/* Phúc lợi (Mới) */}
                            <div className="mb-6">
                                <label className="block text-base font-bold text-[#3D4A7E] mb-2">Quyền lợi & Chế độ</label>
                                <textarea name="benefits" value={formData.benefits} onChange={handleChange} rows="4" placeholder="- Chế độ bảo hiểm, thưởng, du lịch..." className="w-full border rounded-lg p-4 outline-none focus:border-[#3D4A7E] bg-gray-50"></textarea>
                            </div>

                            {/* Kỹ năng (Tags Input) */}
                            <div className="mb-8">
                                <label className="block text-base font-bold text-[#3D4A7E] mb-2">Kỹ năng yêu cầu (Tags)</label>
                                <p className="text-xs text-gray-400 mb-2">Nhập tên kỹ năng và nhấn Enter (VD: ReactJS, Teamwork)</p>
                                
                                <div className="border rounded-lg p-3 flex flex-wrap gap-2 focus-within:ring-2 ring-[#3D4A7E] bg-white">
                                    {tags.map((tag, index) => (
                                        <span key={index} className="bg-blue-100 text-[#3D4A7E] px-3 py-1 rounded-full text-sm font-bold flex items-center">
                                            {tag}
                                            <button type="button" onClick={() => removeTag(index)} className="ml-2 text-blue-400 hover:text-red-500">
                                                <i className="fa-solid fa-xmark"></i>
                                            </button>
                                        </span>
                                    ))}
                                    <input 
                                        type="text" 
                                        value={tagInput}
                                        onChange={(e) => setTagInput(e.target.value)}
                                        onKeyDown={handleTagKeyDown}
                                        placeholder="Nhập kỹ năng..." 
                                        className="flex-grow outline-none bg-transparent min-w-[100px]"
                                    />
                                </div>
                            </div>

                            <button 
                                type="submit" 
                                disabled={isLoading}
                                className="w-full bg-[#C04B59] text-white py-4 rounded-xl font-bold text-lg hover:bg-[#a03542] transition shadow-lg flex items-center justify-center"
                            >
                                {isLoading ? <i className="fa-solid fa-spinner fa-spin mr-2"></i> : <i className="fa-solid fa-paper-plane mr-2"></i>}
                                ĐĂNG TIN NGAY
                            </button>
                        </div>
                    </div>

                </form>
            </div>
        </div>
    );
}