const express = require('express');
const cors = require('cors');
const db = require('./config/database');

const app = express();

// הוספה לפני הגדרת הראוטים
app.use((req, res, next) => {
  const originalJson = res.json;
  res.json = function(data) {
      console.log('Response being sent:', data);
      return originalJson.call(this, data);
  };
  next();
});

// הוספת נתיב בדיקה
app.get('/test', (req, res) => {
  res.json({ message: 'Server is working' });
});

// Middleware
app.use(express.json());
app.use(cors({
  origin: '*',
  methods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS'],
  allowedHeaders: ['Content-Type', 'Authorization']
}));

// בדיקת חיבור לדאטהבייס
db.connect()
  .then(client => {
    console.log('Database connected successfully');
    client.release();
  })
  .catch(err => {
    console.error('Database connection error:', err);
  });

// Routes
app.get('/health', (req, res) => {
  res.json({ status: 'ok', timestamp: new Date().toISOString() });
});

app.use('/users', require('./routes/userRoutes'));

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});