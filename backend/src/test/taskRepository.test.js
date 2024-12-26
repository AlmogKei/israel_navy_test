const AppDataSource = require('../src/database');
const Task = require('../src/entities/Task');
const taskRepository = require('../src/repositories/taskRepository');

// אנו משתמשים ב-jest.mock כדי "ללעוג" (mock) את AppDataSource
jest.mock('../src/database', () => {
    const mockRepository = {
        create: jest.fn(),
        save: jest.fn(),
        find: jest.fn(),
        findOne: jest.fn(),
        delete: jest.fn(),
    };

    return {
        getRepository: jest.fn(() => mockRepository),
    };
});

describe('taskRepository tests', () => {
    let mockRepo;

    beforeAll(() => {
        // AppDataSource.getRepository יחזיר את mockRepository
        mockRepo = AppDataSource.getRepository(Task);
    });

    beforeEach(() => {
        // מנקה קריאות קודמות למתודות המוק (mock)
        jest.clearAllMocks();
    });

    describe('createTask', () => {
        it('should create and save a new task successfully', async () => {
            // הגדרת התנהגות המוק
            const sampleTaskData = { task_name: 'Test Task', task_value: 123 };
            const expectedSavedTask = { id: 1, ...sampleTaskData };

            mockRepo.create.mockReturnValue(expectedSavedTask);
            mockRepo.save.mockResolvedValue(expectedSavedTask);

            const result = await taskRepository.createTask(sampleTaskData);

            expect(mockRepo.create).toHaveBeenCalledWith(sampleTaskData);
            expect(mockRepo.save).toHaveBeenCalledWith(expectedSavedTask);
            expect(result).toEqual(expectedSavedTask);
        });

        it('should throw an error if create/save fails', async () => {
            const sampleTaskData = { task_name: 'Test Task', task_value: 123 };

            mockRepo.create.mockImplementation(() => {
                throw new Error('Error creating task');
            });

            await expect(taskRepository.createTask(sampleTaskData)).rejects.toThrow('Failed to create task');
        });
    });

    describe('getAllTasks', () => {
        it('should return all tasks with order "created_at" DESC', async () => {
            const expectedTasks = [
                { id: 2, task_name: 'BBB', created_at: '2023-01-03' },
                { id: 1, task_name: 'AAA', created_at: '2023-01-02' },
            ];
            mockRepo.find.mockResolvedValue(expectedTasks);

            const result = await taskRepository.getAllTasks();
            expect(mockRepo.find).toHaveBeenCalledWith({ order: { created_at: 'DESC' } });
            expect(result).toEqual(expectedTasks);
        });

        it('should throw an error if find fails', async () => {
            mockRepo.find.mockRejectedValue(new Error('DB error'));
            await expect(taskRepository.getAllTasks()).rejects.toThrow('Failed to fetch tasks');
        });
    });

    describe('getUserTasks', () => {
        it('should return user tasks if userId is provided', async () => {
            const userId = 10;
            const expectedTasks = [{ id: 1, user_id: 10 }, { id: 2, user_id: 10 }];
            mockRepo.find.mockResolvedValue(expectedTasks);

            const result = await taskRepository.getUserTasks(userId);
            expect(mockRepo.find).toHaveBeenCalledWith({
                where: { user_id: userId },
                order: { created_at: 'DESC' },
            });
            expect(result).toEqual(expectedTasks);
        });

        it('should throw an error if userId is not provided', async () => {
            await expect(taskRepository.getUserTasks(null)).rejects.toThrow('User ID is required');
        });

        it('should throw an error if db fails', async () => {
            mockRepo.find.mockRejectedValue(new Error('DB error'));
            await expect(taskRepository.getUserTasks(10)).rejects.toThrow('Failed to fetch tasks for user 10');
        });
    });

    describe('deleteTaskById', () => {
        it('should delete a task by ID if task exists', async () => {
            const taskId = 5;
            mockRepo.delete.mockResolvedValue({ affected: 1 });

            const result = await taskRepository.deleteTaskById(taskId);
            expect(mockRepo.delete).toHaveBeenCalledWith({ id: taskId });
            expect(result).toEqual({ affected: 1 });
        });

        it('should throw an error if taskId is not provided', async () => {
            await expect(taskRepository.deleteTaskById(null)).rejects.toThrow('Task ID is required');
        });

        it('should throw an error if no rows are affected (task not found)', async () => {
            mockRepo.delete.mockResolvedValue({ affected: 0 });
            await expect(taskRepository.deleteTaskById(5)).rejects.toThrow('Task not found');
        });

        it('should throw an error if delete fails', async () => {
            mockRepo.delete.mockRejectedValue(new Error('DB error'));
            await expect(taskRepository.deleteTaskById(5)).rejects.toThrow('Failed to delete task 5');
        });
    });

    describe('updateTaskById', () => {
        it('should update a task if it exists and inputs are valid', async () => {
            const taskId = 1;
            const existingTask = { id: 1, task_name: 'Old Name', task_value: 200 };
            const updates = { task_name: 'New Name', task_value: 300 };
            mockRepo.findOne.mockResolvedValue(existingTask);
            mockRepo.save.mockResolvedValue({ ...existingTask, ...updates });

            const result = await taskRepository.updateTaskById(taskId, updates);
            expect(mockRepo.findOne).toHaveBeenCalledWith({ where: { id: taskId } });
            expect(result.task_name).toBe('New Name');
            expect(result.task_value).toBe(300);
        });

        it('should throw an error if task ID is missing', async () => {
            await expect(taskRepository.updateTaskById(null, {})).rejects.toThrow('Task ID is required');
        });

        it('should throw an error if task not found', async () => {
            mockRepo.findOne.mockResolvedValue(null);
            await expect(taskRepository.updateTaskById(999, { task_name: 'doesnt matter' })).rejects.toThrow('Task not found');
        });

        it('should throw an error if updatedTask.task_name is not a string', async () => {
            const existingTask = { id: 1, task_name: 'old', task_value: 200 };
            mockRepo.findOne.mockResolvedValue(existingTask);
            await expect(taskRepository.updateTaskById(1, { task_name: 123 })).rejects.toThrow('Invalid task name');
        });

        it('should throw an error if updatedTask.task_value is not a number', async () => {
            const existingTask = { id: 1, task_name: 'old', task_value: 200 };
            mockRepo.findOne.mockResolvedValue(existingTask);
            await expect(taskRepository.updateTaskById(1, { task_value: 'abc' })).rejects.toThrow('Invalid task value');
        });

        it('should throw an error if save fails', async () => {
            const existingTask = { id: 1, task_name: 'old', task_value: 200 };
            mockRepo.findOne.mockResolvedValue(existingTask);
            mockRepo.save.mockRejectedValue(new Error('DB error'));

            await expect(taskRepository.updateTaskById(1, { task_name: 'New Name' })).rejects.toThrow('Failed to update task 1');
        });
    });

    describe('validateTaskExists', () => {
        it('should return true if task exists', async () => {
            const existingTask = { id: 2 };
            mockRepo.findOne.mockResolvedValue(existingTask);

            const result = await taskRepository.validateTaskExists(2);
            expect(result).toBe(true);
        });

        it('should return false if task does not exist', async () => {
            mockRepo.findOne.mockResolvedValue(null);
            const result = await taskRepository.validateTaskExists(999);
            expect(result).toBe(false);
        });

        it('should throw an error if findOne fails', async () => {
            mockRepo.findOne.mockRejectedValue(new Error('DB error'));
            await expect(taskRepository.validateTaskExists(1)).rejects.toThrow('Failed to validate task');
        });
    });
});
