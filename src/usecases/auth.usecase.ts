import { inject, injectable } from 'tsyringe';
import { IAuthUseCase } from './interfaces/auth.usecase.interface';
import { IAuthRepository } from '../repositories/interfaces/auth.repository.interface';
import { User } from '../types/users';
import { AuthError } from '../types/error';
import { TYPES } from '../di/types';
/**
 * 認証のユースケース
 */
@injectable()
export class AuthUseCase implements IAuthUseCase {
    /**
     * コンストラクタ
     * @param authRepository 認証リポジトリ
     */
    constructor(
        @inject(TYPES.IAuthRepository)
        private authRepository: IAuthRepository,
    ) {}

    /**
     * ログイン
     * @param email メールアドレス
     * @param password パスワード
     * @returns ユーザーとトークン
     */
    async login(email: string, password: string): Promise<{ user: User; token: string }> {
        try {
            return await this.authRepository.login(email, password);
        } catch (error) {
            console.error(error);
            throw new AuthError('Login failed');
        }
    }

    /**
     * 登録
     * @param user ユーザー情報
     * @returns 作成されたユーザー
     */
    async register(user: { email: string; password: string; username: string }): Promise<User> {
        try {
            return await this.authRepository.register(user);
        } catch (error) {
            console.error(error);
            throw new AuthError('Registration failed');
        }
    }

    /**
     * ログアウト
     */
    async logout(): Promise<void> {
        try {
            await this.authRepository.logout();
        } catch (error) {
            console.error(error);
            throw new AuthError('Logout failed');
        }
    }

    /**
     * トークン検証
     * @param token トークン
     * @returns 検証されたユーザー
     */
    async verifyToken(token: string): Promise<User> {
        try {
            return await this.authRepository.verifyToken(token);
        } catch (error) {
            console.error(error);
            throw new AuthError('Token verification failed');
        }
    }
}
