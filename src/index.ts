import { DirFilenameTransformerImp } from './filename-transformers/dir-filename-transformer-imp';
import { StrictFilenameTransformerImp } from './filename-transformers/strict-filename-transformer-imp';
import { CopyFilesParserImp } from './files-parsers/copy-files-parser-imp';
import { MultiReplaceService } from './multi-replace-service';
import { StringTransformerImp } from './string-transformer-imp';

export * from './models/filename-transformer';
export * from './models/file-system-service';
export * from './models/files-parser';
export * from './models/multi-replace-params';
export * from './models/string-transformer';

export * from './file-system-service-imp';
export * from './string-transformer-imp';
export * from './multi-replace-service';
export * from './filename-transformers/dir-filename-transformer-imp';
export * from './filename-transformers/filename-transformer-imp';
export * from './filename-transformers/strict-filename-transformer-imp';
export * from './files-parsers/files-parser-imp';
export * from './files-parsers/copy-files-parser-imp';

const multiReplaceService = new MultiReplaceService();
const multiReplaceCopyService = new MultiReplaceService(
	void 0,
	void 0,
	new StrictFilenameTransformerImp(),
	new CopyFilesParserImp(),
);
const multiReplaceWithFolderService = new MultiReplaceService(void 0, void 0, new DirFilenameTransformerImp());
const multiReplaceServiceStrict = new MultiReplaceService(new StringTransformerImp([(str) => str]));

export const multiReplace = multiReplaceService.multiReplace.bind(multiReplaceService);
export const multiReplaceCopy = multiReplaceCopyService.multiReplace.bind(multiReplaceCopyService);
export const multiReplaceWithFolder = multiReplaceWithFolderService.multiReplace.bind(multiReplaceWithFolderService);
export const multiReplaceStrict = multiReplaceServiceStrict.multiReplace.bind(multiReplaceServiceStrict);
