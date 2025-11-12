import * as vscode from "vscode";

const registerCommand = (
  context: vscode.ExtensionContext,
  commandId: string,
  callback: (...args: any[]) => void
) => {
  context.subscriptions.push(
    vscode.commands.registerCommand(commandId, callback)
  );
};

export { registerCommand };
