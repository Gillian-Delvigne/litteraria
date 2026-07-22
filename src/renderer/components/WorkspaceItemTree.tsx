import React from "react";
import type { WorkspaceItem } from "../../types/workspace";
import { ChevronRight, ChevronDown } from "lucide-react";
import { WorkspaceItemName } from "./WorkspaceItemName";
import {
    useSelectionContext,
    useExpansionContext,
} from "../contexts/WorkspaceHooks";

interface Props {
    item: WorkspaceItem;
}

function getItemIcon(item: WorkspaceItem) {
    if (item.type === "file") return "📝";
    else return "📂";
}

export const WorkspaceItemTree = React.memo(({ item }: Props) => {
    const { selectedPath, onItemSelect } = useSelectionContext();
    const { expandedPaths, onFolderExpanded } = useExpansionContext();
    const isExpanded = expandedPaths.has(item.path);

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
                    <WorkspaceItemName item={item} />
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
                            onFolderExpanded(item.path);
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
                        <WorkspaceItemName item={item} />
                        <span>
                            {isExpanded ? (
                                <ChevronDown size={16} />
                            ) : (
                                <ChevronRight size={16} />
                            )}
                        </span>
                    </button>
                </li>
                <ul
                    className={`${!isExpanded ? "hidden" : "border-l border-gray-400"} pl-6 ml-3 folderlist`}
                    onContextMenu={handleItemRightclick}
                >
                    {isExpanded &&
                        (item.children.length === 0 ? (
                            <p className="text-xs text-gray-400 italic pl-3 py-1">
                                Aucun fichier
                            </p>
                        ) : (
                            item.children.map((child) => (
                                <WorkspaceItemTree
                                    key={child.path}
                                    item={child}
                                />
                            ))
                        ))}
                </ul>
            </>
        );
    }
});
