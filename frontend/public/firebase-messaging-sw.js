importScripts('https://www.gstatic.com/firebasejs/8.10.0/firebase-app.js')
importScripts('https://www.gstatic.com/firebasejs/8.10.0/firebase-messaging.js')

// fix env variables
const firebaseConfig = {
	apiKey: config.FIREBASE_API_KEY,
	authDomain: config.FIREBASE_AUTH_DOMAIN,
	projectId: config.FIREBASE_PROJECT_ID,
	storageBucket: config.FIREBASE_STORAGE_BUCKET,
	messagingSenderId: config.FIREBASE_MESSAGING_SENDER_ID,
	appId: config.FIREBASE_APP_ID,
}

const app = firebase.initializeApp(firebaseConfig)
const messaging = firebase.messaging()

messaging.onBackgroundMessage((payload) => {
	console.log(
		'[firebase-messaging-sw.js] Received background message ',
		payload
	)
	const notificationTitle = payload.notification.title
	const notificationOptions = {
		body: payload.notification.body,
		icon: payload.notification.image,
	}
	self.registration.showNotification(notificationTitle, notificationOptions)
})
