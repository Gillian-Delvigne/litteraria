import type { FileStatus, WorkspaceItem } from "../../types/workspace";
import { FileStatusLabel } from "./FileStatusLabel";

export default function WorkspaceHeader({
    fileItem,
    fileStatus,
}: {
    fileItem: WorkspaceItem;
    fileStatus: FileStatus;
}) {
    return (
        <div>
            <div className="flex flex-row gap-3 mb-1 py-2 items-center">
                <div>
                    <h1 className="font-display text-3xl font-semibold text-ink">
                        {fileItem.name}
                    </h1>
                </div>
                <FileStatusLabel fileStatus={fileStatus} />
            </div>
            <p className="font-ui text-warm-gray text-sm mb-8">
                {fileItem.path}
            </p>
        </div>
    );
}
