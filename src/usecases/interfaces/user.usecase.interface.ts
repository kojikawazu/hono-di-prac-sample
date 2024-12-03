import { User, InsertUser, UpdateUser } from '../../types/users';

/**
 * ユーザーのユースケースのインターフェイス
 */
export interface IUserUseCase {
    // ユーザーを取得
    getUser(id: string): Promise<User | null>;
    // ユーザーをメールアドレスで取得
    getUserByEmail(email: string): Promise<User | null>;
    // ユーザーを作成
    createUser(user: InsertUser): Promise<User>;
    // ユーザーを更新
    updateUser(id: string, user: UpdateUser): Promise<User>;
    // ユーザーを削除
    deleteUser(id: string): Promise<void>;
    // 全てのユーザーを取得
    getAllUsers(): Promise<User[]>;
}
