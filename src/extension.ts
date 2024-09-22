import * as vscode from "vscode";
import { AppProvider } from "./AppProvider";

export function activate(context: vscode.ExtensionContext) {
  context.subscriptions.push(
    vscode.commands.registerCommand("vs-school.helloWorld", () => {
      AppProvider.createOrShow(context.extensionUri);
    })
  );

  context.subscriptions.push(
    vscode.commands.registerCommand("vs-school.askQuestion", async () => {
      const answer = await vscode.window.showInformationMessage(
        "How was your day today?",
        "good",
        "bad"
      );
      if (answer === "bad") {
        vscode.window.showInformationMessage("Sorry to hear that!");
      }
      if (answer === "good") {
        vscode.window.showInformationMessage("That is great!");
      }
    })
  );

  context.subscriptions.push(
    vscode.commands.registerCommand("vs-school.refresh", () => {
      AppProvider.kill();
      AppProvider.createOrShow(context.extensionUri);
      setTimeout(() => {
        vscode.commands.executeCommand(
          "workbench.action.webview.openDeveloperTools"
        );
      }, 500);
    })
  );
}
