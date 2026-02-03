import { useState, useRef, useEffect } from 'react';
import axios from 'axios';

export default function ChatBot() {
    const [isOpen, setIsOpen] = useState(false);
    const [messages, setMessages] = useState([
        { sender: 'bot', text: 'Chào bạn! Mình đã đọc CV của bạn rồi. Bạn muốn hỏi gì không?' }
    ]);
    const [input, setInput] = useState('');
    const [isLoading, setIsLoading] = useState(false);
    const messagesEndRef = useRef(null);

    // Tự động cuộn xuống khi có tin nhắn mới
    useEffect(() => {
        messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
    }, [messages]);

    const handleSend = async () => {
        if (!input.trim()) return;

        // 1. Hiện tin nhắn user
        const userMsg = input;
        setMessages(prev => [...prev, { sender: 'user', text: userMsg }]);
        setInput('');
        setIsLoading(true);

        try {
            const token = localStorage.getItem('accessToken');
            // 2. Gửi lên Backend
            const res = await axios.post('http://127.0.0.1:8000/ai/api/chat/', 
                { message: userMsg },
                { headers: { Authorization: `Token ${token}` } }
            );

            // 3. Hiện câu trả lời
            setMessages(prev => [...prev, { sender: 'bot', text: res.data.reply }]);
        } catch (error) {
            setMessages(prev => [...prev, { sender: 'bot', text: "Lỗi: Bạn đã đăng nhập và Upload CV chưa?" }]);
        } finally {
            setIsLoading(false);
        }
    };

    return (
        <div className="fixed bottom-6 right-6 z-50 flex flex-col items-end font-sans">
            
            {/* CỬA SỔ CHAT */}
            {isOpen && (
                <div className="bg-white w-80 h-96 rounded-2xl shadow-2xl border flex flex-col mb-4 overflow-hidden animate-fade-in-up">
                    {/* Header */}
                    <div className="bg-[#3D4A7E] text-white p-4 font-bold flex justify-between items-center">
                        <div className="flex items-center gap-2">
                            <span className="text-xl">🤖</span>
                            <span>AI Career Coach</span>
                        </div>
                        <button onClick={() => setIsOpen(false)} className="hover:text-gray-300">✕</button>
                    </div>

                    {/* Body */}
                    <div className="flex-1 p-4 overflow-y-auto bg-gray-50 space-y-3">
                        {messages.map((m, i) => (
                            <div key={i} className={`flex ${m.sender === 'user' ? 'justify-end' : 'justify-start'}`}>
                                <div className={`max-w-[85%] p-3 rounded-xl text-sm ${
                                    m.sender === 'user' 
                                    ? 'bg-[#C04B59] text-white rounded-tr-none' 
                                    : 'bg-white border text-gray-800 rounded-tl-none shadow-sm'
                                }`}>
                                    {m.text}
                                </div>
                            </div>
                        ))}
                        {isLoading && <div className="text-xs text-gray-500 italic ml-2">AI đang nhập...</div>}
                        <div ref={messagesEndRef} />
                    </div>

                    {/* Input */}
                    <div className="p-3 border-t bg-white flex gap-2">
                        <input 
                            className="flex-1 bg-gray-100 rounded-full px-4 outline-none text-sm focus:ring-1 focus:ring-[#3D4A7E]"
                            placeholder="Hỏi về CV của bạn..."
                            value={input}
                            onChange={(e) => setInput(e.target.value)}
                            onKeyPress={(e) => e.key === 'Enter' && handleSend()}
                        />
                        <button onClick={handleSend} className="w-10 h-10 bg-[#3D4A7E] text-white rounded-full hover:bg-opacity-90 flex items-center justify-center">
                            <i className="fa-solid fa-paper-plane"></i>
                        </button>
                    </div>
                </div>
            )}

            {/* NÚT MỞ CHAT TRÒN */}
            <button 
                onClick={() => setIsOpen(!isOpen)}
                className="w-14 h-14 bg-[#C04B59] rounded-full text-white text-2xl shadow-lg hover:scale-110 transition flex items-center justify-center animate-bounce-slow"
            >
                {isOpen ? <i className="fa-solid fa-chevron-down"></i> : <i className="fa-solid fa-comment-dots"></i>}
            </button>
        </div>
    );
}