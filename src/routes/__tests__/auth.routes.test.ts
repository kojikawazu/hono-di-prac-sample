import app from '../../index';
import { describe, it, expect } from '@jest/globals';

describe('Auth Routes', () => {
    let token: string;

    // ユーザー登録
    it('POST /auth/register should register new user', async () => {
        const res = await app.request('/api/v1/auth/register', {
            method: 'POST',
            body: JSON.stringify({
                username: 'testuser',
                email: 'testuser@example.com',
                password: 'password123',
            }),
        });
        expect(res.status).toBe(201);
    });

    // ログイン
    it('POST /auth/login should login user', async () => {
        const res = await app.request('/api/v1/auth/login', {
            method: 'POST',
            body: JSON.stringify({
                email: 'testuser@example.com',
                password: 'password123',
            }),
        });
        const json = await res.json();
        token = json.token;
        expect(res.status).toBe(200);
    });

    // トークン検証
    it('GET /auth/verify-token should verify token', async () => {
        const res = await app.request('/api/v1/auth/verify-token', {
            headers: {
                'Authorization': `Bearer ${token}`,
            },
        });
        expect(res.status).toBe(200);
    });

    // ログアウト
    it('POST /auth/logout should logout user', async () => {
        const res = await app.request('/api/v1/auth/logout', {
            method: 'POST',
            headers: {
                'Authorization': `Bearer ${token}`,
            },
        });
        expect(res.status).toBe(200);
    });

    // 無効なトークンでの検証
    it('GET /auth/verify-token should fail with invalid token', async () => {
        const res = await app.request('/api/v1/auth/verify-token', {
            headers: {
                'Authorization': 'Bearer invalid-token',
            },
        });
        expect(res.status).toBe(401);
    });
});