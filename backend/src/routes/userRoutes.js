const express = require('express');
const bcrypt = require('bcrypt');
const AppDataSource = require('../database');
const User = require('../entities/User');
const taskRepository = require('../repositories/taskRepository');

const router = express.Router();

// Register a new user
router.post('/register', async (req, res) => {
  try {
    const { fullName, email, phone, password } = req.body;
    console.log('Starting registration with:', { fullName, email, phone });

    const userRepository = AppDataSource.getRepository(User);

    // בדיקת משתמש קיים
    const existingUser = await userRepository.findOne({ where: { email } });
    if (existingUser) {
      console.log('User already exists:', email);
      return res.status(400).json({ error: 'Email already registered' });
    }

    // הצפנת סיסמה
    const hashedPassword = await bcrypt.hash(password, 10);

    // יצירת משתמש חדש
    const newUser = userRepository.create({
      fullName,
      email,
      phone,
      password_hash: hashedPassword
    });

    // שמירה בדאטהבייס
    const savedUser = await userRepository.save(newUser);
    console.log('User saved successfully:', savedUser.id);

    // בדיקה שהמשתמש נשמר
    const verifyUser = await userRepository.findOne({ where: { id: savedUser.id } });
    console.log('Verification of saved user:', verifyUser ? 'Success' : 'Failed');

    res.status(201).json({
      message: 'User registered successfully',
      userId: savedUser.id,
      fullName: savedUser.fullName
    });

  } catch (error) {
    console.error('Registration error:', error);
    console.error('Full error stack:', error.stack);
    res.status(500).json({ error: 'Registration failed: ' + error.message });
  }
});


// Login user
router.post('/login', async (req, res) => {
  console.log('Login request received with body:', req.body);

  try {
    const { email, password } = req.body;

    // בדיקת קלט
    if (!email || !password) {
      console.log('Missing credentials');
      return res.status(400).json({
        success: false,
        error: 'נדרש אימייל וסיסמה'
      });
    }

    // בדיקת חיבור לדאטהבייס
    const client = await db.connect();
    console.log('Connected to database');

    try {
      // חיפוש המשתמש
      const query = 'SELECT * FROM users WHERE email = $1';
      console.log('Executing query:', query, 'with email:', email);

      const result = await client.query(query, [email]);
      console.log('Query result rows:', result.rows.length);

      const user = result.rows[0];

      if (!user) {
        console.log('No user found with email:', email);
        return res.status(401).json({
          success: false,
          error: 'פרטי התחברות שגויים'
        });
      }

      console.log('User found:', { id: user.id, email: user.email });

      // בדיקת סיסמה
      const isPasswordValid = await bcrypt.compare(password, user.password_hash);
      console.log('Password validation result:', isPasswordValid);

      if (!isPasswordValid) {
        console.log('Invalid password for user:', email);
        return res.status(401).json({
          success: false,
          error: 'פרטי התחברות שגויים'
        });
      }

      // הכנת התשובה
      const responseData = {
        success: true,
        id: user.id,
        email: user.email,
        fullName: user.fullname
      };

      console.log('Sending response:', responseData);

      // שליחת התשובה
      return res.status(200).json(responseData);

    } finally {
      // שחרור החיבור לדאטהבייס
      client.release();
      console.log('Database connection released');
    }

  } catch (error) {
    console.error('Login error:', error);
    return res.status(500).json({
      success: false,
      error: 'שגיאת שרת',
      details: error.message
    });
  }
});

// הוספת נתיב בדיקה
router.get('/test', (req, res) => {
  res.json({ message: 'Test route working' });
});

// Get all users
router.get('/', async (req, res) => {
  try {
    const userRepository = AppDataSource.getRepository(User);
    const users = await userRepository.find();

    res.status(200).json(users);
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'Internal server error' });
  }
});

// Get a user by ID
router.get('/:id', async (req, res) => {
  try {
    const { id } = req.params;

    const userRepository = AppDataSource.getRepository(User);
    const user = await userRepository.findOne({ where: { id } });

    if (!user) {
      return res.status(404).json({ error: 'User not found' });
    }

    ~res.status(200).json(user);
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'Internal server error' });
  }
});


// Create a new task
router.post('/tasks', async (req, res) => {
  try {
    const { task_name, task_value, user_id } = req.body;
    const newTask = await taskRepository.createTask({
      task_name,
      task_value,
      user_id
    });
    res.status(201).json(newTask);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});


router.get('/tasks/:userId', async (req, res) => {
  const { userId } = req.params;

  try {
    const userIdNum = parseInt(userId, 10);
    if (isNaN(userIdNum)) {
      return res.status(400).json({ error: 'Invalid user ID' });
    }

    const tasks = await taskRepository.getUserTasks(userIdNum);
    return res.json(tasks);

  } catch (error) {
    console.error('Route Error:', error);
    return res.status(500).json({
      error: 'Internal server error',
      message: error.message
    });
  }
});


router.delete('/tasks/:taskId', async (req, res) => {
  const { taskId } = req.params;
  try {
    await taskRepository.deleteTaskById(taskId);
    res.status(200).json({ message: 'Task deleted successfully' });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});


router.put('/tasks/:taskId', async (req, res) => {
  const { taskId } = req.params;
  const { task_name, task_value } = req.body;
  try {
    const task = await taskRepository.updateTaskById(taskId, {
      task_name,
      task_value,
    });
    if (!task) {
      return res.status(404).json({ error: 'Task not found' });
    }
    res.status(200).json(task);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});



module.exports = router;