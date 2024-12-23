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
  try {
    const { email, password } = req.body;
    console.log('Login request received:', { email }); // לוג 1

    // בדיקת שדות חובה
    if (!email || !password) {
      console.log('Missing required fields');
      return res.status(400).json({ error: 'Email and password are required' });
    }

    // מציאת המשתמש
    const userRepository = AppDataSource.getRepository(User);
    console.log('Looking for user with email:', email); // לוג 2

    const user = await userRepository.findOne({
      where: { email }
    });

    console.log('Database query result:', user ? 'User found' : 'User not found'); // לוג 3

    if (!user) {
      console.log('No user found with email:', email);
      return res.status(401).json({ error: 'Invalid credentials' });
    }

    // השוואת סיסמאות
    console.log('Comparing passwords'); // לוג 4
    const isValidPassword = await bcrypt.compare(password, user.password_hash);
    console.log('Password comparison result:', isValidPassword); // לוג 5

    if (!isValidPassword) {
      console.log('Invalid password for user:', email);
      return res.status(401).json({ error: 'Invalid credentials' });
    }

    // הכנת תשובה
    const responseData = {
      id: user.id,
      email: user.email,
      fullName: user.fullName
    };

    console.log('Sending successful response:', responseData); // לוג 6

    // שליחת התשובה
    return res.status(200).json(responseData);

  } catch (error) {
    console.error('Login error:', error);
    return res.status(500).json({
      error: 'Server error',
      details: error.message
    });
  }
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