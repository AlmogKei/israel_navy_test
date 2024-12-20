const AppDataSource = require('../database');
const User = require('../entities/User');
const taskRepo = require('./repositories/taskRepository');

module.exports = {
  findByEmail: async (email) => {
    try {
      return await taskRepo.findUserTasks(email);
    } catch (error) {
      console.error('Error finding user by email:', error);
      throw error;
    }
  },

  createAndSaveWithTask: async (email, passwordHash, initialTask) => {
    try {
      const userRepo = AppDataSource.getRepository(User);
      const user = userRepo.create({ email, password_hash: passwordHash });
      const savedUser = await userRepo.save(user);

      const task = await taskRepo.createTask({
        task_name: initialTask.name,
        task_value: initialTask.value,
        user_id: savedUser.id,
      });

      return { user: savedUser, task };
    } catch (error) {
      console.error('Error creating user with task:', error);
      throw error;
    }
  },

  getAllUsersWithTasks: async () => {
    try {
      const userRepo = AppDataSource.getRepository(User);
      const users = await userRepo.find();

      const usersWithTasks = await Promise.all(
        users.map(async (user) => {
          const tasks = await taskRepo.getTasksByUserId(user.id);
          return { ...user, tasks };
        })
      );

      return usersWithTasks;
    } catch (error) {
      console.error('Error fetching users with tasks:', error);
      throw error;
    }
  },
};
