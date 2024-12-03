import { inject, injectable } from 'tsyringe';
import { Context } from 'hono';
import { IAuthController } from './interfaces/auth.controller.interface';
import { IAuthUseCase } from '../usecases/interfaces/auth.usecase.interface';
import { AuthError } from '../types/error';
// DI
import { TYPES } from '../di/types';

/**
 * 認証コントローラーの実装
 */
@injectable()
export class AuthController implements IAuthController {
    // コンストラクター
    constructor(
        @inject(TYPES.IAuthUseCase)
        private authUseCase: IAuthUseCase,
    ) {}

    /**
     * ログイン
     * @param c コンテキスト
     * @returns レスポンス
     */
    async login(c: Context): Promise<Response> {
        try {
            const { email, password } = await c.req.json();
            const result = await this.authUseCase.login(email, password);
            return c.json(result);
        } catch (error) {
            if (error instanceof AuthError) {
                return c.json({ error: error.message }, 401);
            }
            return c.json({ error: 'Internal server error' }, 500);
        }
    }

    /**
     * 登録
     * @param c コンテキスト
     * @returns レスポンス
     */
    async register(c: Context): Promise<Response> {
        try {
            const { email, password, username } = await c.req.json();
            const user = await this.authUseCase.register({ email, password, username });
            return c.json(user, 201);
        } catch (error) {
            if (error instanceof AuthError) {
                return c.json({ error: error.message }, 400);
            }
            return c.json({ error: 'Internal server error' }, 500);
        }
    }

    /**
     * ログアウト
     * @param c コンテキスト
     * @returns レスポンス
     */
    async logout(c: Context): Promise<Response> {
        try {
            await this.authUseCase.logout();
            return c.json({ message: 'Logged out successfully' });
        } catch (error) {
            if (error instanceof AuthError) {
                return c.json({ error: error.message }, 400);
            }
            return c.json({ error: 'Internal server error' }, 500);
        }
    }

    /**
     * トークン検証
     * @param c コンテキスト
     * @returns レスポンス
     */
    async verifyToken(c: Context): Promise<Response> {
        try {
            const token = c.req.header('Authorization')?.replace('Bearer ', '');
            if (!token) {
                return c.json({ error: 'No token provided' }, 401);
            }

            const user = await this.authUseCase.verifyToken(token);
            return c.json(user);
        } catch (error) {
            if (error instanceof AuthError) {
                return c.json({ error: error.message }, 401);
            }
            return c.json({ error: 'Internal server error' }, 500);
        }
    }
}
