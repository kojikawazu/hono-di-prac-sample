import { inject, injectable } from 'tsyringe';
// DI
import { TYPES } from '../di/types';
// バリデーター
import { isValidEmail } from '../utils/validators/validators';
// 型
import { User, InsertUser, UpdateUser } from '../types/users';
// インターフェイス
import { IUserRepository } from '../repositories/interfaces/user.repository.interface';
// ユースケース
import { IUserUseCase } from './interfaces/user.usecase.interface';

/**
 * ユーザーのユースケースの実装
 */
@injectable()
export class UserUseCase implements IUserUseCase {
    // コンストラクター
    constructor(
        @inject(TYPES.IUserRepository)
        private readonly userRepository: IUserRepository,
    ) {}

    /**
     * IDでユーザーを取得
     * @param id ID
     * @returns ユーザー
     */
    async getUser(id: string): Promise<User | null> {
        try {
            return await this.userRepository.findById(id);
        } catch (error) {
            console.error('Error in getUser:', error);
            throw error;
        }
    }

    /**
     * メールアドレスでユーザーを取得
     * @param email メールアドレス
     * @returns ユーザー
     */
    async getUserByEmail(email: string): Promise<User | null> {
        try {
            // メールアドレス形式チェック
            if (!isValidEmail(email)) {
                throw new Error('Invalid email format');
            }
            return await this.userRepository.findByEmail(email);
        } catch (error) {
            console.error('Error in getUserByEmail:', error);
            throw error;
        }
    }

    /**
     * ユーザーを作成
     * @param user ユーザー
     * @returns ユーザー
     */
    async createUser(user: InsertUser): Promise<User> {
        try {
            if (!isValidEmail(user.email)) {
                throw new Error('Invalid email format');
            }
            return await this.userRepository.create(user);
        } catch (error) {
            console.error('Error in createUser:', error);
            throw error;
        }
    }

    /**
     * ユーザーを更新
     * @param id ID
     * @param user ユーザー
     * @returns ユーザー
     */
    async updateUser(id: string, user: UpdateUser): Promise<User> {
        try {
            if (user.email && !isValidEmail(user.email)) {
                throw new Error('Invalid email format');
            }
            return await this.userRepository.update(id, user);
        } catch (error) {
            console.error('Error in updateUser:', error);
            throw error;
        }
    }

    /**
     * ユーザーを削除
     * @param id ID
     */
    async deleteUser(id: string): Promise<void> {
        try {
            await this.userRepository.delete(id);
        } catch (error) {
            console.error('Error in deleteUser:', error);
            throw error;
        }
    }

    /**
     * 全てのユーザーを取得
     * @returns ユーザー
     */
    async getAllUsers(): Promise<User[]> {
        try {
            return await this.userRepository.findAll();
        } catch (error) {
            console.error('Error in getAllUsers:', error);
            throw error;
        }
    }
}
