import { Observable } from 'rxjs';

export interface FileSystemService {
	getFilesAtFolder(path: string): Observable<string[]>;
	readFile(path: string): Promise<string>;
	writeFile(path: string, data: string): Promise<void>;
	moveFile(srcPath: string, outPath: string): Promise<void>;
	copy(src: string, dest: string): Promise<void>;
}
