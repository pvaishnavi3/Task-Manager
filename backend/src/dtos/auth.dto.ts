import { z } from 'zod';

/**
 * DTO for user registration
 */
export const RegisterDtoSchema = z.object({
    email: z.string().email('Invalid email address'),
    password: z
        .string()
        .min(8, 'Password must be at least 8 characters')
        .regex(/[A-Z]/, 'Password must contain at least one uppercase letter')
        .regex(/[a-z]/, 'Password must contain at least one lowercase letter')
        .regex(/[0-9]/, 'Password must contain at least one number'),
    name: z.string().min(2, 'Name must be at least 2 characters').max(50, 'Name must not exceed 50 characters')
});

export type RegisterDto = z.infer<typeof RegisterDtoSchema>;

/**
 * DTO for user login
 */
export const LoginDtoSchema = z.object({
    email: z.string().email('Invalid email address'),
    password: z.string().min(1, 'Password is required')
});

export type LoginDto = z.infer<typeof LoginDtoSchema>;

/**
 * DTO for updating user profile
 */
export const UpdateUserDtoSchema = z.object({
    name: z.string().min(2, 'Name must be at least 2 characters').max(50, 'Name must not exceed 50 characters').optional(),
    email: z.string().email('Invalid email address').optional()
});

export type UpdateUserDto = z.infer<typeof UpdateUserDtoSchema>;
