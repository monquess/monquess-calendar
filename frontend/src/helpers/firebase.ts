import { initializeApp } from 'firebase/app'
import { getMessaging } from '@firebase/messaging'
import { config } from '@/config/config'

const firebaseConfig = {
	apiKey: config.FIREBASE_API_KEY,
	authDomain: config.FIREBASE_AUTH_DOMAIN,
	projectId: config.FIREBASE_PROJECT_ID,
	storageBucket: config.FIREBASE_STORAGE_BUCKET,
	messagingSenderId: config.FIREBASE_MESSAGING_SENDER_ID,
	appId: config.FIREBASE_APP_ID,
}

export const app = initializeApp(firebaseConfig)
export const messaging = getMessaging(app)
