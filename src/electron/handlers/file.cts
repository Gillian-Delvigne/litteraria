import { ipcMain } from "electron";
import fs from "fs/promises";

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

export function registerFileHandlers() {
    ipcMain.handle("file:read", readFile);
    ipcMain.handle("file:write", writeFile);
}
