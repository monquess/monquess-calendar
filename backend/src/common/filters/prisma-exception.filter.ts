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

		if (exception.code === 'P2002') {
			const modelName = exception.meta?.modelName || 'Record';
			status = HttpStatus.CONFLICT;
			message = `${modelName} already exists`;
		}
		if (exception.code === 'P2025') {
			const modelName = exception.meta?.modelName || 'Record';
			status = HttpStatus.NOT_FOUND;
			message = `${modelName} not found`;
		}

		throw new HttpException(message, status);
	}
}
