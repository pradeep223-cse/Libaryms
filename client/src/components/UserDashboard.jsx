import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { Search, Book, UserCircle, LogOut } from 'lucide-react';
import { useNavigate } from 'react-router-dom';

const UserDashboard = () => {
  const [query, setQuery] = useState('');
  const [books, setBooks] = useState([]);
  const navigate = useNavigate();
  const user = JSON.parse(localStorage.getItem('user'));

  const searchBooks = async () => {
    try {
      const res = await axios.get(`http://localhost:5000/api/books/search?query=${query}`);
      setBooks(res.data);
    } catch (err) {
      console.error(err);
    }
  };

  useEffect(() => {
    searchBooks(); // Initial load
  }, []);

  const handleLogout = () => {
    localStorage.removeItem('token');
    localStorage.removeItem('user');
    navigate('/');
  };

  return (
    <div className="animate-fade-in">
      <header style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '2rem' }}>
        <div>
          <h2>User Dashboard</h2>
          <p style={{ color: 'var(--text-secondary)' }}>Welcome, {user?.username}</p>
        </div>
        <button onClick={handleLogout} className="btn btn-secondary" style={{ display: 'flex', gap: '0.5rem' }}>
          <LogOut size={18} /> Logout
        </button>
      </header>

      <div className="glass-panel" style={{ marginBottom: '2rem' }}>
        <div style={{ display: 'flex', gap: '1rem', alignItems: 'center' }}>
          <Search size={24} color="var(--text-secondary)" />
          <input 
            type="text" 
            className="form-input" 
            placeholder="Search books by title, author, or category..." 
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            onKeyPress={(e) => e.key === 'Enter' && searchBooks()}
          />
          <button className="btn btn-primary" onClick={searchBooks}>Search</button>
        </div>
      </div>

      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(300px, 1fr))', gap: '1.5rem' }}>
        {books.map(book => (
          <div key={book.id} className="glass-panel" style={{ padding: '1.5rem' }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: '1rem' }}>
              <Book size={32} color="var(--accent-primary)" />
              <span style={{ 
                padding: '0.25rem 0.75rem', 
                borderRadius: 'full', 
                fontSize: '0.875rem',
                backgroundColor: book.status === 'AVAILABLE' ? 'rgba(16, 185, 129, 0.1)' : 'rgba(239, 68, 68, 0.1)',
                color: book.status === 'AVAILABLE' ? 'var(--success)' : 'var(--danger)'
              }}>
                {book.status}
              </span>
            </div>
            <h3 style={{ margin: '0 0 0.5rem 0', fontSize: '1.25rem' }}>{book.title}</h3>
            <p style={{ color: 'var(--text-secondary)', margin: '0 0 1rem 0' }}>By {book.author}</p>
            <div style={{ fontSize: '0.875rem', color: '#cbd5e1' }}>
              <p>Category: {book.category || 'N/A'}</p>
              <p>ISBN: {book.isbn || 'N/A'}</p>
            </div>
          </div>
        ))}
        {books.length === 0 && (
          <div style={{ gridColumn: '1 / -1', textAlign: 'center', padding: '3rem', color: 'var(--text-secondary)' }}>
            No books found matching your search.
          </div>
        )}
      </div>
    </div>
  );
};

export default UserDashboard;
