import { useState } from 'react';
import { useNavigate } from 'react-router-dom';

export default function RecruiterDashboard() {
    const navigate = useNavigate();
    const [activeTab, setActiveTab] = useState('jobs'); 

    // Mock Data
    const myJobs = [
        { id: 1, title: "Senior React Dev", posted: "2025-12-01", applications: 15, status: "Active" },
        { id: 2, title: "Intern Python", posted: "2026-01-02", applications: 45, status: "Reviewing" },
    ];

    const handleLogout = () => {
        localStorage.clear();
        navigate('/login');
    };

    return (
        <div className="flex h-screen bg-gray-100 font-sans">
            {/* SIDEBAR */}
            <aside className="w-64 bg-gray-900 text-white flex flex-col">
                <div className="p-6 text-2xl font-bold text-[#C04B59]">MYS <span className="text-xs text-white block font-normal">Recruiter Portal</span></div>
                <nav className="flex-1 px-4 space-y-2">
                    <button onClick={() => setActiveTab('jobs')} className={`w-full text-left py-3 px-4 rounded ${activeTab === 'jobs' ? 'bg-[#C04B59]' : 'hover:bg-gray-800'}`}>
                        <i className="fa-solid fa-briefcase mr-3"></i> My Jobs
                    </button>
                    <button onClick={() => setActiveTab('candidates')} className="w-full text-left py-3 px-4 rounded hover:bg-gray-800">
                        <i className="fa-solid fa-users mr-3"></i> Candidates Pipeline
                    </button>
                    <button className="w-full text-left py-3 px-4 rounded hover:bg-gray-800">
                        <i className="fa-solid fa-building mr-3"></i> Company Profile
                    </button>
                </nav>
                <div className="p-4 border-t border-gray-700">
                    <button onClick={handleLogout} className="text-gray-400 hover:text-white"><i className="fa-solid fa-right-from-bracket mr-2"></i> Logout</button>
                </div>
            </aside>

            {/* MAIN CONTENT */}
            <main className="flex-1 p-8 overflow-y-auto">
                <header className="flex justify-between items-center mb-8">
                    <h1 className="text-3xl font-bold text-gray-800">Dashboard</h1>
                    <button className="bg-[#C04B59] text-white px-6 py-2 rounded shadow hover:bg-rose-700">
                        <i className="fa-solid fa-plus mr-2"></i> Post New Job
                    </button>
                </header>

                {/* STATS CARDS */}
                <div className="grid grid-cols-3 gap-6 mb-8">
                    <div className="bg-white p-6 rounded shadow-sm border-l-4 border-blue-500">
                        <p className="text-gray-500">Active Jobs</p>
                        <p className="text-2xl font-bold">12</p>
                    </div>
                    <div className="bg-white p-6 rounded shadow-sm border-l-4 border-green-500">
                        <p className="text-gray-500">Total Applications</p>
                        <p className="text-2xl font-bold">145</p>
                    </div>
                    <div className="bg-white p-6 rounded shadow-sm border-l-4 border-yellow-500">
                        <p className="text-gray-500">Interviews Scheduled</p>
                        <p className="text-2xl font-bold">8</p>
                    </div>
                </div>

                {/* JOBS TABLE */}
                <div className="bg-white rounded shadow-sm overflow-hidden">
                    <div className="p-4 border-b font-bold text-gray-700">Recent Job Postings</div>
                    <table className="w-full text-left border-collapse">
                        <thead className="bg-gray-50 text-gray-600 uppercase text-xs">
                            <tr>
                                <th className="p-4">Job Title</th>
                                <th className="p-4">Posted Date</th>
                                <th className="p-4">Candidates</th>
                                <th className="p-4">Status</th>
                                <th className="p-4">Action</th>
                            </tr>
                        </thead>
                        <tbody className="text-sm">
                            {myJobs.map(job => (
                                <tr key={job.id} className="border-b hover:bg-gray-50">
                                    <td className="p-4 font-bold text-[#3D4A7E]">{job.title}</td>
                                    <td className="p-4 text-gray-500">{job.posted}</td>
                                    <td className="p-4"><span className="bg-blue-100 text-blue-800 px-2 py-1 rounded font-bold">{job.applications}</span></td>
                                    <td className="p-4"><span className="text-green-600 font-bold">● {job.status}</span></td>
                                    <td className="p-4">
                                        <button className="text-blue-600 hover:underline mr-3">View</button>
                                        <button className="text-red-600 hover:underline">Close</button>
                                    </td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                </div>
            </main>
        </div>
    );
}