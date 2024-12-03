import 'reflect-metadata';
import { jest } from '@jest/globals';
import { Context } from 'hono';
import { UserController } from '../user.controller';
import { IUserUseCase } from '../../usecases/interfaces/user.usecase.interface';
import { User } from '../../types/users';

// モックレスポンスの型
type MockResponse = Response & {
    _data: unknown;
    _status: number;
    _format: 'json';
};

// モックコンテキストの型
type MockContext = {
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    json: any;
    req: {
        param: jest.Mock;
        query: jest.Mock;

        json: jest.Mock;
    };
};

// モックレスポンス生成の共通関数
const createMockResponse = (data: unknown, init?: number | ResponseInit): MockResponse => {
    const res = new Response();
    // モックレスポンスのプロパティを定義
    Object.defineProperties(res, {
        json: { value: () => Promise.resolve(data) },
        status: { value: typeof init === 'number' ? init : init?.status || 200 },
        body: { value: data },
        headers: { value: new Headers() },
        ok: { value: true },
        redirected: { value: false },
        statusText: { value: 'OK' },
        type: { value: 'default' },
        url: { value: '' },
        _data: { value: data },
        _status: { value: typeof init === 'number' ? init : init?.status || 200 },
        _format: { value: 'json' },
    });
    return res as MockResponse;
};

