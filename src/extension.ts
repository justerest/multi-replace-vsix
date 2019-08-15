import { multiReplace } from '@justerest/multi-replace';
import { basename, extname } from 'path';
import { commands, ExtensionContext, Uri, window } from 'vscode';

export function activate(context: ExtensionContext) {
  const multiReplaceHook = commands.registerCommand('extension.multiReplace', multiReplaceCommand);
  context.subscriptions.push(multiReplaceHook);
}

async function multiReplaceCommand(_uri?: Uri, uris?: Uri[]) {
  try {
    uris = parseUris(uris);
    const paths = uris.map((uri) => uri.fsPath);
    const placeholder = basename(paths[0], extname(paths[0]));
    const searchValue = await askSearchValue(placeholder);
    const replaceValue = await askReplaceValue(placeholder);
    multiReplace(paths, searchValue, replaceValue).subscribe({ complete });
  } catch (error) {
    window.showInformationMessage((error as Error).message || 'multi-replace canceled');
  }
}

function parseUris(uris?: Uri[]): Uri[] {
  if (!uris) {
    throw new Error('Use explorer context menu');
  }
  return uris;
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

export function deactivate() {
  //
}
