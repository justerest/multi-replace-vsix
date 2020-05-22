import { basename, dirname, relative, resolve } from 'path';

import { FilenameTransformer, FilePathParams } from '../models/filename-transformer';
import { StringTransformer } from '../models/string-transformer';
import { StringTransformerImp } from '../string-transformer-imp';

export class FilenameTransformerImp implements FilenameTransformer {
	constructor(protected stringTransformer: StringTransformer = new StringTransformerImp()) {}

	replace(filePathParams: FilePathParams): string {
		if (this.isAbsoluteFilePath(filePathParams)) {
			return this.replaceAbsolutePath(filePathParams);
		}
		return this.replaceRelativePath(filePathParams);
	}

	protected replaceRelativePath({ basePath, srcPath, searchValue, replaceValue }: FilePathParams): string {
		const relativePath = relative(basePath, srcPath);
		const path = this.stringTransformer.replace(relativePath, searchValue, replaceValue);
		return resolve(basePath, path);
	}

	protected replaceAbsolutePath({ srcPath, searchValue, replaceValue }: FilePathParams): string {
		const filename = basename(srcPath);
		const dir = dirname(srcPath);
		const changedFilename = this.stringTransformer.replace(filename, searchValue, replaceValue);
		return resolve(dir, changedFilename);
	}

	private isAbsoluteFilePath({ basePath, srcPath }: FilePathParams): boolean {
		return !relative(basePath, srcPath);
	}
}
