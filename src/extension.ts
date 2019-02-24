import { ChangedFileData, multiReplace, multiReplaceStrict } from '@justerest/multi-replace';
import { basename, extname } from 'path';
import { Observable } from 'rxjs';
import { commands, ExtensionContext, Uri, window } from 'vscode';

export function activate(context: ExtensionContext) {
  const multiReplaceHook = commands.registerCommand('extension.multiReplace', getCommand(multiReplace));
  const multiReplaceStrictHook = commands.registerCommand('extension.multiReplaceStrict', getCommand(multiReplaceStrict));

  context.subscriptions.push(multiReplaceHook);
  context.subscriptions.push(multiReplaceStrictHook);
}

function getCommand(replace: (paths: string[], searchValue: string, replaceValue: string) => Observable<ChangedFileData>) {
  return async (_uri?: Uri, uris?: Uri[]) => {
    if (!uris) {
      return window.showErrorMessage('Use explorer context menu');
    }

    const paths = uris.map((uri) => uri.fsPath);
    const placeholder = basename(paths[0], extname(paths[0]));
    const searchValue = await window.showInputBox({ prompt: 'Search value', value: placeholder, ignoreFocusOut: true });
    if (!searchValue) {
      return cancel();
    }
    const replaceValue = await window.showInputBox({ prompt: 'Replace value', value: placeholder, ignoreFocusOut: true });
    if (!replaceValue) {
      return cancel();
    }

    replace(paths, searchValue, replaceValue).subscribe({
      complete() {
        window.showInformationMessage('multi-replace successfully completed');
      },
    });
  };
}

function cancel() {
  return window.showInformationMessage('multi-replace canceled');
}

export function deactivate() {
  //
}
