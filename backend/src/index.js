const express = require('express');
const cors = require('cors');
const AppDataSource = require('./database');
const userRoutes = require('./routes/userRoutes');

const app = express();

// CORS updated settings
app.use(cors({
  origin: [
    'http://localhost:3001',
    'https://israel-navy-test.onrender.com'  // הסרת ה-/ בסוף
  ],
  methods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS'],
  allowedHeaders: [
    'Content-Type', 
    'Authorization', 
    'Accept'
  ],
  credentials: true,
  maxAge: 86400 // 24 שעות בשניות
}));

// הגנה נוספת
app.use(express.json({ limit: '10mb' }));
app.use(express.urlencoded({ extended: true, limit: '10mb' }));

// Health check route
app.get('/', (req, res) => {
  res.json({ message: 'Server is running' });
});

(async () => {
  try {
    await AppDataSource.initialize();
    console.log('Database connected!');

    app.use('/users', userRoutes);

    const PORT = process.env.PORT || 3000;
    app.listen(PORT, '0.0.0.0', () => {  // הוספת '0.0.0.0' לאפשר חיבורים מבחוץ
      console.log(`Server running on port ${PORT}`);
    });
  } catch (error) {
    console.error('Error during initialization:', error);
    process.exit(1);
  }
})();

// Error handling middleware
app.use((err, req, res, next) => {
  console.error(err.stack);
  res.status(500).json({ 
    error: 'Internal Server Error',
    message: process.env.NODE_ENV === 'development' ? err.message : undefined
  });
});

process.on('unhandledRejection', (err) => {
  console.error('Unhandled Rejection:', err);
  process.exit(1);
});