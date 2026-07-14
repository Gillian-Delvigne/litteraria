import { ipcMain, Menu } from "electron";
import type { WorkspaceItem } from "../../types/workspace" with {
    "resolution-mode": "require",
};

const fileMenu = Menu.buildFromTemplate([
    {
        label: "Renommer",
        accelerator: "F2",
        click: () => {
            /* ... */
        },
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
        label: "Créer",
        submenu: [
            {
                label: "Nouveau fichier",
                accelerator: "CmdOrCtrl+N",
                click: () => {
                    /* ... */
                },
            },
            {
                label: "Nouveau dossier",
                accelerator: "CmdOrCtrl+Shift+N",
                click: () => {
                    /* ... */
                },
            },
        ],
    },
    { type: "separator" },
    {
        label: "Renommer",
        accelerator: "F2",
        click: () => {
            /* ... */
        },
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
        label: "Créer",
        submenu: [
            {
                label: "Nouveau fichier",
                accelerator: "CmdOrCtrl+N",
                click: () => {
                    /* ... */
                },
            },
            {
                label: "Nouveau dossier",
                accelerator: "CmdOrCtrl+Shift+N",
                click: () => {
                    /* ... */
                },
            },
        ],
    },
]);

const displayContextMenu = async (
    _: Electron.IpcMainInvokeEvent,
    item: WorkspaceItem | null,
) => {
    if (!item) {
        rootMenu.popup();
        return;
    }
    if (item.type === "file") {
        fileMenu.popup();
    } else {
        folderMenu.popup();
    }
};

export function registerContextMenuHandler() {
    ipcMain.handle("item:showContextMenu", displayContextMenu);
}
