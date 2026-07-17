import { ipcMain, Menu } from "electron";
import { getMainWindow } from "./window.cjs";
import type { WorkspaceItem } from "../../types/workspace" with {
    "resolution-mode": "require",
};

let currentItem: WorkspaceItem | null = null;

const sendEventRename = () => {
    const win = getMainWindow();
    if (win) win.webContents.send("rename-item", currentItem);
};


const fileMenu = Menu.buildFromTemplate([
    {
        label: "Renommer",
        accelerator: "F2",
        click: sendEventRename,
    },
    {
        label: "Dupliquer",
        accelerator: "CmdOrCtrl+D",
        click: () => {
            /* ... */
        },
    },
    {
        label: "Déplacer",
        click: () => {
            /* ... */
        },
    },
    { type: "separator" },
    {
        label: "Supprimer",
        accelerator: "Delete",
        click: () => {
            /* ... */
        },
    },
]);

const folderMenu = Menu.buildFromTemplate([
    {
        label: "Nouveau fichier...",
        accelerator: "CmdOrCtrl+N",
        click: () => {
            /* ... */
        },
    },
    {
        label: "Nouveau dossier...",
        accelerator: "CmdOrCtrl+Shift+N",
        click: () => {
            /* ... */
        },
    },

    { type: "separator" },
    {
        label: "Renommer",
        accelerator: "F2",
        click: sendEventRename,
    },
    {
        label: "Dupliquer",
        accelerator: "CmdOrCtrl+D",
        click: () => {
            /* ... */
        },
    },
    {
        label: "Déplacer",
        click: () => {
            /* ... */
        },
    },
    { type: "separator" },
    {
        label: "Supprimer",
        accelerator: "Delete",
        click: () => {
            /* ... */
        },
    },
]);

const rootMenu = Menu.buildFromTemplate([
    {
        label: "Nouveau fichier...",
        accelerator: "CmdOrCtrl+N",
        click: () => {
            /* ... */
        },
    },
    {
        label: "Nouveau dossier...",
        accelerator: "CmdOrCtrl+Shift+N",
        click: () => {
            /* ... */
        },
    },
]);

const showContextMenu = async (
    _: Electron.IpcMainInvokeEvent,
    item: WorkspaceItem | null,
) => {
    if (!item) {
        rootMenu.popup();
        return;
    }
    currentItem = item;
    if (item.type === "file") {
        fileMenu.popup();
    } else {
        folderMenu.popup();
    }
};

export const registerContextMenuHandler = () => {
    ipcMain.handle("item:showContextMenu", showContextMenu);
};
