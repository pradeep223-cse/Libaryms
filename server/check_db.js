const mysql = require('mysql2/promise');
require('dotenv').config({ path: '../server/.env' });

async function checkDB() {
  try {
    const connection = await mysql.createConnection({
      host: process.env.DB_HOST,
      user: process.env.DB_USER,
      password: process.env.DB_PASSWORD,
    });
    console.log('Successfully connected to MySQL');
    
    const [rows] = await connection.query(`SHOW DATABASES LIKE '${process.env.DB_NAME}'`);
    if (rows.length > 0) {
      console.log(`Database '${process.env.DB_NAME}' exists.`);
    } else {
      console.log(`Database '${process.env.DB_NAME}' does NOT exist.`);
      console.log('You may need to run the database.sql script.');
    }
    await connection.end();
  } catch (err) {
    console.error('Error connecting to MySQL:', err.message);
  }
}

checkDB();
