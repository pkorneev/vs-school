import * as vscode from "vscode";
import { SidebarProvider } from "./SidebarProvider";
import { AppProvider } from "./AppProvider";

export function activate(context: vscode.ExtensionContext) {
  const sidebarProvider = new SidebarProvider(context.extensionUri);

  context.subscriptions.push(
    vscode.window.registerWebviewViewProvider(
      "vs-school-sidebar",
      sidebarProvider
    )
  );

  context.subscriptions.push(
    vscode.commands.registerCommand("vs-school.refresh", async () => {
      await vscode.commands.executeCommand("workbench.action.closeSidebar");
      await vscode.commands.executeCommand(
        "workbench.view.extension.vs-school-sidebar-view"
      );
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

// this method is called when your extension is deactivated
export function deactivate() {}
