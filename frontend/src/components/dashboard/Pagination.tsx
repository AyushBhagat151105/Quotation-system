interface PaginationProps {
    total: number;
}
export default function Pagination({ total }: PaginationProps) {
    const pages = Math.ceil(total / 50);

    return (
        <div className="mt-4 flex gap-2">
            {[...Array(pages)].map((_, i) => (
                <button
                    key={i}
                    className="px-3 py-1 bg-white/10 rounded hover:bg-white/20"
                >
                    {i + 1}
                </button>
            ))}
        </div>
    );
}
