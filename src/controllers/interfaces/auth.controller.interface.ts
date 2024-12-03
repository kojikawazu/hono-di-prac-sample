import { Context } from 'hono';

/**
 * 認証コントローラーのインターフェイス
 */
export interface IAuthController {
    /**
     * ログイン
     * @param c コンテキスト
     * @returns レスポンス
     */
    login(c: Context): Promise<Response>;

    /**
     * 登録
     * @param c コンテキスト
     * @returns レスポンス
     */
    register(c: Context): Promise<Response>;

    /**
     * ログアウト
     * @param c コンテキスト
     * @returns レスポンス
     */
    logout(c: Context): Promise<Response>;

    /**
     * トークン検証
     * @param c コンテキスト
     * @returns レスポンス
     */
    verifyToken(c: Context): Promise<Response>;
}
