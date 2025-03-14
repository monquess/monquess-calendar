import { Module } from '@nestjs/common';
import { NotificationService } from './notification.service';
import { MailChannel } from './channels/mail.channel';

@Module({
	providers: [NotificationService, MailChannel],
	exports: [NotificationService],
})
export class NotificationModule {}
