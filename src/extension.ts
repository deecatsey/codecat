import * as vscode from "vscode";
import { registerCommand } from "./utils";
import { tooltipAlert, tooltipSleeping } from "./consts";
import { register } from "module";

// This method is called when your extension is activated
// Your extension is activated the very first time the command is executed
export function activate(context: vscode.ExtensionContext) {
  const statusBarItem = vscode.window.createStatusBarItem(
    vscode.StatusBarAlignment.Right,
    100 // priority (higher = further left)
  );

  const framesAwake = [`$(alert-1)`];
  const framesSleeping = [`$(sleeping-1)`, `$(sleeping-2)`, `$(sleeping-3)`];

  let statusBarVisible = true;
  let catState: "alert" | "sleeping" = "sleeping";
  let frames = framesSleeping;
  let timeout: NodeJS.Timeout | undefined;
  let i = 0;
  let interval: NodeJS.Timeout;

  statusBarItem.command = "codecat.petTheCat";
  statusBarItem.show();

  const startAnimation = () => {
    interval = setInterval(() => {
      statusBarItem.text = frames[i];
      i = (i + 1) % frames.length;
    }, 700);
  };

  const setCatAlert = () => {
    catState = "alert";
    statusBarItem.tooltip = tooltipAlert;
    statusBarItem.text = `${framesAwake[0]}`;
  };

  const setCatSleeping = () => {
    catState = "sleeping";
    statusBarItem.tooltip = tooltipSleeping;
    frames = framesSleeping;
    statusBarItem.text = `${frames[0]}`;
    startAnimation();
  };

  setCatSleeping();

  const onTextChanged = vscode.workspace.onDidChangeTextDocument((event) => {
    if (
      vscode.window.activeTextEditor &&
      event.document === vscode.window.activeTextEditor.document
    ) {
      if (catState !== "alert") {
        setCatAlert();
        clearInterval(interval);
      }

      if (timeout) {
        clearTimeout(timeout);
      }

      // Reset to default state if no typing
      timeout = setTimeout(() => {
        setCatSleeping();
      }, 5000); // 1000 milliseconds = 1 seconds
    }
  });

  registerCommand(context, "codecat.toggleStatusBar", () => {
    statusBarVisible = !statusBarVisible;
    if (statusBarVisible) {
      statusBarItem.show();
    } else {
      statusBarItem.hide();
    }
  });

  registerCommand(context, "codecat.petTheCat", () => {
    if (catState === "alert") {
      vscode.window.showInformationMessage("Mrrreow! 😺💖");
      return;
    }
    vscode.window.showInformationMessage("Brrrrrrr! 😾💤");
  });

  context.subscriptions.push(
    new vscode.Disposable(() => clearInterval(interval))
  );
  context.subscriptions.push(onTextChanged);
}

export function deactivate() {}
