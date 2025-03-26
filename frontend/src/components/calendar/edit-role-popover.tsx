import { apiClient, ApiError } from '@/helpers/api/axios'
import { MemberRole } from '@/helpers/enum/member-role.enum'
import { ICalendar, IUserMember } from '@/helpers/interface/calendar.interface'
import { showNotification } from '@/helpers/show-notification'
import { ActionIcon, Button, Popover, Select, Stack } from '@mantine/core'
import React, { useState } from 'react'
import { CiEdit } from 'react-icons/ci'

interface EditRolePopoverProps {
	user: IUserMember
	calendar: ICalendar
}

const EditRolePopover: React.FC<EditRolePopoverProps> = React.memo(
	({ user, calendar }) => {
		const [value, setValue] = useState<MemberRole | null>(user.role)

		const handleClick = async () => {
			try {
				await apiClient.patch(
					`calendars/${calendar.id}/users/${user.userId}`,
					value?.toLocaleUpperCase()
				)
				showNotification(
					'Change role',
					`Role for ${user.user.username} changed successfully`,
					'green'
				)
			} catch (error) {
				if (error instanceof ApiError && error.response) {
					showNotification('Calendar update error', error.message, 'red')
				}
			}
		}

		return (
			<Popover shadow="md" zIndex={1100} closeOnClickOutside={false}>
				<Popover.Target>
					<ActionIcon size="xs" variant="transparent">
						<CiEdit />
					</ActionIcon>
				</Popover.Target>
				<Popover.Dropdown>
					<Stack pos="relative">
						<Select
							label="Choose new role"
							value={value}
							onChange={(newValue) => setValue(newValue as MemberRole)}
							data={[
								{ value: MemberRole.EDITOR, label: 'Editor' },
								{ value: MemberRole.VIEWER, label: 'Viewer' },
								{ value: MemberRole.OWNER, label: 'Owner' },
							]}
							styles={{ dropdown: { zIndex: 1200 } }}
						/>
						<Button onClick={handleClick}>Save</Button>
					</Stack>
				</Popover.Dropdown>
			</Popover>
		)
	}
)

export default EditRolePopover
