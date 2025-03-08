import { Box, Switch, useMantineColorScheme } from '@mantine/core'
import React from 'react'
import { IoMoonOutline, IoSunnyOutline } from 'react-icons/io5'

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
				onLabel={<IoSunnyOutline size={20} />}
				offLabel={<IoMoonOutline size={20} />}
				thumbIcon={
					isDark ? (
						<IoMoonOutline size={20} color="black" />
					) : (
						<IoSunnyOutline size={20} color="black" />
					)
				}
			/>
		</Box>
	)
}

export default ThemeSwitch
