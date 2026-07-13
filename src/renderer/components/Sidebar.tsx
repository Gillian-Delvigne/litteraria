import { useEffect, useState } from "react";
import type { WorkspaceItem } from "../../types/workspace";
import WorkspaceItemTree from "./WorkspaceItemTree";

interface Props {
    workspacePath: string;
    selectedItem: WorkspaceItem | null;
    onItemSelect: (item: WorkspaceItem | null) => void;
}

export default function Sidebar({
    workspacePath,
    selectedItem,
    onItemSelect,
}: Props) {
    const [workspaceItems, setWorkspaceItems] = useState<WorkspaceItem[]>([]);
    const [loading, setLoading] = useState(true);
    const [loadedWorkspace, setLoadedWorkspace] = useState(workspacePath);

    const loadItems = async () => {
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

    return (
        <aside className="w-64 h-screen bg-linear-to-b from-ink to-[#3a342f] text-white p-6 flex flex-col gap-8 shrink-0">
            <div>
                <div className="font-display text-2xl font-semibold tracking-tight mb-1">
                    LitterarIA
                </div>
                <div className="font-ui text-sm text-white/60 truncate">
                    📁 {workspaceName}
                </div>
            </div>

            <div className="flex-1 overflow-y-auto">
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
                    <ul className="space-y-2">
                        {workspaceItems.map((item) => (
                            <WorkspaceItemTree
								key={item.path}
                                item={item}
                                selectedItem={selectedItem}
                                onItemSelect={onItemSelect}
                            />
                        ))}
                    </ul>
                )}
            </div>
        </aside>
    );
}
