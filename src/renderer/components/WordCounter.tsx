export default function WordCounter({
    wordCount,
    charCount,
}: {
    wordCount: number;
    charCount: number;
}) {
    return (
        <div className="flex shrink-0 bg-white dark:bg-dark-paper border-t border-gray-100 dark:border-white/10 px-4 py-2 rounded-b-lg">
            <p className="font-ui text-xs text-warm-gray dark:text-dark-ink/50">
                {wordCount} {wordCount > 1 ? "mots" : "mot"}
            </p>
            <div className="w-px h-4 bg-gray-200 mx-2" />
            <p className="font-ui text-xs text-warm-gray dark:text-dark-ink/50">
                {charCount} {charCount > 1 ? "caractères" : "caractère"}
            </p>
        </div>
    );
}
