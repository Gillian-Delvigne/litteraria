import { useState } from "react";
import type { Editor } from "@tiptap/react";
import { useEditorState } from "@tiptap/react";
import { TipTapButton } from "./TipTapButton";

import {
    Bold,
    Italic,
    Underline,
    Strikethrough,
    Heading,
    Heading1,
    Heading2,
    Heading3,
    Heading4,
    Heading5,
    Heading6,
    List,
    ListOrdered,
    Quote,
    Code,
    Code2,
    Minus,
    Sun,
    MoonStar,
    Save,
    Fullscreen,
    Redo2,
    Undo2,
    RefreshCw,
    Check,
} from "lucide-react";
import { TipTapDropDown } from "./TipTapDropDown";
import { TipTapLinkPopover } from "./TipTapLinkPopover";

interface Props {
    editor: Editor;
    fileExtension: string | undefined;
    onSave: () => void;
    onToggleFocusMode: () => void;
    onToggleAutosave: () => void;
    autoSave: boolean;
}

export default function TipTapMenu({
    editor,
    fileExtension,
    onSave,
    onToggleFocusMode,
    onToggleAutosave,
    autoSave,
}: Props) {
    const [dark, setDark] = useState(false);
    const { canUndo, canRedo, canReset } = useEditorState({
        editor,
        selector: (ctx) => {
            return {
                canUndo: ctx.editor.can().chain().focus().undo().run(),
                canRedo: ctx.editor.can().chain().focus().redo().run(),
                canReset: !ctx.editor.state.selection.empty,
            };
        },
    });

    const toggleDarkMode = () => {
        document.getElementById("main-editor")?.classList.toggle("dark");
        setDark(!dark);
    };

    const setToolbarButtonState = () => {
        return fileExtension != "md";
    };

    return (
        <>
            <div className="shrink-0 bg-white dark:bg-dark-paper dark:text-dark-ink h-12 w-full px-2 flex items-center border-b border-gray-100 dark:border-white/10 rounded-t-lg">
                <div className="not-md flex items-center grow gap-1">
                    <TipTapButton
                        title="Annuler"
                        active={editor.isActive("undo")}
                        onClick={() => editor.chain().focus().undo().run()}
                        disabled={setToolbarButtonState() || !canUndo}
                    >
                        <Undo2 size={16} />
                    </TipTapButton>
                    <TipTapButton
                        title="Refaire"
                        active={editor.isActive("redo")}
                        onClick={() => editor.chain().focus().redo().run()}
                        disabled={setToolbarButtonState() || !canRedo}
                    >
                        <Redo2 size={16} />
                    </TipTapButton>
                    <TipTapButton
                        title="Supprimer la mise en forme"
                        onClick={() => {
                            editor.commands.clearNodes();
                            editor.commands.unsetAllMarks();
                        }}
                        disabled={setToolbarButtonState() || !canReset}
                    >
                        <RefreshCw size={16} />
                    </TipTapButton>
                    <div className="w-px h-6 bg-gray-200 mx-1" />
                    <TipTapButton
                        title="Gras"
                        active={editor.isActive("bold")}
                        onClick={() =>
                            editor.chain().focus().toggleBold().run()
                        }
                        disabled={setToolbarButtonState()}
                    >
                        <Bold size={16} />
                    </TipTapButton>
                    <TipTapButton
                        title="Italique"
                        active={editor.isActive("italic")}
                        onClick={() =>
                            editor.chain().focus().toggleItalic().run()
                        }
                        disabled={setToolbarButtonState()}
                    >
                        <Italic size={16} />
                    </TipTapButton>
                    <TipTapButton
                        title="Souligné"
                        active={editor.isActive("underline")}
                        onClick={() =>
                            editor.chain().focus().toggleUnderline().run()
                        }
                        disabled={setToolbarButtonState()}
                    >
                        <Underline size={16} />
                    </TipTapButton>
                    <TipTapButton
                        title="Barré"
                        active={editor.isActive("strike")}
                        onClick={() =>
                            editor.chain().focus().toggleStrike().run()
                        }
                        disabled={setToolbarButtonState()}
                    >
                        <Strikethrough size={16} />
                    </TipTapButton>

                    <div className="w-px h-6 bg-gray-200 mx-1" />

                    <TipTapDropDown
                        disabled={setToolbarButtonState()}
                        title="Titres"
                        menuIcon={<Heading size={16} />}
                    >
                        <TipTapButton
                            title="Titre 1"
                            active={editor.isActive("heading", { level: 1 })}
                            onClick={() => {
                                editor
                                    .chain()
                                    .focus()
                                    .toggleHeading({ level: 1 })
                                    .run();
                            }}
                            disabled={setToolbarButtonState()}
                        >
                            <Heading1 size={16} />
                        </TipTapButton>
                        <TipTapButton
                            title="Titre 2"
                            active={editor.isActive("heading", { level: 2 })}
                            onClick={() =>
                                editor
                                    .chain()
                                    .focus()
                                    .toggleHeading({ level: 2 })
                                    .run()
                            }
                            disabled={setToolbarButtonState()}
                        >
                            <Heading2 size={16} />
                        </TipTapButton>
                        <TipTapButton
                            title="Titre 3"
                            active={editor.isActive("heading", { level: 3 })}
                            onClick={() =>
                                editor
                                    .chain()
                                    .focus()
                                    .toggleHeading({ level: 3 })
                                    .run()
                            }
                            disabled={setToolbarButtonState()}
                        >
                            <Heading3 size={16} />
                        </TipTapButton>
                        <TipTapButton
                            title="Titre 4"
                            active={editor.isActive("heading", { level: 4 })}
                            onClick={() =>
                                editor
                                    .chain()
                                    .focus()
                                    .toggleHeading({ level: 4 })
                                    .run()
                            }
                            disabled={setToolbarButtonState()}
                        >
                            <Heading4 size={16} />
                        </TipTapButton>
                        <TipTapButton
                            title="Titre 5"
                            active={editor.isActive("heading", { level: 5 })}
                            onClick={() =>
                                editor
                                    .chain()
                                    .focus()
                                    .toggleHeading({ level: 5 })
                                    .run()
                            }
                            disabled={setToolbarButtonState()}
                        >
                            <Heading5 size={16} />
                        </TipTapButton>
                        <TipTapButton
                            title="Titre 6"
                            active={editor.isActive("heading", { level: 6 })}
                            onClick={() =>
                                editor
                                    .chain()
                                    .focus()
                                    .toggleHeading({ level: 6 })
                                    .run()
                            }
                            disabled={setToolbarButtonState()}
                        >
                            <Heading6 size={16} />
                        </TipTapButton>
                    </TipTapDropDown>
                    <div className="w-px h-6 bg-gray-200 mx-1" />
                    <TipTapDropDown
                        disabled={setToolbarButtonState()}
                        title="Listes"
                        menuIcon={<List size={16} />}
                    >
                        <TipTapButton
                            title="Liste à puces"
                            active={editor.isActive("bulletList")}
                            onClick={() =>
                                editor.chain().focus().toggleBulletList().run()
                            }
                            disabled={setToolbarButtonState()}
                        >
                            <List size={16} />
                        </TipTapButton>
                        <TipTapButton
                            title="Liste numérotée"
                            active={editor.isActive("orderedList")}
                            onClick={() =>
                                editor.chain().focus().toggleOrderedList().run()
                            }
                            disabled={setToolbarButtonState()}
                        >
                            <ListOrdered size={16} />
                        </TipTapButton>
                    </TipTapDropDown>
                    <div className="w-px h-6 bg-gray-200 mx-1" />
                    <TipTapButton
                        title="Citation"
                        active={editor.isActive("blockquote")}
                        onClick={() =>
                            editor.chain().focus().toggleBlockquote().run()
                        }
                        disabled={setToolbarButtonState()}
                    >
                        <Quote size={16} />
                    </TipTapButton>
                    <TipTapButton
                        title="Code"
                        active={editor.isActive("code")}
                        onClick={() =>
                            editor.chain().focus().toggleCode().run()
                        }
                        disabled={setToolbarButtonState()}
                    >
                        <Code size={16} />
                    </TipTapButton>
                    <TipTapButton
                        title="Bloc de code"
                        active={editor.isActive("codeBlock")}
                        onClick={() =>
                            editor.chain().focus().toggleCodeBlock().run()
                        }
                        disabled={setToolbarButtonState()}
                    >
                        <Code2 size={16} />
                    </TipTapButton>
                    <TipTapButton
                        title="Ligne horizontale"
                        onClick={() =>
                            editor.chain().focus().setHorizontalRule().run()
                        }
                        disabled={setToolbarButtonState()}
                    >
                        <Minus size={16} />
                    </TipTapButton>
                    <TipTapLinkPopover
                        editor={editor}
                        disabled={setToolbarButtonState()}
                    />
                </div>
                <div className="w-px h-6 bg-gray-200 mx-1" />
                <TipTapButton
                    title="Sauvegarder"
                    onClick={onSave}
                    disabled={false}
                >
                    <Save size={16} />
                </TipTapButton>
                <div className="flex mr-1 items-center">
                    <input
                        id="autosave-checkbox"
                        type="checkbox"
                        className="appearance-none relative peer shrink-0 w-2.5 h-2.5 m-1 rounded-xs border border-black bg-white checked:bg-accent-sage checked:border-accent-sage text-white dark:bg-dark-paper dark:border-white/10 focus-visible:ring-1"
                        onChange={onToggleAutosave}
                        checked={autoSave}
                        title="Activer la sauvegarde automatique"
                    ></input>
                    <label htmlFor="autosave-checkbox" className="text-xs">
                        Sauvegarde auto
                    </label>
                    <Check
                        size={10}
                        className="absolute w-2.5 h-2.5 m-1 hidden peer-checked:block pointer-events-none text-white"
                    />
                </div>
                <div className="w-px h-6 bg-gray-200 mx-1" />
                <div className="flex items-center">
                    <TipTapButton
                        title="Mode concentration"
                        onClick={onToggleFocusMode}
                        disabled={false}
                    >
                        <Fullscreen size={16} />
                    </TipTapButton>
                    <TipTapButton
                        title="Mode sombre/clair"
                        active={dark}
                        onClick={toggleDarkMode}
                        disabled={false}
                    >
                        {dark ? <MoonStar size={16} /> : <Sun size={16} />}
                    </TipTapButton>
                </div>
            </div>
            {setToolbarButtonState() && (
                <span
                    className="absolute top-0 left-1/2 -translate-x-1/2 mt-1 whitespace-nowrap
                              opacity-0 not-md:hover:opacity-100 transition-opacity
                              pointer-events-none z-20
                              bg-ink dark:bg-dark-ink text-white dark:text-dark-paper text-xs px-2 py-1 rounded"
                >
                    Only markdown files (.md) can be edited
                </span>
            )}
        </>
    );
}
