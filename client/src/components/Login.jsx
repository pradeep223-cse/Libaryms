import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';
import { BookOpen } from 'lucide-react';

const Login = () => {
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const navigate = useNavigate();

  const handleLogin = async (e) => {
    e.preventDefault();
    setError('');
    try {
      const response = await axios.post('http://localhost:5000/api/auth/login', {
        username,
        password,
      });
      
      const { token, user } = response.data;
      localStorage.setItem('token', token);
      localStorage.setItem('user', JSON.stringify(user));

      if (user.role === 'SUPER_ADMIN') {
        navigate('/super-admin');
      } else if (user.role === 'ADMIN') {
        navigate('/admin');
      } else {
        navigate('/user');
      }
    } catch (err) {
      setError(err.response?.data?.error || 'Login failed');
    }
  };

  return (
    <div className="animate-fade-in" style={{ display: 'flex', justifyContent: 'center', alignItems: 'center', minHeight: '80vh' }}>
      <div className="glass-panel" style={{ width: '100%', maxWidth: '400px' }}>
        <div style={{ textAlign: 'center', marginBottom: '2rem' }}>
          <BookOpen size={48} color="var(--accent-primary)" style={{ marginBottom: '1rem' }} />
          <h2 className="text-gradient">Library Portal</h2>
          <p style={{ color: 'var(--text-secondary)' }}>Sign in to access the system</p>
        </div>
        
        {error && <div style={{ color: 'var(--danger)', marginBottom: '1rem', textAlign: 'center', padding: '0.5rem', background: 'rgba(239, 68, 68, 0.1)', borderRadius: '4px' }}>{error}</div>}
        
        <form onSubmit={handleLogin}>
          <div className="form-group">
            <label className="form-label">Username</label>
            <input 
              className="form-input" 
              type="text" 
              value={username} 
              onChange={(e) => setUsername(e.target.value)} 
              required 
              placeholder="Enter username"
            />
          </div>
          <div className="form-group">
            <label className="form-label">Password</label>
            <input 
              className="form-input" 
              type="password" 
              value={password} 
              onChange={(e) => setPassword(e.target.value)} 
              required 
              placeholder="Enter password"
            />
          </div>
          <button type="submit" className="btn btn-primary" style={{ width: '100%', marginTop: '1rem' }}>
            Sign In
          </button>
        </form>
      </div>
    </div>
  );
};

export default Login;
