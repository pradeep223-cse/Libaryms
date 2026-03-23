require('dotenv').config();
const mysql = require('mysql2/promise');
const bcrypt = require('bcryptjs');

const initDemoUsers = async () => {
  try {
    const pool = mysql.createPool({
      host: process.env.DB_HOST || 'localhost',
      user: process.env.DB_USER || 'root',
      password: process.env.DB_PASSWORD || 'pradeep@9827482516',
      database: process.env.DB_NAME || 'library_db',
      waitForConnections: true,
      connectionLimit: 10,
      queueLimit: 0
    });

    console.log('Connected to database. Generating hashes...');

    const adminPassword = await bcrypt.hash('admin123', 10);
    const userPassword = await bcrypt.hash('user123', 10);
    // Since superadmin was populated without bcrypt originally, let's fix it too
    const superAdminPassword = await bcrypt.hash('superadmin', 10);

    console.log('Inserting demo users...');

    // Clear existing to avoid duplicate entries for the demo script
    await pool.query('DELETE FROM users WHERE username IN ("admin", "user", "superadmin")');

    await pool.query(
      'INSERT INTO users (username, password, role) VALUES (?, ?, ?), (?, ?, ?), (?, ?, ?)',
      ['superadmin', superAdminPassword, 'SUPER_ADMIN', 'admin', adminPassword, 'ADMIN', 'user', userPassword, 'USER']
    );

    console.log('Demo users correctly inserted.');
    process.exit(0);
  } catch (error) {
    console.error('Error inserting users:', error);
    process.exit(1);
  }
};

initDemoUsers();
