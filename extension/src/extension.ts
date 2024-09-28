import * as vscode from "vscode";
import { SidebarProvider } from "./SidebarProvider";
import { AppProvider } from "./AppProvider";
import { authenticate } from "./authenticate";
import { TokenManager } from "./TokenManager";

export function activate(context: vscode.ExtensionContext) {
  TokenManager.globalState = context.globalState;

  const sidebarProvider = new SidebarProvider(context.extensionUri);

  context.subscriptions.push(
    vscode.window.registerWebviewViewProvider(
      "vs-school-sidebar",
      sidebarProvider
    )
  );

  context.subscriptions.push(
    vscode.commands.registerCommand("vs-school.authenticate", () => {
      try {
        authenticate(() => {});
      } catch (err) {
        console.log(err);
      }
    })
  );

  context.subscriptions.push(
    vscode.commands.registerCommand("vs-school.refresh", async () => {
      await vscode.commands.executeCommand("workbench.action.closeSidebar");
      await vscode.commands.executeCommand(
        "workbench.view.extension.vs-school-sidebar-view"
      );
      AppProvider.kill();
      AppProvider.createOrShow(context.extensionUri);
      vscode.window.showInformationMessage(
        "token values is: " + TokenManager.getToken()
      );
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
