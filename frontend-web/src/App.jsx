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
import Pricing from './pages/Pricing';
import Jobs from './pages/Jobs';
import JobDetail from './pages/JobDetail';
import EditJob from './pages/EditJob';
import JobApplicants from './pages/JobApplicants';
import Checkout from './pages/Checkout';
import CVEditor from './pages/CVEditor';
import TemplateGallery from './pages/TemplateGallery';
import CareerQuiz from './pages/CareerQuiz';
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
      <Route path="/admin" element={<AdminDashboard />} />

      {/*4. AI */}
      <Route 
        path="/cv-analyzer" 
          element={<CVAnalyzer />} /> 

      <Route 
        path="/career-roadmap" 
          element={<CareerRoadmap />} />

      {/* 5. Pricing */}
      <Route 
        path="/pricing" 
          element={<Pricing />} />

      {/* 6. Jobs Listing */}
      <Route 
        path="/jobs" 
          element={<Jobs />} />

      {/* 7. Job Detail */}
      <Route 
        path="/jobs/:id" 
          element={<JobDetail />} />

      {/* 8. Edit Job (Recruiter) */}
      <Route path="/recruiter/edit-job/:id" element={
            <PrivateRoute allowedRoles={['recruiter']}>
                <EditJob />
            </PrivateRoute>
        } />

      {/* 9. Job Applicants (Recruiter) */}
      <Route path="/recruiter/job/:jobId/applicants" element={
            <PrivateRoute allowedRoles={['recruiter']}>
                <JobApplicants />
            </PrivateRoute>
        } />

      {/* 10. Checkout */}
      <Route 
        path="/checkout" 
          element={<Checkout />} />

      {/* 11. CV Editor */}
      <Route path="/editor/:id" element={<CVEditor />} />

      {/* 12. Template Gallery */}
      <Route path="/cv-templates" element={<TemplateGallery />} />

      {/* 13. Career Quiz */}
      <Route path="/career-quiz" element={<CareerQuiz />} />
    </Routes> 
      
    </div>
  );
}

export default App;