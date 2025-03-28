import { z } from 'zod'

export const schemaLogin = z.object({
	email: z.string().nonempty().email({ message: 'Invalid email address' }),
})
