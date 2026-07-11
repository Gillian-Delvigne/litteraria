import { useState } from "react";
import Sidebar from "../components/Sidebar";
import Editor from "../components/Editor";

import type { WorkspaceItem } from "../../types/workspace";
import WorkspaceHeader from "../components/WorkspaceHeader";

interface Props {
    workspacePath: string;
}

export default function MainWorkspace({ workspacePath }: Props) {
    const [selectedFile, setSelectedFile] = useState<WorkspaceItem | null>(
        null,
    );
    const [isFocusMode, setIsFocusMode] = useState(false);

    const onToggleFocusMode = () => {
        setIsFocusMode(!isFocusMode);
    };

    return (
        <div className="flex h-screen overflow-hidden">
            {!isFocusMode && (
                <Sidebar
                    workspacePath={workspacePath}
                    selectedFile={selectedFile}
                    onFileSelect={setSelectedFile}
                />
            )}
            <div
                className={`flex-1 ${isFocusMode ? "bg-black" : "bg-paper"} p-8 min-h-0`}
            >
                {selectedFile ? (
                    <div className="h-full flex flex-col">
                        {!isFocusMode && (
                            <WorkspaceHeader fileItem={selectedFile} />
                        )}
                        <Editor
                            fileItem={selectedFile}
                            onToggleFocusMode={onToggleFocusMode}
                        />
                    </div>
                ) : (
                    <div className="flex items-center justify-center h-full">
                        <div className="text-center text-warm-gray">
                            <div className="text-6xl mb-4">📝</div>
                            <p className="font-ui text-xl">
                                Sélectionne un fichier pour commencer
                            </p>
                        </div>
                    </div>
                )}
            </div>
        </div>
    );
}
