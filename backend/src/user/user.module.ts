import { Module } from '@nestjs/common';
import { UserController } from './user.controller';
import { UserService } from './user.service';
import { PrismaModule } from '@prisma/prisma.module';
import { S3Module } from '@s3/s3.module';

@Module({
	imports: [PrismaModule, S3Module],
	controllers: [UserController],
	providers: [UserService],
})
export class UserModule {}
