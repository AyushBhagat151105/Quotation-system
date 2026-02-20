
import { type RowData } from "@tanstack/react-table";

declare module "@tanstack/react-table" {
    interface TableMeta<TData extends RowData> {
        refetch?: () => void;
    }
}

import {
    useReactTable,
    getCoreRowModel,
    getSortedRowModel,
    flexRender,
    type ColumnDef,
} from "@tanstack/react-table";

import { useState } from "react";
import { useQuery } from "@tanstack/react-query";
import { quotationApi } from "@/api/quotation";
import { Link } from "@tanstack/react-router";
import Pagination from "./Pagination";
import type { QuotationLite } from "@/types/quotation";
import { Loader2, Eye, Pencil, Trash2 } from "lucide-react";

export default function QuotationTable() {
    const [sort, setSort] = useState<any>([]);

    const query = useQuery({
        queryKey: ["quotations", sort],
        queryFn: () => quotationApi.listForAdmin().then((res) => res.data),
    });

    const data = query.data;

    const table = useReactTable<QuotationLite>({
        data: data?.items ?? [],
        columns,
        state: { sorting: sort },
        onSortingChange: setSort,
        getCoreRowModel: getCoreRowModel(),
        getSortedRowModel: getSortedRowModel(),
        meta: { refetch: query.refetch },
    });

    if (query.isLoading)
        return (
            <div className="flex items-center justify-center p-10">
                <Loader2 className="animate-spin text-slate-400" />
            </div>
        );

    if (!data) return null;

    return (
        <div className="bg-slate-900 border border-slate-800 rounded-xl overflow-hidden">
            {/* Header row */}
            <div className="px-6 py-4 flex justify-between items-center border-b border-slate-800">
                <h2 className="text-lg font-semibold text-white">Quotations</h2>
                <Link
                    to="/dashboard/quotations/create"
                    className="px-4 py-2 text-sm bg-emerald-600 hover:bg-emerald-500 rounded-lg text-white font-medium transition-colors"
                >
                    + Create
                </Link>
            </div>

            {/* Desktop table */}
            <div className="hidden sm:block overflow-x-auto">
                <table className="w-full text-sm min-w-[600px]">
                    <thead>
                        {table.getHeaderGroups().map((hg) => (
                            <tr key={hg.id} className="border-b border-slate-800 bg-slate-800/30">
                                {hg.headers.map((header) => (
                                    <th
                                        key={header.id}
                                        className="px-6 py-3 text-left cursor-pointer select-none whitespace-nowrap text-slate-400 text-xs uppercase tracking-wider font-medium"
                                        onClick={header.column.getToggleSortingHandler()}
                                    >
                                        <div className="flex items-center gap-1.5">
                                            {flexRender(header.column.columnDef.header, header.getContext())}
                                            {{
                                                asc: "↑",
                                                desc: "↓",
                                            }[header.column.getIsSorted() as string] ?? ""}
                                        </div>
                                    </th>
                                ))}
                            </tr>
                        ))}
                    </thead>

                    <tbody>
                        {table.getRowModel().rows.map((row, idx) => (
                            <tr
                                key={row.id}
                                className={`border-b border-slate-800/50 hover:bg-slate-800/30 transition-colors
                  ${idx % 2 === 1 ? "bg-slate-800/10" : ""}`}
                            >
                                {row.getVisibleCells().map((cell) => (
                                    <td key={cell.id} className="px-6 py-3.5 whitespace-nowrap text-slate-300">
                                        {flexRender(cell.column.columnDef.cell, cell.getContext())}
                                    </td>
                                ))}
                            </tr>
                        ))}
                    </tbody>
                </table>
            </div>

            {/* Mobile cards */}
            <div className="sm:hidden divide-y divide-slate-800">
                {table.getRowModel().rows.map((row) => {
                    const q = row.original;
                    return (
                        <div key={row.id} className="p-4 flex flex-col gap-3">
                            <div className="flex justify-between items-start">
                                <span className="font-semibold text-white">{q.clientName}</span>
                                <StatusBadge status={q.status} />
                            </div>

                            <div className="text-slate-400 text-sm">
                                Total: <span className="font-medium text-white">₹{q.totalAmount}</span>
                            </div>

                            <div className="flex gap-3 pt-1">
                                <Link
                                    to="/dashboard/quotations/$id"
                                    params={{ id: q.id }}
                                    className="text-sm text-emerald-400 hover:text-emerald-300"
                                >
                                    View
                                </Link>
                                <Link
                                    to="/dashboard/quotations/$id/edit"
                                    params={{ id: q.id }}
                                    className="text-sm text-blue-400 hover:text-blue-300"
                                >
                                    Edit
                                </Link>
                                <button
                                    onClick={async () => {
                                        await quotationApi.remove(q.id);
                                        table.options.meta?.refetch?.();
                                    }}
                                    className="text-sm text-red-400 hover:text-red-300"
                                >
                                    Delete
                                </button>
                            </div>
                        </div>
                    );
                })}
            </div>

            <div className="px-6 py-3 border-t border-slate-800">
                <Pagination total={data.count} />
            </div>
        </div>
    );
}

function StatusBadge({ status }: { status: string }) {
    const styles: Record<string, string> = {
        APPROVED: "bg-emerald-500/15 text-emerald-400 border-emerald-500/20",
        REJECTED: "bg-red-500/15 text-red-400 border-red-500/20",
        EXPIRED: "bg-slate-500/15 text-slate-400 border-slate-500/20",
        PENDING: "bg-yellow-500/15 text-yellow-400 border-yellow-500/20",
        SENT: "bg-blue-500/15 text-blue-400 border-blue-500/20",
    };

    return (
        <span
            className={`inline-flex px-2.5 py-0.5 rounded-full text-xs font-medium border ${styles[status] || styles.PENDING}`}
        >
            {status}
        </span>
    );
}

const columns: ColumnDef<QuotationLite>[] = [
    {
        accessorKey: "clientName",
        header: "Client",
        cell: (info) => (
            <span className="font-medium text-white">{info.row.original.clientName}</span>
        ),
    },
    {
        accessorKey: "totalAmount",
        header: "Total",
        cell: (info) => <span className="text-slate-300">₹{info.row.original.totalAmount}</span>,
    },
    {
        accessorKey: "status",
        header: "Status",
        cell: (info) => <StatusBadge status={info.row.original.status} />,
    },
    {
        id: "actions",
        header: "Actions",
        cell: (info) => {
            const id = info.row.original.id;

            return (
                <div className="flex items-center gap-1">
                    <Link
                        to="/dashboard/quotations/$id"
                        params={{ id }}
                        className="p-1.5 rounded-md text-slate-400 hover:text-emerald-400 hover:bg-slate-800 transition-colors"
                        title="View"
                    >
                        <Eye size={16} />
                    </Link>

                    <Link
                        to="/dashboard/quotations/$id/edit"
                        params={{ id }}
                        className="p-1.5 rounded-md text-slate-400 hover:text-blue-400 hover:bg-slate-800 transition-colors"
                        title="Edit"
                    >
                        <Pencil size={16} />
                    </Link>

                    <button
                        onClick={async () => {
                            await quotationApi.remove(id);
                            info.table.options.meta?.refetch?.();
                        }}
                        className="p-1.5 rounded-md text-slate-400 hover:text-red-400 hover:bg-slate-800 transition-colors"
                        title="Delete"
                    >
                        <Trash2 size={16} />
                    </button>
                </div>
            );
        },
    },
];
