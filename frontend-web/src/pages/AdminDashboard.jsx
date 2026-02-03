import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import Navbar from '../components/Navbar';

// Import các component con vừa tạo
import AdminUsers from '../components/admin/AdminUsers';
import AdminTemplates from '../components/admin/AdminTemplates';

export default function AdminDashboard() {
    const navigate = useNavigate();
    
    // 👇 STATE QUAN TRỌNG: Xác định đang xem tab nào
    const [activeTab, setActiveTab] = useState('dashboard'); 

    const handleLogout = () => {
        localStorage.clear();
        navigate('/login');
    };

    // Hàm render nội dung bên phải dựa theo activeTab
    const renderContent = () => {
        switch (activeTab) {
            case 'users':
                return <AdminUsers />;
            case 'templates':
                return <AdminTemplates />;
            case 'packages':
                return <div className="p-10 text-center text-gray-500">Chức năng Quản lý Gói cước đang phát triển...</div>;
            case 'reports':
                return <div className="p-10 text-center text-gray-500">Chức năng Báo cáo đang phát triển...</div>;
            default:
                return <DashboardHome />; // Trang chủ Dashboard (Thống kê)
        }
    };

    return (
        <div className="flex flex-col h-screen bg-gray-200 font-sans">
            <Navbar />

            <div className="flex flex-1 overflow-hidden">
                {/* SIDEBAR */}
                <aside className="w-64 bg-[#1a202c] text-white flex flex-col shadow-xl">
                    <div className="p-6 text-xl font-bold tracking-wider border-b border-gray-700">MYS ADMIN</div>
                    <nav className="flex-1 px-2 space-y-2 mt-4 text-sm">
                        
                        {/* Nút Dashboard */}
                        <button 
                            onClick={() => setActiveTab('dashboard')}
                            className={`w-full text-left py-3 px-4 rounded transition ${activeTab === 'dashboard' ? 'bg-[#C04B59] font-bold' : 'hover:bg-gray-700'}`}
                        >
                            <i className="fa-solid fa-gauge mr-3"></i> Dashboard
                        </button>

                        {/* Nút User Management */}
                        <button 
                            onClick={() => setActiveTab('users')}
                            className={`w-full text-left py-3 px-4 rounded transition ${activeTab === 'users' ? 'bg-[#C04B59] font-bold' : 'hover:bg-gray-700'}`}
                        >
                            <i className="fa-solid fa-users mr-3"></i> User Management
                        </button>

                        {/* Nút CV Templates */}
                        <button 
                            onClick={() => setActiveTab('templates')}
                            className={`w-full text-left py-3 px-4 rounded transition ${activeTab === 'templates' ? 'bg-[#C04B59] font-bold' : 'hover:bg-gray-700'}`}
                        >
                            <i className="fa-solid fa-file-contract mr-3"></i> CV Templates
                        </button>

                        <button onClick={() => setActiveTab('reports')} className="w-full text-left py-3 px-4 rounded hover:bg-gray-700 transition"><i className="fa-solid fa-flag mr-3"></i> Reports & Logs</button>
                        <button onClick={() => setActiveTab('packages')} className="w-full text-left py-3 px-4 rounded hover:bg-gray-700 transition"><i className="fa-solid fa-box-open mr-3"></i> Packages</button>
                    </nav>
                    <div className="p-4 bg-red-900 cursor-pointer hover:bg-red-800 transition" onClick={handleLogout}>
                        <i className="fa-solid fa-power-off mr-2"></i> System Logout
                    </div>
                </aside>

                {/* MAIN CONTENT AREA */}
                <main className="flex-1 p-8 overflow-y-auto">
                    {/* Render nội dung động tại đây */}
                    {renderContent()}
                </main>
            </div>
        </div>
    );
}

// Component con: Trang chủ Dashboard (Thống kê) - Tách ra cho gọn file
function DashboardHome() {
    return (
        <>
            <h2 className="text-2xl font-bold text-gray-800 mb-6">System Overview</h2>
            <div className="grid grid-cols-4 gap-6 mb-10">
                <div className="bg-white p-6 rounded-lg shadow-sm border-l-4 border-indigo-500">
                    <div className="text-3xl font-bold text-gray-800">10,245</div>
                    <div className="text-xs text-gray-500 uppercase font-bold">Total Candidates</div>
                </div>
                {/* ... Các card thống kê khác (giữ nguyên code cũ của bạn) ... */}
                <div className="bg-white p-6 rounded-lg shadow-sm border-l-4 border-green-500">
                     <div className="text-3xl font-bold text-gray-800">540</div>
                     <div className="text-xs text-gray-500 uppercase font-bold">Recruiters</div>
                </div>
            </div>
            
            {/* Logs giữ nguyên ... */}
            <div className="bg-white p-6 rounded shadow-sm">
                <h3 className="font-bold mb-4 border-b pb-2 text-gray-700">System Logs</h3>
                <div className="text-xs font-mono bg-[#1e1e1e] text-green-400 p-4 rounded h-40 overflow-y-auto shadow-inner">
                    <p className="mb-1">[INFO] Admin accessed Dashboard.</p>
                </div>
            </div>
        </>
    );
}