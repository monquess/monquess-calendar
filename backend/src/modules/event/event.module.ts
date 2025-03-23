import { forwardRef, Module } from '@nestjs/common';
import { EventService } from './event.service';
import { EventController } from './event.controller';
import { PrismaModule } from '@modules/prisma/prisma.module';
import { CalendarModule } from '@modules/calendar/calendar.module';
import { NotificationModule } from '@modules/notification/notification.module';

@Module({
	imports: [PrismaModule, forwardRef(() => CalendarModule), NotificationModule],
	providers: [EventService],
	controllers: [EventController],
	exports: [EventService],
})
export class EventModule {}
