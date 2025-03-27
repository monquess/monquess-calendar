import { z } from 'zod'

const hexColorPattern = /^#([0-9A-F]{3}|[0-9A-F]{6})$/i

export const CalendarCreateSchema = z.object({
	name: z.string().nonempty(),
	description: z.string(),
	color: z
		.string()
		.nonempty()
		.refine((value) => hexColorPattern.test(value), {
			message: 'Invalid hex color',
		}),
})

export const HolidayCalendarCreateSchema = z.object({
	description: z.string(),
	color: z
		.string()
		.nonempty()
		.refine((value) => hexColorPattern.test(value), {
			message: 'Invalid hex color',
		}),
})
