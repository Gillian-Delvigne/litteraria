import { useState } from "react";
import type { WorkspaceItem } from "../../types/workspace";

interface Props {
    item: WorkspaceItem;
    renamingPath: string | null;
    onRenameComplete: (path: string | null) => void;
    onItemRenamed: (oldPath: string, newPath: string, newName: string) => void;
}

export const WorkspaceItemName = ({
    item,
    renamingPath,
    onRenameComplete,
    onItemRenamed,
}: Props) => {
    const [newName, setNewName] = useState(item.name);

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

    return (
        <>
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
        </>
    );
};
