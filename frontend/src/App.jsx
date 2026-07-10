import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import { useMemo, useState } from 'react';
import './App.css';

import LoginPage from './pages/LoginPage/LoginPage';
import RegisterPage from './pages/RegisterPage/RegisterPage';
import AdminLoginPage from './pages/AdminLoginPage/AdminLoginPage';

import EmployeeDashboardPage from './pages/EmployeeDashboardPage/EmployeeDashboardPage';
import AdminDashboardPage from './pages/AdminDashboardPage/AdminDashboardPage';

const API_BASE = import.meta.env.VITE_API_BASE || 'http://127.0.0.1:8000';

const getAuthToken = () => localStorage.getItem('token');

const setAuthToken = (token) => localStorage.setItem('token', token);

const clearAuthToken = () => localStorage.removeItem('token');

const isAdmin = () => {
  const user = JSON.parse(localStorage.getItem('user') || 'null');
  return user?.role === 'admin';
};

const ProtectedRoute = ({ children }) => {
  const token = getAuthToken();
  return token ? children : <Navigate to="/login" replace />;
};

const AdminRoute = ({ children }) => {
  const token = getAuthToken();
  return token && isAdmin() ? children : <Navigate to="/admin-login" replace />;
};

function App() {
  const [user, setUser] = useState(() => {
    try {
      return JSON.parse(localStorage.getItem('user') || 'null');
    } catch {
      return null;
    }
  });

  // Separate active tab state for each dashboard role
  // Admin always defaults to 'overview' so the dashboard is immediately visible on login
  const [adminActiveTab, setAdminActiveTab] = useState('overview');
  const [employeeActiveTab, setEmployeeActiveTab] = useState('dashboard');

  const logout = () => {
    clearAuthToken();
    localStorage.removeItem('user');
    setUser(null);
    // Reset tabs on logout
    setAdminActiveTab('overview');
    setEmployeeActiveTab('dashboard');
    window.location.href = '/login';
  };

  const handleLogin = (result) => {
    setAuthToken(result.access_token);
    localStorage.setItem('user', JSON.stringify(result.user));
    setUser(result.user);
    // Ensure correct default tab on login
    if (result.user?.role === 'admin') {
      setAdminActiveTab('overview');
    } else {
      setEmployeeActiveTab('dashboard');
    }
  };

  const employeeNav = useMemo(
    () => [
      { id: 'dashboard', label: 'Dashboard' },
      { id: 'reports', label: 'My Reports' },
      { id: 'projects', label: 'Projects' },
      { id: 'profile', label: 'Profile' }
    ],
    []
  );

  const adminNav = useMemo(
    () => [
      { id: 'overview', label: 'Overview' },
      { id: 'team', label: 'Team Reports' },
      { id: 'create_project', label: 'Create Project' },
      { id: 'view_projects', label: 'View Projects' }
    ],
    []
  );

  return (
    <BrowserRouter>
      <Routes>
        {/* Employee Login */}
        <Route
          path="/login"
          element={<LoginPage onLogin={handleLogin} />}
        />

        {/* Employee Register */}
        <Route
          path="/register"
          element={<RegisterPage />}
        />

        {/* Admin Login */}
        <Route
          path="/admin-login"
          element={<AdminLoginPage />}
        />

        {/* Employee Dashboard */}
        <Route
          path="/"
          element={
            <ProtectedRoute>
              <EmployeeDashboardPage
                user={user}
                logout={logout}
                activeTab={employeeActiveTab}
                setActiveTab={setEmployeeActiveTab}
                navItems={employeeNav}
                apiBase={API_BASE}
                getAuthToken={getAuthToken}
              />
            </ProtectedRoute>
          }
        />

        {/* Admin Dashboard — always opens on 'overview' */}
        <Route
          path="/admin"
          element={
            <AdminRoute>
              <AdminDashboardPage
                user={user}
                logout={logout}
                activeTab={adminActiveTab}
                setActiveTab={setAdminActiveTab}
                navItems={adminNav}
              />
            </AdminRoute>
          }
        />

        {/* Default Route */}
        <Route
          path="*"
          element={
            <Navigate
              to={user?.role === 'admin' ? '/admin' : '/'}
              replace
            />
          }
        />
      </Routes>
    </BrowserRouter>
  );
}

export default App;