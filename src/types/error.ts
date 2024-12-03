/**
 * アプリケーションエラークラス
 */
export class AppError extends Error {
    // コンストラクター
    constructor(
        public statusCode: number,
        public message: string,
        public details?: unknown,
    ) {
        // スーパークラスのコンストラクター
        super(message);
        // エラー名
        this.name = 'AppError';
    }
}

/**
 * 認証エラークラス
 */
export class AuthError extends AppError {
    // コンストラクター
    constructor(message: string) {
        // スーパークラスのコンストラクター
        super(401, message);
        this.name = 'AuthError';
    }
}
