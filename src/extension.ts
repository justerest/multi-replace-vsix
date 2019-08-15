import { commands, ExtensionContext } from 'vscode';
import { multiReplaceCommand } from './multiReplaceCommand';

export function activate(context: ExtensionContext) {
  const multiReplaceHook = commands.registerCommand('extension.multiReplace', multiReplaceCommand);
  context.subscriptions.push(multiReplaceHook);
}

export function deactivate() {
  //
}
