import { useState } from "react";
import type { WorkspaceItem } from "../../types/workspace";
import { ChevronRight, ChevronDown } from "lucide-react";

interface Props {
    item: WorkspaceItem;
    selectedItem: WorkspaceItem | null;
    onItemSelect: (item: WorkspaceItem | null) => void;
    renamingPath: string | null;
    onRenameComplete: (path: string | null) => void;
    onItemRenamed: (oldPath: string, newPath: string, newName: string) => void;
}

function getItemIcon(item: WorkspaceItem) {
    if (item.type === "file") return "📝";
    else return "📂";
}

export default function WorkspaceItemTree({
    item,
    onItemSelect,
    selectedItem,
    renamingPath,
    onRenameComplete,
    onItemRenamed,
}: Props) {
    const [isItemToggle, setIsItemToggle] = useState(false);
    const [newName, setNewName] = useState(item.name);

    const handleItemRightclick = async (
        event: React.MouseEvent<HTMLElement>,
    ) => {
        event.preventDefault();
        event.stopPropagation();
        await window.electronAPI.workspace.item.showContextMenu(item);
    };

    const confirmRename = async () => {
        const result = await window.electronAPI.workspace.item.rename(
            item,
            newName,
        );

        if (result.status === "success") {
            onItemRenamed(item.path, result.data.path, result.data.name);
            onRenameComplete(null);
        } else {
            alert(result.message);
        }
    };

    if (item.type === "file") {
        return (
            <li key={item.path}>
                <button
                    onClick={() => onItemSelect(item)}
                    onContextMenu={handleItemRightclick}
                    className={`w-full text-left p-2 rounded-lg flex items-center gap-3 font-ui text-[0.9375rem] transition-colors ${
                        selectedItem?.path === item.path
                            ? "bg-accent-terra font-medium"
                            : "hover:bg-white/10"
                    }`}
                >
                    <span className="opacity-70">{getItemIcon(item)}</span>
                    {renamingPath && item.path === renamingPath ? (
                        <input
                            name="rename-input"
                            value={newName}
                            onChange={(e) => setNewName(e.target.value)}
                            autoFocus={true}
                            onBlur={confirmRename}
                            onKeyDown={(e) => {
                                if (e.key === "Enter") confirmRename();
                            }}
                        />
                    ) : (
                        <span className="truncate">{item.name}</span>
                    )}
                </button>
            </li>
        );
    }
    if (item.type === "folder") {
        return (
            <>
                <li key={item.path}>
                    <button
                        onClick={() => {
                            setIsItemToggle(!isItemToggle);
                        }}
                        onContextMenu={handleItemRightclick}
                        className={`w-full text-left p-2 rounded-lg flex items-center gap-3 font-ui text-[0.9375rem] transition-colors ${
                            selectedItem?.path === item.path
                                ? "bg-accent-terra font-medium"
                                : "hover:bg-white/10"
                        }`}
                    >
                        {" "}
                        <span className="opacity-70">{getItemIcon(item)}</span>
                        <span className="truncate">{item.name}</span>
                        <span>
                            {isItemToggle ? (
                                <ChevronDown size={16} />
                            ) : (
                                <ChevronRight size={16} />
                            )}
                        </span>
                    </button>
                </li>
                <ul
                    className={`${!isItemToggle ? "hidden" : "border-l border-gray-400"} pl-6 ml-3 folderlist`}
                    onContextMenu={handleItemRightclick}
                >
                    {isItemToggle && item.children.length === 0 ? (
                        <p className="text-xs text-gray-400 italic pl-3 py-1">
                            Aucun fichier
                        </p>
                    ) : (
                        item.children.map((child) => (
                            <WorkspaceItemTree
                                key={child.path}
                                item={child}
                                onItemSelect={onItemSelect}
                                selectedItem={selectedItem}
                                renamingPath={renamingPath}
                                onRenameComplete={onRenameComplete}
                                onItemRenamed={onItemRenamed}
                            />
                        ))
                    )}
                </ul>
            </>
        );
    }
}
