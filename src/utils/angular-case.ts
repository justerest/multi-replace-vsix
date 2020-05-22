import { kebabCase } from 'lodash';

export function angularCase(str: string): string {
	return kebabCase(str).replace(/-(?=\w+$)/, '.');
}
