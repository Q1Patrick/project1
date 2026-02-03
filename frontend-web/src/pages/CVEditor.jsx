import { useState, useEffect, useRef } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import axios from 'axios';
import Navbar from '../components/Navbar';

export default function CVEditor() {
    const { id } = useParams();
    const navigate = useNavigate();
    const containerRef = useRef(null);

    // State dữ liệu (Khởi tạo giá trị mặc định để tránh lỗi undefined)
    const [cvData, setCvData] = useState({
        profile: { full_name: '', email: '', phone: '', summary: '', title: '', location: '' },
        skills: [],
        experience: []
    });

    const [templates, setTemplates] = useState([]);
    const [selectedTemplate, setSelectedTemplate] = useState(null);
    const [previewHtml, setPreviewHtml] = useState('');
    const [isLoading, setIsLoading] = useState(true);
    const [isSaving, setIsSaving] = useState(false);

    // --- 1. KHỞI TẠO DỮ LIỆU (Đã sửa lỗi crash) ---
    useEffect(() => {
        const fetchData = async () => {
            try {
                // Lấy templates
                const tempRes = await axios.get('http://127.0.0.1:8000/editor/templates/');
                setTemplates(tempRes.data);

                // Lấy CV data
                const token = localStorage.getItem('accessToken');
                const cvRes = await axios.get(`http://127.0.0.1:8000/editor/cvs/${id}/`, {
                    headers: { 'Authorization': `Token ${token}` }
                });

                // 👇 FIX LỖI QUAN TRỌNG TẠI ĐÂY:
                // Kiểm tra xem dữ liệu nằm trong biến 'data' hay nằm trực tiếp
                const apiResponse = cvRes.data;
                const actualData = apiResponse.data || apiResponse; 

                // Merge dữ liệu an toàn (Dùng optional chaining ?.)
                setCvData(prev => ({ 
                    profile: { ...prev.profile, ...(actualData.profile || {}) },
                    skills: actualData.skills || [],
                    experience: actualData.experience || []
                }));
                
                // Chọn template mặc định nếu chưa chọn
                if (tempRes.data.length > 0) {
                    setSelectedTemplate(tempRes.data[0]);
                }

            } catch (error) {
                console.error("Lỗi tải dữ liệu:", error);
            } finally {
                setIsLoading(false);
            }
        };
        fetchData();
    }, [id]);

    // --- 2. RENDER HTML ---
    useEffect(() => {
        if (!selectedTemplate) return;
        renderEditableHtml();
    }, [selectedTemplate, cvData.skills.length, cvData.experience.length]); 

    const renderEditableHtml = () => {
        let html = selectedTemplate.html_content || selectedTemplate.description || '';

        const createEditable = (field, value, placeholder) => {
            return `<span 
                class="editable-field" 
                contenteditable="true" 
                data-field="${field}"
            >${value || placeholder}</span>`;
        };

        // 👇 FIX LỖI CRASH: Thêm dấu ? (Optional Chaining) vào trước .full_name, .email...
        // Để nếu cvData.profile bị null thì nó không báo lỗi mà chỉ hiện placeholder
        const profile = cvData.profile || {}; 

        html = html.replace(/\{\{profile\.full_name\}\}/g, createEditable('profile.full_name', profile.full_name, 'Họ tên của bạn'));
        html = html.replace(/\{\{profile\.title\}\}/g, createEditable('profile.title', profile.title, 'Vị trí ứng tuyển'));
        html = html.replace(/\{\{profile\.email\}\}/g, createEditable('profile.email', profile.email, 'email@example.com'));
        html = html.replace(/\{\{profile\.phone\}\}/g, createEditable('profile.phone', profile.phone, 'Số điện thoại'));
        html = html.replace(/\{\{profile\.location\}\}/g, createEditable('profile.location', profile.location, 'Địa chỉ'));
        html = html.replace(/\{\{profile\.summary\}\}/g, createEditable('profile.summary', profile.summary, 'Mô tả ngắn về bản thân...'));

        // Experience
        const experience = cvData.experience || [];
        const expHtml = experience.map((exp, idx) => `
            <div class="mb-4 pb-2 border-b border-gray-100 group relative experience-item">
                <div class="flex justify-between items-baseline">
                    <strong class="text-md">${createEditable(`experience.${idx}.company`, exp.company, 'Tên công ty')}</strong>
                    <span class="text-sm text-gray-500">
                        ${createEditable(`experience.${idx}.start`, exp.start, 'Bắt đầu')} - 
                        ${createEditable(`experience.${idx}.end`, exp.end, 'Kết thúc')}
                    </span>
                </div>
                <div class="text-blue-600 italic text-sm mb-1">${createEditable(`experience.${idx}.role`, exp.role, 'Chức vụ')}</div>
                <div class="text-sm text-gray-600">${createEditable(`experience.${idx}.description`, exp.description, 'Mô tả công việc...')}</div>
                <button onclick="window.removeItem('experience', ${idx})" class="delete-btn absolute -right-6 top-0 text-red-400 opacity-0 group-hover:opacity-100 hover:text-red-600" title="Xóa mục này">✖</button>
            </div>
        `).join('');
        html = html.replace(/\{\{experience\}\}/g, expHtml || '<div class="text-gray-400 text-sm italic">Chưa có kinh nghiệm. Nhấn "Thêm mục" bên trái.</div>');

        // Skills
        const skills = cvData.skills || [];
        const skillsHtml = skills.map((skill, idx) => `
            <span class="inline-block bg-gray-100 px-2 py-1 rounded text-xs mr-2 mb-2 group relative">
                ${createEditable(`skills.${idx}`, skill, 'Kỹ năng')}
                <button onclick="window.removeItem('skills', ${idx})" class="ml-1 text-red-400 hover:text-red-600 hidden group-hover:inline font-bold">x</button>
            </span>
        `).join('');
        html = html.replace(/\{\{skills\}\}/g, skillsHtml || '<div class="text-gray-400 text-sm italic">Chưa có kỹ năng.</div>');

        setPreviewHtml(html);
    };

    // --- 3. LOGIC CẬP NHẬT DỮ LIỆU ---
    const handleContentBlur = (e) => {
        const target = e.target;
        if (target.classList.contains('editable-field')) {
            const fieldPath = target.getAttribute('data-field'); 
            const value = target.innerText;
            updateCvDataByPath(fieldPath, value);
        }
    };

    const updateCvDataByPath = (path, value) => {
        setCvData(prev => {
            // Copy deep object để không ảnh hưởng state cũ
            const newData = JSON.parse(JSON.stringify(prev));
            const keys = path.split('.');
            let current = newData;
            
            // Duyệt qua path để tìm đúng vị trí cần sửa (vd: experience -> 0 -> company)
            for (let i = 0; i < keys.length - 1; i++) {
                if (!current[keys[i]]) current[keys[i]] = {}; // Tạo object nếu chưa có
                current = current[keys[i]];
            }
            current[keys[keys.length - 1]] = value;
            return newData;
        });
    };

    // --- 4. HÀM GLOBAL (Thêm/Xóa) ---
    useEffect(() => {
        window.removeItem = (type, index) => {
            if(!window.confirm("Xóa mục này?")) return;
            setCvData(prev => {
                const newData = { ...prev };
                if (newData[type]) {
                    newData[type] = newData[type].filter((_, i) => i !== index);
                }
                return newData;
            });
        };
        return () => { delete window.removeItem; };
    }, []);

    const addItem = (type) => {
        setCvData(prev => {
            const newData = JSON.parse(JSON.stringify(prev)); // Deep copy an toàn
            if (type === 'experience') {
                if (!newData.experience) newData.experience = [];
                newData.experience.push({ company: 'Công ty Mới', role: 'Vị trí', start: '2023', end: 'Present', description: 'Mô tả...' });
            } else if (type === 'skills') {
                if (!newData.skills) newData.skills = [];
                newData.skills.push('Kỹ năng mới');
            }
            return newData;
        });
    };

    // --- 5. LƯU & IN ---
    const handleSave = async () => {
        setIsSaving(true);
        const token = localStorage.getItem('accessToken');
        try {
            // Clone node để dọn dẹp code rác trước khi lưu
            const cleanHtml = containerRef.current.innerHTML
                .replace(/contenteditable="true"/g, '')
                .replace(/editable-field/g, '')
                .replace(/hover:.*?/g, ''); 

            await axios.patch(`http://127.0.0.1:8000/editor/cvs/${id}/`, 
                { data: cvData, html_content: cleanHtml }, 
                { headers: { 'Authorization': `Token ${token}` } }
            );
            alert("✅ Đã lưu CV!");
        } catch (error) {
            console.error(error);
            alert("Lỗi khi lưu.");
        } finally {
            setIsSaving(false);
        }
    };

    if (isLoading) return <div className="text-center py-20">Đang tải Editor...</div>;

    return (
        <div className="bg-gray-100 min-h-screen flex flex-col h-screen overflow-hidden font-sans">
            <div className="no-print">
                <Navbar />
            </div>

            {/* HEADER TOOLBAR */}
            <div className="bg-white border-b px-6 py-3 flex justify-between items-center shadow-sm z-20 no-print">
                <div className="flex items-center gap-4">
                    <button onClick={() => navigate('/dashboard')} className="text-gray-500 hover:text-black px-2">
                        <i className="fa-solid fa-arrow-left"></i>
                    </button>
                    <div>
                        <h1 className="font-bold text-lg text-[#3D4A7E]">Chỉnh sửa CV</h1>
                        <p className="text-xs text-gray-400">Chế độ chỉnh sửa trực tiếp</p>
                    </div>
                </div>
                <div className="flex gap-3">
                    <button onClick={handleSave} disabled={isSaving} className="bg-[#3D4A7E] text-white px-5 py-2 rounded shadow font-bold text-sm hover:bg-[#2c365e] flex items-center gap-2">
                        {isSaving ? <i className="fa-solid fa-spinner fa-spin"></i> : <i className="fa-solid fa-floppy-disk"></i>} Lưu CV
                    </button>
                    <button onClick={() => window.print()} className="bg-[#C04B59] text-white px-5 py-2 rounded shadow font-bold text-sm hover:bg-[#a03542] flex items-center gap-2">
                        <i className="fa-solid fa-download"></i> Tải PDF
                    </button>
                </div>
            </div>

            {/* MAIN WORKSPACE */}
            <div className="flex flex-1 overflow-hidden">
                
                {/* SIDEBAR TRÁI */}
                <div className="w-80 bg-white border-r flex flex-col shadow-lg z-10 no-print">
                    <div className="p-5 border-b">
                        <h3 className="font-bold text-gray-700 mb-3 text-sm uppercase">Mẫu CV</h3>
                        <select 
                            onChange={(e) => setSelectedTemplate(templates.find(t => t.id === Number(e.target.value)))}
                            value={selectedTemplate?.id || ''}
                            className="w-full border p-2 rounded text-sm focus:ring-2 ring-blue-500 outline-none"
                        >
                            {templates.map(t => <option key={t.id} value={t.id}>{t.name}</option>)}
                        </select>
                    </div>

                    <div className="p-5 flex-1 overflow-y-auto">
                        <h3 className="font-bold text-gray-700 mb-4 text-sm uppercase">Thêm nội dung</h3>
                        <div className="space-y-3">
                            <button onClick={() => addItem('experience')} className="w-full text-left p-3 border rounded hover:bg-blue-50 flex items-center gap-3 group transition">
                                <div className="w-8 h-8 bg-blue-100 text-blue-600 rounded-full flex items-center justify-center group-hover:bg-blue-600 group-hover:text-white transition"><i className="fa-solid fa-briefcase"></i></div>
                                <span className="text-sm font-bold text-gray-700">Thêm Kinh nghiệm</span>
                            </button>
                            <button onClick={() => addItem('skills')} className="w-full text-left p-3 border rounded hover:bg-green-50 flex items-center gap-3 group transition">
                                <div className="w-8 h-8 bg-green-100 text-green-600 rounded-full flex items-center justify-center group-hover:bg-green-600 group-hover:text-white transition"><i className="fa-solid fa-star"></i></div>
                                <span className="text-sm font-bold text-gray-700">Thêm Kỹ năng</span>
                            </button>
                        </div>
                    </div>
                </div>

                {/* EDIT AREA - VÙNG CHỈNH SỬA */}
                <div className="flex-1 bg-slate-200 overflow-y-auto p-10 flex justify-center relative print:p-0 print:bg-white">
                    {/* Đây là tờ giấy A4 */}
                    <div 
                        // w-[21cm]: Chiều rộng chuẩn A4
                        // min-h-[29.7cm]: Chiều cao chuẩn A4
                        // shadow-2xl: Đổ bóng đậm để nổi lên khỏi nền
                        // bg-white: Màu giấy trắng
                        id="cv-preview-container" 
                        ref={containerRef}
                        className="bg-white shadow-2xl w-[21cm] min-h-[29.7cm] transition-transform origin-top print:shadow-none print:w-full print:h-full print:m-0"
                        onBlur={handleContentBlur}
                        dangerouslySetInnerHTML={{ __html: previewHtml }}
                    />
                </div>
            </div>

            {/* CSS */}
            <style>{`
                /* 1. Hiệu ứng khi rê chuột vào vùng sửa được */
                .editable-field:hover {
                    background-color: #f0f9ff; /* Xanh nhạt */
                    outline: 1px dashed #3b82f6; /* Viền nét đứt xanh */
                    cursor: text;
                    border-radius: 2px;
                    min-width: 20px; /* Để nếu trống vẫn click được */
                    display: inline-block;
                }

                /* 2. Hiệu ứng khi đang gõ (Focus) */
                .editable-field:focus {
                    background-color: #fff;
                    outline: 2px solid #2563eb; /* Viền xanh đậm */
                    box-shadow: 0 0 0 4px rgba(37, 99, 235, 0.1);
                    z-index: 10;
                    position: relative;
                }

                /* 3. Style cho Placeholder (Chữ mờ hướng dẫn) */
                /* Mẹo: Bạn cần sửa logic render HTML một chút để thêm class này */
                .empty-placeholder {
                    color: #9ca3af; /* Màu xám nhạt */
                    font-style: italic;
                    background: #f3f4f6;
                    padding: 2px 5px;
                    border-radius: 4px;
                    border: 1px dashed #d1d5db;
                }

                /* 4. Ẩn các thứ "rác" UI khi in ấn */
                @media print {
                    @page { margin: 0; size: auto; }
                    body { background-color: white; }
                    .no-print, nav, header, aside { display: none !important; }
                    ::-webkit-scrollbar { display: none; }
                    #cv-preview-container {
                    box-shadow: none !important;
                    width: 100% !important;
                    margin: 0 !important;
                }
                /* Ẩn viền nét đứt khi in */
                .editable-field { outline: none !important; background: none !important; }
            }
        `}</style>
        </div>
    );
}