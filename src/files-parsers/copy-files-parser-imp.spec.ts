import { resolve } from 'path';
import { of } from 'rxjs';
import { FileSystemService } from '../models/file-system-service';
import { CopyFilesParserImp } from './copy-files-parser-imp';

describe('class CopyFilesParserImp', () => {
	let copyFilesParserImp: CopyFilesParserImp;
	let fileSystemServiceStub: FileSystemService;

	beforeEach(() => {
		fileSystemServiceStub = {
			getFilesAtFolder: () => of(['']),
			writeFile: async () => void 0,
			readFile: async () => '',
			moveFile: async () => void 0,
			copy: async () => void 0,
		};
		copyFilesParserImp = new CopyFilesParserImp(fileSystemServiceStub);
	});

	it('should be created', () => {
		expect(copyFilesParserImp).toBeTruthy();
	});

	describe('#parse()', () => {
		it('should rename folder', (complete) => {
			spyOn(fileSystemServiceStub, 'getFilesAtFolder').and.callThrough();
			expect.assertions(1);
			const params = { paths: ['search-text/search-text'], searchValue: 'search-text', replaceValue: 'replace-text' };
			const expected = resolve('search-text/replace-text');
			copyFilesParserImp.parse(params).subscribe({
				next: () => expect(fileSystemServiceStub.getFilesAtFolder).toHaveBeenCalledWith(expected),
				complete,
			});
		});
	});
});
