import { User } from '../../types/users';

/**
 * 認証のユースケースのインターフェイス
 */
export interface IAuthUseCase {
    /**
     * ログイン
     * @param email メールアドレス
     * @param password パスワード
     * @returns ユーザーとトークン
     */
    login(email: string, password: string): Promise<{ user: User; token: string }>;

    /**
     * 登録
     * @param user ユーザー情報
     * @returns 作成されたユーザー
     */
    register(user: { email: string; password: string; username: string }): Promise<User>;

    /**
     * ログアウト
     */
    logout(): Promise<void>;

    /**
     * トークン検証
     * @param token トークン
     * @returns 検証されたユーザー
     */
    verifyToken(token: string): Promise<User>;
}
