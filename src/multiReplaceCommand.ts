import { DirFilePathTransformer, MainService, multiReplace, multiReplaceStrict } from '@justerest/multi-replace';
import { copy } from 'fs-extra';
import { basename, extname } from 'path';
import { Uri, window } from 'vscode';

const filePathTransformer = new DirFilePathTransformer();
const multiReplacer = new MainService(void 0, void 0, filePathTransformer);
const multiReplaceWithFolder = multiReplacer.multiReplace.bind(multiReplacer);

enum Option {
  Default = 'inside selected catalog (default)',
  Copy = 'copy folder and replace',
  RenameFolder = 'includes selected catalog',
  Strict = 'strict (without case detection)',
}

async function main(uris: Uri[]) {
  const selectedOption = await askOption();
  const { paths, searchValue, replaceValue } = await askReplaceParams(uris);
  switch (selectedOption) {
    case Option.Copy:
      const newFolderPath = await copyFolder(paths, searchValue, replaceValue);
      multiReplace([newFolderPath], searchValue, replaceValue).subscribe({ complete });
      break;

    case Option.RenameFolder:
      multiReplaceWithFolder(paths, searchValue, replaceValue).subscribe({ complete });
      break;

    case Option.Strict:
      multiReplaceStrict(paths, searchValue, replaceValue).subscribe({ complete });
      break;

    default:
      multiReplace(paths, searchValue, replaceValue).subscribe({ complete });
      break;
  }
}

async function copyFolder(paths: string[], searchValue: string, replaceValue: string): Promise<string> {
  const path = paths[0];
  const replacedPath = filePathTransformer.replace({ basePath: path, srcPath: path, searchValue, replaceValue });
  const newFolderPath = path !== replacedPath ? replacedPath : `${path} copy`;
  await copy(path, newFolderPath);
  return newFolderPath;
}

async function askOption(): Promise<Option> {
  const options: Option[] = Object.values(Option);
  const selectedOption = (await window.showQuickPick(options, { placeHolder: 'multi-replace' })) as Option;
  if (selectedOption) {
    return selectedOption;
  }
  throw new Error('');
}

function parseUris(uris?: Uri[]): Uri[] {
  if (!uris || !uris.length) {
    throw new Error('Use explorer context menu');
  }
  return uris;
}

async function askReplaceParams(uris: Uri[]) {
  const paths = uris.map((uri) => uri.fsPath);
  const placeholder = basename(paths[0], extname(paths[0]));
  const searchValue = await askSearchValue(placeholder);
  const replaceValue = await askReplaceValue(placeholder);
  return { paths, searchValue, replaceValue };
}

async function askSearchValue(placeholder: string): Promise<string> {
  const searchValue = await window.showInputBox({ prompt: 'Search value', value: placeholder, ignoreFocusOut: true });
  if (searchValue) {
    return searchValue;
  }
  throw new Error('');
}

async function askReplaceValue(placeholder: string): Promise<string> {
  const replaceValue = await window.showInputBox({ prompt: 'Replace value', value: placeholder, ignoreFocusOut: true });
  if (replaceValue) {
    return replaceValue;
  }
  throw new Error('');
}

function complete() {
  window.showInformationMessage('multi-replace successfully completed');
}

export async function multiReplaceCommand(_uri?: Uri, uris?: Uri[]) {
  try {
    await main(parseUris(uris));
  } catch (error) {
    window.showInformationMessage((error as Error).message || 'multi-replace canceled');
  }
}
