import { Role } from '@prisma/client';

export const DEFAULT_CALENDAR_COLOR = '#0000ff';

export const AllowedRoles = Object.fromEntries(
	Object.entries(Role).filter(([_key, value]) => value !== Role.OWNER)
);

export type AllowedRoles = (typeof AllowedRoles)[keyof typeof AllowedRoles];
