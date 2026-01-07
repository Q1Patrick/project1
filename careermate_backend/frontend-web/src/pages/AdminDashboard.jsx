import { useNavigate } from 'react-router-dom';

export default function AdminDashboard() {
    const navigate = useNavigate();

    const handleLogout = () => {
        localStorage.clear();
        navigate('/login');
    };

    return (
        <div className="flex h-screen bg-gray-200 font-sans">
            {/* SIDEBAR ADMIN */}
            <aside className="w-64 bg-[#1a202c] text-white flex flex-col">
                <div className="p-6 text-xl font-bold tracking-wider">MYS ADMIN</div>
                <nav className="flex-1 px-2 space-y-1 text-sm">
                    <button className="w-full text-left py-3 px-4 rounded bg-gray-700"><i className="fa-solid fa-gauge mr-3"></i> Dashboard</button>
                    <button className="w-full text-left py-3 px-4 rounded hover:bg-gray-700"><i className="fa-solid fa-users mr-3"></i> User Management</button>
                    <button className="w-full text-left py-3 px-4 rounded hover:bg-gray-700"><i className="fa-solid fa-file-contract mr-3"></i> CV Templates</button>
                    <button className="w-full text-left py-3 px-4 rounded hover:bg-gray-700"><i className="fa-solid fa-flag mr-3"></i> Reports & Logs</button>
                    <button className="w-full text-left py-3 px-4 rounded hover:bg-gray-700"><i className="fa-solid fa-box-open mr-3"></i> Packages</button>
                </nav>
                <div className="p-4 bg-red-900 cursor-pointer hover:bg-red-800" onClick={handleLogout}>
                    <i className="fa-solid fa-power-off mr-2"></i> System Logout
                </div>
            </aside>

            {/* ADMIN CONTENT */}
            <main className="flex-1 p-10 overflow-y-auto">
                <h2 className="text-2xl font-bold text-gray-800 mb-6">System Overview</h2>
                
                {/* 4 Cards Thống kê */}
                <div className="grid grid-cols-4 gap-6 mb-10">
                    <div className="bg-white p-6 rounded-lg shadow border-b-4 border-indigo-500">
                        <div className="text-3xl font-bold text-gray-800">10,245</div>
                        <div className="text-xs text-gray-500 uppercase font-bold">Total Candidates</div>
                    </div>
                    <div className="bg-white p-6 rounded-lg shadow border-b-4 border-green-500">
                        <div className="text-3xl font-bold text-gray-800">540</div>
                        <div className="text-xs text-gray-500 uppercase font-bold">Recruiters</div>
                    </div>
                    <div className="bg-white p-6 rounded-lg shadow border-b-4 border-yellow-500">
                        <div className="text-3xl font-bold text-gray-800">1,203</div>
                        <div className="text-xs text-gray-500 uppercase font-bold">Active Jobs</div>
                    </div>
                    <div className="bg-white p-6 rounded-lg shadow border-b-4 border-red-500">
                        <div className="text-3xl font-bold text-gray-800">15</div>
                        <div className="text-xs text-gray-500 uppercase font-bold">Pending Reports</div>
                    </div>
                </div>

                {/* Recent Actions & Logs */}
                <div className="grid grid-cols-2 gap-6">
                    <div className="bg-white p-6 rounded shadow">
                        <h3 className="font-bold mb-4 border-b pb-2">Pending Content Approval</h3>
                        <ul className="space-y-3 text-sm">
                            <li className="flex justify-between items-center">
                                <span>CV Template: "Modern Blue"</span>
                                <button className="text-green-600 hover:underline">Approve</button>
                            </li>
                            <li className="flex justify-between items-center">
                                <span>Article: "Top 10 Interview Tips"</span>
                                <button className="text-green-600 hover:underline">Approve</button>
                            </li>
                        </ul>
                    </div>
                    <div className="bg-white p-6 rounded shadow">
                        <h3 className="font-bold mb-4 border-b pb-2">System Logs</h3>
                        <div className="text-xs font-mono bg-black text-green-400 p-4 rounded h-40 overflow-y-auto">
                            <p>[INFO] User ID:45 logged in.</p>
                            <p>[WARN] High traffic on /api/jobs detected.</p>
                            <p>[INFO] New package purchased by Recruiter #12.</p>
                        </div>
                    </div>
                </div>
            </main>
        </div>
    );
}