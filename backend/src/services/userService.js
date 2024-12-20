const userRepository = require('../repositories/userRepository');

module.exports = {
  registerUser: async (email, passwordHash) => {
    const existing = await userRepository.findByEmail(email);
    if (existing) {
      throw new Error('User already exists');
    }
    return userRepository.createAndSave(email, passwordHash);
  },

  getAllUsers: async () => {
    return userRepository.getAllUsers();
  },

  getUserById: async (id) => {
    return userRepository.getUserById(id)
  }
};