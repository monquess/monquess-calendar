import { Modal, Stack, useMantineColorScheme } from '@mantine/core'
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
	const sitekey = import.meta.env.VITE_GOOGLE_RECAPTCHA_SITE_KEY

	return (
		<Modal
			opened={opened}
			onClose={onClose}
			withCloseButton={false}
			closeOnClickOutside={false}
			closeOnEscape={false}
			centered
		>
			<Stack align="center" justify="center" style={{ padding: 5 }}>
				<ReCAPTCHA
					theme={colorScheme === 'dark' ? 'dark' : 'light'}
					sitekey={sitekey}
					ref={ref}
					onChange={onSubmit}
				/>
			</Stack>
		</Modal>
	)
}

export default GoogleRecaptchaModal
