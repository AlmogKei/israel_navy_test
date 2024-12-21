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
    console.log('Registration attempt:', { fullName, email, phone });

    if (!fullName || !email || !phone || !password) {
      console.log('Missing required fields');
      return res.status(400).json({ error: 'All fields are required' });
    }

    const userRepository = AppDataSource.getRepository(User);
    const existingUser = await userRepository.findOne({ where: { email } });
    
    if (existingUser) {
      console.log('Email already exists:', email);
      return res.status(400).json({ error: 'Email already registered' });
    }

    const hashedPassword = await bcrypt.hash(password, 10);
    console.log('Password hashed successfully');

    const newUser = userRepository.create({
      fullName,
      email,
      phone,
      password_hash: hashedPassword,
    });

    const savedUser = await userRepository.save(newUser);
    console.log('User saved successfully:', savedUser.id);

    return res.status(201).json({ 
      message: 'User registered successfully', 
      userId: savedUser.id 
    });

  } catch (error) {
    console.error('Registration error:', error);
    return res.status(500).json({ error: 'Internal server error' });
  }
});


// Login user
router.post('/login', async (req, res) => {
  try {
    const { email, password } = req.body;

    // Validation
    if (!email || !password) {
      return res.status(400).json({ error: 'Email or password are required' });
    }

    // Check if the user exists
    const userRepository = AppDataSource.getRepository(User);
    const user = await userRepository.findOneBy({ email });

    if (!user) {
      return res.status(400).json({ error: 'Invalid email' });
    }

    // Compare passwords
    const isMatch = await bcrypt.compare(password, user.password_hash);

    if (!isMatch) {
      return res.status(400).json({ error: 'Invalid password' });
    }

    res.status(200).json({ message: 'Login successful', userId: user.id });
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'Internal server error' });
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
