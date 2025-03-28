import { User } from '@prisma/client';
import { NotificationChannel } from '../interfaces/notification-channel.interface';
import { Notification } from '../interfaces/notification.interface';
import { Injectable } from '@nestjs/common';
import { PushService } from '@modules/push/push.service';

@Injectable()
export class PushChannel implements NotificationChannel {
	constructor(private readonly pushService: PushService) {}

	async send(notifiable: User, notification: Notification): Promise<void> {
		if (notification.toPush) {
			await this.pushService.sendPush({
				token: 'hello',
				...notification.toPush(),
			});
		}
	}
}
