import { Observable } from 'rxjs';
import { MultiReplaceParams } from './multi-replace-params';

export interface FileData {
	basePath: string;
	srcPath: string;
	srcText: string;
}

export interface FilesParser {
	parse(params: MultiReplaceParams): Observable<FileData>;
}
