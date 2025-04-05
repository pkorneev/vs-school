import * as vscode from "vscode";
import * as polka from "polka";
import { TokenManager } from "./TokenManager";
import { apiBaseUrl } from "./helpers/constants";

export const authenticate = (
  fn: () => void,
  postToWebview?: (msg: any) => void
) => {
  const app = polka();
  const PORT = 55331;
  const timeoutMs = 60_000; // 60 seconds timeout
  let isResolved = false;

  const shutdown = () => {
    if ((app as any).server) {
      (app as any).server.close();
    }
  };

  // Auth success route
  app.get("/auth/:token", async (req, res) => {
    const { token } = req.params;
    if (!token) {
      res.end("<h1>Invalid token</h1>");
      shutdown();
      return;
    }

    await TokenManager.setToken(token);
    isResolved = true;
    fn();

    res.end(`
      <html>
        <head><title>Auth Success</title></head>
        <body style="background:#1e1e1e;color:white;text-align:center;padding-top:40vh;">
          <h1 style="color:#6cf;">Auth successful! You can close this tab.</h1>
        </body>
      </html>
    `);

    shutdown();
  });

  // Optional cancel route
  app.get("/auth-cancel", (req, res) => {
    res.end(`
      <html>
        <head><title>Auth Canceled</title></head>
        <body style="background:#1e1e1e;color:white;text-align:center;padding-top:40vh;">
          <h1 style="color:#f66;">Authentication canceled</h1>
          <p style="color:#f66;">Something went wrong</p>
        </body>
      </html>
    `);
    vscode.window.showWarningMessage(
      "Authentication was canceled by the user."
    );
    postToWebview?.({ type: "auth-failed" });
    isResolved = true;
    shutdown();
  });

  // Start local server and open auth URL
  app.listen(PORT, (err: Error) => {
    if (err) {
      vscode.window.showErrorMessage(err.message);
    } else {
      vscode.commands.executeCommand(
        "vscode.open",
        vscode.Uri.parse(`${apiBaseUrl}/auth/university`)
      );

      // Timeout fallback
      setTimeout(() => {
        if (!isResolved) {
          vscode.window.showErrorMessage(
            "Authentication timed out. Please try again."
          );
          shutdown();
        }
      }, timeoutMs);
    }
  });
};
