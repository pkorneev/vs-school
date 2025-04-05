import * as vscode from "vscode";

const KEY = "vsschooldeadlines";

export class DeadlinesManager {
  static globalState: vscode.Memento;

  static setDeadlines(deadlinesArray: Array<{ id: number; deadline: string }>) {
    const serializedDeadlines = JSON.stringify(deadlinesArray);
    return this.globalState.update(KEY, serializedDeadlines);
  }

  static getDeadlines(): Array<{ id: number; deadline: string }> | undefined {
    const deadlinesString = this.globalState.get<string>(KEY);
    if (deadlinesString) {
      return JSON.parse(deadlinesString);
    }
    return undefined;
  }
}
