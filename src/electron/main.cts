import { app, BrowserWindow, ipcMain, dialog} from 'electron';
import fs from 'fs/promises';
import path from 'node:path';
import type { WorkspaceItem } from '../types/workspace' with {
    "resolution-mode": "require"
};

const isDev = process.env.NODE_ENV === 'development';

function createWindow() {
  const win = new BrowserWindow({
    width: 1500,
    height: 900,
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


// List files recursively
const listFiles = async (dir: string) : Promise<WorkspaceItem[]> => {
	try {
		const workspaceItems: WorkspaceItem[] = []
		const entries = await fs.readdir(dir, { withFileTypes: true });
		for (const entry of entries) {
			if (entry.isFile() &&
			(entry.name.endsWith('.md') || entry.name.endsWith('.txt') || entry.name.endsWith('.docx')))
				workspaceItems.push({name: entry.name, path: entry.parentPath, type: "file"})
			else if (entry.isDirectory()) {
				const dirPath = path.join(entry.parentPath, entry.name);
				const res = await listFiles(dirPath)
				workspaceItems.push({name: entry.name, path: dirPath, type: "folder", children: res})
			}
		}
		return workspaceItems
	}
	catch (error) {
		console.error('Erreur listFiles:', error);
		return [];
	}
}

// IPC: List files from selected workspace
ipcMain.handle('workspace:listFiles', async (_, workspacePath: string) => {
    const files = await listFiles(workspacePath);
	return files;
});

// IPC: Read file
ipcMain.handle('file:read', async (_, filePath: string) => {
	try {
		const fileContent = await fs.readFile(filePath, 'utf-8')
		return fileContent
	}
	catch (error) {
    	console.error('Erreur read file:', error);
		return null
	}
})

// IPC: Write file
ipcMain.handle('file:write', async (_, filePath: string, content: string) => {
	try {
		await fs.writeFile(filePath, content)
		return true
	}
	catch (error) {
    	console.error('Erreur write file:', error);
		return false
	}
})

app.whenReady().then(() => {
  createWindow();

  app.on('activate', () => {
    if (BrowserWindow.getAllWindows().length === 0) createWindow();
  });
});

app.on('window-all-closed', () => {
  if (process.platform !== 'darwin') app.quit();
});
