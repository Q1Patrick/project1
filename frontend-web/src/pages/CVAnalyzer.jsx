import Navbar from '../components/Navbar';
import { useState } from 'react';
import axios from 'axios';

export default function CVAnalyzer() {
    const [file, setFile] = useState(null);
    const [isAnalyzing, setIsAnalyzing] = useState(false);
    const [result, setResult] = useState(null);

    const handleFileChange = (e) => {
        setFile(e.target.files[0]);
        setResult(null);
    };

    const handleAnalyze = async () => {
        if (!file) return;
        setIsAnalyzing(true);
        setResult(null);

        const formData = new FormData();
        formData.append('file', file);

        try {
            const token = localStorage.getItem('accessToken');
            if (!token) {
                alert("Bạn cần đăng nhập để sử dụng tính năng này!");
                return;
            }

            const response = await axios.post('http://127.0.0.1:8000/ai/analyze/', formData, {
                headers: {
                    'Content-Type': 'multipart/form-data',
                    'Authorization': `Token ${token}`
                }
            });

            console.log("=== KẾT QUẢ BACKEND ===", response.data); // Log để kiểm tra
            setResult(response.data);

        } catch (error) {
            console.error("Lỗi phân tích:", error);
            alert("Có lỗi xảy ra khi phân tích CV. Vui lòng thử lại!");
        } finally {
            setIsAnalyzing(false);
        }
    };

    return (
        <div className="bg-gray-50 min-h-screen font-sans">
            <Navbar />

            <div className="max-w-7xl mx-auto px-6 py-10">
                <div className="text-center mb-10">
                    <h1 className="text-3xl font-bold text-[#3D4A7E]">AI CV Analyzer <span className="text-4xl">🚀</span></h1>
                    <p className="text-gray-500 mt-2">Tải CV của bạn lên để AI chấm điểm và gợi ý sửa lỗi trong vài giây.</p>
                </div>

                <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
                    
                    {/* CỘT TRÁI: UPLOAD FILE */}
                    <div className="lg:col-span-5 space-y-6">
                        <div className="bg-white p-8 rounded-xl shadow-sm border border-gray-200">
                            <label className="flex flex-col items-center justify-center w-full h-64 border-2 border-dashed border-gray-300 rounded-lg cursor-pointer bg-gray-50 hover:bg-gray-100 transition">
                                <div className="flex flex-col items-center justify-center pt-5 pb-6">
                                    <i className="fa-solid fa-cloud-arrow-up text-4xl text-[#C04B59] mb-4 opacity-80"></i>
                                    <p className="mb-2 text-sm text-gray-500 font-bold">Click to upload or drag and drop</p>
                                    <p className="text-xs text-gray-400">PDF, DOCX (Max 5MB)</p>
                                </div>
                                <input type="file" className="hidden" onChange={handleFileChange} accept=".pdf,.docx" />
                            </label>
                            
                            {file && (
                                <div className="mt-4 flex items-center p-3 bg-blue-50 rounded border border-blue-100 text-[#3D4A7E]">
                                    <i className="fa-regular fa-file-pdf text-xl mr-3"></i>
                                    <span className="text-sm font-bold truncate">{file.name}</span>
                                    <i className="fa-solid fa-circle-check text-green-500 ml-auto"></i>
                                </div>
                            )}

                            <button 
                                onClick={handleAnalyze}
                                disabled={!file || isAnalyzing}
                                className={`w-full mt-6 py-3 rounded-lg font-bold text-white shadow transition
                                    ${!file || isAnalyzing ? 'bg-gray-400 cursor-not-allowed' : 'bg-[#C04B59] hover:bg-opacity-90'}
                                `}
                            >
                                {isAnalyzing ? (
                                    <span><i className="fa-solid fa-spinner fa-spin mr-2"></i> Đang phân tích...</span>
                                ) : "PHÂN TÍCH NGAY"}
                            </button>
                        </div>
                    </div>
                
                    
                    {/* CỘT PHẢI: KẾT QUẢ */}
                    <div className="lg:col-span-7">
                        {!result ? (
                            <div className="h-full bg-white rounded-xl shadow-sm border border-gray-200 flex flex-col items-center justify-center p-10 text-center min-h-[400px]">
                                <div className="w-20 h-20 bg-gray-100 rounded-full flex items-center justify-center mb-4">
                                    <i className="fa-solid fa-robot text-3xl text-gray-400"></i>
                                </div>
                                <h3 className="text-xl font-bold text-gray-400">Kết quả phân tích sẽ hiện ở đây</h3>
                            </div>
                        ) : (
                            <div className="bg-white rounded-xl shadow-lg border border-gray-100 overflow-hidden animate-fade-in-up">
                                <div className="bg-[#3D4A7E] p-6 text-white flex justify-between items-center">
                                    <div>
                                        <h2 className="text-xl font-bold">Kết quả đánh giá</h2>
                                        <p className="text-sm opacity-80">Dựa trên tiêu chuẩn ATS mới nhất</p>
                                    </div>
                                    <div className="flex flex-col items-center bg-white text-[#3D4A7E] w-16 h-16 rounded-full justify-center font-bold shadow-lg">
                                        <span className="text-xl">{result.score || 0}</span>
                                        <span className="text-[8px] uppercase">Điểm</span>
                                    </div>
                                </div>

                                <div className="p-6 space-y-6">
                                    {/* Nhận xét chung */}
                                    <div>
                                        <h3 className="font-bold text-gray-800 mb-2 border-l-4 border-[#C04B59] pl-3">Nhận xét chung</h3>
                                        <p className="text-gray-600 text-sm bg-gray-50 p-3 rounded">
                                            {result.summary || "Không có nhận xét."}
                                        </p>
                                    </div>

                                    <div className="grid grid-cols-2 gap-6">
                                        {/* Điểm mạnh */}
                                        <div>
                                            <h3 className="font-bold text-green-600 mb-2 text-sm"><i className="fa-solid fa-check-circle mr-1"></i> Điểm mạnh</h3>
                                            <div className="flex flex-col gap-2">
                                                {/* Dùng || [] để tránh lỗi map null */}
                                                {(result.strengths || []).map((item, index) => (
                                                    <span key={index} className="px-2 py-1 bg-green-50 text-green-700 text-xs rounded font-bold border border-green-100">
                                                        • {item}
                                                    </span>
                                                ))}
                                            </div>
                                        </div>
                                        {/* Điểm yếu */}
                                        <div>
                                            <h3 className="font-bold text-red-500 mb-2 text-sm"><i className="fa-solid fa-triangle-exclamation mr-1"></i> Cần cải thiện</h3>
                                            <div className="flex flex-col gap-2">
                                                {(result.weaknesses || []).map((item, index) => (
                                                    <span key={index} className="px-2 py-1 bg-red-50 text-red-600 text-xs rounded font-bold border border-red-100">
                                                        • {item}
                                                    </span>
                                                ))}
                                            </div>
                                        </div>
                                    </div>

                                    <div>
                                        <h3 className="font-bold text-gray-800 mb-2 border-l-4 border-yellow-400 pl-3">Đề xuất cải thiện</h3>
                                        {/* Thay vì .map(), ta hiển thị trực tiếp vì backend trả về chuỗi văn bản */}
                                        <div className="text-sm text-gray-600 bg-yellow-50 p-4 rounded border border-yellow-100 whitespace-pre-line">
                                            {result.suggestion || "Không có đề xuất cụ thể."}
                                        </div>
                                    </div>
                                    {/* ----------------------- */}

                                    <div className="pt-4 text-center">
                                        <button className="text-[#3D4A7E] font-bold text-sm hover:underline">
                                            <i className="fa-solid fa-download mr-1"></i> Tải báo cáo chi tiết (PDF)
                                        </button>
                                    </div>
                                </div>
                            </div>
                        )}
                    </div>
                </div>
            </div>
        </div>
    );
}