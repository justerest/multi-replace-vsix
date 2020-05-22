import { angularCase } from './angular-case';

describe('AngularCase', () => {
	it('should replace preserving suffix', () => {
		expect(angularCase('app module')).toBe('app.module');
	});
	it('should replace preserving suffix', () => {
		expect(angularCase('app routing module')).toBe('app-routing.module');
	});
});
