import { MailChannel } from '../channels/mail.channel';
import { PushChannel } from '../channels/push.channel';
import { Notification } from '../interfaces/notification.interface';

export class CalendarInvitationNotification implements Notification {
	constructor(private readonly context?: Record<string, unknown>) {}

	channels() {
		return [MailChannel, PushChannel];
	}

	toMail() {
		return {
			subject: 'Calendar invitation',
			templateName: 'calendar-invitation',
			context: this?.context,
		};
	}

	toPush() {
		return {
			title: 'Calendar invitation',
			body: `You've been invited to calendar`,
		};
	}

	toObject() {
		return this.context;
	}
}
