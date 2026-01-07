import { Link } from 'react-router-dom';

export default function Home() {
    return (
        <div className="bg-white text-gray-800">
            
            {/* ================= 1. HEADER / NAVBAR ================= */}
            <nav className="bg-white border-b py-4 px-6 md:px-10 flex justify-between items-center sticky top-0 z-50 shadow-sm">
                
                {/* Logo bên trái */}
                <div className="flex items-center space-x-2 cursor-pointer">
                    <div className="flex flex-col">
                        <span className="text-2xl font-bold text-blue-900 italic flex items-center">
                            <i className="fa-solid fa-cloud text-xl mr-2"></i> MYS
                        </span>
                        <span className="text-[10px] text-gray-500 block leading-tight uppercase">make your selection</span>
                    </div>
                </div>

                {/* Menu ở giữa */}
                <div className="hidden md:flex space-x-6 lg:space-x-8 font-bold text-gray-600 uppercase text-[13px] tracking-wide items-center">
                    {/* Nút HOME đang active (màu đỏ) */}
                    <Link to="/" className="bg-rose-700 text-white px-4 py-1 rounded hover:bg-rose-800 transition">
                        HOME
                    </Link>
                    
                    {/* Các nút khác trỏ về Login (vì chưa đăng nhập) */}
                    <Link to="/login" className="hover:text-red-500 transition">UPLOAD CV</Link>
                    <Link to="#" className="hover:text-red-500 transition">CAREER ROADMAP</Link>
                    <Link to="#" className="hover:text-red-500 transition">GET A QUIZ</Link>
                    <Link to="#" className="text-yellow-600 hover:text-yellow-700 transition">
                        <i className="fa-solid fa-crown mr-1"></i> PREMIUM
                    </Link>
                </div>

                {/* Nút Sign In / Sign Up bên phải */}
                <div className="flex items-center space-x-4 text-[13px] font-bold uppercase">
                    <Link to="/login" className="text-gray-600 hover:text-[#C04B59] transition">
                        SIGN IN
                    </Link>
                    <span className="text-gray-300">|</span>
                    <Link to="/signup" className="border-2 border-[#9E7F84] text-[#9E7F84] px-5 py-1.5 rounded hover:bg-[#9E7F84] hover:text-white transition">
                        REGISTER
                    </Link>
                </div>
            </nav>

            {/* ================= 2. HERO SECTION (Màu xanh đậm) ================= */}
            <section className="flex flex-col md:flex-row">
                {/* Cột trái: Text */}
                <div className="bg-[#3D4A7E] md:w-1/2 p-16 text-white flex flex-col justify-center">
                    <h1 className="text-5xl md:text-6xl font-bold leading-tight mb-6 uppercase tracking-tighter">
                        Make Your <br/> Selection
                    </h1>
                    <hr className="w-20 h-1 bg-white mb-6" />
                    <p className="text-lg italic opacity-90 mb-8 max-w-sm font-light">
                        "The Right Choice for the Right Path: Personalized Support to Elevate Your Career Trajectory."
                    </p>
                    
                    {/* Hình tròn trang trí mờ (Họa tiết) */}
                    <div className="absolute top-0 right-0 w-64 h-64 bg-white opacity-5 rounded-full -mr-16 -mt-16 pointer-events-none"></div>
                </div>

                {/* Cột phải: Ảnh (Placeholder) */}
                <div className="w-full md:w-1/2 bg-gray-50 flex items-center justify-center p-10 relative overflow-hidden">
                    {/* Bạn thay thẻ img dưới đây bằng ảnh thật của bạn */}
                    <div className="relative w-full max-w-md aspect-[4/3] bg-gray-200 rounded-lg shadow-xl flex items-center justify-center group overflow-hidden">
                        <span className="text-gray-400 font-bold uppercase tracking-widest">CV Image Here</span>
                        {/* Giả lập hiệu ứng hover cho ảnh */}
                        <div className="absolute inset-0 bg-black opacity-0 group-hover:opacity-10 transition duration-500"></div>
                    </div>
                </div>
            </section>

            {/* ================= 3. REVIEW SECTION (Màu trắng) ================= */}
            <section className="py-20 px-10 max-w-6xl mx-auto flex flex-col md:flex-row items-center">
                <div className="md:w-1/2 pr-0 md:pr-10 mb-10 md:mb-0">
                    <h2 className="text-3xl font-bold text-[#C04B59] uppercase mb-6 leading-tight">
                        Review your CV to identify strengths and weakness that need improvement
                    </h2>
                    <p className="font-bold mb-4 uppercase text-sm tracking-wide">Get a clear, detailed review of your CV</p>
                    <ul className="space-y-3 text-sm text-gray-600">
                        <li className="flex items-center"><i className="fa-solid fa-check text-green-500 mr-2"></i> Identify strengths and weaknesses in your CV</li>
                        <li className="flex items-center"><i className="fa-solid fa-check text-green-500 mr-2"></i> Highlight improvement areas based on your experience</li>
                        <li className="flex items-center"><i className="fa-solid fa-check text-green-500 mr-2"></i> Refine content, wording, and structure with clear insights</li>
                        <li className="inline-block bg-pink-100 px-2 py-1 rounded text-[#C04B59] font-medium">
                            <i className="fa-solid fa-check mr-2"></i> Chat with AI to fix mistakes instantly
                        </li>
                    </ul>
                </div>
                <div className="md:w-1/2 text-center">
                    <div className="relative inline-block">
                        <img src="https://i.pravatar.cc/150?img=32" className="w-40 h-40 rounded-full border-4 border-gray-200 mx-auto" alt="Reviewer" />
                        <div className="mt-4">
                            <p className="font-bold text-[#3D4A7E] text-lg">Jennifer</p>
                            <p className="text-sm text-gray-500 uppercase tracking-widest">Reviewer Professional</p>
                        </div>
                    </div>
                </div>
            </section>

            {/* BUTTON UPLOAD CV */}
            <div className="text-center pb-20">
                <Link to="#" className="bg-[#C04B59] text-white px-12 py-4 rounded-md font-bold text-xl uppercase shadow-xl hover:scale-105 transition inline-block tracking-wider">
                    Upload Your CV
                </Link>
            </div>

            <section className="bg-blue-50 py-20 px-10 text-center">
                <h2 className="text-3xl font-bold text-blue-900 uppercase mb-4">The CV Builder that's right for your job and experience</h2>
                <Link to="#" className="text-[#C04B59] font-bold underline mb-12 inline-block hover:text-[#a03542]">VIEW ALL CV TEMPLATES →</Link>
                
                <div className="grid grid-cols-2 md:grid-cols-5 gap-4 max-w-7xl mx-auto">
                    {/* Các ảnh Template (Placeholder) */}
                    {[1, 2, 3, 4, 5].map((item, index) => (
                         <div key={index} className={`bg-white p-2 shadow-md rounded hover:shadow-xl transition cursor-pointer transform hover:-translate-y-1 ${index === 1 ? 'border-4 border-blue-200' : ''}`}>
                            <img src="https://via.placeholder.com/200x280" alt={`Template ${index}`} className="w-full h-auto object-cover" />
                        </div>
                    ))}
                </div>
            </section>

            {/* ================= 5. PRICING & FAQ SECTION (MỚI THÊM) ================= */}
            <section className="bg-[#C04B59] py-20 px-6 md:px-10 text-white">
                <h2 className="text-3xl md:text-4xl font-bold text-center uppercase mb-12 tracking-wide">Unlock more exciting experiences with a premium plan</h2>
                
                {/* Pricing Grid */}
                <div className="grid md:grid-cols-3 gap-8 max-w-6xl mx-auto mb-16">
                    {/* Free Plan */}
                    <div className="bg-white text-gray-800 rounded-xl p-8 shadow-2xl hover:scale-105 transition duration-300">
                        <span className="bg-green-700 text-white px-4 py-1 rounded text-xs font-bold">FREE PLAN</span>
                        <h3 className="text-4xl font-bold mt-4 text-[#3D4A7E]">FREE</h3>
                        <p className="text-xs text-gray-500 mb-6 border-b pb-4 mt-2">Best for: trying out the platform</p>
                        <ul className="text-sm space-y-3 mb-8 text-gray-600">
                            <li><i className="fa-solid fa-check text-green-600 mr-2"></i> All CV templates</li>
                            <li><i className="fa-solid fa-check text-green-600 mr-2"></i> Basic CV sections</li>
                            <li><i className="fa-solid fa-check text-green-600 mr-2"></i> Maximum 12 sections</li>
                        </ul>
                    </div>

                    {/* Premium Plan (Nổi bật) */}
                    <div className="bg-white text-gray-800 rounded-xl p-8 shadow-2xl relative border-4 border-yellow-500 transform scale-105">
                        <div className="absolute top-0 right-0 bg-yellow-500 text-white text-xs font-bold px-3 py-1 rounded-bl-lg uppercase">Best Value</div>
                        <span className="bg-[#3D4A7E] text-white px-4 py-1 rounded text-xs font-bold uppercase">Premium</span>
                        <h3 className="text-4xl font-bold mt-4 text-[#C04B59]">$13.9 <span className="text-sm line-through text-gray-400 font-normal ml-2">$20.9</span></h3>
                        <p className="text-xs text-gray-500 mb-6 border-b pb-4 mt-2">Best for: Short-term users & job seekers</p>
                        <ul className="text-sm space-y-3 mb-8 text-gray-600">
                            <li><i className="fa-solid fa-check text-[#C04B59] mr-2"></i> Unlimited AI Reviews</li>
                            <li><i className="fa-solid fa-check text-[#C04B59] mr-2"></i> Priority Support</li>
                        </ul>
                        <button className="w-full bg-[#3D4A7E] text-white py-3 rounded font-bold uppercase mb-2 hover:bg-[#2c365e] transition">Buy Now →</button>
                    </div>

                    {/* Enterprise Plan */}
                    <div className="bg-white text-gray-800 rounded-xl p-8 shadow-2xl hover:scale-105 transition duration-300">
                        <span className="bg-gray-700 text-white px-4 py-1 rounded text-xs font-bold uppercase">Enterprise</span>
                        <h3 className="text-3xl font-bold mt-4 text-[#3D4A7E]">ENTERPRISE</h3>
                        <h3 className="text-2xl font-bold mt-2 text-gray-600">$9.9 <small className="text-sm font-normal">/month</small></h3>
                        <p className="text-xs text-gray-500 mb-6 border-b pb-4 mt-2">Best for: Teams & Agencies</p>
                        <button className="w-full bg-[#3D4A7E] text-white py-3 rounded font-bold uppercase mt-6 hover:bg-[#2c365e] transition">Buy Now →</button>
                    </div>
                </div>

                {/* FAQ Section */}
                <div className="bg-white text-gray-800 rounded-xl p-8 md:p-10 max-w-4xl mx-auto shadow-lg">
                    <h2 className="text-2xl md:text-3xl font-bold text-[#3D4A7E] text-center uppercase mb-10">Frequently Asked Questions About MYS</h2>
                    <div className="space-y-4">
                        <details className="group border-b border-gray-200 pb-4 cursor-pointer">
                            <summary className="font-bold text-[#C04B59] flex justify-between items-center list-none">
                                <span>How does the AI detect issues in my CV beyond formatting errors?</span>
                                <span className="transition group-open:rotate-180"><i className="fa-solid fa-chevron-down"></i></span>
                            </summary>
                            <p className="text-sm mt-3 text-gray-600 leading-relaxed pl-2">The AI analyzes content relevance, skill alignment, role expectations, and career progression based on thousands of successful CVs.</p>
                        </details>
                        <details className="group border-b border-gray-200 pb-4 cursor-pointer">
                            <summary className="font-bold text-[#C04B59] flex justify-between items-center list-none">
                                <span>Can the AI identify missing skills for my target role or career path?</span>
                                <span className="transition group-open:rotate-180"><i className="fa-solid fa-chevron-down"></i></span>
                            </summary>
                            <p className="text-sm mt-3 text-gray-600 leading-relaxed pl-2">Yes. By comparing your profile with real job requirements, the system highlights missing skills and suggests improvements.</p>
                        </details>
                    </div>
                </div>
            </section>

            {/* ================= 6. REVIEWS SECTION (MỚI THÊM) ================= */}
            <section className="py-20 px-10 bg-gray-50">
                <h2 className="text-2xl font-bold mb-10 text-center text-gray-800 uppercase tracking-wider">Latest reviews</h2>
                <div className="grid md:grid-cols-3 gap-6 max-w-6xl mx-auto">
                    {/* Review Item 1 */}
                    <div className="bg-white p-6 rounded-lg shadow-sm border border-gray-100 hover:shadow-md transition">
                        <div className="flex text-yellow-400 mb-2 text-sm space-x-1">
                            <i className="fa-solid fa-star"></i><i className="fa-solid fa-star"></i><i className="fa-solid fa-star"></i><i className="fa-solid fa-star"></i><i className="fa-solid fa-star"></i>
                        </div>
                        <h4 className="font-bold text-gray-800">So Good</h4>
                        <p className="text-sm text-gray-600 mb-4 italic">"Amazing, it's better than i think. Helped me land a job in 2 weeks!"</p>
                        <div className="flex items-center">
                            <img src="https://i.pravatar.cc/150?img=5" alt="User" className="w-10 h-10 rounded-full mr-3 object-cover" />
                            <div>
                                <p className="text-xs font-bold text-[#3D4A7E]">Bella</p>
                                <p className="text-[10px] text-gray-400">22/12/2025</p>
                            </div>
                        </div>
                    </div>
                    {/* Bạn có thể copy thêm Review Item để lấp đầy Grid */}
                     <div className="bg-white p-6 rounded-lg shadow-sm border border-gray-100 hover:shadow-md transition">
                        <div className="flex text-yellow-400 mb-2 text-sm space-x-1">
                            <i className="fa-solid fa-star"></i><i className="fa-solid fa-star"></i><i className="fa-solid fa-star"></i><i className="fa-solid fa-star"></i><i className="fa-solid fa-star"></i>
                        </div>
                        <h4 className="font-bold text-gray-800">Professional Design</h4>
                        <p className="text-sm text-gray-600 mb-4 italic">"The templates are very professional and clean. Easy to use."</p>
                        <div className="flex items-center">
                            <img src="https://i.pravatar.cc/150?img=12" alt="User" className="w-10 h-10 rounded-full mr-3 object-cover" />
                            <div>
                                <p className="text-xs font-bold text-[#3D4A7E]">John Doe</p>
                                <p className="text-[10px] text-gray-400">01/01/2026</p>
                            </div>
                        </div>
                    </div>
                     <div className="bg-white p-6 rounded-lg shadow-sm border border-gray-100 hover:shadow-md transition">
                        <div className="flex text-yellow-400 mb-2 text-sm space-x-1">
                            <i className="fa-solid fa-star"></i><i className="fa-solid fa-star"></i><i className="fa-solid fa-star"></i><i className="fa-solid fa-star"></i><i className="fa-solid fa-star-half-stroke"></i>
                        </div>
                        <h4 className="font-bold text-gray-800">AI feature is cool</h4>
                        <p className="text-sm text-gray-600 mb-4 italic">"The AI suggestions really improved my summary section."</p>
                        <div className="flex items-center">
                            <img src="https://i.pravatar.cc/150?img=9" alt="User" className="w-10 h-10 rounded-full mr-3 object-cover" />
                            <div>
                                <p className="text-xs font-bold text-[#3D4A7E]">Sarah K.</p>
                                <p className="text-[10px] text-gray-400">28/12/2025</p>
                            </div>
                        </div>
                    </div>
                </div>
            </section>

            {/* ================= 7. FOOTER (MỚI THÊM) ================= */}
            <footer className="bg-white border-t py-16 px-10">
                <div className="max-w-7xl mx-auto">
                    <div className="grid grid-cols-2 md:grid-cols-6 gap-8 text-xs mb-10 text-gray-600">
                        <div>
                            <h5 className="font-bold mb-4 uppercase text-[#3D4A7E]">Get started</h5>
                            <ul className="space-y-2">
                                <li><Link to="/signup" className="hover:text-[#C04B59]">Create account</Link></li>
                                <li><Link to="/login" className="hover:text-[#C04B59]">Upload CV</Link></li>
                                <li><Link to="#" className="hover:text-[#C04B59]">Pricing</Link></li>
                            </ul>
                        </div>
                        <div>
                            <h5 className="font-bold mb-4 uppercase text-[#3D4A7E]">Career Tools</h5>
                            <ul className="space-y-2">
                                <li><Link to="#" className="hover:text-[#C04B59]">CV Builder</Link></li>
                                <li><Link to="#" className="hover:text-[#C04B59]">AI Career Coach</Link></li>
                            </ul>
                        </div>
                        {/* Các cột Footer khác nếu cần... */}
                    </div>
                    
                    <div className="border-t pt-8 flex flex-col md:flex-row justify-between items-center italic text-[10px] text-gray-500">
                        <div className="flex space-x-6 mb-4 md:mb-0">
                            <i className="fa-brands fa-facebook text-blue-600 text-lg cursor-pointer hover:scale-110 transition"></i>
                            <i className="fa-brands fa-instagram text-pink-600 text-lg cursor-pointer hover:scale-110 transition"></i>
                            <i className="fa-brands fa-x-twitter text-black text-lg cursor-pointer hover:scale-110 transition"></i>
                        </div>
                        <p>Built with care to help people grow their careers. © 2025 MYS. All rights reserved.</p>
                    </div>
                </div>
            </footer>

        </div>
    );
}
