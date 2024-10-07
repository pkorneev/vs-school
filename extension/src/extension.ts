import * as vscode from "vscode";
import * as fs from "fs";
import * as path from "path";
import * as os from "os";
import { SidebarProvider } from "./SidebarProvider";
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

  const filesCreator = vscode.commands.registerCommand(
    "vs-school.createFiles",
    async (lessonFiles) => {
      // Create a temporary directory
      const tmpDir = path.join(os.tmpdir(), `lesson-${lessonFiles.id}`);
      if (!fs.existsSync(tmpDir)) {
        fs.mkdirSync(tmpDir, { recursive: true });
      }

      // Write files to the temporary directory
      lessonFiles.files.forEach((file: any) => {
        const filePath = path.join(tmpDir, file.path);
        const dirPath = path.dirname(filePath);

        // Ensure the directory exists
        if (!fs.existsSync(dirPath)) {
          fs.mkdirSync(dirPath, { recursive: true });
        }

        // Write the file content
        fs.writeFileSync(filePath, file.content);
      });

      // Add the temporary directory to the workspace
      vscode.workspace.updateWorkspaceFolders(
        vscode.workspace.workspaceFolders
          ? vscode.workspace.workspaceFolders.length
          : 0,
        null,
        { uri: vscode.Uri.file(tmpDir), name: `Lesson-${lessonFiles.id}` }
      );

      // Open the first file in the editor
      const firstFilePath = path.join(tmpDir, lessonFiles.files[0].path);
      const document = await vscode.workspace.openTextDocument(firstFilePath);
      vscode.window.showTextDocument(document);

      // Show a success message
      vscode.window.showInformationMessage(
        `Temporary lesson files created at ${tmpDir}`
      );
    }
  );

  context.subscriptions.push(filesCreator);
}

// this method is called when your extension is deactivated
export function deactivate() {}
