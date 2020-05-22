import { dirname, relative, resolve } from 'path';

import { FilePathParams } from '../models/filename-transformer';
import { FilenameTransformerImp } from './filename-transformer-imp';

export class DirFilenameTransformerImp extends FilenameTransformerImp {
	protected replaceRelativePath({ basePath, srcPath, searchValue, replaceValue }: FilePathParams): string {
		const dir = dirname(basePath.replace(/\**$/, ''));
		const relativePath = relative(dir, srcPath);
		const path = this.stringTransformer.replace(relativePath, searchValue, replaceValue);
		return resolve(dir, path);
	}
}
