import * as vscode from "vscode";
import * as fs from "fs";
import * as path from "path";
import * as os from "os";
import fetch from "node-fetch";
import { SidebarProvider } from "./SidebarProvider";
import { authenticate } from "./authenticate";
import { TokenManager } from "./TokenManager";
import { DeadlinesManager } from "./DeadlinesManager";
import { apiBaseUrl } from "./helpers/constants";

export function activate(context: vscode.ExtensionContext) {
  TokenManager.globalState = context.globalState;
  DeadlinesManager.globalState = context.globalState;

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
      const files: { name: string; path: string; content: string }[] = [];
      const collectFiles = (dirPath: string) => {
        const entries = fs.readdirSync(dirPath, { withFileTypes: true });
        entries.forEach((entry) => {
          const fullPath = path.join(dirPath, entry.name);
          if (entry.isDirectory()) {
            collectFiles(fullPath);
          } else {
            const relativePath = path.relative(folderPath, fullPath);
            const content = fs.readFileSync(fullPath, "utf8");
            const name = path.basename(relativePath);
            files.push({ name, path: relativePath, content });
          }
        });
      };

      collectFiles(folderPath);

      const currentDate = new Date();
      let isLate = false;
      const lessonsMap = DeadlinesManager.getDeadlines() || [];

      const lessonId = folderPath.charAt(folderPath.length - 1);
      const lesson = lessonsMap.find(
        (lesson) => String(lesson.id) === lessonId
      );

      if (lesson && lesson.deadline) {
        const deadlineDate = new Date(lesson.deadline);
        if (currentDate > deadlineDate) {
          isLate = true;
        }
      }

      if (isLate) {
        vscode.window.showErrorMessage(
          "One or more of the assignments are past the deadline. Cannot submit."
        );
        return;
      }

      // Send lesson data along with files to update the lesson
      try {
        const lessonData = {
          title: lesson?.title,
          deadline: lesson?.deadline,
          points: lesson?.points,
          comment: lesson?.comment,
          status: lesson?.status,
          files,
        };
        const token = TokenManager.getToken();
        // Ensure the lesson ID is passed for the update
        const response = await fetch(`${apiBaseUrl}/lessons/${lesson?.id}`, {
          method: "PUT",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`,
          },
          body: JSON.stringify(lessonData),
        });

        if (!response.ok) {
          throw new Error(`Server error: ${response.statusText}`);
        }

        vscode.window.showInformationMessage(
          `Lesson with ID ${lesson?.id} updated successfully with files!`
        );
      } catch (error: any) {
        vscode.window.showErrorMessage(
          `Failed to update lesson: ${error.message}`
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
