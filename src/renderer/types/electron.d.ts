export interface ElectronAPI {
  platform: string;
  workspace: {
    pick: () => Promise<string | null>;
    listFiles: (workspacePath: string) => Promise<FileItem[]>;
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