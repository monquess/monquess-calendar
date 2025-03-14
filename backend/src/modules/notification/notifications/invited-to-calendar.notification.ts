import { MailChannel } from '../channels/mail.channel';
import { Notification } from '../interfaces/notification.interface';

// demo example
export class InvitedToCalendarNotification implements Notification {
	constructor(private readonly context?: Record<string, unknown>) {}

	channels() {
		return [MailChannel];
	}

	toMail() {
		return {
			subject: "You've been invited to calendar",
			templateName: 'verification',
			context: this?.context,
		};
	}
}
