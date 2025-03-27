import React, { useState } from 'react'
import { Select } from '@mantine/core'

import { capitalize } from 'lodash'

import { apiClient, ApiError } from '@/shared/api/axios'
import { MemberRole } from '@/shared/enum'
import { ICalendar, ICalendarMember } from '@/shared/interface'
import { showNotification } from '@/shared/helpers/show-notification'

interface EditRolePopoverProps {
	user: ICalendarMember
	calendar: ICalendar
}

const EditRoleSelect: React.FC<EditRolePopoverProps> = ({ user, calendar }) => {
	const [role, setRole] = useState<MemberRole>(user.role)

	const onChange = async (value: string | null) => {
		try {
			const { data } = await apiClient.patch<ICalendarMember>(
				`calendars/${calendar.id}/users/${user.userId}/role`,
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

export default React.memo(EditRoleSelect)
