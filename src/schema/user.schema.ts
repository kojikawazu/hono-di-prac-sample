import { z } from 'zod';

// ユーザー作成時のスキーマ
export const createUserSchema = z.object({
    email: z.string().email('有効なメールアドレスを入力してください'),
    username: z.string().min(3, '3文字以上で入力してください'),
    password: z.string().min(8, '8文字以上で入力してください'),
});

// ユーザー更新時のスキーマ
export const updateUserSchema = z.object({
    email: z.string().email('有効なメールアドレスを入力してください').optional(),
    username: z.string().min(3, '3文字以上で入力してください').optional(),
});
