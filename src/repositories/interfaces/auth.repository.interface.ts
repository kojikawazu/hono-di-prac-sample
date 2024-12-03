import { User } from '../../types/users';

// 認証リポジトリのインターフェイス
export interface IAuthRepository {
    // ログイン
    login(email: string, password: string): Promise<{ user: User; token: string }>;
    // 登録
    register(user: Omit<User, 'id' | 'created_at' | 'updated_at'>): Promise<User>;
    // ログアウト
    logout(): Promise<void>;
    // トークン検証
    verifyToken(token: string): Promise<User>;
}
