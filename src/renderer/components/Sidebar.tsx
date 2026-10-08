import { useEffect, useState, useCallback, useRef } from "react";
import { MoreVertical } from "lucide-react";
import type { WorkspaceItem } from "../../types/workspace";
import { WorkspaceItemTree } from "./WorkspaceItemTree";
import { SidebarContextProvider } from "./SidebarContextProvider";

interface Props {
    workspacePath: string;
    selectedPath: string | null;
    onItemSelect: (item: WorkspaceItem | null) => void;
}

// Util function
const bulkUpdateChildren = (
    children: WorkspaceItem[],
    oldPath: string,
    newPath: string,
): WorkspaceItem[] => {
    return children.map((item) => {
        const updatedItem = {
            ...item,
            path: newPath + item.path.slice(oldPath.length),
        };
        if (updatedItem.type === "folder")
            return {
                ...updatedItem,
                children: bulkUpdateChildren(
                    updatedItem.children,
                    oldPath,
                    newPath,
                ),
            };
        return updatedItem;
    });
};

// Util function
const updateItemPath = (
    workspaceItems: WorkspaceItem[],
    oldPath: string,
    newPath: string,
    newName: string,
): WorkspaceItem[] => {
    return workspaceItems.map((item: WorkspaceItem) => {
        if (item.path === oldPath) {
            const newItem = { ...item, path: newPath, name: newName };
            if (item.type === "folder")
                return {
                    ...newItem,
                    children: bulkUpdateChildren(
                        item.children,
                        oldPath,
                        newPath,
                    ),
                };
            return newItem;
        } else {
            if (item.type === "folder") {
                const updatedChildren = updateItemPath(
                    item.children,
                    oldPath,
                    newPath,
                    newName,
                );
                if (updatedChildren === item.children) return item;
                return {
                    ...item,
                    children: updatedChildren,
                };
            }
        }
        return item;
    });
};

// Util function
const updateExpandedPaths = (
    expandedPaths: Set<string>,
    oldPath: string,
    newPath: string,
): Set<string> => {
    const updatedSet: Set<string> = new Set();
    for (const path of expandedPaths) {
        if (path === oldPath || path.startsWith(oldPath + "/")) {
            const updatedPath = newPath + path.slice(oldPath.length);
            updatedSet.add(updatedPath);
        } else updatedSet.add(path);
    }
    return updatedSet;
};

