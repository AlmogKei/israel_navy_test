const express = require('express');
const cors = require('cors');
const AppDataSource = require('./database');
const userRoutes = require('./routes/userRoutes');

const app = express();

app.use(cors());
app.use(express.json());

(async () => {
  try {
    await AppDataSource.initialize();
    console.log('Database connected!');


    app.use('/users', userRoutes);

    // starting the server
    const PORT = process.env.PORT || 3000;
    app.listen(PORT, () => {
      console.log(`Server running on http://localhost:${PORT}`);
    });
  } catch (error) {
    console.error('Error during initialization:', error);
    process.exit(1);
  }
})();