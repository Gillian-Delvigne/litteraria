import { useMemo, type ReactNode } from "react";
import type {
    SelectionContextProps,
    RenameContextProps,
} from "./WorkspaceHooks";
import { SelectionContext, RenameContext } from "./WorkspaceHooks";

export const SelectionContextProvider = ({
    children,
    ...value
}: SelectionContextProps & { children: ReactNode }) => {
    const { selectedPath, onItemSelect } = value;
    const props = useMemo(
        () => ({ selectedPath, onItemSelect }),
        [selectedPath, onItemSelect],
    );
    return <SelectionContext value={props}>{children}</SelectionContext>;
};

export const RenameContextProvider = ({
    children,
    ...value
}: RenameContextProps & { children: ReactNode }) => {
    const { renamingPath, onRenameComplete, onItemRenamed } = value;
    const props = useMemo(
        () => ({ renamingPath, onRenameComplete, onItemRenamed }),
        [renamingPath, onRenameComplete, onItemRenamed],
    );
    return <RenameContext value={props}>{children}</RenameContext>;
};
