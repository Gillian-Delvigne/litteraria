import type { ReactNode } from "react";
import {
    ExpansionContextProvider,
    SelectionContextProvider,
    RenameContextProvider,
} from "../contexts/WorkspaceTreeContext";
import type { WorkspaceItem } from "../../types/workspace";

interface Props {
    selectedPath: string | null;
    onItemSelect: (item: WorkspaceItem | null) => void;
    renamingPath: string | null;
    onRenameComplete: (path: string | null) => void;
    onItemRenamed: (oldPath: string, newPath: string, newName: string) => void;
    expandedPaths: Set<string>;
    onFolderExpanded: (path: string) => void;
}

export const SidebarContextProvider = ({
    children,
    selectedPath,
    onItemSelect,
    renamingPath,
    expandedPaths,
    onRenameComplete,
    onItemRenamed,
    onFolderExpanded,
}: Props & { children: ReactNode }) => {
    return (
        <RenameContextProvider
            renamingPath={renamingPath}
            onRenameComplete={onRenameComplete}
            onItemRenamed={onItemRenamed}
        >
            <SelectionContextProvider
                selectedPath={selectedPath}
                onItemSelect={onItemSelect}
            >
                <ExpansionContextProvider
                    expandedPaths={expandedPaths}
                    onFolderExpanded={onFolderExpanded}
                >
                    {children}
                </ExpansionContextProvider>
            </SelectionContextProvider>
        </RenameContextProvider>
    );
};
