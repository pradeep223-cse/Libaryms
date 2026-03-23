const express = require('express');
const router = express.Router();
const pool = require('../db');
const { authenticateToken, requireRole } = require('../auth');

// Create a new permission request (Admin only)
router.post('/', authenticateToken, requireRole(['ADMIN']), async (req, res) => {
  try {
    const { permission_type } = req.body;
    
    if (!permission_type) {
      return res.status(400).json({ error: 'Permission type is required' });
    }
    
    const [result] = await pool.query(
      'INSERT INTO admin_requests (admin_id, permission_type, status) VALUES (?, ?, ?)',
      [req.user.id, permission_type, 'PENDING']
    );
    
    res.status(201).json({ message: 'Request submitted successfully', requestId: result.insertId });
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'Failed to submit request' });
  }
});

// Get all requests (Super Admin only, or Admin's own requests)
router.get('/', authenticateToken, requireRole(['ADMIN', 'SUPER_ADMIN']), async (req, res) => {
  try {
    let sql, params;
    
    if (req.user.role === 'SUPER_ADMIN') {
      sql = `
        SELECT r.*, u.username as admin_name 
        FROM admin_requests r 
        JOIN users u ON r.admin_id = u.id 
        ORDER BY r.created_at DESC
      `;
      params = [];
    } else {
      sql = 'SELECT * FROM admin_requests WHERE admin_id = ? ORDER BY created_at DESC';
      params = [req.user.id];
    }
    
    const [requests] = await pool.query(sql, params);
    res.json(requests);
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'Failed to fetch requests' });
  }
});

// Update request status (Super Admin only)
router.put('/:id/status', authenticateToken, requireRole(['SUPER_ADMIN']), async (req, res) => {
  try {
    const { id } = req.params;
    const { status } = req.body;
    
    if (!['APPROVED', 'DENIED'].includes(status)) {
      return res.status(400).json({ error: 'Invalid status' });
    }
    
    await pool.query('UPDATE admin_requests SET status = ? WHERE id = ?', [status, id]);
    
    res.json({ message: `Request ${status.toLowerCase()} successfully` });
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'Failed to update request status' });
  }
});

module.exports = router;
