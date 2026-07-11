import type { WorkspaceItem } from "../../types/workspace";

export default function WorkspaceHeader({
    fileItem,
}: {
    fileItem: WorkspaceItem;
}) {
    return (
        <div>
            <h1 className="font-display text-3xl font-semibold text-ink mb-2">
                {fileItem.name}
            </h1>
            <p className="font-ui text-warm-gray text-sm mb-8">
                {fileItem.path}
            </p>
        </div>
    );
}
