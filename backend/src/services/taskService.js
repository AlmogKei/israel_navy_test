const taskRepository = require('../repositories/taskRepository');

module.exports = {
  createTask: async function (taskData) {
    try {
      const newTask = await taskRepository.createTask(taskData);
      console.log('Task created successfully:', newTask);
      return newTask;
    } catch (error) {
      console.error('Error creating task:', error);
      throw new Error('Failed to create task');
    }
  },

  getAllTasks: async function () {
    try {
      const tasks = await taskRepository.getAllTasks();
      console.log('Tasks fetched successfully:', tasks);
      return tasks;
    } catch (error) {
      console.error('Error fetching tasks:', error);
      throw new Error('Failed to fetch tasks');
    }
  },

  getTasksByUserId: async function (userId) {
    try {
      const tasks = await taskRepository.getTasksByUserId(userId);
      console.log(`Tasks fetched for user ID ${userId}:`, tasks);
      return tasks;
    } catch (error) {
      console.error(`Error fetching tasks for user ID ${userId}:`, error);
      throw new Error('Failed to fetch tasks for the user');
    }
  },

  deleteTaskById: async function (taskId) {
    try {
      const result = await taskRepository.deleteTaskById(taskId);
      console.log(`Task with ID ${taskId} deleted successfully`);
      return result;
    } catch (error) {
      console.error(`Error deleting task with ID ${taskId}:`, error);
      throw new Error('Failed to delete task');
    }
  },

  getUserTasks: async function (userId) {
    try {
      const tasks = await taskRepository.getUserTasks(userId);
      console.log(`Tasks fetched for user ID ${userId}:`, tasks);
      return tasks;
    } catch (error) {
      console.error(`Error fetching tasks for user ID ${userId}:`, error);
      throw new Error('Failed to fetch tasks for the user');
    }
  },
};
