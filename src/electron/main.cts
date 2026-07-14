import { app, BrowserWindow } from "electron";
import { createWindow } from "./handlers/window.cjs";
import { registerWorkspaceHandlers } from "./handlers/workspace.cjs";
import { registerFileHandlers } from "./handlers/file.cjs";
import { registerContextMenuHandler } from "./handlers/menu.cjs";

app.whenReady().then(() => {
    registerWorkspaceHandlers();
    registerFileHandlers();
    registerContextMenuHandler();
    createWindow();

    app.on("activate", () => {
        if (BrowserWindow.getAllWindows().length === 0) createWindow();
    });
});

app.on("window-all-closed", () => {
    if (process.platform !== "darwin") app.quit();
});
