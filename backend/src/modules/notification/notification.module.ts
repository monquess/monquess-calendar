import { Module } from '@nestjs/common';
import { NotificationService } from './notification.service';
import { MailChannel } from './channels/mail.channel';
import { BullModule } from '@nestjs/bullmq';
import { NotificationProcessor } from './processors/notification.processor';
import { PushModule } from '@modules/push/push.module';
import { PushChannel } from './channels/push.channel';

@Module({
	imports: [
		BullModule.registerQueue({
			name: 'notification',
		}),
		PushModule,
	],
	providers: [
		NotificationService,
		MailChannel,
		PushChannel,
		{
			provide: 'MailChannel',
			useExisting: MailChannel,
		},
		{
			provide: 'PushChannel',
			useExisting: PushChannel,
		},
		NotificationProcessor,
	],
	exports: [NotificationService],
})
export class NotificationModule {}
