import { EventImpl } from '@fullcalendar/core/internal'
import { differenceInDays } from 'date-fns'

type YearFormat = '2-digit' | 'numeric' | undefined

const timeFormatOptions: Intl.DateTimeFormatOptions = {
	hour: '2-digit',
	minute: '2-digit',
	hour12: false,
}

const dateFormatOptions: Intl.DateTimeFormatOptions = {
	month: 'long',
	day: 'numeric',
	weekday: 'long',
}

const getYearFormat = (date: Date): YearFormat => {
	return date.getFullYear() > new Date().getFullYear() ? 'numeric' : undefined
}

const formatDateTime = (date: Date) => {
	const timeFormatter = new Intl.DateTimeFormat('en-US', timeFormatOptions)
	const dateFormatter = new Intl.DateTimeFormat('en-US', {
		...dateFormatOptions,
		year: getYearFormat(date),
	})

	return `${dateFormatter.format(date)}, ${timeFormatter.format(date)}`
}

export const formatEventDate = (event: EventImpl): string => {
	const start = event.start as Date
	const end = event.end

	if (!end) {
		return new Intl.DateTimeFormat('en-US', {
			...timeFormatOptions,
			...dateFormatOptions,
			year: getYearFormat(start),
		}).format(start)
	}

	if (event.allDay) {
		const formatter = new Intl.DateTimeFormat('en-US', {
			...dateFormatOptions,
			year: getYearFormat(start),
		})

		if (differenceInDays(end, start) < 1) {
			return formatter.format(start)
		}

		return [formatter.format(start), formatter.format(end)].join(' - ')
	}

	// if (differenceInDays(end, start) < 1) {
	// 	return (
	// 		dateFormatter.format(start) +
	// 		', ' +
	// 		timeFormatter.format(start) +
	// 		' - ' +
	// 		timeFormatter.format(end)
	// 	)
	// }

	return [formatDateTime(start), formatDateTime(end)].join(' - ')
}
