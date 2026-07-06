import { app, BrowserWindow, ipcMain, dialog} from 'electron';
import fs from 'fs/promises';
import path from 'node:path';

const isDev = process.env.NODE_ENV === 'development';

function createWindow() {
  const win = new BrowserWindow({
    width: 1200,
    height: 800,
    webPreferences: {
      preload: path.join(__dirname, '../preload/index.cjs'),
      contextIsolation: true,
      nodeIntegration: false,
    },
  });

  if (isDev) {
    win.loadURL('http://localhost:5173');
    win.webContents.openDevTools();
  } else {
    win.loadFile(path.join(__dirname, '../index.html'));
  }
}

// IPC: Choose workspace
ipcMain.handle('workspace:pick', async () => {
  const result = await dialog.showOpenDialog({
    properties: ['openDirectory', 'createDirectory'],
    title: 'Choisir le dossier de ton répertoire de travail',
  });

  if (result.canceled) return null;

  const workspacePath = result.filePaths[0];
  return workspacePath;
});

// IPC: List files from selected workspace
ipcMain.handle('workspace:listFiles', async (_, workspacePath: string) => {
  try {
    const files = await fs.readdir(workspacePath, { withFileTypes: true });

    const filtered = files
      .filter(f =>
        f.isFile() &&
        (f.name.endsWith('.md') || f.name.endsWith('.txt') || f.name.endsWith('.docx'))
      )
      .map(f => ({
        name: f.name,
        path: path.join(workspacePath, f.name),
      }));

    return filtered;
  } catch (error) {
    console.error('Erreur listFiles:', error);
    return [];
  }
});

app.whenReady().then(() => {
  createWindow();

  app.on('activate', () => {
    if (BrowserWindow.getAllWindows().length === 0) createWindow();
  });
});

app.on('window-all-closed', () => {
  if (process.platform !== 'darwin') app.quit();
});
