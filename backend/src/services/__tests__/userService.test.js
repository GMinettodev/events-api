const UserService = require('../userService');
const UserModel = require('../../models/userModel');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const createError = require('http-errors');

// 1. Mock das Dependências
jest.mock('../../models/userModel');
jest.mock('bcryptjs');
jest.mock('jsonwebtoken');
jest.mock('http-errors', () => {
  // Factory function para simular o createError
  return jest.fn((status, message) => ({ status, message }));
});

describe('UserService Unit Tests', () => {
  afterEach(() => {
    jest.clearAllMocks(); // Limpa contadores de chamadas após cada teste
  });

  // --- TESTES DE REGISTRO ---
  describe('registerUser', () => {
    it('should register a new user successfully', async () => {
      const userData = {
        name: 'Test',
        email: 'test@mail.com',
        password: '123',
      };

      // Mock: Usuário não existe
      UserModel.findByEmail.mockResolvedValue(null);
      // Mock: Hash da senha
      bcrypt.hash.mockResolvedValue('hashed_123');
      // Mock: Criação retorna ID 1
      UserModel.create.mockResolvedValue({ id: 1 });

      const result = await UserService.registerUser(userData);

      expect(bcrypt.hash).toHaveBeenCalledWith('123', 10);
      expect(UserModel.create).toHaveBeenCalledWith({
        ...userData,
        password: 'hashed_123',
      });
      expect(result).toHaveProperty('id');
    });

    it('should throw 400 if user already exists', async () => {
      UserModel.findByEmail.mockResolvedValue({
        id: 1,
        email: 'test@mail.com',
      });

      await expect(
        UserService.registerUser({ email: 'test@mail.com' })
      ).rejects.toHaveProperty('status', 400);
    });
  });

  // --- TESTES DE LOGIN ---
  describe('loginUser', () => {
    it('should return token and user info on success', async () => {
      const credentials = { email: 'test@mail.com', password: '123' };
      const mockUser = {
        id: 1,
        email: 'test@mail.com',
        password: 'hashed_123',
        role: 'admin',
      };

      // Mocks
      UserModel.findByEmail.mockResolvedValue(mockUser);
      bcrypt.compare.mockResolvedValue(true); // Senha correta
      jwt.sign.mockReturnValue('fake_jwt_token');

      const result = await UserService.loginUser(credentials);

      expect(result).toHaveProperty('token', 'fake_jwt_token');
      expect(result.user).toHaveProperty('email', mockUser.email);
    });

    it('should throw 404 if user not found', async () => {
      UserModel.findByEmail.mockResolvedValue(null);
      await expect(
        UserService.loginUser({ email: 'wrong@mail.com' })
      ).rejects.toHaveProperty('status', 404);
    });

    it('should throw 400 if password does not match', async () => {
      const mockUser = { password: 'hashed_123' };
      UserModel.findByEmail.mockResolvedValue(mockUser);
      bcrypt.compare.mockResolvedValue(false); // Senha errada

      await expect(
        UserService.loginUser({ email: 'test@mail.com', password: 'wrong' })
      ).rejects.toHaveProperty('status', 400);
    });
  });

  // --- TESTES DE LEITURA (ListUser) ---
  describe('listUser', () => {
    it('should return user without password', async () => {
      const mockDbUser = { id: 1, name: 'Test', password: 'secret_hash' };
      UserModel.findById.mockResolvedValue(mockDbUser);

      const result = await UserService.listUser(1);

      expect(result).toHaveProperty('name', 'Test');
      expect(result).not.toHaveProperty('password'); // Garante que a senha foi removida
    });
  });
});
