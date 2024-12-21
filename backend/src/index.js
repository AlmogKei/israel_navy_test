const express = require('express');
const cors = require('cors');
const AppDataSource = require('./database');
const userRoutes = require('./routes/userRoutes');

const app = express();

// הגדרות CORS מעודכנות
app.use(cors({
  origin: ['http://localhost:3001', 'https://israel-navy-test.onrender.com/'],  methods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS'],
  allowedHeaders: ['Content-Type', 'Authorization'],
  credentials: true
}));

app.use(express.json());

(async () => {
  try {
    await AppDataSource.initialize();
    console.log('Database connected!');

    app.use('/users', userRoutes);

    const PORT = process.env.PORT || 3000;
    app.listen(PORT, () => {
      console.log(`Server running on port ${PORT}`);
    });
  } catch (error) {
    console.error('Error during initialization:', error);
    process.exit(1);
  }
})();