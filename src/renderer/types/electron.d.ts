export interface ElectronAPI {
  platform: string;
  workspace: {
    pick: () => Promise<string | null>;
    listFiles: (workspacePath: string) => Promise<WorkspaceItem[]>;
};
	file: {
		read: (filePath: string) => Promise<string | null>;
		write: (filePath: string, content: string) => Promise<boolean>;	
	};
}

declare global {
  interface Window {
    electronAPI: ElectronAPI;
  }
}