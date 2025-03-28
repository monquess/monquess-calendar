import { z } from 'zod'

export const registerSchema = z
	.object({
		fullname: z
			.string()
			.nonempty()
			.min(3, { message: 'Must be 3 or more characters long' }),
		email: z.string().nonempty().email({ message: 'Invalid email address' }),
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
