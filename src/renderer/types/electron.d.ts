export interface ElectronAPI {
  platform: string;
  workspace: {
    pick: () => Promise<string | null>;
    listFiles: (workspacePath: string) => Promise<FileItem[]>;
};
	file: {
		read: (filePath: string) => Promise<string | null>;
		write: (filePath: string, content: string) => Promise<boolean>;	
	};
}

export interface FileItem {
  name: string;
  path: string;
}

declare global {
  interface Window {
    electronAPI: ElectronAPI;
  }
}