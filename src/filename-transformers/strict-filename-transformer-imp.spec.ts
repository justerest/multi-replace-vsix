import { resolve } from 'path';

import { StrictFilenameTransformerImp } from './strict-filename-transformer-imp';

describe('class StrictFilenameTransformerImp', () => {
	let strictFilenameTransformerImp: StrictFilenameTransformerImp;

	beforeEach(() => {
		strictFilenameTransformerImp = new StrictFilenameTransformerImp();
	});

	it('should be created', () => {
		expect(strictFilenameTransformerImp).toBeTruthy();
	});

	describe('#replace()', () => {
		it('should replace file path preserving root part', () => {
			const data = [
				{ basePath: 'search-text', srcPath: 'search-text/search-text.ts', srcText: 'search-text' },
				{ basePath: 'search-text/**', srcPath: 'search-text/search-text.ts', srcText: 'search-text' },
			];
			data.forEach(({ basePath, srcPath }) => {
				const result = strictFilenameTransformerImp.replace({
					basePath,
					srcPath,
					searchValue: 'search-text',
					replaceValue: 'replace-text',
				});
				expect(result).toBe(resolve('search-text/replace-text.ts'));
			});
		});

		it('should not replace absolute file path', () => {
			const value = strictFilenameTransformerImp.replace({
				searchValue: 'ControlGroupImp',
				replaceValue: 'RootControlGroupImp',
				basePath: '/tmp/ControlGroupImp.ts',
				srcPath: '/tmp/ControlGroupImp.ts',
			});

			expect(value).toBe('/tmp/ControlGroupImp.ts');
		});
	});
});
