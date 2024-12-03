import 'reflect-metadata';
import { injectable } from 'tsyringe';
import { IAuthRepository } from './interfaces/auth.repository.interface';
import { supabase } from '../middleware/supabase.middleware';
import { User } from '../types/users';
import { AuthError } from '../types/error';

// 認証リポジトリ
@injectable()
export class SupabaseAuthRepository implements IAuthRepository {
    /**
     * ログイン
     * @param email メールアドレス
     * @param password パスワード
     * @returns ユーザーとトークン
     */
    async login(email: string, password: string): Promise<{ user: User; token: string }> {
        // ログイン
        const { data, error } = await supabase.auth.signInWithPassword({
            email,
            password,
        });

        // エラーがある場合
        if (error) {
            throw new AuthError('Invalid credentials');
        }

        // ユーザーまたはセッションがない場合
        if (!data.user || !data.session) {
            throw new AuthError('Login failed');
        }

        // Supabaseのユーザー情報をアプリケーションのUser型に変換
        const user: User = {
            id: data.user.id,
            email: data.user.email!,
            username: data.user.user_metadata.username || '',
            password: '',
            created_at: data.user.created_at.toString(),
            updated_at: data.user.updated_at?.toString() || '',
        };

        return {
            user,
            token: data.session.access_token,
        };
    }

    /**
     * 登録
     * @param user ユーザー
     * @returns ユーザー
     */
    async register(user: Omit<User, 'id' | 'created_at' | 'updated_at'>): Promise<User> {
        // 登録
        const { data, error } = await supabase.auth.signUp({
            email: user.email,
            password: user.password,
            options: {
                data: {
                    username: user.username,
                },
            },
        });

        // エラーがある場合
        if (error) {
            throw new AuthError('Registration failed');
        }

        // ユーザーがない場合
        if (!data.user) {
            throw new AuthError('User creation failed');
        }

        return {
            id: data.user.id,
            email: data.user.email!,
            username: data.user.user_metadata.username || '',
            password: '',
            created_at: data.user.created_at.toString(),
            updated_at: data.user.updated_at?.toString() || '',
        };
    }

    /**
     * ログアウト
     */
    async logout(): Promise<void> {
        // ログアウト
        const { error } = await supabase.auth.signOut();

        // エラーがある場合
        if (error) {
            throw new AuthError('Logout failed');
        }
    }

    /**
     * トークン検証
     * @param token トークン
     * @returns ユーザー
     */
    async verifyToken(token: string): Promise<User> {
        // トークン検証
        const {
            data: { user },
            error,
        } = await supabase.auth.getUser(token);

        // エラーがある場合
        if (error || !user) {
            throw new AuthError('Invalid token');
        }

        return {
            id: user.id,
            email: user.email!,
            username: user.user_metadata.username || '',
            password: '',
            created_at: user.created_at.toString(),
            updated_at: user.updated_at?.toString() || '',
        };
    }
}
