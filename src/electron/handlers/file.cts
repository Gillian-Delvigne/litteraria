import { ipcMain } from "electron";
import path from "node:path";
import fs from "fs/promises";
import type { WorkspaceItem } from "../../types/workspace" with {
    "resolution-mode": "require",
};
import type { Result } from "../../types/result" with {
    "resolution-mode": "require",
};

const readFile = async (_: Electron.IpcMainInvokeEvent, filePath: string) => {
    try {
        const fileContent = await fs.readFile(filePath, "utf-8");
        return fileContent;
    } catch (error) {
        console.error("Erreur read file:", error);
        return null;
    }
};

const writeFile = async (
    _: Electron.IpcMainInvokeEvent,
    filePath: string,
    content: string,
) => {
    try {
        await fs.writeFile(filePath, content);
        return true;
    } catch (error) {
        console.error("Erreur write file:", error);
        return false;
    }
};

const renameItem = async (
    item: WorkspaceItem,
    newName: string,
): Promise<Result<{ path: string; name: string }>> => {
    try {
        const dirName = path.dirname(item.path);
        const newPath = path.join(dirName, newName);
        await fs.rename(item.path, newPath);
        return { status: "success", data: { path: newPath, name: newName } };
    } catch (error: unknown) {
        console.error("Erreur write file:", error);
        const errorMessage =
            error instanceof Error ? error.message : String(error);
        return { status: "error", message: errorMessage };
    }
};

export const registerFileHandlers = () => {
    ipcMain.handle("file:read", readFile);
    ipcMain.handle("file:write", writeFile);
    ipcMain.handle(
        "item:rename",
        (_event, item: WorkspaceItem, newName: string) =>
            renameItem(item, newName),
    );
};
