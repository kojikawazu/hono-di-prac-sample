import { Hono } from 'hono';
import { container } from '../di/container';
import { TYPES } from '../di/types';
import { UserController } from '../controllers/user.controller';

// ユーザーのルーティング
const userRouter = new Hono();
// ユーザーコントローラー
const userController = container.resolve<UserController>(TYPES.IUserController);

// ユーザーのルーティング
userRouter
    .get('/', (c) => userController.getAllUsers(c))
    .get('/:id', (c) => userController.getUserById(c))
    .get('/email/:email', (c) => userController.getUserByEmail(c))
    .post('/', (c) => userController.createUser(c))
    .patch('/:id', (c) => userController.updateUser(c))
    .delete('/:id', (c) => userController.deleteUser(c));

// ユーザーのルーティングをエクスポート
export { userRouter };