// Sidebar component
export default function Sidebar({
    workspacePath,
    selectedPath,
    onItemSelect,
}: Props) {
    const [workspaceItems, setWorkspaceItems] = useState<WorkspaceItem[]>([]);
    const [loading, setLoading] = useState(true);
    const [loadedWorkspace, setLoadedWorkspace] = useState(workspacePath);
    const [renamingPath, setrenamingPath] = useState<string | null>(null);
    const [expandedPaths, setExpandedPaths] = useState<Set<string>>(new Set());
    const [sidebarWidth, setSidebarWidth] = useState<number>(320);
    const [isResizing, setIsResizing] = useState(false);
    const resizeRef = useRef({ posX: 0, sidebarWidth: 0 });

    const loadItems = async (event: React.MouseEvent<HTMLElement>) => {
        event.stopPropagation();
        setLoading(true);
        const list =
            await window.electronAPI.workspace.listItems(workspacePath);
        setWorkspaceItems(list);
        setLoading(false);
    };

    if (workspacePath !== loadedWorkspace) {
        setLoading(true);
        setLoadedWorkspace(workspacePath);
    }

    useEffect(() => {
        let ignore = false;
        window.electronAPI.workspace.listItems(workspacePath).then((list) => {
            if (!ignore) {
                setWorkspaceItems(list);
                setLoading(false);
            }
        });
        return () => {
            ignore = true;
        };
    }, [workspacePath]);

    const workspaceName =
        workspacePath.split("/").filter(Boolean).pop() ?? workspacePath;

    const handleSidebarRightClick = async (
        event: React.MouseEvent<HTMLElement>,
    ) => {
        event.preventDefault();
        await window.electronAPI.workspace.item.showContextMenu(null);
    };

    useEffect(() => {
        const listener = window.electronAPI.workspace.item.onRename((item) =>
            setrenamingPath(item.path),
        );
        return listener;
    }, []);

    const updateWorkspaceItems = useCallback(
        (oldpath: string, newPath: string, newName: string) => {
            setWorkspaceItems((prev) =>
                updateItemPath(prev, oldpath, newPath, newName),
            );
            setExpandedPaths((prev) =>
                updateExpandedPaths(prev, oldpath, newPath),
            );
        },
        [],
    );

    const onFolderExpanded = useCallback((path: string) => {
        setExpandedPaths((prev) => {
            const next = new Set(prev);
            if (next.has(path)) next.delete(path);
            else next.add(path);
            return next;
        });
    }, []);

    const onResize = (e: React.MouseEvent<HTMLDivElement>) => {
        setIsResizing(true);
        resizeRef.current.posX = e.clientX;
        resizeRef.current.sidebarWidth = sidebarWidth;
    };

    useEffect(() => {
        if (!isResizing) return;

        const onMouseMove = (e: MouseEvent) => {
            const x = resizeRef.current.posX;
            const currWidth = resizeRef.current.sidebarWidth;
            const diff = Math.abs(resizeRef.current.posX - e.clientX);
            const newWidth =
                x > e.clientX ? currWidth - diff : currWidth + diff;
            setSidebarWidth(newWidth);
        };

        const onMouseUp = () => {
            setIsResizing(false);
        };
        window.addEventListener("mousemove", onMouseMove);
        window.addEventListener("mouseup", onMouseUp);

        return () => {
            window.removeEventListener("mousemove", onMouseMove);
            window.removeEventListener("mouseup", onMouseUp);
        };
    }, [isResizing]);

    return (
        <SidebarContextProvider
            selectedPath={selectedPath}
            onItemSelect={onItemSelect}
            renamingPath={renamingPath}
            onRenameComplete={setrenamingPath}
            onItemRenamed={updateWorkspaceItems}
            expandedPaths={expandedPaths}
            onFolderExpanded={onFolderExpanded}
        >
            <aside className="w-fit h-screen text-white flex">
                <div
                    style={{ width: sidebarWidth }}
                    className="flex flex-col p-6 gap-8 shrink-0 bg-linear-to-b from-ink to-[#3a342f]"
                >
                    <div>
                        <div className="font-display text-2xl font-semibold tracking-tight mb-1">
                            LitterarIA
                        </div>
                        <div className="font-ui text-sm text-white/60 truncate">
                            📁 {workspaceName}
                        </div>
                    </div>

                    <div
                        className="flex-1 overflow-y-auto"
                        onContextMenu={handleSidebarRightClick}
                    >
                        <div className="flex items-center justify-between mb-4 font-ui text-sm uppercase tracking-wide font-semibold text-white/70">
                            <span>Fichiers</span>
                            <button
                                onClick={loadItems}
                                title="Actualiser"
                                className="w-6 h-6 rounded-md bg-white/10 hover:bg-white/20 transition-colors flex items-center justify-center text-xs"
                            >
                                🔄
                            </button>
                        </div>

                        {loading ? (
                            <p className="font-ui text-sm text-white/50">
                                Chargement...
                            </p>
                        ) : workspaceItems.length === 0 ? (
                            <p className="font-ui text-sm text-white/50">
                                Aucun élément trouvé.
                            </p>
                        ) : (
                            <ul className="space-y-1">
                                {workspaceItems.map((item) => (
                                    <WorkspaceItemTree
                                        key={item.path}
                                        item={item}
                                    />
                                ))}
                            </ul>
                        )}
                    </div>
                </div>
                <div
                    onMouseDown={onResize}
                    className="group relative w-3 h-full flex items-center justify-center cursor-col-resize"
                >
                    <div
                        className={`absolute inset-y-0 left-1/2 w-1.5 -translate-x-1/2 rounded-full transition-colors ${
                            isResizing
                                ? "bg-ink/10"
                                : "bg-transparent group-hover:bg-ink/10"
                        }`}
                    />
                    <MoreVertical
                        size={14}
                        className="relative text-warm-gray"
                    />
                </div>
            </aside>
        </SidebarContextProvider>
    );
}
