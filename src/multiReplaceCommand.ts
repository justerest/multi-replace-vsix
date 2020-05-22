import {
  multiReplace,
  multiReplaceCopy,
  multiReplaceStrict,
  multiReplaceWithFolder,
} from './index';
import { basename, extname } from 'path';
import { Uri, window, QuickPickItem } from 'vscode';

enum Option {
  Default,
  Copy,
  RenameFolder,
  Strict,
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
  const options: (QuickPickItem & { option: Option })[] = [
    {
      option: Option.Default,
      label: 'Replace',
      description: 'default',
      detail: 'Replace text/filenames preserving cases',
    },
    {
      option: Option.Copy,
      label: 'Clone + Replace',
      description: '',
      detail: 'Clone folder and replace text/filenames',
    },
    {
      option: Option.RenameFolder,
      label: 'Replace text/filenames including selected folder name',
      detail: 'Additional',
    },
    {
      option: Option.Strict,
      label: 'Replace text/filenames without case detection',
      description: 'strict',
      detail: 'Additional',
    },
  ];
  const selectedOption = await window.showQuickPick(options, {
    placeHolder: 'multi-replace',
  });
  if (selectedOption) {
    return selectedOption.option;
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
  const searchValue = await window.showInputBox({
    prompt: 'Search value',
    value: placeholder,
    ignoreFocusOut: true,
  });
  if (searchValue) {
    return searchValue;
  }
  throw new Error('');
}

async function askReplaceValue(placeholder: string): Promise<string> {
  const replaceValue = await window.showInputBox({
    prompt: 'Replace value',
    value: placeholder,
    ignoreFocusOut: true,
  });
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
