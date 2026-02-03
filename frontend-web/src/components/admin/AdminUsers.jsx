import { useState, useEffect } from 'react';
import axios from 'axios';

export default function AdminUsers() {
    const [users, setUsers] = useState([]);
    const [loading, setLoading] = useState(true);

    // 1. Lấy danh sách User
    useEffect(() => {
        fetchUsers();
    }, []);

    const fetchUsers = async () => {
        const token = localStorage.getItem('accessToken');
        try {
            const res = await axios.get('http://127.0.0.1:8000/users/api/admin/list/', {
                headers: { Authorization: `Token ${token}` }
            });
            setUsers(res.data);
        } catch (err) {
            console.error("Lỗi lấy danh sách:", err);
        } finally {
            setLoading(false);
        }
    };

    // 2. Xử lý BLOCK / UNBLOCK
    const handleToggleStatus = async (userId, currentStatus) => {
        const actionName = currentStatus ? "CHẶN (Block)" : "MỞ KHÓA (Unblock)";
        if (!window.confirm(`Bạn có chắc muốn ${actionName} user này?`)) return;

        const token = localStorage.getItem('accessToken');
        try {
            // Gọi API PATCH
            const res = await axios.patch(`http://127.0.0.1:8000/users/api/admin/users/${userId}/`, {}, {
                headers: { Authorization: `Token ${token}` }
            });

            // Cập nhật State giao diện ngay lập tức
            setUsers(users.map(u => 
                u.id === userId ? { ...u, is_active: res.data.is_active } : u
            ));
            alert(`✅ ${res.data.message}`);

        } catch (err) {
            alert("❌ Lỗi: " + (err.response?.data?.error || "Không thể thực hiện"));
        }
    };

    // 3. Xử lý XÓA (DELETE)
    const handleDelete = async (userId) => {
        if (!window.confirm("⚠️ CẢNH BÁO: Hành động này sẽ xóa vĩnh viễn User và toàn bộ dữ liệu (CV, bài đăng...) của họ.\n\nBạn có chắc chắn không?")) return;

        const token = localStorage.getItem('accessToken');
        try {
            // Gọi API DELETE
            await axios.delete(`http://127.0.0.1:8000/users/api/admin/users/${userId}/`, {
                headers: { Authorization: `Token ${token}` }
            });

            // Xóa user khỏi danh sách trên màn hình
            setUsers(users.filter(u => u.id !== userId));
            alert("✅ Đã xóa user thành công!");

        } catch (err) {
            alert("❌ Lỗi: " + (err.response?.data?.error || "Không thể xóa"));
        }
    };

    if (loading) return <div className="p-6 text-gray-500">Đang tải dữ liệu...</div>;

    return (
        <div className="bg-white p-6 rounded shadow">
            <div className="flex justify-between items-center mb-4">
                <h3 className="font-bold text-xl text-[#3D4A7E]">Quản lý Người dùng</h3>
                <span className="text-sm bg-blue-100 text-blue-800 py-1 px-3 rounded-full font-bold">
                    Tổng: {users.length} users
                </span>
            </div>

            <table className="w-full text-left border-collapse">
                <thead>
                    <tr className="bg-gray-100 border-b text-sm text-gray-600 uppercase">
                        <th className="p-3">ID</th>
                        <th className="p-3">Email</th>
                        <th className="p-3">Họ Tên</th>
                        <th className="p-3">Vai trò</th>
                        <th className="p-3">Trạng thái</th>
                        <th className="p-3 text-center">Hành động</th>
                    </tr>
                </thead>
                <tbody className="text-sm">
                    {users.map(u => (
                        <tr key={u.id} className="border-b hover:bg-gray-50 transition">
                            <td className="p-3 font-mono text-gray-500">#{u.id}</td>
                            <td className="p-3 font-medium text-gray-700">{u.email}</td>
                            <td className="p-3">{u.last_name} {u.first_name}</td>
                            <td className="p-3">
                                <span className={`px-2 py-1 rounded text-xs text-white uppercase font-bold shadow-sm
                                    ${u.role === 'recruiter' ? 'bg-indigo-500' : 'bg-teal-500'}`}>
                                    {u.role || 'User'}
                                </span>
                            </td>
                            <td className="p-3">
                                {u.is_active ? 
                                    <span className="inline-flex items-center text-green-600 font-bold bg-green-50 px-2 py-1 rounded border border-green-200">
                                        <i className="fa-solid fa-circle-check mr-1 text-xs"></i> Active
                                    </span> 
                                    : 
                                    <span className="inline-flex items-center text-red-600 font-bold bg-red-50 px-2 py-1 rounded border border-red-200">
                                        <i className="fa-solid fa-lock mr-1 text-xs"></i> Banned
                                    </span>
                                }
                            </td>
                            <td className="p-3 text-center">
                                <div className="flex justify-center gap-2">
                                    {/* Nút Block / Unblock */}
                                    <button 
                                        onClick={() => handleToggleStatus(u.id, u.is_active)}
                                        className={`w-24 py-1.5 rounded text-xs font-bold transition text-white shadow
                                            ${u.is_active 
                                                ? 'bg-orange-400 hover:bg-orange-500' 
                                                : 'bg-blue-500 hover:bg-blue-600'}`}
                                    >
                                        {u.is_active ? (
                                            <><i className="fa-solid fa-ban mr-1"></i> Block</>
                                        ) : (
                                            <><i className="fa-solid fa-unlock mr-1"></i> Unblock</>
                                        )}
                                    </button>

                                    {/* Nút Xóa */}
                                    <button 
                                        onClick={() => handleDelete(u.id)}
                                        className="bg-red-100 text-red-600 hover:bg-red-600 hover:text-white p-1.5 rounded w-8 h-8 transition shadow-sm"
                                        title="Xóa vĩnh viễn user này"
                                    >
                                        <i className="fa-solid fa-trash-can"></i>
                                    </button>
                                </div>
                            </td>
                        </tr>
                    ))}
                </tbody>
            </table>
            
            {users.length === 0 && <div className="text-center py-10 text-gray-400 italic">Chưa có người dùng nào trong hệ thống.</div>}
        </div>
    );
}