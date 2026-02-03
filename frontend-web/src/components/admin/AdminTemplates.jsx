import { useState, useEffect } from 'react';
import axios from 'axios';

export default function AdminTemplates() {
    const [templates, setTemplates] = useState([]);
    const [showForm, setShowForm] = useState(false);
    
    // State cho form thêm mới
    const [formData, setFormData] = useState({
        name: '',
        html_content: '',
        thumbnail: null
    });
    const [isSaving, setIsSaving] = useState(false);

    // 1. Lấy danh sách template khi vào trang
    useEffect(() => {
        fetchTemplates();
    }, []);

    const fetchTemplates = async () => {
        try {
            const token = localStorage.getItem('accessToken');  // ✅ Lấy token
            const res = await axios.get('http://127.0.0.1:8000/editor/admin/templates/', {
                headers: { Authorization: `Token ${token}` }  // ✅ Gửi token
            });
            setTemplates(res.data);
        } catch (err) {
            console.error("Lỗi tải template:", err);
        }
    };

    // 2. Xử lý khi chọn file ảnh
    const handleFileChange = (e) => {
        setFormData({ ...formData, thumbnail: e.target.files[0] });
    };

    // 3. Hàm LƯU TEMPLATE (Save)
    const handleSave = async (e) => {
        e.preventDefault(); // Chặn reload trang
        
        if (!formData.name || !formData.html_content) {
            alert("Vui lòng nhập Tên và Nội dung HTML!");
            return;
        }

        setIsSaving(true);
        const token = localStorage.getItem('accessToken');

        // Tạo FormData để gửi cả file ảnh + text
        const data = new FormData();
        data.append('name', formData.name);
        data.append('html_content', formData.html_content);
        if (formData.thumbnail) {
            data.append('thumbnail', formData.thumbnail);
        }

        try {
            // Gọi API POST tạo mới
            await axios.post('http://127.0.0.1:8000/editor/admin/templates/', data, {  // ✅ FIXED: /editor/admin/templates/
                headers: { 
                    'Authorization': `Token ${token}`,
                    'Content-Type': 'multipart/form-data'
                }
            });

            alert("✅ Lưu template thành công!");
            setShowForm(false); // Đóng form
            setFormData({ name: '', html_content: '', thumbnail: null }); // Reset form
            fetchTemplates(); // Tải lại danh sách mới
        } catch (err) {
            console.error(err);
            alert("❌ Lỗi khi lưu: " + (err.response?.data?.error || "Vui lòng thử lại"));
        } finally {
            setIsSaving(false);
        }
    };

    // 4. Hàm Xóa
    const handleDelete = async (id) => {
        if(!window.confirm("Bạn chắc chắn muốn xóa mẫu này chứ?")) return;
        const token = localStorage.getItem('accessToken');
        try {
            await axios.delete(`http://127.0.0.1:8000/editor/admin/templates/${id}/`, {  // ✅ FIXED: /editor/admin/templates/
                headers: { Authorization: `Token ${token}` }
            });
            setTemplates(templates.filter(t => t.id !== id));
        } catch (err) { alert("Lỗi xóa: " + err.message); }
    };

    return (
        <div className="bg-white p-6 rounded shadow">
            <div className="flex justify-between items-center mb-6">
                <h3 className="font-bold text-xl text-gray-800">Quản lý Mẫu CV</h3>
                <button 
                    onClick={() => setShowForm(!showForm)} 
                    className="bg-[#C04B59] text-white px-4 py-2 rounded font-bold hover:bg-rose-700 transition"
                >
                    {showForm ? 'Đóng Form' : '+ Thêm Mẫu Mới'}
                </button>
            </div>

            {/* FORM THÊM MỚI (Hiện ra khi bấm nút) */}
            {showForm && (
                <div className="mb-8 p-6 border-2 border-dashed border-gray-300 rounded-lg bg-gray-50 animate-fade-in-down">
                    <h4 className="font-bold text-lg mb-4 text-[#3D4A7E]">Thêm Template Mới</h4>
                    <form onSubmit={handleSave} className="space-y-4">
                        
                        {/* Tên mẫu */}
                        <div>
                            <label className="block text-sm font-bold mb-1">Tên mẫu:</label>
                            <input 
                                className="border p-2 w-full rounded focus:outline-none focus:ring-2 focus:ring-blue-400" 
                                placeholder="Ví dụ: Modern Blue, Professional..." 
                                value={formData.name}
                                onChange={e => setFormData({...formData, name: e.target.value})}
                            />
                        </div>

                        {/* Upload Thumbnail */}
                        <div>
                            <label className="block text-sm font-bold mb-1">Ảnh đại diện (Thumbnail):</label>
                            <input type="file" onChange={handleFileChange} className="block w-full text-sm text-gray-500 file:mr-4 file:py-2 file:px-4 file:rounded-full file:border-0 file:text-sm file:font-semibold file:bg-blue-50 file:text-blue-700 hover:file:bg-blue-100"/>
                        </div>

                        {/* HTML Content */}
                        <div>
                            <label className="block text-sm font-bold mb-1">HTML Code:</label>
                            <textarea 
                                className="border p-2 w-full h-64 rounded font-mono text-xs focus:outline-none focus:ring-2 focus:ring-blue-400 bg-white" 
                                placeholder="Dán code HTML template vào đây..."
                                value={formData.html_content}
                                onChange={e => setFormData({...formData, html_content: e.target.value})}
                            ></textarea>
                            <p className="text-xs text-gray-500 mt-1">💡 Mẹo: Copy code HTML mình vừa gửi ở trên rồi dán vào đây.</p>
                        </div>

                        {/* Nút Save */}
                        <div className="flex justify-end pt-2">
                            <button 
                                type="button" 
                                onClick={() => setShowForm(false)}
                                className="mr-3 px-4 py-2 text-gray-600 hover:text-gray-800 font-bold"
                            >
                                Hủy bỏ
                            </button>
                            <button 
                                type="submit" 
                                disabled={isSaving}
                                className="bg-green-600 text-white px-6 py-2 rounded font-bold hover:bg-green-700 transition shadow"
                            >
                                {isSaving ? <i className="fa-solid fa-spinner fa-spin mr-2"></i> : <i className="fa-solid fa-floppy-disk mr-2"></i>}
                                Lưu Template
                            </button>
                        </div>
                    </form>
                </div>
            )}

            {/* DANH SÁCH TEMPLATE */}
            <div className="grid grid-cols-1 md:grid-cols-3 lg:grid-cols-4 gap-6">
                {templates.map(t => (
                    <div key={t.id} className="border rounded-lg overflow-hidden group relative hover:shadow-lg transition bg-white">
                        <div className="h-48 bg-gray-200 flex items-center justify-center overflow-hidden">
                            {t.thumbnail ? (
                                <img src={t.thumbnail} alt={t.name} className="w-full h-full object-cover object-top hover:scale-105 transition duration-500"/>
                            ) : (
                                <div className="text-gray-400 flex flex-col items-center">
                                    <i className="fa-regular fa-image text-3xl mb-2"></i>
                                    <span className="text-xs">Chưa có ảnh</span>
                                </div>
                            )}
                        </div>
                        <div className="p-3 border-t">
                            <h4 className="font-bold text-gray-800 truncate">{t.name}</h4>
                            <p className="text-xs text-gray-500">ID: {t.id}</p>
                        </div>
                        
                        {/* Nút Xóa (Chỉ hiện khi hover) */}
                        <button 
                            onClick={() => handleDelete(t.id)} 
                            className="absolute top-2 right-2 bg-red-600 text-white w-8 h-8 rounded-full opacity-0 group-hover:opacity-100 transition shadow hover:bg-red-700 flex items-center justify-center"
                            title="Xóa mẫu này"
                        >
                            <i className="fa-solid fa-trash-can text-sm"></i>
                        </button>
                    </div>
                ))}
            </div>
            
            {templates.length === 0 && !showForm && (
                <div className="text-center py-10 text-gray-500">
                    <p>Chưa có mẫu CV nào. Hãy bấm nút "Thêm Mẫu Mới" ở trên!</p>
                </div>
            )}
        </div>
    );
}