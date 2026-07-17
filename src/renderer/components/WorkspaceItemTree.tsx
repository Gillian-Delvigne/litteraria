import { useState } from "react";
import type { WorkspaceItem } from "../../types/workspace";
import { ChevronRight, ChevronDown } from "lucide-react";
import { WorkspaceItemName } from "./WorkspaceItemName";

interface Props {
    item: WorkspaceItem;
    selectedPath: string | null;
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
    selectedPath,
    renamingPath,
    onRenameComplete,
    onItemRenamed,
}: Props) {
    const [isItemToggle, setIsItemToggle] = useState(false);

    const handleItemRightclick = async (
        event: React.MouseEvent<HTMLElement>,
    ) => {
        event.preventDefault();
        event.stopPropagation();
        await window.electronAPI.workspace.item.showContextMenu(item);
    };

    if (item.type === "file") {
        return (
            <li key={item.path}>
                <button
                    onClick={() => onItemSelect(item)}
                    onContextMenu={handleItemRightclick}
                    className={`w-full text-left p-2 rounded-lg flex items-center gap-3 font-ui text-[0.9375rem] transition-colors ${
                        selectedPath === item.path
                            ? "bg-accent-terra font-medium"
                            : "hover:bg-white/10"
                    }`}
                >
                    <span className="opacity-70">{getItemIcon(item)}</span>
                    <WorkspaceItemName
                        item={item}
                        renamingPath={renamingPath}
                        onRenameComplete={onRenameComplete}
                        onItemRenamed={onItemRenamed}
                    />
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
                            selectedPath === item.path
                                ? "bg-accent-terra font-medium"
                                : "hover:bg-white/10"
                        }`}
                    >
                        {" "}
                        <span className="opacity-70">{getItemIcon(item)}</span>
                        <WorkspaceItemName
                            item={item}
                            renamingPath={renamingPath}
                            onRenameComplete={onRenameComplete}
                            onItemRenamed={onItemRenamed}
                        />
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
                                selectedPath={selectedPath}
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
