CREATE DATABASE IF NOT EXISTS library_db;
USE library_db;

CREATE TABLE IF NOT EXISTS users (
    id INT AUTO_INCREMENT PRIMARY KEY,
    username VARCHAR(255) UNIQUE NOT NULL,
    password VARCHAR(255) NOT NULL,
    role ENUM('USER', 'ADMIN', 'SUPER_ADMIN') NOT NULL DEFAULT 'USER',
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

CREATE TABLE IF NOT EXISTS books (
    id INT AUTO_INCREMENT PRIMARY KEY,
    title VARCHAR(255) NOT NULL,
    author VARCHAR(255) NOT NULL,
    isbn VARCHAR(100) UNIQUE,
    category VARCHAR(100),
    status ENUM('AVAILABLE', 'BORROWED') NOT NULL DEFAULT 'AVAILABLE',
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

CREATE TABLE IF NOT EXISTS admin_requests (
    id INT AUTO_INCREMENT PRIMARY KEY,
    admin_id INT NOT NULL,
    permission_type VARCHAR(255) NOT NULL,
    status ENUM('PENDING', 'APPROVED', 'DENIED') NOT NULL DEFAULT 'PENDING',
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (admin_id) REFERENCES users(id) ON DELETE CASCADE
);

-- Insert a default Super Admin
INSERT IGNORE INTO users (username, password, role) VALUES ('superadmin', '$2b$10$superadminhashedpasswordplaceholder', 'SUPER_ADMIN');
-- Note: Replace the password hash with a proper bcrypt hash when generating users via API.
