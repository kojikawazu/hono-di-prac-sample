import { isValidEmail } from '../validators';

describe('isValidEmail', () => {
    // 正常系
    it('should return true for valid email', () => {
        expect(isValidEmail('test@example.com')).toBe(true);
    });

    // 異常系
    it('should return false for invalid email', () => {
        expect(isValidEmail('invalid-email')).toBe(false);
    });

    // 空文字
    it('should return false for empty string', () => {
        expect(isValidEmail('')).toBe(false);
    });

    // 空白文字
    it('should return false for whitespace', () => {
        expect(isValidEmail(' ')).toBe(false);
    });

    // ドメインがない
    it('should return false for email without domain', () => {
        expect(isValidEmail('test@')).toBe(false);
    });
});
