import React from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import { AuthProvider } from './context/AuthContext';
import Navbar from './components/Navbar';
import Footer from './components/Footer';
import PrivateRoute from './components/PrivateRoute';

// Pages
import Landing from './pages/Home';
import Login from './pages/Login';
import Register from './pages/Register';
import Search from './pages/Search';
import InternshipList from './pages/InternshipList';
import InternshipDetail from './pages/InternshipDetail';
import StudentDashboard from './pages/StudentDashboard';
import CompanyDashboard from './pages/CompanyDashboard';
import CreateInternship from './pages/CreateInternship';
import EditInternship from './pages/EditInternship';
import ProfileEdit from './pages/Profile';
import MyApplications from './pages/MyApplications';
import ApplicantDetail from './pages/ApplicantDetail';
import ApplicationDetail from './pages/ApplicationDetail';
import Messages from './pages/Messages';
import Notifications from './pages/Notifications';
import About from './pages/About';
import Contact from './pages/Contact';
import FAQ from './pages/FAQ';

// Role-based route wrapper
const RoleRoute = ({ children, allowedRoles }) => {
  const { profile, loading } = React.useContext(require('./context/AuthContext').default);
  
  if (loading) {
    return <div className="spinner"></div>;
  }
  
  if (allowedRoles && profile && !allowedRoles.includes(profile.role)) {
    return <Navigate to="/dashboard" />;
  }
  
  return children;
};

function App() {
  return (
    <AuthProvider>
      <Router>
        <div className="App" style={{ minHeight: '100vh', display: 'flex', flexDirection: 'column' }}>
          <Navbar />
          <main style={{ flex: 1 }}>
            <Routes>
              {/* Public routes */}
              <Route path="/" element={<Landing />} />
              <Route path="/login" element={<Login />} />
              <Route path="/register" element={<Register />} />
              <Route path="/internships" element={<InternshipList />} />
              <Route path="/internships/:id" element={<InternshipDetail />} />
              <Route path="/search" element={<Search />} />
              <Route path="/about" element={<About />} />
              <Route path="/contact" element={<Contact />} />
              <Route path="/faq" element={<FAQ />} />

              {/* Protected routes - All authenticated users */}
              <Route
                path="/dashboard"
                element={
                  <PrivateRoute>
                    <DashboardRouter />
                  </PrivateRoute>
                }
              />
              <Route
                path="/profile"
                element={
                  <PrivateRoute>
                    <ProfileEdit />
                  </PrivateRoute>
                }
              />
              <Route
                path="/messages"
                element={
                  <PrivateRoute>
                    <Messages />
                  </PrivateRoute>
                }
              />
              <Route
                path="/notifications"
                element={
                  <PrivateRoute>
                    <Notifications />
                  </PrivateRoute>
                }
              />

              {/* Student-only routes */}
              <Route
                path="/applications"
                element={
                  <PrivateRoute>
                    <RoleRoute allowedRoles={['student']}>
                      <MyApplications />
                    </RoleRoute>
                  </PrivateRoute>
                }
              />

              {/* Company-only routes */}
              <Route
                path="/internships/create"
                element={
                  <PrivateRoute>
                    <RoleRoute allowedRoles={['company']}>
                      <CreateInternship />
                    </RoleRoute>
                  </PrivateRoute>
                }
              />
              <Route
                path="/internships/:id/edit"
                element={
                  <PrivateRoute>
                    <RoleRoute allowedRoles={['company']}>
                      <EditInternship />
                    </RoleRoute>
                  </PrivateRoute>
                }
              />
              <Route
                path="/internships/:id/applicants"
                element={
                  <PrivateRoute>
                    <RoleRoute allowedRoles={['company']}>
                      <ApplicantDetail />
                    </RoleRoute>
                  </PrivateRoute>
                }
              />
              <Route
                path="/applications/:id"
                element={
                  <PrivateRoute>
                    <RoleRoute allowedRoles={['company']}>
                      <ApplicationDetail />
                    </RoleRoute>
                  </PrivateRoute>
                }
              />

              {/* Catch all */}
              <Route path="*" element={<Navigate to="/" />} />
            </Routes>
          </main>
          <Footer />
        </div>
      </Router>
    </AuthProvider>
  );
}

// Dashboard router based on role
const DashboardRouter = () => {
  const { profile, loading } = React.useContext(require('./context/AuthContext').default);
  
  if (loading) {
    return <div className="spinner"></div>;
  }
  
  if (profile?.role === 'company') {
    return <CompanyDashboard />;
  }
  
  return <StudentDashboard />;
};

export default App;
