import { Injectable } from '@nestjs/common';
import * as admin from 'firebase-admin';
import { SendPushOptions } from './interfaces/send-push-options.interface';

// fix env variables
admin.initializeApp({
	credential: admin.credential.cert({
		projectId: process.env.FIREBASE_PROJECT_ID,
		clientEmail: process.env.FIREBASE_CLIENT_EMAIL,
		privateKey: process.env.FIREBASE_PRIVATE_KEY,
	}),
});
@Injectable()
export class PushService {
	constructor() {}

	async sendPush({ token, title, body }: SendPushOptions) {
		return admin.messaging().send({
			token,
			notification: {
				title,
				body,
			},
		});
	}
}
