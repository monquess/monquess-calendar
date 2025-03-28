import { MailChannel } from '../channels/mail.channel';
import { Notification } from '../interfaces/notification.interface';

export class ReminderNotification implements Notification {
	constructor(private readonly context?: Record<string, unknown>) {}

	channels() {
		return [MailChannel];
	}

	toMail() {
		return {
			subject: 'Event reminder',
			templateName: 'reminder',
			context: this?.context,
		};
	}

	toObject() {
		return this.context;
	}
}
