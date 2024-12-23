// index.js
const express = require('express');
const cors = require('cors');
const db = require('./config/database');

const app = express();

// CORS configuration
app.use(cors());

// Body parsing middleware
app.use(express.json());

// Logging middleware
app.use((req, res, next) => {
  console.log(`${req.method} ${req.url}`, {
    body: req.body,
    headers: req.headers
  });

  // Override the res.json method to log responses
  const originalJson = res.json;
  res.json = function (body) {
    console.log('Response body:', body);
    return originalJson.call(this, body);
  };

  next();
});

// Test route
app.get('/test', (req, res) => {
  return res.json({ message: 'Hello from server!' });
});

app.use('/users', require('./routes/userRoutes'));

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});