import { Context } from 'hono';
import { inject, injectable } from 'tsyringe';
// DI
import { TYPES } from '../di/types';
// 型
import { InsertUser, UpdateUser } from '../types/users';
// インターフェイス
import { IUserController } from './interfaces/user.controller.interface';
// ユースケース
import { IUserUseCase } from '../usecases/interfaces/user.usecase.interface';

/**
 * ユーザーコントローラーの実装
 */
@injectable()
export class UserController implements IUserController {
    // コンストラクター
    constructor(
        @inject(TYPES.IUserUseCase)
        private readonly userUseCase: IUserUseCase,
    ) {}

    /**
     * IDでユーザーを取得
     * @param c コンテキスト
     * @returns レスポンス
     */
    async getUserById(c: Context): Promise<Response> {
        try {
            const id = c.req.param('id');
            const user = await this.userUseCase.getUser(id);
            if (!user) {
                return c.json({ message: 'User not found' }, 404);
            }
            return c.json(user);
        } catch (error: unknown) {
            console.error('Error in getUserById:', error);
            if (error instanceof Error) {
                return c.json({ error: error.message }, 500);
            }
            return c.json({ error: 'Unknown error occurred' }, 500);
        }
    }

    /**
     * ユーザーをメールアドレスで取得
     * @param c コンテキスト
     * @returns レスポンス
     */
    async getUserByEmail(c: Context): Promise<Response> {
        try {
            const email = c.req.param('email');
            if (!email) {
                return c.json({ message: 'Email is required' }, 400);
            }
            const user = await this.userUseCase.getUserByEmail(email);
            if (!user) {
                return c.json({ message: 'User not found' }, 404);
            }
            return c.json(user);
        } catch (error: unknown) {
            console.error('Error in getUserByEmail:', error);
            if (error instanceof Error) {
                return c.json({ error: error.message }, 500);
            }
            return c.json({ error: 'Unknown error occurred' }, 500);
        }
    }

    /**
     * ユーザーを作成
     * @param c コンテキスト
     * @returns レスポンス
     */
    async createUser(c: Context): Promise<Response> {
        try {
            const data = await c.req.json<InsertUser>();
            const user = await this.userUseCase.createUser(data);
            return c.json(user, 201);
        } catch (error: unknown) {
            console.error('Error in createUser:', error);
            if (error instanceof Error) {
                return c.json({ error: error.message }, 500);
            }
            return c.json({ error: 'Unknown error occurred' }, 500);
        }
    }

    /**
     * ユーザーを更新
     * @param c コンテキスト
     * @returns レスポンス
     */
    async updateUser(c: Context): Promise<Response> {
        try {
            const id = c.req.param('id');
            const data = await c.req.json<UpdateUser>();
            const user = await this.userUseCase.updateUser(id, data);
            return c.json(user);
        } catch (error: unknown) {
            console.error('Error in updateUser:', error);
            if (error instanceof Error) {
                return c.json({ error: error.message }, 500);
            }
            return c.json({ error: 'Unknown error occurred' }, 500);
        }
    }

    /**
     * ユーザーを削除
     * @param c コンテキスト
     * @returns レスポンス
     */
    async deleteUser(c: Context): Promise<Response> {
        try {
            const id = c.req.param('id');
            await this.userUseCase.deleteUser(id);
            return c.json({ message: 'User deleted' });
        } catch (error: unknown) {
            console.error('Error in deleteUser:', error);
            if (error instanceof Error) {
                return c.json({ error: error.message }, 500);
            }
            return c.json({ error: 'Unknown error occurred' }, 500);
        }
    }

    /**
     * 全てのユーザーを取得
     * @param c コンテキスト
     * @returns レスポンス
     */
    async getAllUsers(c: Context): Promise<Response> {
        try {
            const users = await this.userUseCase.getAllUsers();
            return c.json(users);
        } catch (error: unknown) {
            console.error('Error in getAllUsers:', error);
            if (error instanceof Error) {
                return c.json({ error: error.message }, 500);
            }
            return c.json({ error: 'Unknown error occurred' }, 500);
        }
    }
}
