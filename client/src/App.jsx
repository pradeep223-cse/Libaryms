import React from 'react';
import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import Login from './components/Login';
import UserDashboard from './components/UserDashboard';
import AdminDashboard from './components/AdminDashboard';
import SuperAdminDashboard from './components/SuperAdminDashboard';

// Custom protected route wrapper
const ProtectedRoute = ({ children, allowedRoles }) => {
  const token = localStorage.getItem('token');
  const userStr = localStorage.getItem('user');
  
  if (!token || !userStr) {
    return <Navigate to="/" replace />;
  }

  try {
    const user = JSON.parse(userStr);
    if (!allowedRoles.includes(user.role)) {
      // Redirect to their respective dashboard if they try to access wrong role page
      if (user.role === 'SUPER_ADMIN') return <Navigate to="/super-admin" replace />;
      if (user.role === 'ADMIN') return <Navigate to="/admin" replace />;
      return <Navigate to="/user" replace />;
    }
  } catch (err) {
    return <Navigate to="/" replace />;
  }

  return children;
};

function App() {
  return (
    <BrowserRouter>
      <div className="app-container">
        <Routes>
          <Route path="/" element={<Login />} />
          <Route 
            path="/user" 
            element={
              <ProtectedRoute allowedRoles={['USER', 'ADMIN', 'SUPER_ADMIN']}>
                <UserDashboard />
              </ProtectedRoute>
            } 
          />
          <Route 
            path="/admin" 
            element={
              <ProtectedRoute allowedRoles={['ADMIN', 'SUPER_ADMIN']}>
                <AdminDashboard />
              </ProtectedRoute>
            } 
          />
          <Route 
            path="/super-admin" 
            element={
              <ProtectedRoute allowedRoles={['SUPER_ADMIN']}>
                <SuperAdminDashboard />
              </ProtectedRoute>
            } 
          />
          <Route path="*" element={<Navigate to="/" replace />} />
        </Routes>
      </div>
    </BrowserRouter>
  );
}

export default App;
