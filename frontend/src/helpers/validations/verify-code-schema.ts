import { z } from 'zod'

export const verifyCodeSchema = z.object({
	code: z.string().length(6, { message: 'Must be 6 characters long' }),
})