// テストケースの定義
describe('UserController', () => {
    // テスト対象のコントローラーのインスタンス
    let controller: UserController;
    // ユースケースのモック
    let mockUserUseCase: jest.Mocked<IUserUseCase>;
    // モックコンテキスト
    let mockContext: MockContext;

    // モックユーザー
    const mockUser: User = {
        id: '1',
        username: 'testuser',
        email: 'test@example.com',
        password: 'hashedpassword',
        created_at: '2024-03-14T00:00:00Z',
        updated_at: '2024-03-14T00:00:00Z',
    };

    beforeEach(() => {
        // ユースケースのモック作成
        mockUserUseCase = {
            getUser: jest.fn(),
            getUserByEmail: jest.fn(),
            createUser: jest.fn(),
            updateUser: jest.fn(),
            deleteUser: jest.fn(),
            getAllUsers: jest.fn(),
        };

        // モックコンテキストのプロパティを定義
        mockContext = {
            json: jest.fn((data: unknown, init?: number | ResponseInit) =>
                createMockResponse(data, init),
            ),
            req: {
                param: jest.fn(),
                query: jest.fn(),
                json: jest.fn(),
            },
        };

        // コントローラーのインスタンス化
        controller = new UserController(mockUserUseCase);
    });

    describe('getUserById', () => {
        // ユーザーが見つかった場合のテスト
        it('should return a user when found', async () => {
            mockContext.req.param.mockReturnValue('1');
            mockUserUseCase.getUser.mockResolvedValue(mockUser);
            mockContext.json.mockImplementation((data: unknown, init?: number | ResponseInit) =>
                createMockResponse(data, init),
            );

            const result = await controller.getUserById(mockContext as unknown as Context);
            expect(result.body).toEqual(mockUser);
            expect(mockContext.json).toHaveBeenCalledWith(mockUser);
        });

        // ユーザーが見つからない場合のテスト
        it('should return 404 when user is not found', async () => {
            mockContext.req.param.mockReturnValue('999');
            mockUserUseCase.getUser.mockResolvedValue(null);
            mockContext.json.mockImplementation((data: unknown, init?: number | ResponseInit) =>
                createMockResponse(data, init),
            );

            const result = await controller.getUserById(mockContext as unknown as Context);
            expect(result.status).toBe(404);
            expect(mockContext.json).toHaveBeenCalledWith({ message: 'User not found' }, 404);
        });

        // エラーが発生した場合のテスト
        it('should return 500 when an error occurs', async () => {
            mockContext.req.param.mockReturnValue('1');
            mockUserUseCase.getUser.mockRejectedValue(new Error('Test error'));
            mockContext.json.mockImplementation((data: unknown, init?: number | ResponseInit) =>
                createMockResponse(data, init),
            );

            const result = await controller.getUserById(mockContext as unknown as Context);
            expect(result.status).toBe(500);
            expect(mockContext.json).toHaveBeenCalledWith({ error: 'Test error' }, 500);
        });
    });

    describe('createUser', () => {
        // ユーザーが正常に作成された場合のテスト
        it('should update a user successfully', async () => {
            const updateData: Partial<User> = {
                username: 'updateduser',
                email: 'updated@example.com',
                password: 'newpassword',
            };

            mockContext.req.param.mockReturnValue('1');
            // Promise.resolveを使用してモックの戻り値を設定
            mockContext.req.json.mockImplementation(() => Promise.resolve(updateData));
            mockUserUseCase.updateUser.mockResolvedValue({
                ...mockUser,
                ...updateData,
            });

            const result = await controller.updateUser(mockContext as unknown as Context);
            expect(result.body).toEqual({
                ...mockUser,
                ...updateData,
            });
            expect(mockContext.json).toHaveBeenCalledWith({
                ...mockUser,
                ...updateData,
            });
        });

        // 作成に失敗した場合のテスト
        it('should return 500 when creation fails', async () => {
            const newUser: Partial<User> = {
                username: 'newuser',
                email: 'new@example.com',
                password: 'password123',
            };

            mockContext.req.json.mockImplementation(() => Promise.resolve(newUser));
            mockUserUseCase.createUser.mockRejectedValue(new Error('Creation failed'));
            mockContext.json.mockImplementation((data: unknown, init?: number | ResponseInit) =>
                createMockResponse(data, init),
            );

            const result = await controller.createUser(mockContext as unknown as Context);
            expect(result.status).toBe(500);
            expect(mockContext.json).toHaveBeenCalledWith({ error: 'Creation failed' }, 500);
        });
    });

    describe('updateUser', () => {
        // ユーザーが正常に更新された場合のテスト
        it('should update a user successfully', async () => {
            const updateData: Partial<User> = {
                username: 'updateduser',
            };

            mockContext.req.param.mockReturnValue('1');
            mockContext.req.json.mockImplementation(() => Promise.resolve(updateData));
            mockUserUseCase.updateUser.mockResolvedValue(mockUser);
            mockContext.json.mockImplementation((data: unknown, init?: number | ResponseInit) =>
                createMockResponse(data, init),
            );

            const result = await controller.updateUser(mockContext as unknown as Context);
            expect(result.body).toEqual(mockUser);
            expect(mockContext.json).toHaveBeenCalledWith(mockUser);
        });

        // 更新に失敗した場合のテスト
        it('should return 500 when update fails', async () => {
            const updateData: Partial<User> = {
                username: 'updateduser',
            };

            mockContext.req.param.mockReturnValue('1');
            mockContext.req.json.mockImplementation(() => Promise.resolve(updateData));
            mockUserUseCase.updateUser.mockRejectedValue(new Error('Update failed'));
            mockContext.json.mockImplementation((data: unknown, init?: number | ResponseInit) =>
                createMockResponse(data, init),
            );

            const result = await controller.updateUser(mockContext as unknown as Context);
            expect(result.status).toBe(500);
            expect(mockContext.json).toHaveBeenCalledWith({ error: 'Update failed' }, 500);
        });
    });

    describe('deleteUser', () => {
        // ユーザーが正常に削除された場合のテスト
        it('should delete a user successfully', async () => {
            mockContext.req.param.mockReturnValue('1');
            mockUserUseCase.deleteUser.mockResolvedValue();
            mockContext.json.mockImplementation((data: unknown, init?: number | ResponseInit) =>
                createMockResponse(data, init),
            );

            const result = await controller.deleteUser(mockContext as unknown as Context);
            expect(result.body).toEqual({ message: 'User deleted' });
        });

        // 削除に失敗した場合のテスト
        it('should return 500 when deletion fails', async () => {
            mockContext.req.param.mockReturnValue('1');
            mockUserUseCase.deleteUser.mockRejectedValue(new Error('Deletion failed'));
            mockContext.json.mockImplementation((data: unknown, init?: number | ResponseInit) =>
                createMockResponse(data, init),
            );

            const result = await controller.deleteUser(mockContext as unknown as Context);
            expect(result.status).toBe(500);
            expect(mockContext.json).toHaveBeenCalledWith({ error: 'Deletion failed' }, 500);
        });
    });

    describe('getAllUsers', () => {
        // 全ユーザーが正常に取得された場合のテスト
        it('should return all users', async () => {
            const mockUsers = [mockUser];
            mockUserUseCase.getAllUsers.mockResolvedValue(mockUsers);
            mockContext.json.mockImplementation((data: unknown, init?: number | ResponseInit) =>
                createMockResponse(data, init),
            );

            const result = await controller.getAllUsers(mockContext as unknown as Context);
            expect(result.body).toEqual(mockUsers);
            expect(mockContext.json).toHaveBeenCalledWith(mockUsers);
        });

        // 取得に失敗した場合のテスト
        it('should return 500 when fetching fails', async () => {
            mockUserUseCase.getAllUsers.mockRejectedValue(new Error('Fetch failed'));
            mockContext.json.mockImplementation((data: unknown, init?: number | ResponseInit) =>
                createMockResponse(data, init),
            );

            const result = await controller.getAllUsers(mockContext as unknown as Context);
            expect(result.status).toBe(500);
            expect(mockContext.json).toHaveBeenCalledWith({ error: 'Fetch failed' }, 500);
        });
    });
});
