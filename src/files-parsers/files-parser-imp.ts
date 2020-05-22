import { from, Observable, of } from 'rxjs';
import { mergeAll, mergeMap, map } from 'rxjs/operators';

import { FileSystemServiceImp } from '../file-system-service-imp';
import { FileSystemService } from '../models/file-system-service';
import { FileData, FilesParser } from '../models/files-parser';
import { MultiReplaceParams } from '../models/multi-replace-params';
import { filterUnique } from '../utils/filter-unique.rxjs-pipe';

export class FilesParserImp implements FilesParser {
  constructor(protected fileSystemService: FileSystemService = new FileSystemServiceImp()) {}

  parse({ paths }: MultiReplaceParams): Observable<FileData> {
    return from(paths).pipe(mergeMap((path) => this.parsePath(path)));
  }

  protected parsePath(path: string): Observable<FileData> {
    return of({ basePath: path }).pipe(
      mergeMap(({ basePath }) =>
        this.getFilesAtFolder(basePath).pipe(map((srcPath) => ({ basePath, srcPath }))),
      ),
      filterUnique(({ srcPath }) => srcPath),
      mergeMap(({ srcPath, ...params }) =>
        this.fileSystemService
          .readFile(srcPath)
          .then((srcText) => ({ ...params, srcPath, srcText })),
      ),
    );
  }

  private getFilesAtFolder(path: string): Observable<string> {
    return this.fileSystemService.getFilesAtFolder(path).pipe(mergeAll());
  }
}
