import { kebabCase } from 'lodash';

import { StringTransformerImp } from './string-transformer-imp';

describe('class StringTransformerImp', () => {
	let stringTransformerImp: StringTransformerImp;

	beforeEach(() => {
		stringTransformerImp = new StringTransformerImp();
	});

	it('should be created', () => {
		expect(stringTransformerImp).toBeTruthy();
	});

	describe('method replaceText', () => {
		it('should replace preserving cases', () => {
			expect(stringTransformerImp.replace('searchValue', 'search_value', 'replace-value')).toBe('replaceValue');
		});

		it('should replace angular case', () => {
			expect(stringTransformerImp.replace('user.service', 'user service', 'currentUserService')).toBe(
				'current-user.service',
			);
		});

		it('should camelCase if not indetify', () => {
			expect(stringTransformerImp.replace('user', 'user', 'currentUser')).toBe('currentUser');
		});

		it('should use default transformer if not indetify', () => {
			stringTransformerImp = new StringTransformerImp(void 0, kebabCase);
			expect(stringTransformerImp.replace('user', 'user', 'currentUser')).toBe('current-user');
		});

		it('should replace without preserving case', () => {
			stringTransformerImp = new StringTransformerImp([(str) => str]);
			expect(stringTransformerImp.replace('user', 'user', 'an-animal_case')).toBe('an-animal_case');
		});
	});
});
