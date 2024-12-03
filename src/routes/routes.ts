import { Hono } from 'hono';
import { userRouter } from './user.routes';
import { authRouter } from './auth.routes';

// ルーターの作成
export const createRouter = () => {
    // アプリケーションの作成
    const app = new Hono();

    // ルートのグループ化
    app.route('/api/v1/users', userRouter);
    app.route('/api/v1/auth', authRouter);
    // ヘルスチェック
    app.get('/health', (c) => c.json({ status: 'ok' }));

    // ルートを返す
    return app;
};
