const express = require('express');
const cors = require('cors');
const AppDataSource = require('./database');

const app = express();

// Middleware בסיסי
app.use(express.json());
app.use(cors());

// Middleware לבדיקת בקשות
app.use((req, res, next) => {
  console.log('Request received:', {
    method: req.method,
    path: req.url,
    body: req.body,
    headers: req.headers
  });
  next();
});

// Middleware לטיפול בשגיאות
app.use((err, req, res, next) => {
  console.error('Server error:', err);
  res.status(500).json({ error: 'Internal server error', details: err.message });
});

// הפעלת השרת רק אחרי התחברות לדאטהבייס
const startServer = async () => {
  try {
    await AppDataSource.initialize();
    console.log('Database connected successfully');

    app.use('/users', require('./routes/userRoutes'));

    const PORT = process.env.PORT || 3000;
    app.listen(PORT, () => {
      console.log(`Server running on port ${PORT}`);
    });
  } catch (error) {
    console.error('Server initialization error:', error);
    process.exit(1);
  }
};

startServer();