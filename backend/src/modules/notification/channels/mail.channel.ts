import { User } from '@prisma/client';
import { NotificationChannel } from '../interfaces/notification-channel.interface';
import { Notification } from '../interfaces/notification.interface';
import { Injectable } from '@nestjs/common';
import { InjectQueue } from '@nestjs/bullmq';
import { Queue } from 'bullmq';
import { NotificationName } from '../constants/notification.constant';

@Injectable()
export class MailChannel implements NotificationChannel {
	constructor(@InjectQueue('notification') private notificationQueue: Queue) {}

	async send(notifiable: User, notification: Notification): Promise<void> {
		if (notification.toMail) {
			await this.notificationQueue.add(NotificationName.EMAIL, {
				to: notifiable.email,
				...notification.toMail(),
			});
		}
	}
}
