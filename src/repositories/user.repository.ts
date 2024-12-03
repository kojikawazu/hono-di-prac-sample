import { injectable } from 'tsyringe';
import { supabase } from '../middleware/supabase.middleware';
// 型
import { User, InsertUser, UpdateUser } from '../types/users';
// テーブル名
import { USER_TABLE_NAME } from '../types/users';
// インターフェイス
import { IUserRepository } from './interfaces/user.repository.interface';

// エラー型の定義を追加
type PostgrestError = {
    message: string;
    details: string;
    hint: string;
    code: string;
};

// Supabaseを使用したユーザーレポジトリの実装
@injectable()
export class SupabaseUserRepository implements IUserRepository {
    /**
     * IDでユーザーを取得
     * @param id ID
     * @returns ユーザー
     */
    async findById(id: string): Promise<User | null> {
        try {
            const { data, error } = (await supabase
                .from(USER_TABLE_NAME)
                .select('*')
                .eq('id', id)
                .single()) as { data: User | null; error: PostgrestError | null };

            if (error) throw error;
            return data;
        } catch (error) {
            console.error('Error in findById:', error);
            throw error;
        }
    }

    /**
     * メールアドレスでユーザーを取得
     * @param email メールアドレス
     * @returns ユーザー
     */
    async findByEmail(email: string): Promise<User | null> {
        try {
            const { data, error } = (await supabase
                .from(USER_TABLE_NAME)
                .select('*')
                .eq('email', email)
                .single()) as { data: User | null; error: PostgrestError | null };

            if (error) throw error;
            return data;
        } catch (error) {
            console.error('Error in findByEmail:', error);
            throw error;
        }
    }

    /**
     * ユーザーを作成
     * @param user ユーザー
     * @returns ユーザー
     */
    async create(user: InsertUser): Promise<User> {
        try {
            const { data, error } = (await supabase
                .from(USER_TABLE_NAME)
                .insert(user)
                .select()
                .single()) as { data: User; error: PostgrestError | null };

            if (error) throw error;
            return data;
        } catch (error) {
            console.error('Error in create:', error);
            throw error;
        }
    }

    /**
     * ユーザーを更新
     * @param id ID
     * @param user ユーザー
     * @returns ユーザー
     */
    async update(id: string, user: UpdateUser): Promise<User> {
        try {
            const { data, error } = (await supabase
                .from(USER_TABLE_NAME)
                .update(user)
                .eq('id', id)
                .select()
                .single()) as { data: User; error: PostgrestError | null };

            if (error) throw error;
            return data;
        } catch (error) {
            console.error('Error in update:', error);
            throw error;
        }
    }

    /**
     * ユーザーを削除
     * @param id ID
     */
    async delete(id: string): Promise<void> {
        try {
            const { error } = await supabase.from(USER_TABLE_NAME).delete().eq('id', id);

            if (error) throw error;
        } catch (error) {
            console.error('Error in delete:', error);
            throw error;
        }
    }

    /**
     * 全てのユーザーを取得
     * @returns ユーザー
     */
    async findAll(): Promise<User[]> {
        try {
            const { data, error } = (await supabase.from(USER_TABLE_NAME).select('*')) as {
                data: User[];
                error: PostgrestError | null;
            };

            if (error) throw error;
            return data;
        } catch (error) {
            console.error('Error in findAll:', error);
            throw error;
        }
    }
}
