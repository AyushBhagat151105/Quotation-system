import { FileText, Clock, CheckCircle, XCircle, AlertTriangle } from "lucide-react";

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
        {
            label: "Total Quotations",
            value: stats.total,
            icon: FileText,
            iconColor: "text-emerald-400",
            iconBg: "bg-emerald-500/10",
        },
        {
            label: "Pending",
            value: stats.pending,
            icon: Clock,
            iconColor: "text-yellow-400",
            iconBg: "bg-yellow-500/10",
        },
        {
            label: "Approved",
            value: stats.approved,
            icon: CheckCircle,
            iconColor: "text-emerald-400",
            iconBg: "bg-emerald-500/10",
        },
        {
            label: "Rejected",
            value: stats.rejected,
            icon: XCircle,
            iconColor: "text-red-400",
            iconBg: "bg-red-500/10",
        },
        {
            label: "Expired",
            value: stats.expired,
            icon: AlertTriangle,
            iconColor: "text-slate-400",
            iconBg: "bg-slate-500/10",
        },
    ];

    return (
        <div className="grid grid-cols-2 lg:grid-cols-5 gap-4">
            {cards.map((c) => (
                <div
                    key={c.label}
                    className="p-5 rounded-xl bg-slate-900 border border-slate-800 hover:border-slate-700 transition-colors"
                >
                    <div className="flex items-center justify-between mb-3">
                        <p className="text-sm text-slate-400">{c.label}</p>
                        <div className={`w-8 h-8 rounded-lg ${c.iconBg} flex items-center justify-center`}>
                            <c.icon size={16} className={c.iconColor} />
                        </div>
                    </div>
                    <h2 className="text-3xl font-bold text-white">{c.value}</h2>
                </div>
            ))}
        </div>
    );
}
