import { useState } from 'react';
import axios from 'axios';

export default function CVAnalyzer() {
    const [file, setFile] = useState(null);
    const [loading, setLoading] = useState(false);
    const [result, setResult] = useState(null);

    const handleAnalyze = async () => {
        if (!file) return alert("Chưa chọn file!");
        
        setLoading(true);
        const formData = new FormData();
        formData.append('file', file);

        try {
            const token = localStorage.getItem('accessToken');
            const res = await axios.post('http://127.0.0.1:8000/ai/api/analyze/', formData, {
                headers: {
                    'Authorization': `Token ${token}`,
                    'Content-Type': 'multipart/form-data'
                }
            });
            setResult(res.data);
        } catch (error) {
            console.error(error);
            alert("Lỗi! Kiểm tra lại Backend hoặc API Key.");
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="min-h-screen bg-gray-50 p-8 flex flex-col items-center">
            <h1 className="text-3xl font-bold text-[#3D4A7E] mb-6">AI CV Analyzer 🚀</h1>
            
            {/* Box Upload */}
            <div className="bg-white p-6 rounded-xl shadow-md w-full max-w-xl text-center">
                <input 
                    type="file" 
                    accept=".pdf"
                    onChange={(e) => setFile(e.target.files[0])}
                    className="mb-4 block w-full text-sm text-gray-500 file:mr-4 file:py-2 file:px-4 file:rounded-full file:border-0 file:text-sm file:font-semibold file:bg-blue-50 file:text-blue-700 hover:file:bg-blue-100"
                />
                <button 
                    onClick={handleAnalyze}
                    disabled={loading}
                    className={`w-full py-3 rounded font-bold text-white transition ${loading ? 'bg-gray-400' : 'bg-[#C04B59] hover:bg-rose-600'}`}
                >
                    {loading ? "AI Đang Đọc & Chấm Điểm..." : "PHÂN TÍCH NGAY"}
                </button>
            </div>

            {/* Kết quả Phân tích */}
            {result && (
                <div className="mt-8 w-full max-w-3xl animate-fade-in-up">
                    {/* Điểm số */}
                    <div className="bg-[#3D4A7E] text-white p-6 rounded-t-xl flex justify-between items-center">
                        <div>
                            <h2 className="text-xl font-bold">Kết quả đánh giá</h2>
                            <p className="text-sm opacity-80">{result.summary}</p>
                        </div>
                        <div className="text-5xl font-bold text-yellow-400">{result.score}/100</div>
                    </div>

                    {/* Chi tiết */}
                    <div className="bg-white p-6 rounded-b-xl shadow-lg grid grid-cols-1 md:grid-cols-2 gap-6">
                        <div className="bg-green-50 p-4 rounded border border-green-100">
                            <h3 className="font-bold text-green-700 mb-2">✅ Điểm mạnh</h3>
                            <ul className="list-disc list-inside text-sm text-gray-700">
                                {result.strengths?.map((s, i) => <li key={i}>{s}</li>)}
                            </ul>
                        </div>
                        <div className="bg-red-50 p-4 rounded border border-red-100">
                            <h3 className="font-bold text-red-700 mb-2">⚠️ Cần khắc phục</h3>
                            <ul className="list-disc list-inside text-sm text-gray-700">
                                {result.weaknesses?.map((w, i) => <li key={i}>{w}</li>)}
                            </ul>
                        </div>
                        <div className="col-span-1 md:col-span-2 bg-blue-50 p-4 rounded border border-blue-100">
                            <h3 className="font-bold text-blue-700 mb-2">💡 Lời khuyên từ AI Coach</h3>
                            <p className="text-sm text-gray-700 italic">"{result.suggestion}"</p>
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
}