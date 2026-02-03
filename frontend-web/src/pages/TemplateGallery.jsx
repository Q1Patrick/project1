import { useState, useEffect } from 'react';
import Navbar from '../components/Navbar';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';

export default function TemplateGallery() {
    const [templates, setTemplates] = useState([]);
    const [isLoading, setIsLoading] = useState(false); // Loading khi bấm nút tạo
    const navigate = useNavigate();

    // 1. Lấy danh sách mẫu từ Backend
    useEffect(() => {
        const fetchTemplates = async () => {
            try {
                const res = await axios.get('http://127.0.0.1:8000/editor/templates/');
                setTemplates(res.data);
            } catch (error) {
                console.error("Lỗi lấy mẫu:", error);
            }
        };
        fetchTemplates();
    }, []);

    // 2. Hàm xử lý khi bấm "Dùng mẫu này"
    const handleUseTemplate = async (templateId) => {
        const token = localStorage.getItem('accessToken');
        
        if (!token) {
            alert("Bạn cần đăng nhập để tạo CV!");
            navigate('/login');
            return;
        }

        setIsLoading(true);
        try {
            // Gọi API tạo CV Nháp (Logic cũ bạn đã có)
            const res = await axios.post(
                'http://127.0.0.1:8000/editor/cvs/', 
                { template_id: templateId }, 
                { headers: { Authorization: `Token ${token}` } }
            );

            // Tạo xong -> Chuyển hướng sang trang Editor để sửa ngay
            const newCvId = res.data.id;
            navigate(`/editor/${newCvId}`);

        } catch (error) {
            console.error(error);
            alert("Có lỗi khi khởi tạo CV.");
        } finally {
            setIsLoading(false);
        }
    };

    return (
        <div className="bg-gray-50 min-h-screen font-sans">
            <Navbar />
            
            <div className="max-w-7xl mx-auto px-4 py-16">
                <div className="text-center mb-12">
                    <h1 className="text-4xl font-bold text-[#3D4A7E] mb-4">Thư viện Mẫu CV Chuyên nghiệp</h1>
                    <p className="text-gray-500">Chọn một mẫu ưng ý và bắt đầu chỉnh sửa chỉ trong vài giây.</p>
                </div>

                {/* Grid hiển thị các mẫu */}
                <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
                    {templates.map((tpl) => (
                        <div key={tpl.id} className="bg-white rounded-xl shadow-md overflow-hidden hover:shadow-xl transition group">
                            {/* Khung ảnh Thumbnail */}
                            <div className="h-64 bg-gray-200 relative overflow-hidden">
                                {tpl.thumbnail ? (
                                    <img src={tpl.thumbnail} alt={tpl.name} className="w-full h-full object-cover object-top transition duration-500 group-hover:scale-105" />
                                ) : (
                                    <div className="w-full h-full flex items-center justify-center text-gray-400">
                                        <span className="text-4xl"><i className="fa-regular fa-file-lines"></i></span>
                                    </div>
                                )}
                                
                                {/* Overlay hiện ra khi hover */}
                                <div className="absolute inset-0 bg-black bg-opacity-40 flex items-center justify-center opacity-0 group-hover:opacity-100 transition duration-300">
                                    <button 
                                        onClick={() => handleUseTemplate(tpl.id)}
                                        disabled={isLoading}
                                        className="bg-[#C04B59] text-white px-6 py-3 rounded-full font-bold transform translate-y-4 group-hover:translate-y-0 transition duration-300 hover:bg-[#a03542]"
                                    >
                                        {isLoading ? 'Đang tạo...' : 'Dùng mẫu này'}
                                    </button>
                                </div>
                            </div>

                            <div className="p-4 text-center">
                                <h3 className="font-bold text-gray-800">{tpl.name}</h3>
                            </div>
                        </div>
                    ))}
                </div>

                {templates.length === 0 && (
                    <div className="text-center text-gray-500 py-10">
                        <p>Chưa có mẫu nào. Admin hãy vào trang quản trị để thêm Template nhé!</p>
                    </div>
                )}
            </div>
        </div>
    );
}