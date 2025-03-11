import { z } from 'zod'

const configSchema = z.object({
	VITE_API_BASE_URL: z.string().url(),
	VITE_GOOGLE_RECAPTCHA_SITE_KEY: z.string(),
})

const env = configSchema.parse(import.meta.env)

export const config = Object.fromEntries(
	Object.entries(env).map(([key, value]) => [key.replace('VITE_', ''), value])
)
