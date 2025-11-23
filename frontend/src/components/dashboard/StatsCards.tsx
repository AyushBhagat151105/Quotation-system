interface StatsCardsProps {
    stats: {
        total: number;
        pending: number;
        approved: number;
        rejected: number;
        expired: number;
    };
}

export default function StatsCards({ stats }: StatsCardsProps) {
    const cards = [
        { label: "Total Quotations", value: stats.total, color: "from-pink-500 to-purple-500" },
        { label: "Pending", value: stats.pending, color: "from-yellow-500 to-orange-500" },
        { label: "Approved", value: stats.approved, color: "from-green-500 to-emerald-500" },
        { label: "Rejected", value: stats.rejected, color: "from-red-500 to-pink-500" },
        { label: "Expired", value: stats.expired, color: "from-gray-500 to-gray-700" },
    ];

    return (
        <div className="grid grid-cols-2 md:grid-cols-5 gap-4">
            {cards.map((c) => (
                <div
                    key={c.label}
                    className={`p-6 rounded-xl bg-linear-to-br ${c.color} text-white shadow-xl`}
                >
                    <p className="text-sm opacity-80">{c.label}</p>
                    <h2 className="text-3xl font-bold">{c.value}</h2>
                </div>
            ))}
        </div>
    );
}
