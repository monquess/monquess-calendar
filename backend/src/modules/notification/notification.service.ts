import { Injectable } from '@nestjs/common';
import { User } from '@prisma/client';
import { Notification } from './interfaces/notification.interface';
import { ModuleRef } from '@nestjs/core';

@Injectable()
export class NotificationService {
	constructor(private readonly moduleRef: ModuleRef) {}

	async send(notifiables: User[] | User, notification: Notification) {
		notifiables = Array.isArray(notifiables) ? notifiables : [notifiables];

		for (const channel of notification.channels()) {
			for (const notifiable of notifiables) {
				await this.moduleRef.get(channel).send(notifiable, notification);
			}
		}
	}
}
