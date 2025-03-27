import { Select } from '@mantine/core'
import React, { useState } from 'react'

import { capitalize } from 'lodash'

import { apiClient, ApiError } from '@/helpers/api/axios'
import { MemberRole } from '@/helpers/enum/member-role.enum'
import { IUserMember } from '@/helpers/interface/calendar.interface'
import { IEventMember } from '@/helpers/interface/event.interface'
import { showNotification } from '@/helpers/show-notification'
import { EventImpl } from '@fullcalendar/core/internal'

interface EditEventRoleSelectProps {
	user: IEventMember
	event: EventImpl
}

const EditEventRoleSelect: React.FC<EditEventRoleSelectProps> = React.memo(
	({ user, event }) => {
		const [role, setRole] = useState<MemberRole>(user.role)

		const onChange = async (value: string | null) => {
			try {
				const { data } = await apiClient.patch<IUserMember>(
					`events/${event.id}/members/${user.userId}/role`,
					{
						role: value?.toLocaleUpperCase(),
					}
				)

				setRole(data.role)
				showNotification(
					'Change role',
					`Role for ${user.user.username} changed successfully`,
					'green'
				)
			} catch (error) {
				if (error instanceof ApiError && error.response) {
					showNotification('Change role error', error.message, 'red')
				}
			}
		}

		return (
			<Select
				size="xs"
				value={role}
				onChange={onChange}
				data={Object.entries(MemberRole)
					.filter(([key]) => key !== MemberRole.OWNER)
					.map(([key, value]) => ({
						value: key,
						label: capitalize(value),
					}))}
				styles={{ dropdown: { zIndex: 1200 } }}
			/>
		)
	}
)

export default EditEventRoleSelect
