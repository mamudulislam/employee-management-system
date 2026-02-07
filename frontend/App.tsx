import React, { useState, useEffect } from 'react';
import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import { ThemeProvider } from './contexts/ThemeContext';
import AppLayout from './layouts/AppLayout';
import Dashboard from './components/Dashboard';
import EmployeeDirectory from './components/EmployeeDirectory';
import Payroll from './components/Payroll';
import Attendance from './components/Attendance';
import PerformanceEnhanced from './components/PerformanceEnhanced';
import Reports from './components/Reports';
import Login from './components/Login';
import Settings from './components/Settings';
import SearchResults from './components/SearchResults';
import OrganizationChart from './components/OrganizationChart';
import WorkspacePage from './pages/WorkspacePage';
import ProjectList from './pages/projects/ProjectList';
import ProjectDetails from './pages/projects/ProjectDetails';
import Leaves from './components/Leaves';
import RecruitmentEnhanced from './components/RecruitmentEnhanced';



import { User } from './types';
import { AuthService } from './services/authService';

const App: React.FC = () => {
  const [currentUser, setCurrentUser] = useState<User | null>(null);

  useEffect(() => {
    // Check if user is already authenticated on app load
    if (AuthService.isAuthenticated()) {
      const user = AuthService.getUser();
      if (user) {
        const userObj: User = {
          id: user.id,
          name: user.name,
          email: user.email,
          role: user.role,
          avatar: user.avatar || '',
          department: user.department
        };
        setCurrentUser(userObj);
      }
    }
  }, []);

  const handleLogout = () => {
    AuthService.logout();
    setCurrentUser(null);
  };

  return (
    <ThemeProvider>
      <BrowserRouter>
        <Routes>
          {!currentUser ? (
            <Route path="*" element={<Login onLogin={setCurrentUser} />} />
          ) : (
            <Route element={<AppLayout currentUser={currentUser} onLogout={handleLogout} />}>
              <Route path="/" element={<Navigate to="/dashboard" replace />} />
              <Route path="/dashboard" element={<Dashboard user={currentUser} />} />
              <Route path="/employees" element={<EmployeeDirectory />} />
              <Route path="/payroll" element={<Payroll />} />
              <Route path="/attendance" element={<Attendance />} />
              <Route path="/leaves" element={<Leaves />} />
              <Route path="/performance" element={<PerformanceEnhanced />} />
              <Route path="/recruitment" element={<RecruitmentEnhanced />} />



              <Route path="/reports" element={<Reports />} />
              <Route path="/org-chart" element={<OrganizationChart />} />
              <Route path="/workspace" element={<WorkspacePage />} />
              <Route path="/settings" element={<Settings currentUser={currentUser} onLogout={handleLogout} />} />
              <Route path="/search" element={<SearchResults />} />

              {/* Complex Nested Routes for Projects */}
              <Route path="/projects" element={<ProjectList />} />
              <Route path="/projects/:id" element={<ProjectDetails />} />
            </Route>
          )}
        </Routes>
        <ToastContainer
          position="top-right"
          autoClose={5000}
          hideProgressBar={false}
          newestOnTop={false}
          closeOnClick
          rtl={false}
          pauseOnFocusLoss
          draggable
          pauseOnHover
          theme="light"
        />
      </BrowserRouter>
    </ThemeProvider>
  );
};

export default App;

