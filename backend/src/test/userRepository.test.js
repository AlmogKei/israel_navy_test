const AppDataSource = require('../database');
const User = require('../entities/User');
const taskRepo = require('../repositories/taskRepository');
const userRepository = require('../repositories/userRepository');

// Mock the dependencies
jest.mock('../database', () => {
    const mockRepository = {
        create: jest.fn(),
        save: jest.fn(),
        find: jest.fn(),
    };
    return {
        getRepository: jest.fn(() => mockRepository),
    };
});

// Mock the taskRepo
jest.mock('../repositories/taskRepository', () => ({
    findUserTasks: jest.fn(),
    createTask: jest.fn(),
    getTasksByUserId: jest.fn(),
}));

describe('User Repository Tests', () => {
    let mockRepo;
    beforeAll(() => {
        mockRepo = AppDataSource.getRepository(User);
    });

    beforeEach(() => {
        jest.clearAllMocks();
    });

    describe('findByEmail', () => {
        it('should call taskRepo.findUserTasks with email', async () => {
            taskRepo.findUserTasks.mockResolvedValue([{ id: 1 }]);
            const result = await userRepository.findByEmail('test@example.com');
            expect(taskRepo.findUserTasks).toHaveBeenCalledWith('test@example.com');
            expect(result).toEqual([{ id: 1 }]);
        });

        it('should throw on error', async () => {
            taskRepo.findUserTasks.mockRejectedValue(new Error('DB error'));
            await expect(userRepository.findByEmail('x')).rejects.toThrow('DB error');
        });
    });

    describe('createAndSaveWithTask', () => {
        it('should create a user and initial task', async () => {
            const mockUser = { id: 10, email: 'user@example.com' };
            const mockTask = { id: 20, task_name: 'initial task' };

            // לעג (mock) של userRepo
            mockRepo.create.mockReturnValue(mockUser);
            mockRepo.save.mockResolvedValue(mockUser);

            // לעג של יצירת משימה
            taskRepo.createTask.mockResolvedValue(mockTask);

            const result = await userRepository.createAndSaveWithTask('user@example.com', 'passHash', { name: 'T1', value: 100 });
            expect(mockRepo.create).toHaveBeenCalledWith({ email: 'user@example.com', password_hash: 'passHash' });
            expect(taskRepo.createTask).toHaveBeenCalledWith({
                task_name: 'T1',
                task_value: 100,
                user_id: 10,
            });
            expect(result).toEqual({ user: mockUser, task: mockTask });
        });
    });

    describe('getAllUsersWithTasks', () => {
        it('should fetch users and their tasks', async () => {
            const users = [{ id: 1 }, { id: 2 }];
            const tasksForUser1 = [{ id: 11 }, { id: 12 }];
            const tasksForUser2 = [{ id: 21 }];

            mockRepo.find.mockResolvedValue(users);
            taskRepo.getTasksByUserId.mockImplementation(async (id) => {
                if (id === 1) return tasksForUser1;
                if (id === 2) return tasksForUser2;
            });

            const result = await userRepository.getAllUsersWithTasks();
            expect(mockRepo.find).toHaveBeenCalled();
            expect(result).toEqual([
                { id: 1, tasks: tasksForUser1 },
                { id: 2, tasks: tasksForUser2 },
            ]);
        });
    });
});
