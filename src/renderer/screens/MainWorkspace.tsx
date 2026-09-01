import { useState } from "react";
import Sidebar from "../components/Sidebar";
import Editor from "../components/Editor";

import type { WorkspaceItem, FileStatus } from "../../types/workspace";
import WorkspaceHeader from "../components/WorkspaceHeader";

interface Props {
    workspacePath: string;
}

export default function MainWorkspace({ workspacePath }: Props) {
    const [selectedItem, setSelectedItem] = useState<WorkspaceItem | null>(
        null,
    );
    const [isFocusMode, setIsFocusMode] = useState(false);
    const [fileStatus, setFileStatus] = useState<FileStatus>({
        status: "saved",
        timestamp: null,
    });

    const selectedPath = selectedItem?.path ?? null;

    const onToggleFocusMode = () => {
        setIsFocusMode(!isFocusMode);
    };

    return (
        <div className="flex h-screen overflow-hidden">
            {!isFocusMode && (
                <Sidebar
                    workspacePath={workspacePath}
                    selectedPath={selectedPath}
                    onItemSelect={setSelectedItem}
                />
            )}
            <div
                className={`flex-1 ${isFocusMode ? "bg-black" : "bg-paper"} p-8 min-h-0`}
            >
                {selectedItem ? (
                    <div className="h-full flex flex-col">
                        {!isFocusMode && (
                            <WorkspaceHeader
                                fileItem={selectedItem}
                                fileStatus={fileStatus}
                            />
                        )}
                        <Editor
                            fileItem={selectedItem}
                            setFileStatus={setFileStatus}
                            fileStatus={fileStatus}
                            onToggleFocusMode={onToggleFocusMode}
                        />
                    </div>
                ) : (
                    <div className="flex items-center justify-center h-full">
                        <div className="text-center text-warm-gray">
                            <div className="text-6xl mb-4">📝</div>
                            <p className="font-ui text-xl">
                                Aucun fichier sélectionné
                            </p>
                        </div>
                    </div>
                )}
            </div>
        </div>
    );
}
