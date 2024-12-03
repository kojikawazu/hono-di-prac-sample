import 'reflect-metadata';
import { describe, it, expect, jest, beforeEach } from '@jest/globals';
import { AuthUseCase } from '../auth.usecase';
import { IAuthRepository } from '../../repositories/interfaces/auth.repository.interface';
import { AuthError } from '../../types/error';
import { User } from '../../types/users';
import { IAuthUseCase } from '../interfaces/auth.usecase.interface';

describe('AuthUseCase', () => {
    // ユースケース
    let useCase: IAuthUseCase;
    // モックリポジトリ
    let mockAuthRepository: jest.Mocked<IAuthRepository>;

    // モックユーザー
    const mockUser: User = {
        id: '1',
        email: 'test@example.com',
        username: 'testuser',
        password: 'password123',
        created_at: '2024-03-14T00:00:00Z',
        updated_at: '2024-03-14T00:00:00Z',
    };

    beforeEach(() => {
        // モックリポジトリ
        mockAuthRepository = {
            login: jest.fn(),
            register: jest.fn(),
            logout: jest.fn(),
            verifyToken: jest.fn(),
        };

        // ユースケース
        useCase = new AuthUseCase(mockAuthRepository);
    });

    describe('login', () => {
        // ログイン成功
        it('should login successfully', async () => {
            const mockToken = 'mock-token';
            mockAuthRepository.login.mockResolvedValue({
                user: mockUser,
                token: mockToken,
            });

            const result = await useCase.login(mockUser.email, mockUser.password);

            expect(result.user).toEqual(mockUser);
            expect(result.token).toBe(mockToken);
            expect(mockAuthRepository.login).toHaveBeenCalledWith(
                mockUser.email,
                mockUser.password,
            );
        });

        // ログイン失敗
        it('should throw AuthError when login fails', async () => {
            mockAuthRepository.login.mockRejectedValue(new Error('Login failed'));

            await expect(useCase.login(mockUser.email, mockUser.password)).rejects.toThrow(
                AuthError,
            );
        });
    });

    describe('register', () => {
        // 登録成功
        it('should register successfully', async () => {
            mockAuthRepository.register.mockResolvedValue(mockUser);

            const result = await useCase.register({
                email: mockUser.email,
                username: mockUser.username,
                password: mockUser.password,
            });

            expect(result).toEqual(mockUser);
            expect(mockAuthRepository.register).toHaveBeenCalledWith({
                email: mockUser.email,
                username: mockUser.username,
                password: mockUser.password,
            });
        });

        // 登録失敗
        it('should throw AuthError when registration fails', async () => {
            mockAuthRepository.register.mockRejectedValue(new Error('Registration failed'));

            await expect(
                useCase.register({
                    email: mockUser.email,
                    username: mockUser.username,
                    password: mockUser.password,
                }),
            ).rejects.toThrow(AuthError);
        });
    });

    describe('logout', () => {
        // ログアウト成功
        it('should logout successfully', async () => {
            mockAuthRepository.logout.mockResolvedValue(undefined);

            await expect(useCase.logout()).resolves.not.toThrow();
            expect(mockAuthRepository.logout).toHaveBeenCalled();
        });

        // ログアウト失敗
        it('should throw AuthError when logout fails', async () => {
            mockAuthRepository.logout.mockRejectedValue(new Error('Logout failed'));

            await expect(useCase.logout()).rejects.toThrow(AuthError);
        });
    });

    describe('verifyToken', () => {
        // トークン検証成功
        it('should verify token successfully', async () => {
            mockAuthRepository.verifyToken.mockResolvedValue(mockUser);

            const result = await useCase.verifyToken('mock-token');

            expect(result).toEqual(mockUser);
            expect(mockAuthRepository.verifyToken).toHaveBeenCalledWith('mock-token');
        });

        // トークン検証失敗
        it('should throw AuthError when token verification fails', async () => {
            mockAuthRepository.verifyToken.mockRejectedValue(
                new Error('Token verification failed'),
            );

            await expect(useCase.verifyToken('invalid-token')).rejects.toThrow(AuthError);
        });
    });
});
