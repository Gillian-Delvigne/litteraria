import type { MouseEventHandler } from "react";

export const TipTapButton = ({
    onClick,
    children,
    title,
    disabled,
}: {
    onClick: MouseEventHandler<HTMLButtonElement>;
    active: boolean;
    children: React.ReactNode;
    title: string;
    disabled: boolean;
}) => {
    return (
        <div className="relative group">
            <button
                disabled={disabled}
                type="button"
                onClick={onClick}
                className={`w-8 h-8 rounded-md flex items-center justify-center transition-colors 
				${disabled ? "hover:bg-none text-gray-500" : "dark:hover:bg-accent-terra hover:bg-gray-100"}`}
            >
                {children}
            </button>
            { !disabled && <span
                className="absolute top-full left-1/2 -translate-x-1/2 mt-1 whitespace-nowrap
                              opacity-0 group-hover:opacity-100 transition-opacity
                              pointer-events-none z-20
                              bg-ink dark:bg-dark-ink text-white dark:text-dark-paper text-xs px-2 py-1 rounded"
            >
                {title}
            </span>}
        </div>
    );
};
