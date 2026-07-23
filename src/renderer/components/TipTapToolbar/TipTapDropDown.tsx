import React, { useState } from "react";
import { ChevronDown } from "lucide-react";

interface Props {
    children: React.ReactNode;
    disabled: boolean;
    title: string;
    menuIcon: React.ReactNode;
}

export const TipTapDropDown = ({
    children,
    disabled,
    title,
    menuIcon,
}: Props) => {
    const [isToogle, setIsToogle] = useState(false);
    const handleClick = () => {
        setIsToogle(!isToogle);
    };

    return (
        <div className="relative">
            <div className="relative group">
                <button
                    disabled={disabled}
                    type="button"
                    onClick={handleClick}
                    className={`w-8 h-8 rounded-md flex items-center justify-center transition-colors 
					${disabled ? "hover:bg-none text-gray-500" : "dark:hover:bg-accent-terra hover:bg-gray-100"}`}
                >
                    {menuIcon}
                    <ChevronDown size={12} />
                </button>
                {!isToogle && !disabled && (
                    <span
                        className="absolute top-full left-1/2 -translate-x-1/2 mt-1 whitespace-nowrap
				opacity-0 group-hover:opacity-100 transition-opacity
				pointer-events-none z-20
				bg-ink dark:bg-dark-ink text-white dark:text-dark-paper text-xs px-2 py-1 rounded"
                    >
                        {title}
                    </span>
                )}
            </div>
            <div
                onClick={() => setIsToogle(false)}
                className={`dropdown absolute top-9 left-1/2 -translate-x-1/2 p-4 bg-white dark:bg-dark-paper transition-colors rounded-md z-50 shadow-sm border border-gray-50 dark:border-white/10 ${isToogle ? "" : "hidden"}`}
            >
                {children}
            </div>
        </div>
    );
};
