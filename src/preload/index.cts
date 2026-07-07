import { contextBridge, ipcRenderer } from 'electron';

// API exposed at renderer (React)
contextBridge.exposeInMainWorld('electronAPI', {
  platform: process.platform,
  workspace: {
    pick: () => ipcRenderer.invoke('workspace:pick'),
    listFiles: (workspacePath: string) =>
      ipcRenderer.invoke('workspace:listFiles', workspacePath),
},
  file: {
		read: (filePath: string) => ipcRenderer.invoke('file:read', filePath),
		write: (filePath: string, content:string) => ipcRenderer.invoke('file:write', filePath, content),
	}
});