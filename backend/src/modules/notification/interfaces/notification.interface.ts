import { Type } from '@nestjs/common';
import { NotificationChannel } from './notification-channel.interface';
import { SendMailOptions } from '@modules/mail/interfaces/send-mail-options.interface';
import { SendPushOptions } from '@modules/push/interfaces/send-push-options.interface';

export interface Notification {
	channels(): Type<NotificationChannel>[];

	toMail?(): Omit<SendMailOptions, 'to'>;

	toPush?(): Omit<SendPushOptions, 'token'>;

	toObject(): Record<string, unknown> | undefined;
}
