import { Injectable } from '@nestjs/common';
import { User } from '@prisma/client';
import { Notification } from './interfaces/notification.interface';
import { JobsOptions, Queue } from 'bullmq';
import { InjectQueue } from '@nestjs/bullmq';

@Injectable({})
export class NotificationService {
	constructor(@InjectQueue('notification') private notificationQueue: Queue) {}

	async send(
		notifiables: User[] | User,
		notification: Notification,
		options?: JobsOptions
	) {
		notifiables = Array.isArray(notifiables) ? notifiables : [notifiables];

		for (const channel of notification.channels()) {
			for (const notifiable of notifiables) {
				await this.notificationQueue.add(
					'sendNotification',
					{
						channel: channel.name,
						notifiable,
						notification: {
							className: notification.constructor.name,
							properties: { ...notification },
						},
					},
					options
				);
			}
		}
	}
}
