import { describe, it, expect, jest, beforeEach } from '@jest/globals';
import { SupabaseAuthRepository } from '../auth.repository';
import { supabase } from '../../middleware/supabase.middleware';
import { AuthError } from '../../types/error';
import { User } from '../../types/users';

// Supabaseのモックを作成
jest.mock('../../middleware/supabase.middleware', () => ({
    supabase: {
        auth: {
            signInWithPassword: jest.fn(),
            signUp: jest.fn(),
            signOut: jest.fn(),
            getUser: jest.fn(),
        },
    },
}));

describe('SupabaseAuthRepository', () => {
    // リポジトリ
    let repository: SupabaseAuthRepository;
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
        // リポジトリ
        repository = new SupabaseAuthRepository();
        // モックのクリア
        jest.clearAllMocks();
    });

    describe('login', () => {
        // ログイン成功
        it('should login successfully', async () => {
            // セッション
            const mockSession = {
                access_token: 'mock-token',
            };
            // レスポンス
            const mockResponse = {
                data: {
                    user: {
                        id: mockUser.id,
                        email: mockUser.email,
                        user_metadata: { username: mockUser.username },
                        created_at: mockUser.created_at,
                        updated_at: mockUser.updated_at,
                    },
                    session: mockSession,
                },
                error: null,
            };

            (supabase.auth.signInWithPassword as jest.Mock).mockImplementation(() =>
                Promise.resolve(mockResponse),
            );
            const result = await repository.login(mockUser.email, mockUser.password);

            expect(result.user).toEqual({
                ...mockUser,
                password: '',
            });
            expect(result.token).toBe(mockSession.access_token);
        });

        // 無効な資格情報の場合
        it('should throw AuthError on invalid credentials', async () => {
            (supabase.auth.signInWithPassword as jest.Mock).mockImplementation(() =>
                Promise.resolve({
                    data: { user: null, session: null },
                    error: new Error('Invalid credentials'),
                }),
            );

            await expect(repository.login(mockUser.email, mockUser.password)).rejects.toThrow(
                AuthError,
            );
        });

        // ログイン失敗の場合
        it('should throw AuthError on login failure', async () => {
            await expect(repository.login(mockUser.email, mockUser.password)).rejects.toThrow(
                AuthError,
            );
        });

        // ユーザーまたはセッションがない場合
        it('should throw AuthError on missing user or session', async () => {
            await expect(repository.login(mockUser.email, mockUser.password)).rejects.toThrow(
                AuthError,
            );
        });

        // エラーがある場合
        it('should throw AuthError on error', async () => {
            await expect(repository.login(mockUser.email, mockUser.password)).rejects.toThrow(
                AuthError,
            );
        });
    });

    describe('register', () => {
        // 登録成功
        it('should register successfully', async () => {
            // レスポンス
            const mockResponse = {
                data: {
                    user: {
                        id: mockUser.id,
                        email: mockUser.email,
                        user_metadata: { username: mockUser.username },
                        created_at: mockUser.created_at,
                        updated_at: mockUser.updated_at,
                    },
                },
                error: null,
            };

            (supabase.auth.signUp as jest.Mock).mockImplementation(() =>
                Promise.resolve(mockResponse),
            );
            const result = await repository.register({
                email: mockUser.email,
                username: mockUser.username,
                password: mockUser.password,
            });

            expect(result).toEqual({
                ...mockUser,
                password: '',
            });
        });

        // 登録失敗の場合
        it('should throw AuthError on registration failure', async () => {
            (supabase.auth.signUp as jest.Mock).mockImplementation(() =>
                Promise.resolve({
                    data: { user: null },
                    error: new Error('Registration failed'),
                }),
            );

            await expect(
                repository.register({
                    email: mockUser.email,
                    username: mockUser.username,
                    password: mockUser.password,
                }),
            ).rejects.toThrow(AuthError);
        });

        // エラーがある場合
        it('should throw AuthError on error', async () => {
            await expect(
                repository.register({
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
            (supabase.auth.signOut as jest.Mock).mockImplementation(() =>
                Promise.resolve({ error: null }),
            );

            await expect(repository.logout()).resolves.not.toThrow();
        });

        // ログアウト失敗の場合
        it('should throw AuthError on logout failure', async () => {
            (supabase.auth.signOut as jest.Mock).mockImplementation(() =>
                Promise.resolve({
                    error: new Error('Logout failed'),
                }),
            );

            await expect(repository.logout()).rejects.toThrow(AuthError);
        });

        // エラーがある場合
        it('should throw AuthError on error', async () => {
            await expect(repository.logout()).rejects.toThrow(AuthError);
        });
    });

    describe('verifyToken', () => {
        // トークン検証成功
        it('should verify token successfully', async () => {
            const mockResponse = {
                data: {
                    user: {
                        id: mockUser.id,
                        email: mockUser.email,
                        user_metadata: { username: mockUser.username },
                        created_at: mockUser.created_at,
                        updated_at: mockUser.updated_at,
                    },
                },
                error: null,
            };

            (supabase.auth.getUser as jest.Mock).mockImplementation(() =>
                Promise.resolve(mockResponse),
            );

            const result = await repository.verifyToken('mock-token');

            expect(result).toEqual({
                ...mockUser,
                password: '',
            });
        });

        // 無効なトークンの場合
        it('should throw AuthError on invalid token', async () => {
            (supabase.auth.getUser as jest.Mock).mockImplementation(() =>
                Promise.resolve({
                    data: { user: null },
                    error: new Error('Invalid token'),
                }),
            );

            await expect(repository.verifyToken('invalid-token')).rejects.toThrow(AuthError);
        });

        // エラーがある場合
        it('should throw AuthError on error', async () => {
            await expect(repository.verifyToken('mock-token')).rejects.toThrow(AuthError);
        });
    });
});
