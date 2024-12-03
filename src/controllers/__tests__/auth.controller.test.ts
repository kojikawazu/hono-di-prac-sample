import 'reflect-metadata';
import { describe, it, expect, jest, beforeEach } from '@jest/globals';
import { AuthController } from '../auth.controller';
import { IAuthUseCase } from '../../usecases/interfaces/auth.usecase.interface';
import { Context } from 'hono';
import { AuthError } from '../../types/error';
import { User } from '../../types/users';

// 認証コントローラーのテスト
describe('AuthController', () => {
    // 認証コントローラー
    let controller: AuthController;
    // 認証ユースケース
    let mockAuthUseCase: jest.Mocked<IAuthUseCase>;

    // ユーザー
    const mockUser: User = {
        id: '1',
        email: 'test@example.com',
        username: 'testuser',
        password: 'password123',
        created_at: '2024-03-14T00:00:00Z',
        updated_at: '2024-03-14T00:00:00Z',
    };

    beforeEach(() => {
        // 認証ユースケースのモック
        mockAuthUseCase = {
            login: jest.fn(),
            register: jest.fn(),
            logout: jest.fn(),
            verifyToken: jest.fn(),
        };

        // 認証コントローラーのインスタンス
        controller = new AuthController(mockAuthUseCase);
    });

    describe('login', () => {
        // ログイン成功
        it('should login successfully', async () => {
            const mockToken = 'mock-token';
            mockAuthUseCase.login.mockResolvedValue({
                user: mockUser,
                token: mockToken,
            });

            const mockContext = {
                req: {
                    json: jest.fn(() =>
                        Promise.resolve({
                            email: mockUser.email,
                            password: mockUser.password,
                            username: mockUser.username,
                        }),
                    ),
                },
                json: jest.fn(),
            } as unknown as Context;

            await controller.login(mockContext);

            expect(mockContext.json).toHaveBeenCalledWith({
                user: mockUser,
                token: mockToken,
            });
        });

        // ログイン失敗
        it('should return 401 on login failure', async () => {
            mockAuthUseCase.login.mockRejectedValue(new AuthError('Login failed'));

            const mockContext = {
                req: {
                    json: jest.fn(() =>
                        Promise.resolve({
                            email: mockUser.email,
                            password: mockUser.password,
                            username: mockUser.username,
                        }),
                    ),
                },
                json: jest.fn(),
            } as unknown as Context;

            await controller.login(mockContext);

            expect(mockContext.json).toHaveBeenCalledWith({ error: 'Login failed' }, 401);
        });
    });

    describe('register', () => {
        // 登録成功
        it('should register successfully', async () => {
            mockAuthUseCase.register.mockResolvedValue(mockUser);

            const mockContext = {
                req: {
                    json: jest.fn(() =>
                        Promise.resolve({
                            email: mockUser.email,
                            password: mockUser.password,
                            username: mockUser.username,
                        }),
                    ),
                },
                json: jest.fn(),
            } as unknown as Context;

            await controller.register(mockContext);

            expect(mockContext.json).toHaveBeenCalledWith(mockUser, 201);
        });

        // 登録失敗
        it('should return 400 on registration failure', async () => {
            mockAuthUseCase.register.mockRejectedValue(new AuthError('Registration failed'));

            const mockContext = {
                req: {
                    json: jest.fn(() =>
                        Promise.resolve({
                            email: mockUser.email,
                            password: mockUser.password,
                            username: mockUser.username,
                        }),
                    ),
                },
                json: jest.fn(),
            } as unknown as Context;

            await controller.register(mockContext);

            expect(mockContext.json).toHaveBeenCalledWith({ error: 'Registration failed' }, 400);
        });
    });

    describe('logout', () => {
        // ログアウト成功
        it('should logout successfully', async () => {
            mockAuthUseCase.logout.mockResolvedValue(undefined);

            const mockContext = {
                json: jest.fn(),
            } as unknown as Context;

            await controller.logout(mockContext);

            expect(mockContext.json).toHaveBeenCalledWith({ message: 'Logged out successfully' });
        });

        // ログアウト失敗
        it('should return 400 on logout failure', async () => {
            mockAuthUseCase.logout.mockRejectedValue(new AuthError('Logout failed'));

            const mockContext = {
                json: jest.fn(),
            } as unknown as Context;

            await controller.logout(mockContext);

            expect(mockContext.json).toHaveBeenCalledWith({ error: 'Logout failed' }, 400);
        });
    });

    describe('verifyToken', () => {
        // トークン検証成功
        it('should verify token successfully', async () => {
            mockAuthUseCase.verifyToken.mockResolvedValue(mockUser);

            const mockContext = {
                req: {
                    header: jest.fn().mockReturnValue('Bearer mock-token'),
                },
                json: jest.fn(),
            } as unknown as Context;

            await controller.verifyToken(mockContext);

            expect(mockContext.json).toHaveBeenCalledWith(mockUser);
        });

        // トークン検証失敗
        it('should return 401 on token verification failure', async () => {
            mockAuthUseCase.verifyToken.mockRejectedValue(
                new AuthError('Token verification failed'),
            );

            const mockContext = {
                req: {
                    header: jest.fn().mockReturnValue('Bearer invalid-token'),
                },
                json: jest.fn(),
            } as unknown as Context;

            await controller.verifyToken(mockContext);

            expect(mockContext.json).toHaveBeenCalledWith(
                { error: 'Token verification failed' },
                401,
            );
        });

        // トークンが提供されていない
        it('should return 401 if no token is provided', async () => {
            const mockContext = {
                req: {
                    header: jest.fn().mockReturnValue(null),
                },
                json: jest.fn(),
            } as unknown as Context;

            await controller.verifyToken(mockContext);

            expect(mockContext.json).toHaveBeenCalledWith({ error: 'No token provided' }, 401);
        });
    });
});
