import { useLocation, useNavigate } from 'react-router-dom';
import Navbar from '../components/Navbar';
import { useState } from 'react';

export default function Checkout() {
    const location = useLocation();
    const navigate = useNavigate();
    
    // Lấy thông tin gói được gửi từ trang Pricing sang
    // Nếu người dùng vào thẳng link này mà không chọn gói, mặc định là null
    const plan = location.state?.plan;

    const [paymentMethod, setPaymentMethod] = useState('momo');
    const [isProcessing, setIsProcessing] = useState(false);

    // Nếu không có thông tin gói (User gõ trực tiếp URL), đá về trang Pricing
    if (!plan) {
        return (
            <div className="h-screen flex flex-col justify-center items-center">
                <p>Vui lòng chọn gói dịch vụ trước.</p>
                <button onClick={() => navigate('/pricing')} className="mt-4 text-blue-600 font-bold">Quay lại</button>
            </div>
        );
    }

    const handlePayment = () => {
        setIsProcessing(true);
        // Giả lập quá trình thanh toán (delay 2 giây)
        setTimeout(() => {
            setIsProcessing(false);
            alert(`Thanh toán thành công gói ${plan.name}!`);
            navigate('/dashboard'); // Chuyển về Dashboard sau khi mua xong
        }, 2000);
    };

    return (
        <div className="bg-gray-50 min-h-screen font-sans text-gray-800">
            <Navbar />
            
            <div className="max-w-6xl mx-auto px-4 py-10">
                <h1 className="text-3xl font-bold text-[#3D4A7E] mb-8 text-center">Thanh toán đơn hàng</h1>

                <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
                    {/* CỘT TRÁI: CHỌN PHƯƠNG THỨC THANH TOÁN */}
                    <div className="md:col-span-2 space-y-6">
                        <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-200">
                            <h3 className="font-bold text-lg mb-4">1. Chọn hình thức thanh toán</h3>
                            
                            <div className="space-y-3">
                                {/* Option MoMo */}
                                <label className={`flex items-center p-4 border rounded-lg cursor-pointer transition ${paymentMethod === 'momo' ? 'border-[#C04B59] bg-pink-50' : 'hover:bg-gray-50'}`}>
                                    <input 
                                        type="radio" 
                                        name="payment" 
                                        value="momo" 
                                        checked={paymentMethod === 'momo'}
                                        onChange={(e) => setPaymentMethod(e.target.value)}
                                        className="w-5 h-5 text-[#C04B59]"
                                    />
                                    <div className="ml-4 flex items-center gap-3">
                                        <img src="https://cdn.haitrieu.com/wp-content/uploads/2022/10/Logo-MoMo-Square.png" alt="MoMo" className="w-8 h-8 rounded" />
                                        <div>
                                            <p className="font-bold text-sm">Thanh toán bằng Ví MoMo</p>
                                            <p className="text-xs text-gray-500">Quét mã QR cực nhanh</p>
                                        </div>
                                    </div>
                                </label>

                                {/* Option Ngân hàng */}
                                <label className={`flex items-center p-4 border rounded-lg cursor-pointer transition ${paymentMethod === 'bank' ? 'border-[#C04B59] bg-pink-50' : 'hover:bg-gray-50'}`}>
                                    <input 
                                        type="radio" 
                                        name="payment" 
                                        value="bank" 
                                        checked={paymentMethod === 'bank'}
                                        onChange={(e) => setPaymentMethod(e.target.value)}
                                        className="w-5 h-5 text-[#C04B59]"
                                    />
                                    <div className="ml-4 flex items-center gap-3">
                                        <img src="https://athgroup.vn/upload/blocks/thumb_1920x0/ATH-kh%C3%A1m-ph%C3%A1-b%E1%BB%99-nh%E1%BA%ADn-di%E1%BB%87n-mastercard-4.png" alt="Bank" className="w-8 h-8" />
                                        <div>
                                            <p className="font-bold text-sm">Chuyển khoản Ngân hàng (QR Code)</p>
                                            <p className="text-xs text-gray-500">Hỗ trợ tất cả ngân hàng tại VN</p>
                                        </div>
                                    </div>
                                </label>
                            </div>
                        </div>

                        {/* Khu vực hiển thị QR Code (Giả lập) */}
                        <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-200 text-center">
                            <h3 className="font-bold text-gray-700 mb-2">Quét mã để thanh toán</h3>
                            <p className="text-sm text-gray-500 mb-4">Mở ứng dụng {paymentMethod === 'momo' ? 'MoMo' : 'Ngân hàng'} để quét mã bên dưới</p>
                            
                            <div className="inline-block p-4 border-2 border-dashed border-gray-300 rounded-lg bg-gray-50">
                                {/* Đây là ảnh QR Demo, bạn có thể thay bằng ảnh QR thật của bạn */}
                                <img 
                                    src={`https://api.qrserver.com/v1/create-qr-code/?size=200x200&data=ThanhToanGoi_${plan.name}_Gia_${plan.price}`} 
                                    alt="QR Code" 
                                    className="w-48 h-48 mix-blend-multiply"
                                />
                            </div>
                            <p className="text-xs text-gray-400 mt-2">Nội dung CK: <span className="font-bold text-black">MUA {plan.name.toUpperCase()} [SĐT Của Bạn]</span></p>
                        </div>
                    </div>

                    {/* CỘT PHẢI: TÓM TẮT ĐƠN HÀNG */}
                    <div className="md:col-span-1">
                        <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-200 sticky top-24">
                            <h3 className="font-bold text-lg mb-4 border-b pb-2">Thông tin đơn hàng</h3>
                            
                            <div className="flex items-center gap-3 mb-4">
                                <div className={`w-12 h-12 rounded-lg flex items-center justify-center text-white font-bold text-xl ${plan.name.includes('Pro') ? 'bg-blue-500' : 'bg-purple-600'}`}>
                                    {plan.name.charAt(0)}
                                </div>
                                <div>
                                    <p className="font-bold text-gray-700">{plan.name}</p>
                                    <p className="text-sm text-gray-500">Gói 1 tháng</p>
                                </div>
                            </div>

                            <div className="flex justify-between items-center mb-2 text-sm text-gray-600">
                                <span>Tạm tính:</span>
                                <span>{plan.price}</span>
                            </div>
                            <div className="flex justify-between items-center mb-4 text-sm text-green-600">
                                <span>Khuyến mãi:</span>
                                <span>0 đ</span>
                            </div>

                            <div className="border-t pt-4 flex justify-between items-center mb-6">
                                <span className="font-bold text-lg">Tổng cộng:</span>
                                <span className="font-bold text-xl text-[#C04B59]">{plan.price}</span>
                            </div>

                            <button 
                                onClick={handlePayment}
                                disabled={isProcessing}
                                className={`w-full py-3 rounded-lg font-bold text-white shadow-lg transition ${isProcessing ? 'bg-gray-400 cursor-not-allowed' : 'bg-[#C04B59] hover:bg-[#a03542]'}`}
                            >
                                {isProcessing ? 'Đang xử lý...' : 'XÁC NHẬN THANH TOÁN'}
                            </button>
                            
                            <p className="text-xs text-gray-400 text-center mt-4">
                                Bằng việc thanh toán, bạn đồng ý với <a href="#" className="underline">Điều khoản dịch vụ</a> của CareerMate.
                            </p>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
}