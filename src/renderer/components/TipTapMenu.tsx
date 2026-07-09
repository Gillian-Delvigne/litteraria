import { useState } from "react";
import { useTiptapState } from "@tiptap/react";
import type { Editor } from "@tiptap/react";

import {
    Bold,
    Italic,
    Heading1,
    Heading2,
    Heading3,
    List,
    ListOrdered,
    Sun,
    MoonStar,
    Save,
} from "lucide-react";

interface Props {
    editor: Editor;
    fileExtension: string | undefined;
    onSave: () => void;
    onToggleFocusMode: () => void;
}

function ToolbarButton({
    onClick,
    active,
    children,
    title,
    disabled,
}: {
    onClick: () => void;
    active: boolean;
    children: React.ReactNode;
    title: string;
    disabled: boolean;
}) {
    console.log(disabled);
    return (
        <button
            disabled={disabled}
            type="button"
            title={title}
            onClick={onClick}
            className={`w-8 h-8 rounded-md flex items-center justify-center transition-colors 
			 ${disabled ? "hover:bg-none cursor-not-allowed" : "dark:hover:bg-accent-terra hover:bg-gray-100"}`}
        >
            {children}
        </button>
    );
}

export default function TipTapMenu({
    editor,
    fileExtension,
    onSave,
    onToggleFocusMode,
}: Props) {
    const [dark, setDark] = useState(false);

    const toggleDarkMode = () => {
        document.getElementById("main-editor")?.classList.toggle("dark");
        setDark(!dark);
    };

    const setToolbarButtonState = () => {
        return fileExtension != "md";
    };

    // const test = useTiptapState((disabled) => {
    //     const text = disabled.editor.disabled;
    //     console.log(text);
    // });

    return (
        <div className="shrink-0 bg-white dark:bg-dark-paper dark:text-dark-ink h-12 w-full px-2 flex items-center gap-1 border-b border-gray-100 dark:border-white/10">
            <div className="flex items-center grow">
                <ToolbarButton
                    title="Gras"
                    active={editor.isActive("bold")}
                    onClick={() => editor.chain().focus().toggleBold().run()}
                    disabled={setToolbarButtonState()}
                >
                    <Bold size={16} />
                </ToolbarButton>
                <ToolbarButton
                    title="Italique"
                    active={editor.isActive("italic")}
                    onClick={() => editor.chain().focus().toggleItalic().run()}
                    disabled={setToolbarButtonState()}
                >
                    <Italic size={16} />
                </ToolbarButton>

                <div className="w-px h-6 bg-gray-200 mx-1" />

                <ToolbarButton
                    title="Titre 1"
                    active={editor.isActive("heading", { level: 1 })}
                    onClick={() =>
                        editor.chain().focus().toggleHeading({ level: 1 }).run()
                    }
                    disabled={setToolbarButtonState()}
                >
                    <Heading1 size={16} />
                </ToolbarButton>
                <ToolbarButton
                    title="Titre 2"
                    active={editor.isActive("heading", { level: 2 })}
                    onClick={() =>
                        editor.chain().focus().toggleHeading({ level: 2 }).run()
                    }
                    disabled={setToolbarButtonState()}
                >
                    <Heading2 size={16} />
                </ToolbarButton>
                <ToolbarButton
                    title="Titre 3"
                    active={editor.isActive("heading", { level: 3 })}
                    onClick={() =>
                        editor.chain().focus().toggleHeading({ level: 3 }).run()
                    }
                    disabled={setToolbarButtonState()}
                >
                    <Heading3 size={16} />
                </ToolbarButton>
                <div className="w-px h-6 bg-gray-200 mx-1" />
                <ToolbarButton
                    title="Liste à puces"
                    active={editor.isActive("bulletList")}
                    onClick={() =>
                        editor.chain().focus().toggleBulletList().run()
                    }
                    disabled={setToolbarButtonState()}
                >
                    <List size={16} />
                </ToolbarButton>
                <ToolbarButton
                    title="Liste numérotée"
                    active={editor.isActive("orderedList")}
                    onClick={() =>
                        editor.chain().focus().toggleOrderedList().run()
                    }
                    disabled={setToolbarButtonState()}
                >
                    <ListOrdered size={16} />
                </ToolbarButton>
            </div>
            <div className="w-px h-6 bg-gray-200 mx-1" />
            <div className="flex items-center">
                <ToolbarButton
                    title="Sauvegarder"
                    active={false}
                    onClick={onSave}
                    disabled=""
                >
                    <Save size={16} />
                </ToolbarButton>
                <ToolbarButton
                    title="Mode sombre/clair"
                    active={dark}
                    onClick={toggleDarkMode}
                    disabled=""
                >
                    {dark ? <MoonStar size={16} /> : <Sun size={16} />}
                </ToolbarButton>
            </div>
        </div>
    );
}
