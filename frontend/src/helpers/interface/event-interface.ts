export interface IEventMember {
	userId: number
	role: string
	status: string
	createdAt: Date
}

export interface IEvent {
	id: string
	name: string
	description: string | null
	color: string
	type: string
	startDate: string
	endDate: string | null

	members: IEventMember[]
}
