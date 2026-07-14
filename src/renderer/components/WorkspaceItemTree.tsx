import { useState } from "react";
import type { WorkspaceItem } from "../../types/workspace";
import { ChevronRight, ChevronDown } from "lucide-react";

interface Props {
    item: WorkspaceItem;
    selectedItem: WorkspaceItem | null;
    onItemSelect: (item: WorkspaceItem | null) => void;
}

function getItemIcon(item: WorkspaceItem) {
    if (item.type === "file") return "📝";
    else return "📂";
}

export default function WorkspaceItemTree({
    item,
    onItemSelect,
    selectedItem,
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
                        selectedItem?.path === item.path
                            ? "bg-accent-terra font-medium"
                            : "hover:bg-white/10"
                    }`}
                >
                    <span className="opacity-70">{getItemIcon(item)}</span>
                    <span className="truncate">{item.name}</span>
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
                    className={`${!isItemToggle ? "hidden" : ""} pl-6 folderlist`}
                    onContextMenu={handleItemRightclick}
                >
                    {item.children.map((child) => (
                        <WorkspaceItemTree
                            key={child.path}
                            item={child}
                            onItemSelect={onItemSelect}
                            selectedItem={selectedItem}
                        />
                    ))}
                </ul>
            </>
        );
    }
}
