import app from '../../index';
import { describe, it, expect } from '@jest/globals';

describe('User Routes', () => {
    let id: string;
    // ユーザーの一覧を取得する
    it('GET /users should return users list', async () => {
        const res = await app.request('/api/v1/users');
        expect(res.status).toBe(200);
    });

    // ユーザーを作成する
    it('POST /users should create new user', async () => {
        const res = await app.request('/api/v1/users', {
            method: 'POST',
            body: JSON.stringify({
                username: 'test',
                email: 'test@example.com',
                password: 'password',
            }),
        });
        const json = await res.json();
        id = json.id;

        expect(res.status).toBe(201);
    });

    // ユーザーを更新する
    it('PATCH /users/:id should update user', async () => {
        const res = await app.request(`/api/v1/users/${id}`, {
            method: 'PATCH',
            body: JSON.stringify({
                username: 'test2',
                email: 'test2@example.com',
            }),
        });
        expect(res.status).toBe(200);
    });

    // ユーザーを取得する
    it('GET /users/:id should return user', async () => {
        const res = await app.request(`/api/v1/users/${id}`);
        expect(res.status).toBe(200);
    });

    // ユーザーをメールアドレスで取得する
    it('GET /users/email/:email should return user', async () => {
        const res = await app.request(`/api/v1/users/email/test2@example.com`);
        expect(res.status).toBe(200);
    }); 

    // ユーザーを削除する
    it('DELETE /users/:id should delete user', async () => {
        const res = await app.request(`/api/v1/users/${id}`, {
            method: 'DELETE',
        });
        expect(res.status).toBe(200);
    });
});
