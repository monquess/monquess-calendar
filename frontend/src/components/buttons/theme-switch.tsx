import React from 'react'
import { Box, Switch, useMantineColorScheme } from '@mantine/core'

import { HiSun } from 'react-icons/hi'
import { MdDarkMode } from 'react-icons/md'

const ThemeSwitch: React.FC = () => {
	const { colorScheme, toggleColorScheme } = useMantineColorScheme()
	const isDark = colorScheme === 'dark'

	return (
		<Box>
			<Switch
				checked={isDark}
				onChange={() => toggleColorScheme()}
				size="lg"
				color="dark.4"
				onLabel={<HiSun size={20} />}
				offLabel={<MdDarkMode size={20} />}
				thumbIcon={
					isDark ? (
						<MdDarkMode size={20} color="black" />
					) : (
						<HiSun size={20} color="black" />
					)
				}
			/>
		</Box>
	)
}

export default ThemeSwitch
