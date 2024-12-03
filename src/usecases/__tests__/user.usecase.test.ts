import 'reflect-metadata';
import { jest } from '@jest/globals';
import { UserUseCase } from '../user.usecase';
import { IUserRepository } from '../../repositories/interfaces/user.repository.interface';
import { User } from '../../types/users';

describe('UserUseCase', () => {
    // テスト対象のクラスをインスタンス化
    let useCase: UserUseCase;
    // モックオブジェクトを作成
    let mockRepository: jest.Mocked<IUserRepository>;

    // モックデータを作成
    const mockUser: User = {
        id: '1',
        username: 'testuser',
        email: 'test@example.com',
        password: 'hashedpassword',
        created_at: '2024-03-14T00:00:00Z',
        updated_at: '2024-03-14T00:00:00Z',
    };

    beforeEach(() => {
        // モックオブジェクトを作成
        mockRepository = {
            findById: jest.fn(),
            findByEmail: jest.fn(),
            create: jest.fn(),
            update: jest.fn(),
            delete: jest.fn(),
            findAll: jest.fn(),
        };
        // テスト対象のクラスをインスタンス化
        useCase = new UserUseCase(mockRepository);
    });

    describe('findById', () => {
        // 正常系(ユーザーが見つかった場合)
        it('should return a user when found', async () => {
            mockRepository.findById.mockResolvedValue(mockUser);
            const result = await useCase.getUser('1');
            expect(result).toEqual(mockUser);
        });

        // 正常系(ユーザーが見つからない場合)
        it('should return null when user is not found', async () => {
            mockRepository.findById.mockResolvedValue(null);
            const result = await useCase.getUser('999');
            expect(result).toBeNull();
        });

        // 異常系(リポジトリがエラーをスローした場合)
        it('should throw an error when repository throws', async () => {
            mockRepository.findById.mockRejectedValue(new Error('Test error'));
            await expect(useCase.getUser('1')).rejects.toThrow('Test error');
        });
    });

    describe('findByEmail', () => {
        // 正常系(ユーザーが見つかった場合)
        it('should return a user when found', async () => {
            mockRepository.findByEmail.mockResolvedValue(mockUser);
            const result = await useCase.getUserByEmail('test@example.com');
            expect(result).toEqual(mockUser);
        });

        // 正常系(ユーザーが見つからない場合)
        it('should return null when user is not found', async () => {
            mockRepository.findByEmail.mockResolvedValue(null);
            const result = await useCase.getUserByEmail('notfound@example.com');
            expect(result).toBeNull();
        });

        // 異常系(リポジトリがエラーをスローした場合)
        it('should throw an error when repository throws', async () => {
            mockRepository.findByEmail.mockRejectedValue(new Error('Test error'));
            await expect(useCase.getUserByEmail('test@example.com')).rejects.toThrow('Test error');
        });
    });

    describe('create', () => {
        // 正常系
        it('should create a user', async () => {
            mockRepository.create.mockResolvedValue(mockUser);
            const result = await useCase.createUser(mockUser);
            expect(result).toEqual(mockUser);
        });

        // 異常系(リポジトリがエラーをスローした場合)
        it('should throw an error when repository throws', async () => {
            mockRepository.create.mockRejectedValue(new Error('Test error'));
            await expect(useCase.createUser(mockUser)).rejects.toThrow('Test error');
        });
    });

    describe('update', () => {
        // 正常系
        it('should update a user', async () => {
            mockRepository.update.mockResolvedValue(mockUser);
            const result = await useCase.updateUser(mockUser.id, { username: 'updated' });
            expect(result).toEqual(mockUser);
        });

        // 異常系
        it('should throw an error when repository throws', async () => {
            mockRepository.update.mockRejectedValue(new Error('Test error'));
            await expect(useCase.updateUser(mockUser.id, { username: 'updated' })).rejects.toThrow(
                'Test error',
            );
        });
    });

    describe('delete', () => {
        // 正常系
        it('should delete a user', async () => {
            mockRepository.delete.mockResolvedValue();
            await useCase.deleteUser(mockUser.id);
        });

        // 異常系
        it('should throw an error when repository throws', async () => {
            mockRepository.delete.mockRejectedValue(new Error('Test error'));
            await expect(useCase.deleteUser(mockUser.id)).rejects.toThrow('Test error');
        });
    });
});
