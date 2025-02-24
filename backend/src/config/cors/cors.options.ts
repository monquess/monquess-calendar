import { HttpStatus } from '@nestjs/common';
import { origins } from './allowed-origins';

export const corsOptions = {
	origin: origins,
	methods: ['GET', 'POST', 'PATCH', 'DELETE'],
	optionsSuccessStatus: HttpStatus.NO_CONTENT,
	credentials: true,
};
