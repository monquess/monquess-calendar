import { MailService } from '@modules/mail/mail.service';
import { Processor, WorkerHost } from '@nestjs/bullmq';
import { Job } from 'bullmq';
import { NotificationName } from '../constants/notification.constant';
import { SendMailOptions } from '@modules/mail/interfaces/send-mail-options.interface';

@Processor('notification')
export class NotificationProcessor extends WorkerHost {
	constructor(private readonly mailService: MailService) {
		super();
	}

	async process(job: Job): Promise<any> {
		if (job.name === NotificationName.EMAIL) {
			await this.mailService.sendMail(job.data as SendMailOptions);
		}

		return;
	}
}
