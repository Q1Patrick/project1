import { useState, useEffect } from 'react';
import axios from 'axios';
import Navbar from '../components/Navbar';
import { useNavigate } from 'react-router-dom';

export default function CareerQuiz() {
    const navigate = useNavigate();

    // State quản lý
    const [questions, setQuestions] = useState([]);
    const [currentStep, setCurrentStep] = useState(0);
    const [userAnswers, setUserAnswers] = useState([]);
    const [result, setResult] = useState(null); // Kết quả sau khi submit
    const [loading, setLoading] = useState(true);

    // 1. Lấy bộ câu hỏi từ Backend khi vào trang
    useEffect(() => {
        const fetchQuestions = async () => {
            try {
                // Gọi vào API Django bạn vừa tạo
                const res = await axios.get('http://127.0.0.1:8000/api/assessment/questions/');
                setQuestions(res.data);
            } catch (err) {
                console.error("Lỗi tải câu hỏi:", err);
                alert("Không thể tải bộ câu hỏi. Vui lòng thử lại sau.");
            } finally {
                setLoading(false);
            }
        };
        fetchQuestions();
    }, []);

    // 2. Xử lý khi người dùng chọn đáp án
    const handleOptionSelect = (option) => {
        // Lưu câu trả lời
        const newAnswer = {
            category: option.category,
            score: option.score,
            max_score: 5 // Giả sử max score mỗi câu là 5 (hoặc lấy từ API nếu có)
        };
        const updatedAnswers = [...userAnswers, newAnswer];
        setUserAnswers(updatedAnswers);

        // Chuyển câu tiếp theo hoặc Nộp bài
        if (currentStep < questions.length - 1) {
            setCurrentStep(currentStep + 1);
        } else {
            submitQuiz(updatedAnswers);
        }
    };

    // 3. Gửi đáp án lên Backend để chấm điểm
    const submitQuiz = async (finalAnswers) => {
        setLoading(true);
        const token = localStorage.getItem('accessToken'); // Nếu cần đăng nhập
        try {
            const res = await axios.post('http://127.0.0.1:8000/api/assessment/submit/', 
                { answers: finalAnswers },
                { headers: { Authorization: `Token ${token}` } } // Bỏ dòng này nếu API public
            );
            setResult(res.data); // Lưu kết quả trả về (analysis + recommendations)
        } catch (err) {
            console.error("Lỗi nộp bài:", err);
            alert("Có lỗi khi phân tích kết quả.");
        } finally {
            setLoading(false);
        }
    };

    // --- RENDER GIAO DIỆN ---

    if (loading) return (
        <div className="min-h-screen flex flex-col bg-gray-50">
            <Navbar />
            <div className="flex-1 flex items-center justify-center">
                <div className="text-[#3D4A7E] font-bold text-xl animate-pulse">
                    <i className="fa-solid fa-brain mr-2"></i>
                    Đang phân tích dữ liệu...
                </div>
            </div>
        </div>
    );

    // MÀN HÌNH KẾT QUẢ (Sau khi nộp)
    if (result) {
        return (
            <div className="min-h-screen bg-gray-50">
                <Navbar />
                <div className="max-w-4xl mx-auto p-6">
                    <div className="bg-white rounded-xl shadow-lg p-8 animate-fade-in-up">
                        <div className="text-center mb-10">
                            <h1 className="text-3xl font-bold text-[#3D4A7E] mb-2">Kết Quả Định Hướng</h1>
                            <p className="text-gray-500">Dựa trên câu trả lời của bạn, đây là hồ sơ năng lực và gợi ý nghề nghiệp.</p>
                        </div>

                        <div className="grid grid-cols-1 md:grid-cols-2 gap-10">
                            {/* CỘT TRÁI: BIỂU ĐỒ NĂNG LỰC */}
                            <div>
                                <h3 className="font-bold text-lg mb-4 border-l-4 border-[#C04B59] pl-3">Hồ Sơ Năng Lực</h3>
                                <div className="space-y-4">
                                    {Object.entries(result.analysis).map(([skill, score]) => (
                                        <div key={skill}>
                                            <div className="flex justify-between text-sm mb-1 uppercase font-semibold text-gray-600">
                                                <span>{skill}</span>
                                                <span>{score}%</span>
                                            </div>
                                            <div className="w-full bg-gray-200 rounded-full h-2.5">
                                                <div 
                                                    className="bg-[#3D4A7E] h-2.5 rounded-full transition-all duration-1000" 
                                                    style={{ width: `${score}%` }}
                                                ></div>
                                            </div>
                                        </div>
                                    ))}
                                </div>
                            </div>

                            {/* CỘT PHẢI: GỢI Ý NGHỀ NGHIỆP */}
                            <div>
                                <h3 className="font-bold text-lg mb-4 border-l-4 border-green-500 pl-3">Nghề Nghiệp Phù Hợp</h3>
                                <div className="space-y-4">
                                    {result.recommendations.length > 0 ? (
                                        result.recommendations.map((job, idx) => (
                                            <div key={idx} className="bg-green-50 border border-green-200 p-4 rounded-lg">
                                                <div className="font-bold text-green-800 text-lg mb-1">
                                                    <i className="fa-solid fa-briefcase mr-2"></i>
                                                    {job.role}
                                                </div>
                                                <p className="text-sm text-green-700 italic">"{job.reason}"</p>
                                            </div>
                                        ))
                                    ) : (
                                        <p className="text-gray-500 italic">Hãy thử khám phá thêm các kỹ năng khác nhé.</p>
                                    )}
                                </div>
                            </div>
                        </div>

                        <div className="mt-10 text-center">
                            <button 
                                onClick={() => navigate('/dashboard')}
                                className="bg-gray-200 text-gray-700 px-6 py-3 rounded-lg font-bold hover:bg-gray-300 mr-4"
                            >
                                Về Dashboard
                            </button>
                            <button 
                                onClick={() => window.location.reload()}
                                className="bg-[#C04B59] text-white px-6 py-3 rounded-lg font-bold hover:bg-[#a03542]"
                            >
                                Làm lại bài test
                            </button>
                        </div>
                    </div>
                </div>
            </div>
        );
    }

    // MÀN HÌNH CÂU HỎI (Đang làm bài)
    const currentQuestion = questions[currentStep];

    return (
        <div className="min-h-screen bg-gray-100 flex flex-col font-sans">
            <Navbar />
            
            <div className="flex-1 flex items-center justify-center p-4">
                <div className="bg-white w-full max-w-2xl rounded-2xl shadow-xl overflow-hidden">
                    
                    {/* Progress Bar */}
                    <div className="bg-gray-200 h-2 w-full">
                        <div 
                            className="bg-[#C04B59] h-2 transition-all duration-500"
                            style={{ width: `${((currentStep + 1) / questions.length) * 100}%` }}
                        ></div>
                    </div>

                    <div className="p-8 md:p-12">
                        {/* Header câu hỏi */}
                        <div className="mb-8">
                            <span className="text-sm font-bold text-gray-400 uppercase tracking-widest">
                                Câu hỏi {currentStep + 1} / {questions.length}
                            </span>
                            <h2 className="text-2xl md:text-3xl font-bold text-[#3D4A7E] mt-3 leading-tight">
                                {currentQuestion?.question}
                            </h2>
                        </div>

                        {/* Danh sách đáp án */}
                        <div className="space-y-4">
                            {currentQuestion?.options.map((option, index) => (
                                <button
                                    key={index}
                                    onClick={() => handleOptionSelect(option)}
                                    className="w-full text-left p-4 md:p-5 border-2 border-gray-100 rounded-xl hover:border-[#3D4A7E] hover:bg-blue-50 transition-all group flex items-center"
                                >
                                    <div className="w-8 h-8 rounded-full bg-gray-200 text-gray-600 flex items-center justify-center font-bold mr-4 group-hover:bg-[#3D4A7E] group-hover:text-white transition">
                                        {String.fromCharCode(65 + index)}
                                    </div>
                                    <span className="text-lg text-gray-700 font-medium group-hover:text-[#3D4A7E]">
                                        {option.text}
                                    </span>
                                </button>
                            ))}
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
}