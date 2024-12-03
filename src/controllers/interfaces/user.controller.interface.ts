import { Context } from 'hono';

/**
 * ユーザーコントローラーのインターフェイス
 */
export interface IUserController {
    // IDでユーザーを取得
    getUserById(c: Context): Promise<Response>;
    // メールアドレスでユーザーを取得
    getUserByEmail(c: Context): Promise<Response>;
    // ユーザーを作成
    createUser(c: Context): Promise<Response>;
    // ユーザーを更新
    updateUser(c: Context): Promise<Response>;
    // ユーザーを削除
    deleteUser(c: Context): Promise<Response>;
    // 全てのユーザーを取得
    getAllUsers(c: Context): Promise<Response>;
}
