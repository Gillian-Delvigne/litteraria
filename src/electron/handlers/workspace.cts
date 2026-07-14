import { ipcMain, dialog } from "electron";
import fs from "fs/promises";
import path from "node:path";
import type { WorkspaceItem } from "../../types/workspace" with {
    "resolution-mode": "require",
};

const pickWorkspace = async () => {
    const result = await dialog.showOpenDialog({
        properties: ["openDirectory", "createDirectory"],
        title: "Choisir le dossier de ton répertoire de travail",
    });

    if (result.canceled) return null;

    const workspacePath = result.filePaths[0];
    return workspacePath;
};

// List items recursively
const listWorkspaceItems = async (
    _: Electron.IpcMainInvokeEvent,
    dir: string,
): Promise<WorkspaceItem[]> => {
    try {
        const workspaceItems: WorkspaceItem[] = [];
        const entries = await fs.readdir(dir, { withFileTypes: true });
        for (const entry of entries) {
            const itemPath = path.join(entry.parentPath, entry.name);
            if (
                entry.isFile() &&
                (entry.name.endsWith(".md") ||
                    entry.name.endsWith(".txt") ||
                    entry.name.endsWith(".docx"))
            )
                workspaceItems.push({
                    name: entry.name,
                    path: itemPath,
                    type: "file",
                });
            else if (entry.isDirectory()) {
                const res = await listWorkspaceItems(_, itemPath);
                workspaceItems.push({
                    name: entry.name,
                    path: itemPath,
                    type: "folder",
                    children: res,
                });
            }
        }
        return workspaceItems;
    } catch (error) {
        console.error("Erreur listWorkspaceItems:", error);
        return [];
    }
};

export function registerWorkspaceHandlers() {
    ipcMain.handle("workspace:pick", pickWorkspace);
    ipcMain.handle("workspace:listItems", listWorkspaceItems);
}