import { Context, MiddlewareHandler } from 'hono';
import { ZodError } from 'zod';

// バリデーションミドルウェア
export const validateMiddleware = (): MiddlewareHandler => {
    return async (c: Context, next) => {
        try {
            // const bodyText = await c.req.text()
            // const body = bodyText ? JSON.parse(bodyText) : {}
            // schema.parse(body)
            await next();
        } catch (error) {
            if (error instanceof ZodError) {
                return c.json({ error: error.message }, 400);
            }
            return c.json({ error: 'Invalid request' }, 400);
        }
    };
};
