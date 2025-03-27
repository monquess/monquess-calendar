import { MailChannel } from '../channels/mail.channel';
import { Notification } from '../interfaces/notification.interface';

export class EventInvitationNotification implements Notification {
	constructor(private readonly context?: Record<string, unknown>) {}

	channels() {
		return [MailChannel];
	}

	toMail() {
		return {
			subject: 'Event invitation',
			templateName: 'event-invitation',
			context: this?.context,
		};
	}

	toObject() {
		return this.context;
	}
}
