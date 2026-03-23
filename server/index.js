const express = require('express');
const cors = require('cors');
require('dotenv').config();

const app = express();
const port = process.env.PORT || 5000;

app.use(cors());
app.use(express.json());

const authRoutes = require('./routes/auth');
const bookRoutes = require('./routes/books');
const requestRoutes = require('./routes/requests');

// Basic route test
app.get('/api/health', (req, res) => {
  res.json({ status: 'ok', message: 'Library API is running' });
});

app.use('/api/auth', authRoutes);
app.use('/api/books', bookRoutes);
app.use('/api/requests', requestRoutes);

app.listen(port, () => {
  console.log(`Server running on port ${port}`);
});
