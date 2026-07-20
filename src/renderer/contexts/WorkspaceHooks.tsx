import type { WorkspaceItem } from "../../types/workspace";
import { createContext, useContext } from "react";

export interface SelectionContextProps {
    selectedPath: string | null;
    onItemSelect: (item: WorkspaceItem | null) => void;
}

export interface RenameContextProps {
    renamingPath: string | null;
    onRenameComplete: (path: string | null) => void;
    onItemRenamed: (oldPath: string, newPath: string, newName: string) => void;
}

export const SelectionContext = createContext<
    SelectionContextProps | undefined
>(undefined);
export const RenameContext = createContext<RenameContextProps | undefined>(
    undefined,
);

export const useSelectionContext = () => {
    const selectionState = useContext(SelectionContext);
    if (selectionState === undefined)
        throw new Error(
            "Le contexte de sélection doit être utlisé dans un Selection Provider",
        );
    return selectionState;
};

export const useRenameContext = () => {
    const renameState = useContext(RenameContext);
    if (renameState === undefined)
        throw new Error(
            "Le contexte de renommage doit être utlisé dans un Selection Provider",
        );
    return renameState;
};
