import { useState, useEffect } from 'react';
import Navbar from '../components/Navbar';
import axios from 'axios';
import { useSearchParams, useNavigate, Link } from 'react-router-dom';

export default function Jobs() {
    const [jobs, setJobs] = useState([]); // Danh sách gốc từ API
    const [filteredJobs, setFilteredJobs] = useState([]); // Danh sách hiển thị
    const [isLoading, setIsLoading] = useState(true);
    
    // 👇 1. LẤY THAM SỐ TỪ URL (DO TRANG HOME GỬI SANG)
    const [searchParams] = useSearchParams(); 
    const urlKeyword = searchParams.get('search') || '';
    const urlLocation = searchParams.get('location') || 'All Locations';

    const navigate = useNavigate();

    // State bộ lọc
    const [searchTerm, setSearchTerm] = useState(urlKeyword);
    const [filters, setFilters] = useState({
        location: urlLocation === 'All Locations' ? 'All' : urlLocation, // Đồng bộ với URL
        jobType: 'All',
        salaryRange: 'All'
    });

    // 2. LOAD DATA VÀ TỰ ĐỘNG LỌC NGAY LẦN ĐẦU
    useEffect(() => {
        const fetchJobs = async () => {
            setIsLoading(true);
            try {
                // Gọi API lấy toàn bộ việc làm
                const response = await axios.get('http://127.0.0.1:8000/jobs/api/public/');
                setJobs(response.data);
                
                // 👇 TỰ ĐỘNG LỌC NGAY KHI CÓ DỮ LIỆU DỰA TRÊN URL
                filterData(response.data, urlKeyword, {
                    ...filters,
                    location: urlLocation === 'All Locations' ? 'All' : urlLocation
                });

            } catch (error) {
                console.error("Lỗi lấy danh sách job:", error);
            } finally {
                setIsLoading(false);
            }
        };
        fetchJobs();
    }, []); // Chỉ chạy 1 lần khi mount, các tham số URL đã được lấy vào biến const ở trên

    // Hàm lọc dữ liệu (Client-side Filtering)
    const filterData = (data, keyword, currentFilters) => {
        let result = [...data];

        // Lọc theo từ khóa
        if (keyword) {
            const lowerKey = keyword.toLowerCase();
            result = result.filter(job => 
                job.title.toLowerCase().includes(lowerKey) ||
                job.company_name?.toLowerCase().includes(lowerKey) || 
                (job.tags && job.tags.toString().toLowerCase().includes(lowerKey))
            );
        }

        // Lọc theo địa điểm
        if (currentFilters.location !== 'All') {
            result = result.filter(job => job.location.includes(currentFilters.location));
        }

        // Lọc theo loại công việc
        if (currentFilters.jobType !== 'All') {
            result = result.filter(job => job.job_type === currentFilters.jobType);
        }

        setFilteredJobs(result);
    };

    // Khi người dùng thay đổi bộ lọc trên trang Jobs
    const handleFilterChange = (key, value) => {
        const newFilters = { ...filters, [key]: value };
        setFilters(newFilters);
        filterData(jobs, searchTerm, newFilters);
    };

    // Khi bấm Search lại trên trang Jobs
    const handleSearchSubmit = (e) => {
        e.preventDefault();
        filterData(jobs, searchTerm, filters);
        // (Optional) Cập nhật lại URL nếu muốn share link
        navigate(`/jobs?search=${searchTerm}&location=${filters.location}`);
    };

    const handleApply = async (jobId) => {
        const token = localStorage.getItem('accessToken');
        if (!token) {
            if(window.confirm("Vui lòng đăng nhập để ứng tuyển!")) navigate('/login');
            return;
        }
        if(!window.confirm("Xác nhận nộp đơn?")) return;
        
        try {
            await axios.post(`http://127.0.0.1:8000/jobs/apply/${jobId}/`, {}, { headers: { 'Authorization': `Token ${token}` } });
            alert("🎉 Ứng tuyển thành công!");
        } catch (error) {
            alert(error.response?.data?.error || "Lỗi khi ứng tuyển.");
        }
    };

    return (
        <div className="bg-gray-50 min-h-screen font-sans text-gray-800">
            <Navbar />

            {/* HEADER TÌM KIẾM (Đồng bộ dữ liệu với URL) */}
            <div className="bg-[#3D4A7E] py-8 px-4">
                <div className="max-w-7xl mx-auto">
                    <form onSubmit={handleSearchSubmit} className="bg-white p-2 rounded-lg flex flex-col md:flex-row gap-2 shadow-lg">
                        <div className="flex-1 flex items-center px-4">
                            <i className="fa-solid fa-magnifying-glass text-gray-400 mr-3"></i>
                            <input 
                                type="text" 
                                placeholder="Tìm kiếm theo kỹ năng, chức vụ, công ty..." 
                                className="w-full outline-none py-2"
                                value={searchTerm}
                                onChange={(e) => setSearchTerm(e.target.value)}
                            />
                        </div>
                        <button type="submit" className="bg-[#C04B59] text-white px-8 py-2 rounded font-bold hover:bg-[#a03542] transition">
                            Search
                        </button>
                    </form>
                </div>
            </div>

            <div className="max-w-7xl mx-auto px-4 py-8 grid grid-cols-1 md:grid-cols-4 gap-8">
                
                {/* SIDEBAR BỘ LỌC */}
                <div className="md:col-span-1 space-y-6">
                    <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-200">
                        <div className="flex justify-between items-center mb-4">
                            <h3 className="font-bold text-[#3D4A7E]">Filters</h3>
                            <button onClick={() => {
                                setFilters({ location: 'All', jobType: 'All', salaryRange: 'All' });
                                setSearchTerm('');
                                setFilteredJobs(jobs);
                                navigate('/jobs'); // Reset URL
                            }} className="text-xs text-[#C04B59] hover:underline">Clear all</button>
                        </div>

                        {/* Location Filter */}
                        <div className="mb-4">
                            <label className="block text-sm font-bold text-gray-700 mb-2">Location</label>
                            <select 
                                className="w-full p-2 border rounded-lg text-sm bg-gray-50 outline-none focus:border-[#3D4A7E]"
                                value={filters.location}
                                onChange={(e) => handleFilterChange('location', e.target.value)}
                            >
                                <option value="All">All Locations</option>
                                <option value="Ho Chi Minh">Ho Chi Minh</option>
                                <option value="Ha Noi">Ha Noi</option>
                                <option value="Da Nang">Da Nang</option>
                                <option value="Remote">Remote</option>
                            </select>
                        </div>

                        {/* Job Type Filter */}
                        <div className="mb-4">
                            <label className="block text-sm font-bold text-gray-700 mb-2">Job Type</label>
                            <div className="space-y-2">
                                {['All', 'Full-time', 'Part-time', 'Freelance', 'Internship'].map(type => (
                                    <label key={type} className="flex items-center space-x-2 cursor-pointer">
                                        <input 
                                            type="radio" name="jobType" value={type}
                                            checked={filters.jobType === type}
                                            onChange={(e) => handleFilterChange('jobType', e.target.value)}
                                            className="text-[#3D4A7E] focus:ring-[#3D4A7E]"
                                        />
                                        <span className="text-sm text-gray-600">{type}</span>
                                    </label>
                                ))}
                            </div>
                        </div>
                    </div>
                </div>

                {/* DANH SÁCH KẾT QUẢ */}
                <div className="md:col-span-3">
                    <div className="mb-4 flex justify-between items-center">
                        <h2 className="font-bold text-xl text-gray-800">
                            Found <span className="text-[#C04B59]">{filteredJobs.length}</span> jobs 
                            {urlKeyword && <span> for "<span className="italic">{urlKeyword}</span>"</span>}
                        </h2>
                    </div>

                    {isLoading ? (
                        <div className="text-center py-20">Loading...</div>
                    ) : filteredJobs.length === 0 ? (
                        <div className="text-center py-20 bg-white rounded-xl shadow-sm">
                            <i className="fa-solid fa-folder-open text-4xl text-gray-300 mb-4"></i>
                            <p className="text-gray-500">Không tìm thấy công việc phù hợp.</p>
                            <button onClick={() => {setSearchTerm(''); setFilters({...filters, location: 'All'}); filterData(jobs, '', {...filters, location: 'All'})}} className="mt-2 text-blue-500 underline text-sm">Xem tất cả công việc</button>
                        </div>
                    ) : (
                        <div className="space-y-4">
                            {filteredJobs.map(job => (
                                <div key={job.id} className="bg-white p-5 rounded-xl shadow-sm border border-gray-200 hover:shadow-md hover:border-blue-300 transition group">
                                    <div className="flex gap-5">
                                        {/* LOGO */}
                                        <div className="w-24 h-24 flex-shrink-0 border rounded-lg p-2 flex items-center justify-center bg-white">
                                            <img src={job.logo || job.company_logo || "https://via.placeholder.com/150"} alt="Logo" className="max-w-full max-h-full object-contain" />
                                        </div>
                                        {/* INFO */}
                                        <div className="flex-1">
                                            <div className="flex justify-between items-start">
                                                <div>
                                                    <Link to={`/jobs/${job.id}`} className="font-bold text-lg text-[#3D4A7E] group-hover:text-[#C04B59] transition mb-1 block">{job.title}</Link>
                                                    <p className="text-gray-500 font-medium text-sm mb-3">
                                                        <i className="fa-solid fa-building mr-2 text-gray-400"></i>
                                                        {job.company || job.company_name || "Công ty ẩn danh"}
                                                    </p>
                                                </div>
                                                <button onClick={() => handleApply(job.id)} className="bg-white border border-[#C04B59] text-[#C04B59] px-4 py-1.5 rounded font-bold hover:bg-[#C04B59] hover:text-white transition text-sm whitespace-nowrap ml-2">Apply Now</button>
                                            </div>
                                            <div className="flex flex-wrap gap-3 text-sm font-medium">
                                                <span className="bg-[#f0f9ff] text-[#007acc] px-3 py-1 rounded"><i className="fa-solid fa-dollar-sign mr-1"></i> {job.salary || job.salary_range || "Thỏa thuận"}</span>
                                                <span className="bg-gray-100 text-gray-600 px-3 py-1 rounded"><i className="fa-solid fa-location-dot mr-1"></i> {job.location}</span>
                                                <span className="bg-orange-50 text-orange-600 px-3 py-1 rounded text-xs uppercase pt-1.5">{job.job_type}</span>
                                            </div>
                                        </div>
                                    </div>
                                </div>
                            ))}
                        </div>
                    )}
                </div>
            </div>
        </div>
    );
}