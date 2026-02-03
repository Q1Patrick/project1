import { useState, useEffect, useRef } from 'react';
import axios from 'axios';
import { Link } from 'react-router-dom'; // 👈 Import thêm Link để làm nút Back

export default function CareerRoadmap() {
    const [messages, setMessages] = useState([
        { role: 'bot', content: "Chào bạn! 👋 Tôi là AI Career Coach của bạn. Dựa trên CV bạn đã tải lên, tôi có thể giúp bạn lên lộ trình học tập, luyện phỏng vấn hoặc gợi ý dự án. Bạn muốn bắt đầu từ đâu?" }
    ]);
    const [input, setInput] = useState('');
    const [isLoading, setIsLoading] = useState(false);
    
    const messagesEndRef = useRef(null);
    const scrollToBottom = () => {
        messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
    };
    useEffect(scrollToBottom, [messages]);

    const handleSend = async (e) => {
        e.preventDefault();
        if (!input.trim()) return;

        const userMessage = { role: 'user', content: input };
        setMessages(prev => [...prev, userMessage]);
        setInput('');
        setIsLoading(true);

        try {
            const token = localStorage.getItem('accessToken');
            if (!token) {
                setMessages(prev => [...prev, { role: 'bot', content: "⚠️ Bạn cần đăng nhập để chat với Coach." }]);
                return;
            }

            const response = await axios.post('http://127.0.0.1:8000/ai/chat/', {
                message: userMessage.content
            }, {
                headers: { 'Authorization': `Token ${token}` }
            });

            const botReply = response.data.reply;
            setMessages(prev => [...prev, { role: 'bot', content: botReply }]);

        } catch (error) {
            console.error("Lỗi chat:", error);
            let errorMsg = "Xin lỗi, có lỗi kết nối. Vui lòng thử lại.";
            if (error.response && error.response.data && error.response.data.reply) {
                 errorMsg = error.response.data.reply;
            }
            setMessages(prev => [...prev, { role: 'bot', content: "⚠️ " + errorMsg }]);
        } finally {
            setIsLoading(false);
        }
    };

    return (
        // 👇 Thay min-h-screen bằng h-screen để cố định chiều cao, không bị cuộn cả trang
        <div className="bg-gray-50 h-screen font-sans flex justify-center bg-gradient-to-br from-gray-50 to-gray-100">
            
            {/* Không còn Navbar ở đây nữa */}

            <div className="w-full max-w-5xl h-full flex flex-col shadow-2xl bg-white md:rounded-xl md:my-4 md:h-[95vh] overflow-hidden border border-gray-200">
                
                {/* --- HEADER MỚI (Gọn gàng hơn) --- */}
                <div className="bg-white p-4 border-b flex items-center justify-between shadow-sm z-10">
                    <div className="flex items-center">
                        {/* Nút Quay lại Trang chủ */}
                        <Link to="/" className="mr-4 w-10 h-10 rounded-full hover:bg-gray-100 flex items-center justify-center text-gray-500 transition" title="Về trang chủ">
                            <i className="fa-solid fa-arrow-left text-lg"></i>
                        </Link>

                        {/* Avatar Bot */}
                        <div className="w-10 h-10 rounded-full bg-gradient-to-r from-[#3D4A7E] to-[#C04B59] flex items-center justify-center text-white font-bold shadow-md mr-3">
                            <i className="fa-solid fa-robot"></i>
                        </div>
                        
                        <div>
                            <h1 className="font-bold text-[#3D4A7E] text-lg leading-tight">Career Coach</h1>
                            <div className="flex items-center text-xs text-green-600 font-semibold">
                                <span className="w-2 h-2 bg-green-500 rounded-full mr-1 animate-pulse"></span>
                                Always Active
                            </div>
                        </div>
                    </div>

                    <button 
                        onClick={() => setMessages([])} 
                        className="text-gray-400 hover:text-red-500 text-sm px-3 py-2 rounded hover:bg-red-50 transition"
                        title="Xóa cuộc trò chuyện"
                    >
                        <i className="fa-solid fa-trash-can mr-1"></i> Clear
                    </button>
                </div>

                {/* --- VÙNG CHAT (Tự động co giãn) --- */}
                <div className="flex-grow p-4 md:p-8 overflow-y-auto space-y-6 bg-[#F9FAFB]">
                    {messages.map((msg, index) => (
                        <div key={index} className={`flex w-full ${msg.role === 'user' ? 'justify-end' : 'justify-start'}`}>
                            
                            {/* Avatar nhỏ bên cạnh tin nhắn Bot */}
                            {msg.role === 'bot' && (
                                <div className="flex-shrink-0 w-8 h-8 rounded-full bg-white border border-gray-200 flex items-center justify-center mr-3 mt-1 shadow-sm">
                                    <i className="fa-solid fa-robot text-xs text-[#3D4A7E]"></i>
                                </div>
                            )}
                            
                            <div className={`max-w-[85%] md:max-w-[70%] p-4 rounded-2xl text-[15px] leading-relaxed shadow-sm whitespace-pre-line
                                ${msg.role === 'user' 
                                    ? 'bg-[#3D4A7E] text-white rounded-br-none' 
                                    : 'bg-white text-gray-800 rounded-bl-none border border-gray-200'}
                            `}>
                                {msg.content}
                            </div>
                        </div>
                    ))}

                    {/* Hiệu ứng Loading */}
                    {isLoading && (
                        <div className="flex justify-start w-full animate-pulse">
                             <div className="flex-shrink-0 w-8 h-8 rounded-full bg-white border border-gray-200 flex items-center justify-center mr-3 mt-1">
                                <i className="fa-solid fa-robot text-xs text-gray-400"></i>
                            </div>
                            <div className="bg-white p-4 rounded-2xl rounded-bl-none border border-gray-200 flex space-x-2 items-center h-12 w-24 shadow-sm">
                                <div className="w-2 h-2 bg-gray-400 rounded-full animate-bounce"></div>
                                <div className="w-2 h-2 bg-gray-400 rounded-full animate-bounce delay-75"></div>
                                <div className="w-2 h-2 bg-gray-400 rounded-full animate-bounce delay-150"></div>
                            </div>
                        </div>
                    )}
                    <div ref={messagesEndRef} />
                </div>

                {/* --- VÙNG NHẬP LIỆU --- */}
                <div className="bg-white p-4 border-t z-10">
                    <form onSubmit={handleSend} className="relative max-w-4xl mx-auto flex items-center gap-3">
                        <input
                            type="text"
                            value={input}
                            onChange={(e) => setInput(e.target.value)}
                            placeholder="Nhập câu hỏi của bạn..."
                            className="flex-grow bg-gray-100 text-gray-700 rounded-full py-4 px-6 focus:outline-none focus:ring-2 focus:ring-[#3D4A7E] focus:bg-white transition shadow-inner"
                            disabled={isLoading}
                        />
                        <button 
                            type="submit" 
                            disabled={isLoading || !input.trim()}
                            className="flex-shrink-0 w-12 h-12 bg-[#3D4A7E] text-white rounded-full shadow-lg hover:bg-[#2c365e] transition flex items-center justify-center disabled:opacity-50 disabled:cursor-not-allowed transform active:scale-95"
                        >
                            <i className="fa-solid fa-paper-plane text-lg"></i>
                        </button>
                    </form>
                    <p className="text-center text-xs text-gray-400 mt-2">AI có thể mắc lỗi. Hãy kiểm chứng thông tin quan trọng.</p>
                </div>
            </div>
        </div>
    );
}