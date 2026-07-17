import { contextBridge, ipcRenderer } from "electron";
import type { WorkspaceItem } from "../types/workspace" with {
    "resolution-mode": "require",
};
import type { Result } from "../types/result" with {
    "resolution-mode": "require",
};

// API exposed at renderer (React)
contextBridge.exposeInMainWorld("electronAPI", {
    platform: process.platform,
    workspace: {
        pick: () => ipcRenderer.invoke("workspace:pick"),
        listItems: (workspacePath: string) =>
            ipcRenderer.invoke("workspace:listItems", workspacePath),
        item: {
            showContextMenu: (item: WorkspaceItem) =>
                ipcRenderer.invoke("item:showContextMenu", item),
            create: () => ipcRenderer.invoke("item:create"),
            rename: (
                item: WorkspaceItem,
                newName: string,
            ): Promise<Result<string>> =>
                ipcRenderer.invoke("item:rename", item, newName),
            onRename: (callback: (item: WorkspaceItem) => void) => {
                const renameListener = (
                    _: Electron.IpcRendererEvent,
                    item: WorkspaceItem,
                ) => {
                    return callback(item);
                };

                const removeRenameListener = () => {
                    ipcRenderer.removeListener("rename-item", renameListener);
                };

                ipcRenderer.on("rename-item", renameListener);
                return removeRenameListener;
            },
            copy: () => ipcRenderer.invoke("item:copy"),
            move: () => ipcRenderer.invoke("item:move"),
            delete: () => ipcRenderer.invoke("item:delete"),
        },
    },
    file: {
        read: (filePath: string) => ipcRenderer.invoke("file:read", filePath),
        write: (filePath: string, content: string) =>
            ipcRenderer.invoke("file:write", filePath, content),
    },
});
