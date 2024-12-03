import { createUserSchema, updateUserSchema } from '../user.schema';

describe('User Schema', () => {
    it('should validate correct user data', () => {
        const validUser = {
            username: 'test',
            email: 'test@example.com',
            password: 'password123',
        };

        const result = createUserSchema.safeParse(validUser);
        expect(result.success).toBe(true);
    });
});

describe('Update User Schema', () => {
    it('should validate correct user data', () => {
        const validUser = {
            username: 'test',
        };

        const result = updateUserSchema.safeParse(validUser);
        expect(result.success).toBe(true);
    });
});
