import { MonoTypeOperatorFunction } from 'rxjs';
import { filter } from 'rxjs/operators';

/**
 * RxJs pipable operator.
 */
export function filterUnique<T>(fn: (arg: T) => any = (data) => data): MonoTypeOperatorFunction<T> {
	const cache = new Set<string>();
	return filter((data) => {
		const value = fn(data);
		if (!cache.has(value)) {
			cache.add(value);
			return true;
		}
		return false;
	});
}
