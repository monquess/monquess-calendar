import { Body, Controller, Post } from '@nestjs/common';
import { PushService } from './push.service';
import { CurrentUser } from '@common/decorators/current-user.decorator';

@Controller('push')
export class PushController {
	constructor(private readonly pushService: PushService) {}

	private subscriptions = new Map<number, Set<string>>();

	@Post('subscribe')
	subscribe(
		@Body() { token }: { token: string },
		@CurrentUser() user: CurrentUser
	) {
		if (!this.subscriptions.has(user.id)) {
			this.subscriptions.set(user.id, new Set());
		}

		this.subscriptions.get(user.id)?.add(token);
		console.log(this.subscriptions);

		return { message: 'Subscribed successfully!' };
	}
}
