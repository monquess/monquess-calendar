import * as crypto from 'crypto';

export const generateColor = (str: string): string => {
	const hash = crypto.createHash('md5').update(str).digest('hex');
	return `#${hash.substring(0, 6)}`;
};
