import { useMemo, type ReactNode } from "react";
import type {
    SelectionContextProps,
    RenameContextProps,
    ExpansionContextProps,
} from "./WorkspaceHooks";
import {
    SelectionContext,
    RenameContext,
    ExpansionContext,
} from "./WorkspaceHooks";

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

export const ExpansionContextProvider = ({
    children,
    ...value
}: ExpansionContextProps & { children: ReactNode }) => {
    const { expandedPaths, onFolderExpanded } = value;
    const props = useMemo(
        () => ({ expandedPaths, onFolderExpanded }),
        [expandedPaths, onFolderExpanded],
    );
    return <ExpansionContext value={props}>{children}</ExpansionContext>;
};
