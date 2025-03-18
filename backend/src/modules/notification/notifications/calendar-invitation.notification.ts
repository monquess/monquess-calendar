import { MailChannel } from '../channels/mail.channel';
import { Notification } from '../interfaces/notification.interface';

export class CalendarInvitationNotification implements Notification {
	constructor(private readonly context?: Record<string, unknown>) {}

	channels() {
		return [MailChannel];
	}

	toMail() {
		return {
			subject: 'Calendar invitation',
			templateName: 'calendar-invitation',
			context: this?.context,
		};
	}
}
