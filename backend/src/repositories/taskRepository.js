const AppDataSource = require('../database');
const Task = require('../entities/Task');

const taskRepository = AppDataSource.getRepository(Task);

module.exports = {
    // Create a new task
    createTask: async (taskData) => {
        try {
            const newTask = taskRepository.create(taskData);
            return await taskRepository.save(newTask);
        } catch (error) {
            console.error('Error creating task:', error);
            throw new Error('Failed to create task');
        }
    },

    // Get all tasks
    getAllTasks: async () => {
        try {
            return await taskRepository.find({
                order: {
                    created_at: 'DESC'
                }
            });
        } catch (error) {
            console.error('Error fetching all tasks:', error);
            throw new Error('Failed to fetch tasks');
        }
    },

    // Get tasks by user ID
    getUserTasks: async (userId) => {
        try {
            if (!userId) {
                throw new Error('User ID is required');
            }

            return await taskRepository.find({
                where: { user_id: userId },
                order: { created_at: 'DESC' }
            });
        } catch (error) {
            console.error('Error fetching user tasks:', error);
            throw new Error(`Failed to fetch tasks for user ${userId}`);
        }
    },

    // Delete a task by ID
    deleteTaskById: async (taskId) => {
        try {
            if (!taskId) {
                throw new Error('Task ID is required');
            }

            const result = await taskRepository.delete({ id: taskId });

            if (result.affected === 0) {
                throw new Error('Task not found');
            }

            return result;
        } catch (error) {
            console.error('Error deleting task:', error);
            throw new Error(`Failed to delete task ${taskId}`);
        }
    },

    // Update a task by ID
    updateTaskById: async (taskId, updatedTask) => {
        try {
            if (!taskId) {
                throw new Error('Task ID is required');
            }

            const task = await taskRepository.findOne({
                where: { id: taskId }
            });

            if (!task) {
                throw new Error('Task not found');
            }

            if (updatedTask.task_name && typeof updatedTask.task_name !== 'string') {
                throw new Error('Invalid task name');
            }

            if (updatedTask.task_value && isNaN(updatedTask.task_value)) {
                throw new Error('Invalid task value');
            }

            Object.assign(task, updatedTask);
            return await taskRepository.save(task);
        } catch (error) {
            console.error('Error updating task:', error);
            throw new Error(`Failed to update task ${taskId}`);
        }
    },

    // Validate if task exists
    validateTaskExists: async (taskId) => {
        try {
            const task = await taskRepository.findOne({
                where: { id: taskId }
            });
            return !!task;
        } catch (error) {
            console.error('Error validating task:', error);
            throw new Error('Failed to validate task');
        }
    }
};