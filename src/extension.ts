import { commands, ExtensionContext, window } from 'vscode';

export function activate(context: ExtensionContext) {
    const disposable = commands.registerCommand('extension.helloWorld', () => {
        window.showInformationMessage('Hello World!');
    });
    context.subscriptions.push(disposable);
}

export function deactivate() {
    //
}
