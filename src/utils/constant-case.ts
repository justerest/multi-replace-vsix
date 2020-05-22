import { snakeCase } from 'lodash';

export function constantCase(str: string): string {
	return snakeCase(str).toUpperCase();
}
