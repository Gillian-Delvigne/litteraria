import { useEffect, useRef, useState } from "react";
import type { KeyboardEvent } from "react";
import type { Editor } from "@tiptap/react";
import { Check, Link2, Trash2 } from "lucide-react";

interface Props {
    editor: Editor;
    disabled: boolean;
}

export const TipTapLinkPopover = ({ editor, disabled }: Props) => {
    const [isOpen, setIsOpen] = useState(false);
    const [url, setUrl] = useState("");
    const inputRef = useRef<HTMLInputElement>(null);
    const isActive = editor.isActive("link");

    useEffect(() => {
        if (isOpen) inputRef.current?.focus();
    }, [isOpen]);

    const openPopover = () => {
        setUrl((editor.getAttributes("link").href as string | undefined) ?? "");
        setIsOpen(true);
    };

    const applyLink = () => {
        const trimmed = url.trim();
        if (trimmed === "") {
            editor.chain().focus().extendMarkRange("link").unsetLink().run();
        } else {
            editor
                .chain()
                .focus()
                .extendMarkRange("link")
                .setLink({ href: trimmed })
                .run();
        }
        setIsOpen(false);
    };

    const removeLink = () => {
        editor.chain().focus().extendMarkRange("link").unsetLink().run();
        setIsOpen(false);
    };

    const handleKeyDown = (event: KeyboardEvent<HTMLInputElement>) => {
        if (event.key === "Enter") {
            event.preventDefault();
            applyLink();
        }
        if (event.key === "Escape") {
            event.preventDefault();
            setIsOpen(false);
        }
    };

    return (
        <div className="relative">
            <div className="relative group">
                <button
                    disabled={disabled}
                    type="button"
                    onClick={() => (isOpen ? setIsOpen(false) : openPopover())}
                    className={`w-8 h-8 rounded-md flex items-center justify-center transition-colors
						${(isActive || isOpen) && "dark:bg-accent-terra bg-gray-100"}
						${disabled ? "hover:bg-none text-gray-500" : "dark:hover:bg-accent-terra hover:bg-gray-100"}`}
                >
                    <Link2 size={16} />
                </button>
                {!isOpen && !disabled && (
                    <span
                        className="absolute top-full left-1/2 -translate-x-1/2 mt-1 whitespace-nowrap
                                  opacity-0 group-hover:opacity-100 transition-opacity
                                  pointer-events-none z-20
                                  bg-ink dark:bg-dark-ink text-white dark:text-dark-paper text-xs px-2 py-1 rounded"
                    >
                        Lien
                    </span>
                )}
            </div>
            {isOpen && (
                <div className="dropdown absolute top-9 left-1/2 -translate-x-1/2 p-2 bg-white dark:bg-dark-paper transition-colors rounded-md z-50 shadow-sm border border-gray-50 dark:border-white/10 flex items-center gap-1">
                    <input
                        ref={inputRef}
                        type="url"
                        value={url}
                        onChange={(event) => setUrl(event.target.value)}
                        onKeyDown={handleKeyDown}
                        placeholder="https://..."
                        className="w-48 text-xs px-2 py-1.5 rounded-sm border border-gray-200 dark:border-white/10 bg-white dark:bg-dark-paper dark:text-dark-ink focus:outline-none focus-visible:ring-1"
                    />
                    <button
                        type="button"
                        onClick={applyLink}
                        title="Valider"
                        className="w-7 h-7 shrink-0 rounded-md flex items-center justify-center hover:bg-gray-100 dark:hover:bg-accent-terra"
                    >
                        <Check size={14} />
                    </button>
                    {isActive && (
                        <button
                            type="button"
                            onClick={removeLink}
                            title="Supprimer le lien"
                            className="w-7 h-7 shrink-0 rounded-md flex items-center justify-center hover:bg-gray-100 dark:hover:bg-accent-terra"
                        >
                            <Trash2 size={14} />
                        </button>
                    )}
                </div>
            )}
        </div>
    );
};
