export type WorkspaceItem = {
  name: string;
  path: string;
} & (FolderItem | FileItem);

export type FileItem = {
  type: "file";
}

export type FolderItem = {
  type: "folder";
  children: Array<WorkspaceItem>;
}