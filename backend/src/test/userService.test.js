const userService = require('../services/userService');
const userRepository = require('../repositories/userRepository');

jest.mock('../repositories/userRepository', () => ({
    findByEmail: jest.fn(),
    createAndSave: jest.fn(),
    getAllUsers: jest.fn(),
    getUserById: jest.fn(),
}));

describe('User Service Tests', () => {
    afterEach(() => {
        jest.clearAllMocks();
    });

    describe('registerUser', () => {
        it('should throw an error if user already exists', async () => {
            userRepository.findByEmail.mockResolvedValue({ id: 1, email: 'exists@example.com' });
            await expect(userService.registerUser('exists@example.com', 'hash'))
                .rejects
                .toThrow('User already exists');
        });

        it('should create a new user if not exists', async () => {
            userRepository.findByEmail.mockResolvedValue(null);
            userRepository.createAndSave.mockResolvedValue({ id: 2, email: 'new@example.com' });

            const result = await userService.registerUser('new@example.com', 'hash');
            expect(userRepository.findByEmail).toHaveBeenCalledWith('new@example.com');
            expect(userRepository.createAndSave).toHaveBeenCalledWith('new@example.com', 'hash');
            expect(result).toEqual({ id: 2, email: 'new@example.com' });
        });
    });

    describe('getAllUsers', () => {
        it('should return all users', async () => {
            const mockUsers = [{ id: 1 }, { id: 2 }];
            userRepository.getAllUsers.mockResolvedValue(mockUsers);

            const result = await userService.getAllUsers();
            expect(result).toEqual(mockUsers);
            expect(userRepository.getAllUsers).toHaveBeenCalled();
        });
    });

    describe('getUserById', () => {
        it('should return a user by ID', async () => {
            userRepository.getUserById.mockResolvedValue({ id: 10, email: 'test@example.com' });
            const result = await userService.getUserById(10);
            expect(result).toEqual({ id: 10, email: 'test@example.com' });
            expect(userRepository.getUserById).toHaveBeenCalledWith(10);
        });
    });
});
