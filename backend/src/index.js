const express = require('express');
const cors = require('cors');
const pool = require('./config/database');  // שינוי משם המשתנה

const app = express();

app.use(cors());
app.use(express.json());

// בדיקת חיבור לדאטהבייס
pool.connect()
  .then(client => {
    console.log('Database connection successful');
    client.release();
  })
  .catch(err => {
    console.error('Database connection error:', err);
  });

// Test route
app.get('/test', (req, res) => {
  res.json({ message: 'Server working' });
});

app.use('/users', require('./routes/userRoutes'));

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});