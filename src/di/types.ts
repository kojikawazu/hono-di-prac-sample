// DIの型
export const TYPES = {
    // ユーザーリポジトリ
    IUserRepository: Symbol.for('IUserRepository'),
    // ユーザーサービス
    IUserUseCase: Symbol.for('IUserUseCase'),
    // ユーザーコントローラー
    IUserController: Symbol.for('IUserController'),
    // 認証リポジトリ
    IAuthRepository: Symbol.for('IAuthRepository'),
    // 認証サービス
    IAuthUseCase: Symbol.for('IAuthUseCase'),
    // 認証コントローラー
    IAuthController: Symbol.for('IAuthController'),
} as const;
