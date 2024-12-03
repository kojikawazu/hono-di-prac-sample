/**
 * メールアドレス形式チェック
 * @param email メールアドレス
 * @returns メールアドレス形式かどうか
 */
export const isValidEmail = (email: string): boolean => {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return emailRegex.test(email);
};
