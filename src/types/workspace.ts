export type WorkspaceItem = {
    name: string;
    path: string;
} & (FolderItem | FileItem);

export type FileItem = {
    type: "file";
};

export type FolderItem = {
    type: "folder";
    children: Array<WorkspaceItem>;
};

export type FileStatus = {} & (
    FileStatusSaved | FileStatusUnsaved | FileStatusSaving | FileStatusError
);

type FileStatusSaved = {
    status: "saved";
    timestamp: number | null;
};

type FileStatusSaving = {
    status: "saving";
};

type FileStatusUnsaved = {
    status: "unsaved";
};

type FileStatusError = {
    status: "error";
    message?: string;
};
