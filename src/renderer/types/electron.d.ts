import type { WorkspaceItem } from "../types/workspace"
import type { Result } from "../types/result"

export interface ElectronAPI {
    platform: string;
    workspace: {
        pick: () => Promise<string | null>;
        listItems: (workspacePath: string) => Promise<WorkspaceItem[]>;
        item: {
            showContextMenu: (item: WorkspaceItem | null) => Promise<void>;
            create: () => Promise;
            rename: (
                item: WorkspaceItem,
                newName: string,
            ) => Promise<Result<{ path: string; name: string }>>;
            onRename: (callback: (item: WorkspaceItem) => void) => () => void;
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
