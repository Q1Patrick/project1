import { useState, useEffect } from 'react';
import Navbar from '../components/Navbar';
import axios from 'axios';
import { useNavigate, useParams } from 'react-router-dom';

export default function EditJob() {
    const { id } = useParams(); // Lấy ID bài viết từ URL
    const navigate = useNavigate();
    const [isLoading, setIsLoading] = useState(true);

    // State lưu dữ liệu form
    const [formData, setFormData] = useState({
        title: '',
        company_name: '',
        location: '',
        job_type: 'Full-time',
        category: 'IT Software',
        experience: '',
        salary_range: '',
        deadline: '',
        description: '',
        requirements: '',
        benefits: '',
        logo: ''
    });

    const [tags, setTags] = useState([]);
    const [tagInput, setTagInput] = useState('');

    // 👇 1. LẤY DỮ LIỆU CŨ KHI VÀO TRANG
    useEffect(() => {
        const fetchJobDetail = async () => {
            const token = localStorage.getItem('accessToken');
            try {
                // Gọi API detail mà ta vừa tạo ở Bước 1
                const response = await axios.get(`http://127.0.0.1:8000/jobs/recruiter/${id}/`, {
                    headers: { 'Authorization': `Token ${token}` }
                });
                
                const data = response.data;
                // Đổ dữ liệu vào form
                setFormData({
                    title: data.title,
                    company_name: data.company_name,
                    location: data.location,
                    job_type: data.job_type,
                    category: data.category,
                    experience: data.experience,
                    salary_range: data.salary_range,
                    deadline: data.deadline,
                    description: data.description,
                    requirements: data.requirements,
                    benefits: data.benefits || '',
                    logo: data.logo || ''
                });

                // Xử lý tags (chuyển từ chuỗi sang mảng)
                if (data.tags) {
                    setTags(typeof data.tags === 'string' ? data.tags.split(',') : data.tags);
                }
            } catch (error) {
                console.error("Lỗi lấy thông tin job:", error);
                alert("Không tìm thấy tin tuyển dụng hoặc bạn không có quyền sửa.");
                navigate('/recruiter');
            } finally {
                setIsLoading(false);
            }
        };
        fetchJobDetail();
    }, [id, navigate]);

    const handleChange = (e) => {
        setFormData({ ...formData, [e.target.name]: e.target.value });
    };

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

    const removeTag = (indexToRemove) => {
        setTags(tags.filter((_, index) => index !== indexToRemove));
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        
        try {
            const token = localStorage.getItem('accessToken');
            const finalData = {
                ...formData,
                tags: tags.join(',') // Gộp lại thành chuỗi
            };

            // 👇 2. DÙNG PUT ĐỂ CẬP NHẬT
            await axios.put(`http://127.0.0.1:8000/jobs/recruiter/${id}/`, finalData, {
                headers: { 'Authorization': `Token ${token}` }
            });

            alert("Cập nhật tin tuyển dụng thành công!");
            navigate('/recruiter');
        } catch (error) {
            console.error("Lỗi cập nhật:", error);
            alert("Có lỗi xảy ra khi cập nhật.");
        }
    };

    if (isLoading) return <div className="text-center py-20">Đang tải dữ liệu...</div>;

    return (
        <div className="bg-gray-50 min-h-screen font-sans text-gray-800">
            <Navbar />
            <div className="max-w-5xl mx-auto px-4 py-10">
                <div className="text-center mb-10">
                    <h1 className="text-3xl font-bold text-[#3D4A7E]">Chỉnh Sửa Tin Tuyển Dụng</h1>
                    <p className="text-gray-500 mt-2">Cập nhật thông tin để thu hút ứng viên tốt hơn.</p>
                </div>

                {/* --- Form y hệt PostJob --- */}
                <form onSubmit={handleSubmit} className="grid grid-cols-1 md:grid-cols-3 gap-8">
                    {/* Bạn copy y nguyên phần nội dung Form từ PostJob.jsx qua đây là được */}
                    {/* Hoặc để mình viết tóm tắt phần cấu trúc, bạn copy nội dung các thẻ input qua nhé vì nó giống hệt */}
                    
                    {/* ... COPY NỘI DUNG FORM TỪ PostJob.jsx QUA ... */}
                    {/* ... CHỈ KHÁC NÚT SUBMIT GHI LÀ "LƯU THAY ĐỔI" ... */}
                    
                    {/* Ví dụ nút Submit: */}
                     <div className="md:col-span-3"> {/* Tạm thời để nút ở ngoài hoặc trong cột phải tùy bạn */}
                        {/* Mình khuyên nên copy nguyên cấu trúc 2 cột của PostJob để giao diện đẹp */}
                    </div>
                </form>

                 {/* 👇 ĐÂY LÀ FORM ĐẦY ĐỦ MÌNH VIẾT LẠI CHO BẠN LUÔN CHO NHANH 👇 */}
                <form onSubmit={handleSubmit} className="grid grid-cols-1 md:grid-cols-3 gap-8">
                    {/* CỘT TRÁI */}
                    <div className="md:col-span-1 space-y-6">
                        <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-200">
                            <h3 className="font-bold text-[#3D4A7E] mb-4 border-b pb-2">Thông tin chung</h3>
                            <div className="space-y-4">
                                <div><label className="block text-sm font-bold mb-1">Tiêu đề</label><input required name="title" value={formData.title} onChange={handleChange} className="w-full border rounded p-2" /></div>
                                <div><label className="block text-sm font-bold mb-1">Ngành nghề</label><select name="category" value={formData.category} onChange={handleChange} className="w-full border rounded p-2"><option>IT Software</option><option>Marketing</option></select></div>
                                <div><label className="block text-sm font-bold mb-1">Hình thức</label><select name="job_type" value={formData.job_type} onChange={handleChange} className="w-full border rounded p-2"><option>Full-time</option><option>Part-time</option></select></div>
                                <div><label className="block text-sm font-bold mb-1">Kinh nghiệm</label><select name="experience" value={formData.experience} onChange={handleChange} className="w-full border rounded p-2"><option>Không yêu cầu</option><option>1 - 3 năm</option></select></div>
                                <div><label className="block text-sm font-bold mb-1">Địa điểm</label><select name="location" value={formData.location} onChange={handleChange} className="w-full border rounded p-2"><option>Ho Chi Minh</option><option>Ha Noi</option><option>Da Nang</option><option>Remote</option></select></div>
                                <div><label className="block text-sm font-bold mb-1">Lương</label><input required name="salary_range" value={formData.salary_range} onChange={handleChange} className="w-full border rounded p-2" /></div>
                                <div><label className="block text-sm font-bold mb-1">Hạn nộp</label><input type="date" name="deadline" value={formData.deadline} onChange={handleChange} className="w-full border rounded p-2" /></div>
                            </div>
                        </div>
                        <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-200">
                             <h3 className="font-bold text-[#3D4A7E] mb-4 border-b pb-2">Công ty</h3>
                             <div className="space-y-4">
                                <div><label className="block text-sm font-bold mb-1">Tên công ty</label><input required name="company_name" value={formData.company_name} onChange={handleChange} className="w-full border rounded p-2" /></div>
                                <div><label className="block text-sm font-bold mb-1">Logo URL</label><input name="logo" value={formData.logo} onChange={handleChange} className="w-full border rounded p-2" /></div>
                             </div>
                        </div>
                    </div>

                    {/* CỘT PHẢI */}
                    <div className="md:col-span-2 space-y-6">
                        <div className="bg-white p-8 rounded-xl shadow-sm border border-gray-200">
                            <div className="mb-4"><label className="block font-bold mb-2">Mô tả (JD)</label><textarea required name="description" value={formData.description} onChange={handleChange} rows="6" className="w-full border rounded p-3 bg-gray-50"></textarea></div>
                            <div className="mb-4"><label className="block font-bold mb-2">Yêu cầu</label><textarea required name="requirements" value={formData.requirements} onChange={handleChange} rows="5" className="w-full border rounded p-3 bg-gray-50"></textarea></div>
                            <div className="mb-4"><label className="block font-bold mb-2">Quyền lợi</label><textarea name="benefits" value={formData.benefits} onChange={handleChange} rows="4" className="w-full border rounded p-3 bg-gray-50"></textarea></div>
                            
                            <div className="mb-8">
                                <label className="block font-bold mb-2">Kỹ năng (Tags)</label>
                                <div className="border rounded p-3 flex flex-wrap gap-2 bg-white">
                                    {tags.map((tag, i) => (<span key={i} className="bg-blue-100 px-2 rounded-full text-sm font-bold flex items-center">{tag}<button type="button" onClick={() => removeTag(i)} className="ml-2 text-red-500">x</button></span>))}
                                    <input value={tagInput} onChange={(e)=>setTagInput(e.target.value)} onKeyDown={handleTagKeyDown} placeholder="Thêm kỹ năng..." className="outline-none flex-grow" />
                                </div>
                            </div>

                            <button type="submit" className="w-full bg-[#C04B59] text-white py-4 rounded-xl font-bold text-lg hover:bg-[#a03542] transition shadow-lg">
                                <i className="fa-solid fa-save mr-2"></i> LƯU THAY ĐỔI
                            </button>
                        </div>
                    </div>
                </form>
            </div>
        </div>
    );
}