import { useState, useEffect, useRef } from "react";
import type { FileStatus, WorkspaceItem } from "../../types/workspace";
import { Editor, Tiptap, useEditor } from "@tiptap/react";
import { EditorState } from "prosemirror-state";
import { Markdown } from "@tiptap/markdown";
import StarterKit from "@tiptap/starter-kit";
import TipTapMenu from "./TipTapToolbar/TipTapMenu";
import WordCounter from "./WordCounter";

export default function MainEditor({
    fileItem,
    onToggleFocusMode,
    setFileStatus,
}: {
    fileItem: WorkspaceItem;
    onToggleFocusMode: () => void;
    setFileStatus: React.Dispatch<React.SetStateAction<FileStatus>>;
    fileStatus: FileStatus;
}) {
    const [loading, setLoading] = useState(true);
    const [fileContent, setFileContent] = useState<string | null>(null);
    const [loadedFileItem, setLoadedFileItem] = useState(fileItem);
    const [wordCount, setWordCount] = useState(0);
    const [charCount, setCharCount] = useState(0);
    const [autoSave, setAutosave] = useState(false);
    const saveTimeoutRef = useRef<NodeJS.Timeout | null>(null);

    const updateWordCount = (text: string) => {
        if (text) {
            const words = text
                .trim()
                .split(/\s+/)
                .filter((w) => w.length > 0);
            setWordCount(words.length);
            setCharCount(
                words.reduce((total, word) => {
                    total += word.length;
                    return total;
                }, 0),
            );
            return;
        }
        setWordCount(0);
        setCharCount(0);
    };

    if (loadedFileItem !== fileItem) {
        setLoading(true);
        setLoadedFileItem(fileItem);
    }

    const saveFile = async (content: string) => {
        try {
            setFileStatus({ status: "saving" });
            await window.electronAPI.file.write(fileItem.path, content);
            setFileStatus({ status: "saved", timestamp: Date.now() });
            console.log("Fichier sauvegardé:", fileItem.name);
        } catch (error) {
            setFileStatus({ status: "error", message: error as string });
            console.error("Erreur sauvegarde:", error);
        }
    };

    const handleWrite = (value: string | undefined) => {
        if (value === undefined) return;
        updateWordCount(value);

        setFileStatus({ status: "unsaved" });

        if (saveTimeoutRef.current) {
            clearTimeout(saveTimeoutRef.current);
        }
        if (autoSave) {
            saveTimeoutRef.current = setTimeout(() => {
                saveFile(value);
            }, 1000);
        }
    };

    const handleAutosave = () => {
        setAutosave(!autoSave);
    };

    const getFileExtension = (filename: string) => {
        return filename.split(".").pop();
    };

    const extractContent = (
        editor: Editor,
        fileItem: WorkspaceItem,
    ): string | undefined => {
        const ext = getFileExtension(fileItem.name);
        switch (ext) {
            case "txt":
                return editor.getText({ blockSeparator: "\n\n" });
            case "md":
                return editor.getMarkdown();
            default:
                break;
        }
    };

    const handleManualSave = () => {
        const content = extractContent(editor, fileItem);
        if (!content) return;
        saveFile(content);
    };

    const editor = useEditor({
        extensions: [StarterKit, Markdown],
        content: null,
        editorProps: {
            attributes: {
                class: "w-full h-full prose dark:prose-invert max-w-none focus:outline-none font-display p-4",
            },
        },
        onUpdate({ editor }) {
            handleWrite(extractContent(editor, fileItem));
        },
    });

    useEffect(() => {
        let ignore = false;

        const updateFileContent = (content: string) => {
            setFileContent(content);
            if (!editor || loading) return;
            editor.commands.setContent(fileContent, {
                contentType: "markdown",
                emitUpdate: false,
            });
            const newEditorState = EditorState.create({
                doc: editor.state.doc,
                plugins: editor.state.plugins,
                schema: editor.state.schema,
                selection: editor.state.selection,
            });
            editor.view.updateState(newEditorState);
            updateWordCount(content);
        };

        window.electronAPI.file
            .read(fileItem.path)
            .then((content) => {
                if (!ignore) {
                    updateFileContent(content ?? "");
                    setLoading(false);
                }
            })
            .catch((error) => {
                console.error("Erreur chargement fichier:", error);
                if (!ignore) {
                    updateFileContent("");
                    setLoading(false);
                }
            });
        return () => {
            ignore = true;
        };
    }, [editor, loading, fileItem, fileContent]);

    return (
        <div className="flex-1 min-h-0">
            <div
                className="bg-white dark:bg-dark-paper dark:text-dark-ink rounded-lg shadow-sm scrollbar-thin scrollbar-gutter-stable dark:scrollbar-thumb-ink dark:scrollbar-track-warm-gray border border-gray-50 dark:border-white/10 h-full flex flex-col w-full 2xl:max-w-4/5 m-auto"
                id="main-editor"
            >
                {loading || !editor ? (
                    <p className="font-ui text-sm text-white/50">
                        Chargement...
                    </p>
                ) : (
                    <Tiptap editor={editor}>
                        <TipTapMenu
                            editor={editor}
                            fileExtension={getFileExtension(fileItem.name)}
                            onSave={handleManualSave}
                            onToggleFocusMode={onToggleFocusMode}
                            onToggleAutosave={handleAutosave}
                            autoSave={autoSave}
                        />
                        <Tiptap.Content className="flex-1 min-h-0 overflow-y-auto p-4" />
                        <WordCounter
                            wordCount={wordCount}
                            charCount={charCount}
                        />
                    </Tiptap>
                )}
            </div>
        </div>
    );
}
