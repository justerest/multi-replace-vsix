import { multiReplace } from '@justerest/multi-replace';
import { basename, extname } from 'path';
import { commands, ExtensionContext, Uri, window } from 'vscode';

export function activate(context: ExtensionContext) {
    const multiReplaceHook = commands.registerCommand('extension.multiReplace', async (_uri?: Uri, uris?: Uri[]) => {
        if (!uris) return window.showErrorMessage('Use explorer context menu');

        const paths = uris.map((uri) => uri.fsPath);
        const placeholder = basename(paths[0], extname(paths[0]));
        const searchValue = await window.showInputBox({ prompt: 'Search value', value: placeholder, ignoreFocusOut: true });
        if (!searchValue) return cancel();
        const replaceValue = await window.showInputBox({ prompt: 'Replace value', value: placeholder, ignoreFocusOut: true });
        if (!replaceValue) return cancel();

        multiReplace(paths, searchValue, replaceValue).subscribe({
            complete() {
                window.showInformationMessage('Multi replace successfully completed');
            },
        });
    });

    context.subscriptions.push(multiReplaceHook);
}

function cancel() {
    return window.showInformationMessage('Multi replace canceled');
}

export function deactivate() {
    //
}
