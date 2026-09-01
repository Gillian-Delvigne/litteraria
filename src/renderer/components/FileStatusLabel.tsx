import { useEffect, useState } from "react";
import type { FileStatus } from "../../types/workspace";
import { SaveCheck, FilePenLine, LoaderCircle, FileX } from "lucide-react";

const saveStatus = {
    saved: { colorStyle: "text-accent-sage", label: <SaveCheck size={16} /> },
    unsaved: {
        colorStyle: "text-accent-terra",
        label: <FilePenLine size={16} />,
    },
    saving: {
        colorStyle: "text-violet-500",
        label: <LoaderCircle className="animate-spin" size={16} />,
    },
    error: { colorStyle: "text-red-500", label: <FileX size={16} /> },
};

const rtf = new Intl.RelativeTimeFormat("fr-FR", { numeric: "auto" });

const computeElapsedTime = (
    timestamp: number,
): { value: string; nextDelayMs: number } => {
    const time = Math.max(Math.floor((Date.now() - timestamp) / 1000), 0);
    const minutes = Math.floor(time / 60);
    const hours = Math.floor(minutes / 60);
    const days = Math.floor(hours / 24);
    const months = Math.floor(days / 30);
    const years = Math.floor(months / 12);

    if (years > 0)
        return {
            value: rtf.format(0 - years, "year"),
            nextDelayMs: (946080000 - (time % 946080000)) * 1000,
        };
    if (months > 0)
        return {
            value: rtf.format(0 - months, "month"),
            nextDelayMs: (2592000 - (time % 2592000)) * 1000,
        };
    if (days > 0)
        return {
            value: rtf.format(0 - days, "day"),
            nextDelayMs: (86400 - (time % 86400)) * 1000,
        };
    if (hours > 0)
        return {
            value: rtf.format(0 - hours, "hour"),
            nextDelayMs: (3600 - (time % 3600)) * 1000,
        };
    if (minutes > 0)
        return {
            value: rtf.format(0 - minutes, "minute"),
            nextDelayMs: (60 - (time % 60)) * 1000,
        };
    return {
        value: rtf.format(0 - time, "second"),
        nextDelayMs: 1000,
    };
};

export const FileStatusLabel = ({ fileStatus }: { fileStatus: FileStatus }) => {
    const [elapsedTime, setElapsedTime] = useState<string | undefined>();

    useEffect(() => {
        if (fileStatus.status !== "saved" || !fileStatus.timestamp) {
            return;
        }
        const timestamp = fileStatus.timestamp;

        let timeoutId: ReturnType<typeof setTimeout>;
        const tick = () => {
            const { value, nextDelayMs } = computeElapsedTime(timestamp);
            setElapsedTime(value);
            timeoutId = setTimeout(tick, nextDelayMs);
        };
        tick();

        return () => clearTimeout(timeoutId);
    }, [fileStatus]);

    return (
        <div
            className={`text-center text-xs flex gap-2 ${saveStatus[fileStatus.status].colorStyle}`}
        >
            {saveStatus[fileStatus.status].label}
            {fileStatus.status === "saved" && elapsedTime && (
                <span>{elapsedTime}</span>
            )}
        </div>
    );
};
