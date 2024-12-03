import { container } from 'tsyringe';
// DI
import { TYPES } from './types';
// ユーザー関連
import { IUserUseCase } from '../usecases/interfaces/user.usecase.interface';
import { UserUseCase } from '../usecases/user.usecase';
import { IUserRepository } from '../repositories/interfaces/user.repository.interface';
import { SupabaseUserRepository } from '../repositories/user.repository';
import { IUserController } from '../controllers/interfaces/user.controller.interface';
import { UserController } from '../controllers/user.controller';
// 認証関連
import { IAuthRepository } from '../repositories/interfaces/auth.repository.interface';
import { SupabaseAuthRepository } from '../repositories/auth.repository';
import { IAuthUseCase } from '../usecases/interfaces/auth.usecase.interface';
import { AuthUseCase } from '../usecases/auth.usecase';
import { IAuthController } from '../controllers/interfaces/auth.controller.interface';
import { AuthController } from '../controllers/auth.controller';

// リポジトリの登録
container.register<IUserRepository>(TYPES.IUserRepository, {
    useClass: SupabaseUserRepository,
});

// サービスの登録
container.register<IUserUseCase>(TYPES.IUserUseCase, {
    useClass: UserUseCase,
});

// コントローラーの登録
container.register<IUserController>(TYPES.IUserController, {
    useClass: UserController,
});

// 認証リポジトリの登録
container.register<IAuthRepository>(TYPES.IAuthRepository, {
    useClass: SupabaseAuthRepository,
});

// 認証ユースケースの登録
container.register<IAuthUseCase>(TYPES.IAuthUseCase, {
    useClass: AuthUseCase,
});

// 認証コントローラーの登録
container.register<IAuthController>(TYPES.IAuthController, {
    useClass: AuthController,
});

export { container };
