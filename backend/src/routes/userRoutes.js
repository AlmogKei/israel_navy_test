const express = require('express');
const bcrypt = require('bcrypt');
const AppDataSource = require('../database');
const User = require('../entities/User');
const taskRepository = require('../repositories/taskRepository');
const pool = require('../config/database');

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

router.get('/test', async (req, res) => {
  try {
    const { rows } = await pool.query('SELECT id, email FROM users');
    console.log('Test query result:', rows);
    res.json({
      success: true,
      users: rows
    });
  } catch (error) {
    console.error('Test route error:', error);
    res.status(500).json({
      success: false,
      error: error.message
    });
  }
});

// Login user
router.post('/login', async (req, res) => {
  console.log('Login attempt with:', req.body);

  try {
    const { email, password } = req.body;

    // בדיקת משתמש
    const { rows } = await pool.query(
      'SELECT * FROM users WHERE email = $1',
      [email]
    );

    console.log('Found user:', rows[0] ? 'Yes' : 'No');

    if (rows.length === 0) {
      return res.status(401).json({
        success: false,
        error: 'משתמש לא קיים'
      });
    }

    const user = rows[0];
    const isValidPassword = await bcrypt.compare(password, user.password_hash);

    if (!isValidPassword) {
      return res.status(401).json({
        success: false,
        error: 'סיסמה שגויה'
      });
    }

    return res.json({
      success: true,
      id: user.id,
      email: user.email,
      fullName: user.fullname
    });

  } catch (error) {
    console.error('Login error:', error);
    return res.status(500).json({
      success: false,
      error: 'שגיאת שרת',
      details: error.message
    });
  }
});

// נוסיף נתיב בדיקה
router.get('/check-users', async (req, res) => {
  try {
    const result = await pool.query('SELECT id, email FROM users');
    return res.json({
      success: true,
      userCount: result.rows.length,
      users: result.rows
    });
  } catch (error) {
    return res.status(500).json({
      success: false,
      error: error.message
    });
  }
});

// נתיב בדיקה חדש
router.get('/debug', async (req, res) => {
  let client;
  try {
    client = await pool.connect();

    // בדיקת מבנה הטבלה
    const tableStructure = await client.query(`
          SELECT column_name, data_type 
          FROM information_schema.columns 
          WHERE table_name = 'users'
          ORDER BY ordinal_position
      `);

    // בדיקת משתמשים
    const users = await client.query(`
          SELECT id, email, fullname, created_at 
          FROM users 
          ORDER BY id DESC
      `);

    res.json({
      success: true,
      tableStructure: tableStructure.rows,
      userCount: users.rowCount,
      users: users.rows
    });

  } catch (error) {
    console.error('Debug endpoint error:', error);
    res.status(500).json({
      success: false,
      error: error.message
    });
  } finally {
    if (client) client.release();
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