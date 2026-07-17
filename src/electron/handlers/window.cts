import { BrowserWindow } from "electron";
import path from "node:path";

const isDev = process.env.NODE_ENV === "development";
let mainWindow: BrowserWindow | null = null;

export const createWindow = () => {
    const win = new BrowserWindow({
        width: 1500,
        height: 900,
        webPreferences: {
            preload: path.join(__dirname, "../../preload/index.cjs"),
            contextIsolation: true,
            nodeIntegration: false,
        },
    });

    if (isDev) {
        win.loadURL("http://localhost:5173");
        win.webContents.openDevTools();
    } else {
        win.loadFile(path.join(__dirname, "../index.html"));
    }
    mainWindow = win;
};

export const getMainWindow = () => {
    return mainWindow;
};
