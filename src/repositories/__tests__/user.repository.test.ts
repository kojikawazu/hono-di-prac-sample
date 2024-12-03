import 'reflect-metadata';
import { jest } from '@jest/globals';
import { SupabaseUserRepository } from '../user.repository';
import { supabase } from '../../middleware/supabase.middleware';
import { User } from '../../types/users';

// モックの共通関数を作成
const createMockFrom = (mockResponse: { data: User | null; error: Error | null }) => {
    // モックオブジェクトを作成
    const mockObject = {
        select: jest.fn().mockReturnThis(),
        eq: jest.fn().mockReturnThis(),
        single: jest.fn().mockImplementation(() => Promise.resolve(mockResponse)),
        insert: jest.fn().mockReturnThis(),
        update: jest.fn().mockReturnThis(),
        delete: jest.fn().mockReturnValue({
            eq: jest.fn().mockImplementation(() => Promise.resolve(mockResponse)),
        }),
    };
    // モックオブジェクトを返す
    return mockObject;
};

describe('SupabaseUserRepository', () => {
    // テスト対象のインスタンス
    let repository: SupabaseUserRepository;
    // モックデータ
    const mockUser: User = {
        id: '1',
        username: 'testuser',
        email: 'test@example.com',
        password: 'hashedpassword',
        created_at: '2024-03-14T00:00:00Z',
        updated_at: '2024-03-14T00:00:00Z',
    };

    beforeEach(() => {
        // テスト対象のインスタンスを作成
        repository = new SupabaseUserRepository();
        // モックのリセット
        jest.clearAllMocks();
    });

    describe('findById', () => {
        // 正常系
        it('should return a user when found', async () => {
            const mockResponse = { data: mockUser, error: null };
            jest.spyOn(supabase, 'from').mockReturnValue(createMockFrom(mockResponse));

            const result = await repository.findById('1');
            expect(result).toEqual(mockUser);
        });

        // 異常系(ユーザーが見つからない場合)
        it('should return null when user is not found', async () => {
            const mockResponse = { data: null, error: null };
            jest.spyOn(supabase, 'from').mockReturnValue(createMockFrom(mockResponse));

            const result = await repository.findById('999');
            expect(result).toBeNull();
        });

        // 異常系(エラーが発生した場合)
        it('should throw an error when an error occurs', async () => {
            const mockResponse = { data: null, error: new Error('Test error') };
            jest.spyOn(supabase, 'from').mockReturnValue(createMockFrom(mockResponse));

            await expect(repository.findById('1')).rejects.toThrow('Test error');
        });
    });

    describe('findByEmail', () => {
        // 正常系
        it('should return a user when found by email', async () => {
            const mockResponse = { data: mockUser, error: null };
            jest.spyOn(supabase, 'from').mockReturnValue(createMockFrom(mockResponse));

            const result = await repository.findByEmail('test@example.com');
            expect(result).toEqual(mockUser);
        });

        // 異常系(ユーザーが見つからない場合)
        it('should return null when user is not found by email', async () => {
            const mockResponse = { data: null, error: null };
            jest.spyOn(supabase, 'from').mockReturnValue(createMockFrom(mockResponse));

            const result = await repository.findByEmail('notfound@example.com');
            expect(result).toBeNull();
        });

        // 異常系(エラーが発生した場合)
        it('should throw an error when an error occurs', async () => {
            const mockResponse = { data: null, error: new Error('Test error') };
            jest.spyOn(supabase, 'from').mockReturnValue(createMockFrom(mockResponse));

            await expect(repository.findByEmail('test@example.com')).rejects.toThrow('Test error');
        });
    });

    describe('create', () => {
        // 正常系
        it('should create a user', async () => {
            const mockResponse = { data: mockUser, error: null };
            jest.spyOn(supabase, 'from').mockReturnValue(createMockFrom(mockResponse));

            const result = await repository.create(mockUser);
            expect(result).toEqual(mockUser);
        });

        // 異常系(エラーが発生した場合)
        it('should throw an error when an error occurs', async () => {
            const mockResponse = { data: null, error: new Error('Test error') };
            jest.spyOn(supabase, 'from').mockReturnValue(createMockFrom(mockResponse));

            await expect(repository.create(mockUser)).rejects.toThrow('Test error');
        });

        // 異常系(ユーザーがすでに存在する場合)
        it('should throw an error when a user already exists', async () => {
            const mockResponse = { data: mockUser, error: new Error('User already exists') };
            jest.spyOn(supabase, 'from').mockReturnValue(createMockFrom(mockResponse));

            await expect(repository.create(mockUser)).rejects.toThrow('User already exists');
        });
    });

    describe('update', () => {
        // 正常系
        it('should update a user', async () => {
            const mockResponse = { data: mockUser, error: null };
            jest.spyOn(supabase, 'from').mockReturnValue(createMockFrom(mockResponse));

            const result = await repository.update(mockUser.id, { username: 'updated' });
            expect(result).toEqual(mockUser);
        });

        // 異常系(エラーが発生した場合)
        it('should throw an error when an error occurs', async () => {
            const mockResponse = { data: null, error: new Error('Test error') };
            jest.spyOn(supabase, 'from').mockReturnValue(createMockFrom(mockResponse));

            await expect(repository.update(mockUser.id, { username: 'updated' })).rejects.toThrow(
                'Test error',
            );
        });

        // 異常系(ユーザーが見つからない場合)
        it('should throw an error when a user is not found', async () => {
            const mockResponse = { data: null, error: new Error('User not found') };
            jest.spyOn(supabase, 'from').mockReturnValue(createMockFrom(mockResponse));

            await expect(repository.update(mockUser.id, { username: 'updated' })).rejects.toThrow(
                'User not found',
            );
        });
    });

    describe('delete', () => {
        // 正常系
        it('should delete a user', async () => {
            const mockResponse = { data: null, error: null };
            jest.spyOn(supabase, 'from').mockReturnValue(createMockFrom(mockResponse));

            await repository.delete(mockUser.id);
        });

        // 異常系(エラーが発生した場合)
        it('should throw an error when an error occurs', async () => {
            const mockResponse = { data: null, error: new Error('Test error') };
            jest.spyOn(supabase, 'from').mockReturnValue(createMockFrom(mockResponse));

            await expect(repository.delete(mockUser.id)).rejects.toThrow('Test error');
        });

        // 異常系(ユーザーが見つからない場合)
        it('should throw an error when a user is not found', async () => {
            const mockResponse = { data: null, error: new Error('User not found') };
            jest.spyOn(supabase, 'from').mockReturnValue(createMockFrom(mockResponse));

            await expect(repository.delete(mockUser.id)).rejects.toThrow('User not found');
        });
    });
});
