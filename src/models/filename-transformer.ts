export interface FilePathParams {
	basePath: string;
	srcPath: string;
	searchValue: string;
	replaceValue: string;
}

export interface FilenameTransformer {
	replace(filePathParams: FilePathParams): string;
}
