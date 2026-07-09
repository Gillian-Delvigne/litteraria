export default function WordCounter({ count }: { count: number }) {
    return (
        <div className="shrink-0 bg-white dark:bg-dark-paper border-t border-gray-100 dark:border-white/10 px-4 py-2">
            <p className="font-ui text-xs text-warm-gray dark:text-dark-ink/50">
                {count} {count > 1 ? "mots" : "mot"}
            </p>
        </div>
    );
}