import { useState, useEffect } from 'react';
import Navbar from '../components/Navbar';
import axios from 'axios';
import { useParams, useNavigate } from 'react-router-dom';

export default function JobApplicants() {
    const { jobId } = useParams();
    const [applicants, setApplicants] = useState([]);
    const [isLoading, setIsLoading] = useState(true);
    const navigate = useNavigate();

    useEffect(() => {
        const fetchApplicants = async () => {
            const token = localStorage.getItem('accessToken');
            try {
                const response = await axios.get(`http://127.0.0.1:8000/jobs/recruiter/job/${jobId}/applicants/`, {
                    headers: { 'Authorization': `Token ${token}` }
                });
                setApplicants(response.data);
            } catch (error) {
                console.error("Lỗi:", error);
                alert("Không thể tải danh sách ứng viên.");
            } finally {
                setIsLoading(false);
            }
        };
        fetchApplicants();
    }, [jobId]);

    const handleUpdateStatus = async (appId, newStatus) => {
        const token = localStorage.getItem('accessToken');
        try {
            await axios.patch(`http://127.0.0.1:8000/jobs/recruiter/application/${appId}/status/`, 
                { status: newStatus },
                { headers: { 'Authorization': `Token ${token}` } }
            );
            
            // Cập nhật giao diện ngay lập tức mà không cần F5
            setApplicants(applicants.map(app => 
                app.id === appId ? { ...app, status: newStatus } : app
            ));
            
        } catch (error) {
            alert("Lỗi cập nhật trạng thái");
        }
    };

    const getStatusBadge = (status) => {
        const styles = {
            'APPLIED': 'bg-gray-100 text-gray-600',
            'REVIEWING': 'bg-yellow-100 text-yellow-700',
            'INTERVIEW': 'bg-blue-100 text-blue-700',
            'ACCEPTED': 'bg-green-100 text-green-700',
            'REJECTED': 'bg-red-100 text-red-700',
        };
        return <span className={`px-3 py-1 rounded-full text-xs font-bold ${styles[status] || styles['APPLIED']}`}>{status}</span>;
    };

    return (
        <div className="bg-gray-50 min-h-screen font-sans text-gray-800">
            <Navbar />
            <div className="max-w-6xl mx-auto px-4 py-10">
                <button onClick={() => navigate('/recruiter')} className="mb-6 text-gray-500 hover:text-[#3D4A7E] font-bold">
                    &larr; Quay lại Dashboard
                </button>

                <h1 className="text-3xl font-bold text-[#3D4A7E] mb-2">Danh sách ứng viên</h1>
                <p className="text-gray-500 mb-8">Quản lý và đánh giá hồ sơ cho công việc này.</p>

                <div className="bg-white rounded-xl shadow-sm border overflow-hidden">
                    {isLoading ? (
                        <div className="p-10 text-center">Đang tải...</div>
                    ) : applicants.length === 0 ? (
                        <div className="p-10 text-center text-gray-500">Chưa có ai nộp đơn cho công việc này.</div>
                    ) : (
                        <table className="w-full text-left border-collapse">
                            <thead className="bg-gray-50 border-b">
                                <tr>
                                    <th className="p-4 font-bold text-gray-600 text-sm">Ứng viên</th>
                                    <th className="p-4 font-bold text-gray-600 text-sm">Ngày nộp</th>
                                    <th className="p-4 font-bold text-gray-600 text-sm">CV & Cover Letter</th>
                                    <th className="p-4 font-bold text-gray-600 text-sm">Trạng thái</th>
                                    <th className="p-4 font-bold text-gray-600 text-sm text-right">Hành động</th>
                                </tr>
                            </thead>
                            <tbody className="divide-y">
                                {applicants.map(app => (
                                    <tr key={app.id} className="hover:bg-gray-50">
                                        <td className="p-4">
                                            <div className="flex items-center gap-3">
                                                <img src={app.candidate.avatar || `https://ui-avatars.com/api/?name=${app.candidate.last_name}`} className="w-10 h-10 rounded-full bg-gray-200" alt="" />
                                                <div>
                                                    <p className="font-bold text-[#3D4A7E]">{app.candidate.last_name} {app.candidate.first_name}</p>
                                                    <p className="text-xs text-gray-500">{app.candidate.email}</p>
                                                </div>
                                            </div>
                                        </td>
                                        <td className="p-4 text-sm text-gray-600">
                                            {new Date(app.created_at).toLocaleDateString()}
                                        </td>
                                        <td className="p-4 text-sm">
                                            <a href={app.cv_file} target="_blank" rel="noreferrer" className="text-blue-600 font-bold hover:underline block mb-1">
                                                <i className="fa-solid fa-file-pdf mr-1"></i> Xem CV
                                            </a>
                                            {app.cover_letter && (
                                                <p className="text-xs text-gray-500 italic max-w-xs truncate" title={app.cover_letter}>
                                                    "{app.cover_letter}"
                                                </p>
                                            )}
                                        </td>
                                        <td className="p-4">
                                            {getStatusBadge(app.status)}
                                        </td>
                                        <td className="p-4 text-right">
                                            <div className="flex justify-end gap-2">
                                                <button 
                                                    onClick={() => handleUpdateStatus(app.id, 'ACCEPTED')}
                                                    className="w-8 h-8 rounded-full bg-green-100 text-green-600 hover:bg-green-200 flex items-center justify-center transition"
                                                    title="Chấp nhận"
                                                >
                                                    <i className="fa-solid fa-check"></i>
                                                </button>
                                                <button 
                                                    onClick={() => handleUpdateStatus(app.id, 'REJECTED')}
                                                    className="w-8 h-8 rounded-full bg-red-100 text-red-600 hover:bg-red-200 flex items-center justify-center transition"
                                                    title="Từ chối"
                                                >
                                                    <i className="fa-solid fa-xmark"></i>
                                                </button>
                                                <button 
                                                    onClick={() => handleUpdateStatus(app.id, 'INTERVIEW')}
                                                    className="w-8 h-8 rounded-full bg-blue-100 text-blue-600 hover:bg-blue-200 flex items-center justify-center transition"
                                                    title="Mời phỏng vấn"
                                                >
                                                    <i className="fa-solid fa-phone"></i>
                                                </button>
                                            </div>
                                        </td>
                                    </tr>
                                ))}
                            </tbody>
                        </table>
                    )}
                </div>
            </div>
        </div>
    );
}