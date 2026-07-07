import { useState, useEffect } from "react";
import type { FileItem } from "../types/electron";

export default function Editor({ fileItem }: { fileItem: FileItem }) {
    const [loading, setLoading] = useState(true);
    const [fileContent, setFileContent] = useState<string | null>(null);
    const [loadedFileItem, setLoadedFileItem] = useState(fileItem);
    const [wordCount, setWordCount] = useState(0);

    const updateWordCount = (text: string) => {
        const words = text
            .trim()
            .split(/\s+/)
            .filter((w) => w.length > 0);
        setWordCount(words.length);
    };

    useEffect(() => {
        let ignore = false;

        const updateFileContent = (content: string) => {
            setFileContent(content);
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
    }, [fileItem]);

    if (loadedFileItem !== fileItem) {
        setLoading(true);
        setLoadedFileItem(fileItem);
    }

    return (
        <div>
            {loading ? (
                <p className="font-ui text-sm text-white/50">Chargement...</p>
            ) : (
                <>
                    <p>{`${wordCount} ${wordCount > 1 ? "mots" : "mot"}`} </p>
                    <div>{fileContent}</div>
                </>
            )}
        </div>
    );
}
