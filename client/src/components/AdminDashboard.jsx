import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { Plus, Trash2, Send, LogOut } from 'lucide-react';
import { useNavigate } from 'react-router-dom';

const AdminDashboard = () => {
  const [books, setBooks] = useState([]);
  const [requests, setRequests] = useState([]);
  const [newBook, setNewBook] = useState({ title: '', author: '', isbn: '', category: '' });
  const [permissionTarget, setPermissionTarget] = useState('');
  
  const token = localStorage.getItem('token');
  const user = JSON.parse(localStorage.getItem('user'));
  const navigate = useNavigate();

  const authHeaders = { headers: { Authorization: `Bearer ${token}` } };

  const fetchData = async () => {
    try {
      const [booksRes, reqsRes] = await Promise.all([
        axios.get('http://localhost:5000/api/books', authHeaders),
        axios.get('http://localhost:5000/api/requests', authHeaders)
      ]);
      setBooks(booksRes.data);
      setRequests(reqsRes.data);
    } catch (err) {
      console.error('Fetch error:', err);
    }
  };

  useEffect(() => {
    if (!token || user?.role !== 'ADMIN') navigate('/');
    fetchData();
  }, []);

  const handleAddBook = async (e) => {
    e.preventDefault();
    try {
      await axios.post('http://localhost:5000/api/books', newBook, authHeaders);
      setNewBook({ title: '', author: '', isbn: '', category: '' });
      fetchData();
    } catch (err) {
      alert('Failed to add book');
    }
  };

  const handleDeleteBook = async (id) => {
    try {
      await axios.delete(`http://localhost:5000/api/books/${id}`, authHeaders);
      fetchData();
    } catch (err) {
      alert('Failed to delete book');
    }
  };

  const handleRequestPermission = async (e) => {
    e.preventDefault();
    try {
      await axios.post('http://localhost:5000/api/requests', { permission_type: permissionTarget }, authHeaders);
      setPermissionTarget('');
      fetchData();
      alert('Request sent to Super Admin');
    } catch (err) {
      alert('Failed to send request');
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
          <h2 className="text-gradient">Admin Dashboard</h2>
          <p style={{ color: 'var(--text-secondary)' }}>Inventory and Permissions</p>
        </div>
        <button onClick={handleLogout} className="btn btn-secondary" style={{ display: 'flex', gap: '0.5rem' }}>
          <LogOut size={18} /> Logout
        </button>
      </header>

      <div style={{ display: 'grid', gridTemplateColumns: '2fr 1fr', gap: '2rem' }}>
        <div>
          <div className="glass-panel" style={{ marginBottom: '2rem' }}>
            <h3>Add New Book</h3>
            <form onSubmit={handleAddBook} style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1rem' }}>
              <input className="form-input" placeholder="Title" value={newBook.title} onChange={e => setNewBook({...newBook, title: e.target.value})} required />
              <input className="form-input" placeholder="Author" value={newBook.author} onChange={e => setNewBook({...newBook, author: e.target.value})} required />
              <input className="form-input" placeholder="ISBN (Optional)" value={newBook.isbn} onChange={e => setNewBook({...newBook, isbn: e.target.value})} />
              <input className="form-input" placeholder="Category (Optional)" value={newBook.category} onChange={e => setNewBook({...newBook, category: e.target.value})} />
              <button type="submit" className="btn btn-primary" style={{ gridColumn: '1 / -1' }}><Plus size={18} style={{ marginRight: '0.5rem' }}/> Add Book</button>
            </form>
          </div>

          <div className="glass-panel">
            <h3>Library Inventory</h3>
            <div style={{ overflowX: 'auto' }}>
              <table style={{ width: '100%', textAlign: 'left', borderCollapse: 'collapse' }}>
                <thead>
                  <tr style={{ borderBottom: '1px solid var(--glass-border)' }}>
                    <th style={{ padding: '1rem', color: 'var(--text-secondary)' }}>Title</th>
                    <th style={{ padding: '1rem', color: 'var(--text-secondary)' }}>Author</th>
                    <th style={{ padding: '1rem', color: 'var(--text-secondary)' }}>Status</th>
                    <th style={{ padding: '1rem', color: 'var(--text-secondary)', textAlign: 'right' }}>Actions</th>
                  </tr>
                </thead>
                <tbody>
                  {books.map(book => (
                    <tr key={book.id} style={{ borderBottom: '1px solid rgba(255,255,255,0.05)' }}>
                      <td style={{ padding: '1rem' }}>{book.title}</td>
                      <td style={{ padding: '1rem' }}>{book.author}</td>
                      <td style={{ padding: '1rem' }}>
                        <span style={{ color: book.status === 'AVAILABLE' ? 'var(--success)' : 'var(--warning)' }}>{book.status}</span>
                      </td>
                      <td style={{ padding: '1rem', textAlign: 'right' }}>
                        <button onClick={() => handleDeleteBook(book.id)} className="btn btn-secondary" style={{ padding: '0.5rem', border: 'none', color: 'var(--danger)' }}>
                          <Trash2 size={18} />
                        </button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        </div>

        <div>
          <div className="glass-panel" style={{ marginBottom: '2rem' }}>
            <h3>Request Permissions</h3>
            <p style={{ color: 'var(--text-secondary)', fontSize: '0.875rem', marginBottom: '1rem' }}>Request additional privileges from the Super Admin.</p>
            <form onSubmit={handleRequestPermission}>
              <div className="form-group">
                <input 
                  className="form-input" 
                  placeholder="e.g. Delete User Privileges" 
                  value={permissionTarget} 
                  onChange={e => setPermissionTarget(e.target.value)} 
                  required 
                />
              </div>
              <button type="submit" className="btn btn-primary" style={{ width: '100%' }}>
                <Send size={18} style={{ marginRight: '0.5rem' }}/> Submit Request
              </button>
            </form>
          </div>

          <div className="glass-panel">
            <h3>My Requests Status</h3>
            <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
              {requests.length === 0 ? <p style={{ color: 'var(--text-secondary)' }}>No requests made yet.</p> : null}
              {requests.map(req => (
                <div key={req.id} style={{ padding: '1rem', backgroundColor: 'rgba(0,0,0,0.2)', borderRadius: '8px' }}>
                  <p style={{ fontWeight: '500', marginBottom: '0.5rem' }}>{req.permission_type}</p>
                  <span style={{ 
                    fontSize: '0.75rem', 
                    padding: '0.25rem 0.5rem', 
                    borderRadius: '4px',
                    backgroundColor: req.status === 'APPROVED' ? 'var(--success)' : req.status === 'DENIED' ? 'var(--danger)' : 'var(--warning)',
                    color: req.status === 'PENDING' ? '#000' : '#fff'
                  }}>
                    {req.status}
                  </span>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default AdminDashboard;
