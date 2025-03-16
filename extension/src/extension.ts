import * as vscode from "vscode";
import * as fs from "fs";
import * as path from "path";
import * as os from "os";
import fetch from "node-fetch";
import { SidebarProvider } from "./SidebarProvider";
import { authenticate } from "./authenticate";
import { TokenManager } from "./TokenManager";
import { apiBaseUrl } from "./helpers/constants";

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

  const sendFilesCommand = vscode.commands.registerCommand(
    "vs-school.sendFiles",
    async () => {
      const workspaceFolders = vscode.workspace.workspaceFolders;
      if (!workspaceFolders || workspaceFolders.length === 0) {
        vscode.window.showErrorMessage("No workspace is currently opened.");
        return;
      }

      // Get the active editor and its document
      const activeEditor = vscode.window.activeTextEditor;
      if (!activeEditor) {
        vscode.window.showErrorMessage("No active editor found.");
        return;
      }

      const activeFilePath = activeEditor.document.uri.fsPath;

      // Find the workspace folder containing the active file
      const currentWorkspaceFolder = workspaceFolders.find((folder) =>
        activeFilePath.startsWith(folder.uri.fsPath)
      );

      if (!currentWorkspaceFolder) {
        vscode.window.showErrorMessage(
          "Could not determine the current workspace folder."
        );
        return;
      }

      const folderPath = currentWorkspaceFolder.uri.fsPath;

      // Collect all files in the workspace folder
      const files: { path: string; content: string }[] = [];
      const collectFiles = (dirPath: string) => {
        const entries = fs.readdirSync(dirPath, { withFileTypes: true });
        entries.forEach((entry) => {
          const fullPath = path.join(dirPath, entry.name);
          if (entry.isDirectory()) {
            collectFiles(fullPath);
          } else {
            const relativePath = path.relative(folderPath, fullPath);
            const content = fs.readFileSync(fullPath, "utf8");
            files.push({ path: relativePath, content });
          }
        });
      };

      collectFiles(folderPath);

      // Send files to the server
      try {
        const response = await fetch(`${apiBaseUrl}/upload`, {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ files }),
        });

        if (!response.ok) {
          throw new Error(`Server error: ${response.statusText}`);
        }

        vscode.window.showInformationMessage(
          `Files from ${currentWorkspaceFolder.name} sent successfully!`
        );
      } catch (error: any) {
        vscode.window.showErrorMessage(
          `Failed to send files: ${error.message}`
        );
      }
    }
  );

  context.subscriptions.push(sendFilesCommand);

  const createStatusBarButton = () => {
    const statusBar = vscode.window.createStatusBarItem(
      vscode.StatusBarAlignment.Right,
      100
    );
    statusBar.text = "$(cloud-upload) Send Homework";
    statusBar.command = "vs-school.sendFiles";
    statusBar.tooltip = "Send all files to the server";
    statusBar.show();
  };

  createStatusBarButton();
}

// this method is called when your extension is deactivated
export function deactivate() {}
