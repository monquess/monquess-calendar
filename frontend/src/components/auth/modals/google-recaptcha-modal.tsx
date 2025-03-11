import { config } from '@/config/config'
import { Modal, Stack, useMantineColorScheme } from '@mantine/core'
import React from 'react'
import ReCAPTCHA from 'react-google-recaptcha'

interface GoogleRecaptchaModalProps {
	opened: boolean
	onClose: () => void
	onSubmit: () => void
	ref: React.Ref<ReCAPTCHA>
}

const GoogleRecaptchaModal: React.FC<GoogleRecaptchaModalProps> = ({
	opened,
	onClose,
	onSubmit,
	ref,
}) => {
	const { colorScheme } = useMantineColorScheme()

	return (
		<Modal
			opened={opened}
			onClose={onClose}
			withCloseButton={false}
			closeOnEscape={false}
			centered
		>
			<Stack align="center" justify="center" style={{ padding: 5 }}>
				<ReCAPTCHA
					theme={colorScheme === 'dark' ? 'dark' : 'light'}
					sitekey={config.GOOGLE_RECAPTCHA_SITE_KEY}
					ref={ref}
					onChange={onSubmit}
				/>
			</Stack>
		</Modal>
	)
}

export default GoogleRecaptchaModal
