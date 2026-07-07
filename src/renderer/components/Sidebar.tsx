import { useEffect, useState } from "react";
import type { FileItem } from "../types/electron";

interface Props {
    workspacePath: string;
    selectedFile: FileItem | null;
    onFileSelect: (file: FileItem) => void;
}

function getFileIcon(fileName: string) {
    if (fileName.endsWith(".md")) return "📝";
    if (fileName.endsWith(".txt")) return "📄";
    if (fileName.endsWith(".docx")) return "📑";
    return "📄";
}

export default function Sidebar({
    workspacePath,
    selectedFile,
    onFileSelect,
}: Props) {
    const [files, setFiles] = useState<FileItem[]>([]);
    const [loading, setLoading] = useState(true);
    const [loadedWorkspace, setLoadedWorkspace] = useState(workspacePath);

    const loadFiles = async () => {
        setLoading(true);
        const list =
            await window.electronAPI.workspace.listFiles(workspacePath);
        setFiles(list);
        setLoading(false);
    };

    if (workspacePath !== loadedWorkspace) {
        setLoading(true);
        setLoadedWorkspace(workspacePath);
    }

    useEffect(() => {
        let ignore = false;
        window.electronAPI.workspace.listFiles(workspacePath).then((list) => {
            if (!ignore) {
                setFiles(list);
                setLoading(false);
            }
        });
        return () => {
            ignore = true;
        };
    }, [workspacePath]);

    const workspaceName =
        workspacePath.split("/").filter(Boolean).pop() ?? workspacePath;

    return (
        <aside className="w-64 h-screen bg-linear-to-b from-ink to-[#3a342f] text-white p-6 flex flex-col gap-8 shrink-0">
            <div>
                <div className="font-display text-2xl font-semibold tracking-tight mb-1">
                    LitterarIA
                </div>
                <div className="font-ui text-sm text-white/60 truncate">
                    📁 {workspaceName}
                </div>
            </div>

            <div className="flex-1 overflow-y-auto">
                <div className="flex items-center justify-between mb-4 font-ui text-sm uppercase tracking-wide font-semibold text-white/70">
                    <span>Fichiers</span>
                    <button
                        onClick={loadFiles}
                        title="Actualiser"
                        className="w-6 h-6 rounded-md bg-white/10 hover:bg-white/20 transition-colors flex items-center justify-center text-xs"
                    >
                        🔄
                    </button>
                </div>

                {loading ? (
                    <p className="font-ui text-sm text-white/50">
                        Chargement...
                    </p>
                ) : files.length === 0 ? (
                    <p className="font-ui text-sm text-white/50">
                        Aucun fichier .md, .txt ou .docx trouvé.
                    </p>
                ) : (
                    <ul className="space-y-2">
                        {files.map((file) => (
                            <li key={file.path}>
                                <button
                                    onClick={() => onFileSelect(file)}
                                    className={`w-full text-left px-3 py-3 rounded-lg flex items-center gap-3 font-ui text-[0.9375rem] transition-colors ${
                                        selectedFile?.path === file.path
                                            ? "bg-accent-terra font-medium"
                                            : "hover:bg-white/10"
                                    }`}
                                >
                                    <span className="opacity-70">
                                        {getFileIcon(file.name)}
                                    </span>
                                    <span className="truncate">
                                        {file.name}
                                    </span>
                                </button>
                            </li>
                        ))}
                    </ul>
                )}
            </div>
        </aside>
    );
}
