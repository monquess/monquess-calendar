import { z } from 'zod'

export const updateUserSchema = z.object({
	username: z
		.string()
		.nonempty()
		.min(3, { message: 'Must be 3 or more characters long' }),
	email: z.string().nonempty().email({ message: 'Invalid email address' }),
})
