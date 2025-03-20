export interface GoogleHolidayResponse {
	items: {
		summary: string;
		start: { date: string };
		end: { date: string };
	}[];
}
