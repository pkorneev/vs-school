import * as vscode from "vscode";
import { AppProvider } from "./AppProvider";
import { SidebarProvider } from "./SidebarProvider";

export function activate(context: vscode.ExtensionContext) {
  const sidebarProvider = new SidebarProvider(context.extensionUri);

  context.subscriptions.push(
    vscode.window.registerWebviewViewProvider(
      "vs-school-sidebar",
      sidebarProvider
    )
  );

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
    vscode.commands.registerCommand("vs-school.refresh", async () => {
      AppProvider.kill();
      AppProvider.createOrShow(context.extensionUri);
      await vscode.commands.executeCommand("workbench.action.closeSidebar");
      await vscode.commands.executeCommand(
        "workbench.view.extension.vs-school-sidebar-view"
      );
      setTimeout(() => {
        vscode.commands.executeCommand(
          "workbench.action.webview.openDeveloperTools"
        );
      }, 500);
    })
  );
}
