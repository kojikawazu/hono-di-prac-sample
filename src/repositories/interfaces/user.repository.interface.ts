import { User, InsertUser, UpdateUser } from '../../types/users';

// ユーザーモデルのリポジトリインターフェース
export interface IUserRepository {
    // IDでユーザーを取得
    findById(id: string): Promise<User | null>;
    // メールアドレスでユーザーを取得
    findByEmail(email: string): Promise<User | null>;
    // ユーザーを作成
    create(user: InsertUser): Promise<User>;
    // ユーザーを更新
    update(id: string, user: UpdateUser): Promise<User>;
    // ユーザーを削除
    delete(id: string): Promise<void>;
    // 全てのユーザーを取得
    findAll(): Promise<User[]>;
}
