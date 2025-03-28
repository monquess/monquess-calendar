import { Role, CalendarType } from '@prisma/client';

export const AllowedRoles = Object.fromEntries(
	Object.entries(Role).filter(([_key, value]) => value !== Role.OWNER)
);

export type AllowedRoles = (typeof AllowedRoles)[keyof typeof AllowedRoles];

export const AllowedTypes = Object.fromEntries(
	Object.entries(CalendarType).filter(
		([_key, value]) => value !== CalendarType.PERSONAL
	)
);

export type AllowedTypes = (typeof AllowedTypes)[keyof typeof AllowedTypes];
