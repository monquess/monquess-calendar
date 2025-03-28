import { useMemo } from 'react'
import { useMediaQuery } from '@mantine/hooks'

export const useResponsive = () => {
	const isMobile = useMediaQuery('(max-width: 36em)')
	const isTablet = useMediaQuery('(max-width: 48em)')

	return useMemo(
		() => ({
			isMobile,
			isTablet,
		}),
		[isMobile, isTablet]
	)
}
