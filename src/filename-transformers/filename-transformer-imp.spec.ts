import { resolve } from 'path';

import { FilenameTransformerImp } from './filename-transformer-imp';

describe('class FilenameTransformerImp', () => {
	let filenameTransformerImp: FilenameTransformerImp;

	beforeEach(() => {
		filenameTransformerImp = new FilenameTransformerImp();
	});

	it('should be created', () => {
		expect(filenameTransformerImp).toBeTruthy();
	});

	describe('#replace()', () => {
		it('should replace file path preserving root part', () => {
			const data = [
				{ basePath: 'search-text', srcPath: 'search-text/search-text.ts', srcText: 'search-text' },
				{ basePath: 'search-text/**', srcPath: 'search-text/search-text.ts', srcText: 'search-text' },
				{ basePath: 'search-text/search-text.ts', srcPath: 'search-text/search-text.ts', srcText: 'search-text' },
			];
			data.forEach(({ basePath, srcPath }) => {
				const result = filenameTransformerImp.replace({
					basePath,
					srcPath,
					searchValue: 'search-text',
					replaceValue: 'replace-text',
				});
				expect(result).toBe(resolve('search-text/replace-text.ts'));
			});
		});

		it('should replace file path', () => {
			const value = filenameTransformerImp.replace({
				searchValue: 'ControlGroupImp',
				replaceValue: 'RootControlGroupImp',
				basePath: '/tmp/ControlGroupImp.ts',
				srcPath: '/tmp/ControlGroupImp.ts',
			});

			expect(value).toBe('/tmp/RootControlGroupImp.ts');
		});
	});
});
