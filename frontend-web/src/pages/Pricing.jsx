import { useState, useEffect } from 'react';
import Navbar from '../components/Navbar';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';

export default function Pricing() {
    const [plans, setPlans] = useState([]);
    const [isLoading, setIsLoading] = useState(true);
    const navigate = useNavigate();

    // Lấy thông tin user để biết đã đăng nhập chưa
    const token = localStorage.getItem('accessToken');

    useEffect(() => {
        const fetchPlans = async () => {
            try {
                // Gọi API lấy danh sách gói từ Backend
                const response = await axios.get('http://127.0.0.1:8000/premium/plans/');
                setPlans(response.data);
            } catch (error) {
                console.error("Lỗi lấy danh sách gói:", error);
            } finally {
                setIsLoading(false);
            }
        };
        fetchPlans();
    }, []);

    // 👇 HÀM XỬ LÝ CHÍNH ĐÃ ĐƯỢC NÂNG CẤP
    const handleSubscribe = (plan) => {
        // 1. Kiểm tra đăng nhập
        if (!token) {
            alert("Vui lòng đăng nhập để xem chi tiết gói cước!");
            navigate('/login');
            return;
        }
        
        // 2. Xử lý gói Miễn phí
        if (plan.price === 0) {
            alert(`Chào mừng! Bạn đang sử dụng gói ${plan.name} miễn phí.`);
            navigate('/dashboard');
            return;
        } 

        // 3. Xử lý gói Trả phí -> Chuyển sang Checkout
        // Chúng ta format giá tiền thành chuỗi (VD: "99.000 đ") để hiển thị đẹp bên trang Checkout
        const formattedPrice = plan.price.toLocaleString('vi-VN') + ' đ';

        navigate('/checkout', { 
            state: { 
                plan: { 
                    name: plan.name, 
                    price: formattedPrice,
                    id: plan.id // Gửi thêm ID để sau này gửi về API thanh toán
                } 
            } 
        });
    };

    return (
        <div className="bg-gray-50 min-h-screen font-sans">
            <Navbar />

            <div className="max-w-7xl mx-auto px-4 py-16">
                <div className="text-center mb-16">
                    <h1 className="text-4xl font-bold text-[#3D4A7E] mb-4">Nâng cấp sự nghiệp của bạn</h1>
                    <p className="text-gray-500 max-w-2xl mx-auto">
                        Mở khóa các tính năng AI cao cấp, kết nối trực tiếp với nhà tuyển dụng và nhận lộ trình nghề nghiệp được cá nhân hóa.
                    </p>
                </div>

                {isLoading ? (
                    <div className="text-center py-20">
                        <i className="fa-solid fa-spinner fa-spin text-3xl text-[#C04B59]"></i>
                    </div>
                ) : (
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-8 max-w-6xl mx-auto">
                        {plans.map((plan) => (
                            <div 
                                key={plan.id} 
                                className={`bg-white rounded-2xl shadow-lg overflow-hidden border transition-transform hover:-translate-y-2 relative flex flex-col
                                    ${plan.code === 'PRO_MONTHLY' ? 'border-[#C04B59] ring-2 ring-[#C04B59] ring-opacity-50 scale-105 z-10' : 'border-gray-200'}
                                `}
                            >
                                {/* Badge cho gói Pro */}
                                {plan.code === 'PRO_MONTHLY' && (
                                    <div className="bg-[#C04B59] text-white text-xs font-bold uppercase tracking-wider py-1 text-center">
                                        Được đề xuất
                                    </div>
                                )}

                                <div className="p-8 flex-grow">
                                    <h3 className="text-xl font-bold text-[#3D4A7E]">{plan.name}</h3>
                                    <p className="text-gray-400 text-sm mt-2 min-h-[40px]">{plan.description || "Gói dịch vụ cơ bản"}</p>
                                    
                                    <div className="my-6">
                                        <span className="text-4xl font-extrabold text-gray-800">
                                            {plan.price === 0 ? "Miễn phí" : plan.price.toLocaleString()}
                                        </span>
                                        <span className="text-gray-500 ml-1 text-sm font-medium">
                                            {plan.price === 0 ? "" : "đ /tháng"}
                                        </span>
                                    </div>

                                    <ul className="space-y-4 mb-8">
                                        {plan.features.map((feature, idx) => (
                                            <li key={idx} className="flex items-start text-sm text-gray-600">
                                                <i className="fa-solid fa-check text-green-500 mt-1 mr-3"></i>
                                                {feature}
                                            </li>
                                        ))}
                                    </ul>
                                </div>

                                <div className="p-8 pt-0 mt-auto">
                                    <button 
                                        onClick={() => handleSubscribe(plan)}
                                        className={`w-full py-3 rounded-xl font-bold transition shadow-md
                                            ${plan.code === 'PRO_MONTHLY' 
                                                ? 'bg-[#C04B59] text-white hover:bg-[#a03542]' 
                                                : 'bg-[#3D4A7E] text-white hover:bg-[#2c365e]'}
                                        `}
                                    >
                                        {plan.price === 0 ? "Bắt đầu ngay" : "Chọn gói này"}
                                    </button>
                                </div>
                            </div>
                        ))}
                    </div>
                )}
            </div>
        </div>
    );
}