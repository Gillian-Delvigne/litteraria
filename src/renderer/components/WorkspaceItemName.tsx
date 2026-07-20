import React, { useState } from "react";
import type { WorkspaceItem } from "../../types/workspace";
import { useRenameContext } from "../contexts/WorkspaceHooks";

interface Props {
    item: WorkspaceItem;
}

export const WorkspaceItemName = React.memo(({ item }: Props) => {
    const { renamingPath, onRenameComplete, onItemRenamed } =
        useRenameContext();
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
});
