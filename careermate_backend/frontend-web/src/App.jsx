import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import Login from './pages/Login';
import Signup from './pages/Signup';
import Home from './pages/Home';
import Dashboard from './pages/Dashboard'; // Candidate Dashboard
import AdminDashboard from './pages/AdminDashboard';
import RecruiterDashboard from './pages/RecruiterDashboard';
import CVAnalyzer from './pages/CVAnalyzer';
import CareerRoadmap from './pages/CareerRoadmap';
import PostJob from './pages/PostJob';
// Component bảo vệ Route: Chỉ cho phép role cụ thể truy cập
const PrivateRoute = ({ children, allowedRoles }) => {
    const storedUser = localStorage.getItem('userInfo');
    const user = storedUser ? JSON.parse(storedUser) : null;

    if (!user) {
        return <Navigate to="/login" />;
    }

    // Nếu có role nhưng role không nằm trong danh sách cho phép -> Đá về trang Home hoặc 403
    if (allowedRoles && !allowedRoles.includes(user.role)) {
         // Ví dụ: Candidate cố vào trang Admin
        return <Navigate to="/" />; 
    }

    return children;
};

function App() {
  return (
    <div className="relative"> {/* Bọc ngoài bằng thẻ div relative */}
    <Routes>
      <Route path="/" element={<Home />} />
      <Route path="/login" element={<Login />} />
      <Route path="/signup" element={<Signup />} />

      {/* 1. Candidate Route */}
      <Route path="/dashboard" element={
            <PrivateRoute allowedRoles={['candidate']}>
                <Dashboard />
            </PrivateRoute>
        } 
      />

      {/* 2. Recruiter Route */}
      <Route 
        path="/recruiter" element={
            <PrivateRoute allowedRoles={['recruiter']}>
                <RecruiterDashboard />
            </PrivateRoute>
        } 
      />

      {/* Post Job Route */}
      <Route path="/recruiter/post-job" element={
            <PrivateRoute allowedRoles={['recruiter']}>
                <PostJob />
            </PrivateRoute>
        } 
      />

      {/* 3. Admin Route */}
      <Route 
        path="/admin" element={
            <PrivateRoute allowedRoles={['admin']}>
                <AdminDashboard />
            </PrivateRoute>
        } 
      />

      {/*4. AI */}
      <Route 
        path="/cv-analyzer" 
          element={<CVAnalyzer />} /> 

      <Route 
        path="/career-roadmap" 
          element={<CareerRoadmap />} />
    </Routes> 
      
      
    </div>
  );
}

export default App;