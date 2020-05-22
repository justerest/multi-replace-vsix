import { basename, dirname, resolve } from 'path';

import { DirFilenameTransformerImp } from './dir-filename-transformer-imp';

describe('class DirFilenameTransformerImp', () => {
	let dirFilenameTransformerImp: DirFilenameTransformerImp;

	beforeEach(() => {
		dirFilenameTransformerImp = new DirFilenameTransformerImp();
	});

	it('should be created', () => {
		expect(dirFilenameTransformerImp).toBeTruthy();
	});

	describe('#replace()', () => {
		xit('learn', () => {
			expect(dirname('a/b/c.ts')).toBe('a/b');
		});

		xit('learn', () => {
			expect(dirname(dirname('a/b/c.ts'))).toBe('a');
		});

		xit('learn', () => {
			expect(basename('a/b')).toBe('b');
		});

		it('should replace absolute file path preserving dir', () => {
			const result = dirFilenameTransformerImp.replace({
				basePath: 'search-text/search-text/search-text.ts',
				srcPath: 'search-text/search-text/search-text.ts',
				searchValue: 'search-text',
				replaceValue: 'replace-text',
			});
			expect(result).toBe(resolve('search-text/search-text/replace-text.ts'));
		});

		it('should replace file path with first dir', () => {
			const result = dirFilenameTransformerImp.replace({
				basePath: 'search-text/search-text',
				srcPath: 'search-text/search-text/search-text.ts',
				searchValue: 'search-text',
				replaceValue: 'replace-text',
			});
			expect(result).toBe(resolve('search-text/replace-text/replace-text.ts'));
		});

		it('should replace file path with first dir', () => {
			const result = dirFilenameTransformerImp.replace({
				basePath: 'search-text/search-text/**',
				srcPath: 'search-text/search-text/search-text.ts',
				searchValue: 'search-text',
				replaceValue: 'replace-text',
			});
			expect(result).toBe(resolve('search-text/replace-text/replace-text.ts'));
		});

		it('should replace file path with first dir', () => {
			const result = dirFilenameTransformerImp.replace({
				basePath: 'search-text/search-text',
				srcPath: 'search-text/search-text/search-text.ts',
				searchValue: 'search-text',
				replaceValue: 'replace-text',
			});
			expect(result).toBe(resolve('search-text/replace-text/replace-text.ts'));
		});

		it('should replace file path with first dir', () => {
			const result = dirFilenameTransformerImp.replace({
				basePath: 'search-text',
				srcPath: 'search-text/search-text/search-text.ts',
				searchValue: 'search-text',
				replaceValue: 'replace-text',
			});
			expect(result).toBe(resolve('replace-text/replace-text/replace-text.ts'));
		});
	});
});
