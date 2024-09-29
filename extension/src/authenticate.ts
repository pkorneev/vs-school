import * as vscode from "vscode";
import { apiBaseUrl } from "./helpers/constants";
import * as polka from "polka";
import { TokenManager } from "./TokenManager";

export const authenticate = (fn: () => void) => {
  const app = polka();

  app.get(`/auth/:token`, async (req, res) => {
    const { token } = req.params;
    if (!token) {
      res.end(`<h1>Something went wrong</h1>`);
      return;
    }

    await TokenManager.setToken(token);
    fn();

    res.end(`
      <html>
        <head>
          <style>
            body {
              background-color: #1e1e1e;/
              color: #d4d4d4;
              font-family: 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif;
              display: flex;
              justify-content: center;
              align-items: center;
              height: 100vh;
              margin: 0;
            }
            h1 {
              color: #569cd6;
            }
          </style>
        </head>
        <body>
          <h1>Auth was successful, you can close this now</h1>
        </body>
      </html>
    `);
    (app as any).server.close();
  });

  app.listen(54321, (err: Error) => {
    if (err) {
      vscode.window.showErrorMessage(err.message);
    } else {
      vscode.commands.executeCommand(
        "vscode.open",
        vscode.Uri.parse(`${apiBaseUrl}/auth/google`)
      );
    }
  });
};
