import { z } from 'zod'

export const emailSchema = z.object({
	email: z.string().nonempty().email({ message: 'Invalid email address' }),
})

export const resetPasswordSchema = z
	.object({
		code: z.string().length(6, { message: 'Must be 6 characters long' }),
		password: z
			.string()
			.min(8, { message: 'Must be 8 or more characters long' }),
		confirmPassword: z
			.string()
			.min(8, { message: 'Must be 8 or more characters long' }),
	})
	.superRefine(({ password, confirmPassword }, ctx) => {
		if (confirmPassword !== password) {
			ctx.addIssue({
				message: 'Passwords do not match',
				path: ['confirmPassword'],
				code: 'custom',
			})
		}
	})
