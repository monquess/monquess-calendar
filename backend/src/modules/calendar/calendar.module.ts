import { Module } from '@nestjs/common';
import { CalendarController } from './calendar.controller';
import { CalendarService } from './calendar.service';
import { PrismaModule } from '@modules/prisma/prisma.module';
import { NotificationModule } from '@modules/notification/notification.module';
import { UserModule } from '@modules/user/user.module';

@Module({
	imports: [PrismaModule, NotificationModule, UserModule],
	controllers: [CalendarController],
	providers: [CalendarService],
	exports: [CalendarService],
})
export class CalendarModule {}
