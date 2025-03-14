export const NotificationName = {
	EMAIL: 'email',
} as const;

export type NotificationName =
	(typeof NotificationName)[keyof typeof NotificationName];
