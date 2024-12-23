// בקובץ index.js
const express = require('express');
const cors = require('cors');
const AppDataSource = require('./database');

const app = express();

// הוסף את זה לפני הראוטים
app.use((req, res, next) => {
  console.log(`${req.method} ${req.path}`, {
    body: req.body,
    headers: req.headers
  });
  next();
});

app.use(cors({
  origin: ['http://localhost:3001', 'https://israel-navy-test.onrender.com'],
  methods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS'],
  allowedHeaders: ['Content-Type', 'Authorization'],
  credentials: true
}));

app.use(express.json());

async function startServer() {
  try {
    await AppDataSource.initialize();
    console.log('Database Connected Successfully!');

    app.use('/users', require('./routes/userRoutes'));

    const PORT = process.env.PORT || 3000;
    app.listen(PORT, () => {
      console.log(`Server is running on port ${PORT}`);
    });
  } catch (error) {
    console.error('Error during initialization:', error);
    process.exit(1);
  }
}

startServer();