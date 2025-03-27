import { z } from 'zod'
import { EventType } from '../enum/event-type.enum'

export const createEventSchema = z.object({
	name: z.string().nonempty({ message: 'Title must be not empty' }),
	description: z.string().optional(),
	type: z.nativeEnum(EventType),
	startDate: z.date(),
	endDate: z.date().optional(),
})
