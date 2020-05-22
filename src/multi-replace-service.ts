import { Observable } from 'rxjs';

import { FileSystemServiceImp } from './file-system-service-imp';
import { FilenameTransformerImp } from './filename-transformers/filename-transformer-imp';
import { FilesParserImp } from './files-parsers/files-parser-imp';
import { FileSystemService } from './models/file-system-service';
import { FilenameTransformer } from './models/filename-transformer';
import { FileData, FilesParser } from './models/files-parser';
import { MultiReplaceParams } from './models/multi-replace-params';
import { StringTransformer } from './models/string-transformer';
import { StringTransformerImp } from './string-transformer-imp';
import { mergeMap } from 'rxjs/operators';

export interface ChangedFileData extends FileData {
  outPath: string;
  outText: string;
}

export class MultiReplaceService {
  constructor(
    private stringTransformer: StringTransformer = new StringTransformerImp(),
    private fileSystemService: FileSystemService = new FileSystemServiceImp(),
    private filenameTransformer: FilenameTransformer = new FilenameTransformerImp(
      stringTransformer,
    ),
    private filesParser: FilesParser = new FilesParserImp(fileSystemService),
  ) {}

  multiReplace({
    paths,
    searchValue,
    replaceValue,
  }: MultiReplaceParams): Observable<ChangedFileData> {
    return this.filesParser.parse({ paths, searchValue, replaceValue }).pipe(
      mergeMap(async ({ basePath, srcPath, srcText }) => {
        const outText = this.stringTransformer.replace(srcText, searchValue, replaceValue);
        const outPath = this.filenameTransformer.replace({
          basePath,
          srcPath,
          searchValue,
          replaceValue,
        });
        await this.fileSystemService.writeFile(srcPath, outText);
        await this.fileSystemService.moveFile(srcPath, outPath);
        return { basePath, srcPath, srcText, outPath, outText };
      }),
    );
  }
}
