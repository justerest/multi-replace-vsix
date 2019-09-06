import { multiReplace, multiReplaceCopy, multiReplaceStrict, multiReplaceWithFolder } from '@justerest/multi-replace';
import { basename, extname } from 'path';
import { Uri, window } from 'vscode';

enum Option {
  Default = 'multi-replace inside selected catalog (default)',
  Copy = 'copy',
  RenameFolder = 'rename',
  Strict = 'strict multi-replace (without case detection)',
}

async function main(uris: Uri[]) {
  const selectedOption = await askOption();
  const { paths, searchValue, replaceValue } = await askReplaceParams(uris);
  switch (selectedOption) {
    case Option.Copy:
      multiReplaceCopy({ paths, searchValue, replaceValue }).subscribe({ complete });
      break;

    case Option.RenameFolder:
      multiReplaceWithFolder({ paths, searchValue, replaceValue }).subscribe({ complete });
      break;

    case Option.Strict:
      multiReplaceStrict({ paths, searchValue, replaceValue }).subscribe({ complete });
      break;

    default:
      multiReplace({ paths, searchValue, replaceValue }).subscribe({ complete });
      break;
  }
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
