import { Notification } from './interfaces/notification.interface';
import { CalendarInvitationNotification } from './notifications/calendar-invitation.notification';
import { EventInvitationNotification } from './notifications/event-invitation.notification';
import { ReminderNotification } from './notifications/reminder.notification';

export const NotificationRegistry: Record<
	string,
	new (props: any) => Notification
> = {
	CalendarInvitationNotification,
	EventInvitationNotification,
	ReminderNotification,
};
