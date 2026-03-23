import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { Shield, ShieldAlert, Check, X, LogOut } from 'lucide-react';
import { useNavigate } from 'react-router-dom';

const SuperAdminDashboard = () => {
  const [requests, setRequests] = useState([]);
  
  const token = localStorage.getItem('token');
  const user = JSON.parse(localStorage.getItem('user'));
  const navigate = useNavigate();

  const authHeaders = { headers: { Authorization: `Bearer ${token}` } };

  const fetchRequests = async () => {
    try {
      const res = await axios.get('http://localhost:5000/api/requests', authHeaders);
      setRequests(res.data);
    } catch (err) {
      console.error('Fetch error:', err);
    }
  };

  useEffect(() => {
    if (!token || user?.role !== 'SUPER_ADMIN') navigate('/');
    fetchRequests();
  }, []);

  const handleUpdateStatus = async (id, status) => {
    try {
      await axios.put(`http://localhost:5000/api/requests/${id}/status`, { status }, authHeaders);
      fetchRequests();
    } catch (err) {
      alert(`Failed to ${status.toLowerCase()} request`);
    }
  };

  const handleLogout = () => {
    localStorage.removeItem('token');
    localStorage.removeItem('user');
    navigate('/');
  };

  return (
    <div className="animate-fade-in">
      <header style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '2rem' }}>
        <div>
          <h2 className="text-gradient">Super Admin Dashboard</h2>
          <p style={{ color: 'var(--text-secondary)' }}>System Oversight and Permission Management</p>
        </div>
        <button onClick={handleLogout} className="btn btn-secondary" style={{ display: 'flex', gap: '0.5rem' }}>
          <LogOut size={18} /> Logout
        </button>
      </header>

      <div className="glass-panel">
        <div style={{ display: 'flex', alignItems: 'center', gap: '1rem', marginBottom: '2rem' }}>
          <ShieldAlert size={32} color="var(--accent-primary)" />
          <h3>Admin Permission Requests</h3>
        </div>

        <div style={{ display: 'grid', gap: '1rem' }}>
          {requests.length === 0 && (
            <div style={{ textAlign: 'center', padding: '2rem', color: 'var(--text-secondary)' }}>
              No pending requests at this time.
            </div>
          )}
          {requests.map(req => (
            <div key={req.id} style={{ 
              display: 'flex', 
              justifyContent: 'space-between', 
              alignItems: 'center',
              padding: '1.5rem',
              backgroundColor: 'rgba(0,0,0,0.2)',
              borderRadius: '12px',
              border: '1px solid var(--glass-border)'
            }}>
              <div>
                <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', marginBottom: '0.5rem' }}>
                  <span style={{ fontWeight: '600' }}>Admin: {req.admin_name}</span>
                  <span style={{ 
                    fontSize: '0.75rem', 
                    padding: '0.25rem 0.5rem', 
                    borderRadius: '4px',
                    backgroundColor: req.status === 'PENDING' ? 'var(--warning)' : (req.status === 'APPROVED' ? 'var(--success)' : 'var(--danger)'),
                    color: req.status === 'PENDING' ? '#000' : '#fff'
                  }}>
                    {req.status}
                  </span>
                </div>
                <p style={{ color: 'var(--text-secondary)' }}>Requested Privilege: <strong style={{ color: 'var(--text-primary)' }}>{req.permission_type}</strong></p>
                <p style={{ fontSize: '0.75rem', color: '#64748b', marginTop: '0.5rem' }}>
                  Requested on: {new Date(req.created_at).toLocaleString()}
                </p>
              </div>

              {req.status === 'PENDING' && (
                <div style={{ display: 'flex', gap: '1rem' }}>
                  <button 
                    onClick={() => handleUpdateStatus(req.id, 'APPROVED')}
                    className="btn" 
                    style={{ backgroundColor: 'rgba(16, 185, 129, 0.2)', color: 'var(--success)' }}
                  >
                    <Check size={18} style={{ marginRight: '0.5rem' }} /> Approve
                  </button>
                  <button 
                    onClick={() => handleUpdateStatus(req.id, 'DENIED')}
                    className="btn" 
                    style={{ backgroundColor: 'rgba(239, 68, 68, 0.2)', color: 'var(--danger)' }}
                  >
                    <X size={18} style={{ marginRight: '0.5rem' }} /> Deny
                  </button>
                </div>
              )}
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default SuperAdminDashboard;
