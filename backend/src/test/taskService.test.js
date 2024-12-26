// test/taskService.test.js
const taskService = require('../services/taskService');
const taskRepository = require('../repositories/taskRepository');

// Mock the taskRepository
jest.mock('../repositories/taskRepository', () => ({
    createTask: jest.fn(),
    getAllTasks: jest.fn(),
    getTasksByUserId: jest.fn(),
    deleteTaskById: jest.fn(),
    getUserTasks: jest.fn(),
}));

describe('Task Service Tests', () => {
    afterEach(() => {
        jest.clearAllMocks();
    });

    describe('createTask', () => {
        it('should create task successfully', async () => {
            const mockTaskData = { task_name: 'Test Task', task_value: 100 };
            const mockSavedTask = { id: 1, ...mockTaskData };

            taskRepository.createTask.mockResolvedValue(mockSavedTask);

            const result = await taskService.createTask(mockTaskData);
            expect(taskRepository.createTask).toHaveBeenCalledWith(mockTaskData);
            expect(result).toEqual(mockSavedTask);
        });

        it('should throw error on failure', async () => {
            taskRepository.createTask.mockRejectedValue(new Error('Some Error'));
            await expect(taskService.createTask({})).rejects.toThrow('Failed to create task');
        });
    });

    describe('getAllTasks', () => {
        it('should return a list of tasks', async () => {
            const mockTasks = [
                { id: 1, task_name: 'Task A' },
                { id: 2, task_name: 'Task B' },
            ];
            taskRepository.getAllTasks.mockResolvedValue(mockTasks);

            const result = await taskService.getAllTasks();
            expect(taskRepository.getAllTasks).toHaveBeenCalled();
            expect(result).toEqual(mockTasks);
        });

        it('should throw error on failure', async () => {
            taskRepository.getAllTasks.mockRejectedValue(new Error('DB Error'));
            await expect(taskService.getAllTasks()).rejects.toThrow('Failed to fetch tasks');
        });
    });

    describe('getTasksByUserId', () => {
        it('should return user tasks', async () => {
            const userId = 10;
            const mockTasks = [{ id: 1, user_id: 10 }];
            taskRepository.getTasksByUserId.mockResolvedValue(mockTasks);

            const result = await taskService.getTasksByUserId(userId);
            expect(taskRepository.getTasksByUserId).toHaveBeenCalledWith(userId);
            expect(result).toEqual(mockTasks);
        });

        it('should throw error on failure', async () => {
            taskRepository.getTasksByUserId.mockRejectedValue(new Error('DB Error'));
            await expect(taskService.getTasksByUserId(10)).rejects.toThrow('Failed to fetch tasks for the user');
        });
    });

    describe('deleteTaskById', () => {
        it('should delete task successfully', async () => {
            taskRepository.deleteTaskById.mockResolvedValue({ affected: 1 });
            await taskService.deleteTaskById(5);
            expect(taskRepository.deleteTaskById).toHaveBeenCalledWith(5);
        });

        it('should throw error on failure', async () => {
            taskRepository.deleteTaskById.mockRejectedValue(new Error('DB Error'));
            await expect(taskService.deleteTaskById(5)).rejects.toThrow('Failed to delete task');
        });
    });

    describe('getUserTasks', () => {
        it('should return tasks for a user', async () => {
            const userId = 20;
            const mockTasks = [{ id: 2, user_id: 20 }];
            taskRepository.getUserTasks.mockResolvedValue(mockTasks);

            const result = await taskService.getUserTasks(userId);
            expect(taskRepository.getUserTasks).toHaveBeenCalledWith(userId);
            expect(result).toEqual(mockTasks);
        });

        it('should throw error on failure', async () => {
            taskRepository.getUserTasks.mockRejectedValue(new Error('DB Error'));
            await expect(taskService.getUserTasks(20)).rejects.toThrow('Failed to fetch tasks for the user');
        });
    });
});
