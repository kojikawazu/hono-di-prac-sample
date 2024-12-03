import { Hono } from 'hono';
import { container } from 'tsyringe';
import { AuthController } from '../controllers/auth.controller';

// 認証のルーティング
const authRouter = new Hono();
// 認証コントローラー
const authController = container.resolve(AuthController);

// 認証のルーティング
authRouter
    .post('/login', async (c) => await authController.login(c))
    .post('/register', async (c) => await authController.register(c))
    .post('/logout', async (c) => await authController.logout(c))
    .get('/verify-token', async (c) => await authController.verifyToken(c));

// 認証のルーティングをエクスポート
export { authRouter };
