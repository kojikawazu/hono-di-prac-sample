import { Database } from '../types/supabase/database.types';

// テーブル名を型として定義
type TableName = keyof Database['public']['Tables'];
export const USER_TABLE_NAME: TableName = 'trans_users';

// ユーザーモデルの型定義
export type User = Database['public']['Tables'][typeof USER_TABLE_NAME]['Row'];
// ユーザーモデルの挿入型定義
export type InsertUser = Database['public']['Tables'][typeof USER_TABLE_NAME]['Insert'];
// ユーザーモデルの更新型定義
export type UpdateUser = Database['public']['Tables'][typeof USER_TABLE_NAME]['Update'];
