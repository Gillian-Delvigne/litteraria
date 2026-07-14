export interface ElectronAPI {
    platform: string;
    workspace: {
        pick: () => Promise<string | null>;
        listItems: (workspacePath: string) => Promise<WorkspaceItem[]>;
        item: {
            showContextMenu: (item: WorkspaceItem | null) => Promise<void>;
            create: () => Promise;
            rename: () => Promise;
            copy: () => Promise;
            move: () => Promise;
            delete: () => Promise;
        };
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
