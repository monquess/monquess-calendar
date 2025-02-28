import {
	Catch,
	HttpException,
	ExceptionFilter,
	ArgumentsHost,
	HttpStatus,
} from '@nestjs/common';
import { Prisma } from '@prisma/client';

@Catch(Prisma.PrismaClientKnownRequestError)
export class PrismaExceptionFilter implements ExceptionFilter {
	catch(exception: Prisma.PrismaClientKnownRequestError, host: ArgumentsHost) {
		let status = HttpStatus.INTERNAL_SERVER_ERROR;
		let message = 'Internal server error';

		if (exception.code === 'P2025') {
			status = HttpStatus.NOT_FOUND;
			message = 'Record not found';
		}

		throw new HttpException(message, status);
	}
}
