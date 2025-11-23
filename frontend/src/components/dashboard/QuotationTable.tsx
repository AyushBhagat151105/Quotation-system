
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
import { Loader2 } from "lucide-react";

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
                <Loader2 className="animate-spin text-white" />
            </div>
        );

    if (!data) return null;

    return (
        <div className="bg-white/5 backdrop-blur-xl border border-white/10 rounded-xl p-6 shadow-xl">
            {/* Header row */}
            <div className="mb-4 flex justify-between items-center">
                <h2 className="text-2xl font-bold text-white">Quotations</h2>

                <Link
                    to="/dashboard/quotations/create"
                    className="px-4 py-2 bg-linear-to-r from-pink-500 to-purple-600 rounded-lg text-white shadow hover:opacity-90"
                >
                    + Create
                </Link>
            </div>

            <div className="hidden sm:block overflow-x-auto">
                <table className="w-full text-white text-sm min-w-[600px]">
                    <thead className="bg-white/5">
                        {table.getHeaderGroups().map((hg) => (
                            <tr key={hg.id} className="border-b border-white/10">
                                {hg.headers.map((header) => (
                                    <th
                                        key={header.id}
                                        className="p-3 cursor-pointer select-none whitespace-nowrap"
                                        onClick={header.column.getToggleSortingHandler()}
                                    >
                                        <div className="flex items-center gap-2 opacity-80">
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
                        {table.getRowModel().rows.map((row) => (
                            <tr
                                key={row.id}
                                className="border-b border-white/10 hover:bg-white/5 transition-colors"
                            >
                                {row.getVisibleCells().map((cell) => (
                                    <td key={cell.id} className="p-3 whitespace-nowrap">
                                        {flexRender(cell.column.columnDef.cell, cell.getContext())}
                                    </td>
                                ))}
                            </tr>
                        ))}
                    </tbody>
                </table>
            </div>

            <div className="sm:hidden space-y-4">
                {table.getRowModel().rows.map((row) => {
                    const q = row.original;
                    return (
                        <div
                            key={row.id}
                            className="p-4 bg-white/5 border border-white/10 rounded-lg shadow flex flex-col gap-3"
                        >
                            <div className="flex justify-between">
                                <span className="font-bold text-white text-lg">{q.clientName}</span>
                                <span className="text-sm opacity-80">{q.status}</span>
                            </div>

                            <div className="text-white opacity-80 text-sm">
                                Total: <span className="font-semibold">₹{q.totalAmount}</span>
                            </div>

                            <div className="flex gap-3 text-sm pt-2">
                                <Link
                                    to="/dashboard/quotations/$id"
                                    params={{ id: q.id }}
                                    className="text-blue-400"
                                >
                                    View
                                </Link>

                                <Link
                                    to="/dashboard/quotations/$id/edit"
                                    params={{ id: q.id }}
                                    className="text-purple-400"
                                >
                                    Edit
                                </Link>

                                <button
                                    onClick={async () => {
                                        await quotationApi.remove(q.id);
                                        table.options.meta?.refetch?.();
                                    }}
                                    className="text-red-400"
                                >
                                    Delete
                                </button>
                            </div>
                        </div>
                    );
                })}
            </div>

            <Pagination total={data.count} />
        </div>
    );
}

const columns: ColumnDef<QuotationLite>[] = [
    {
        accessorKey: "clientName",
        header: "Client",
        cell: (info) => (
            <span className="font-semibold text-white/90">{info.row.original.clientName}</span>
        ),
    },
    {
        accessorKey: "totalAmount",
        header: "Total",
        cell: (info) => <span>₹{info.row.original.totalAmount}</span>,
    },
    {
        accessorKey: "status",
        header: "Status",
        cell: (info) => {
            const s = info.row.original.status;
            const color =
                s === "APPROVED"
                    ? "text-green-400"
                    : s === "REJECTED"
                        ? "text-red-400"
                        : s === "EXPIRED"
                            ? "text-gray-400"
                            : "text-yellow-300";

            return <span className={color}>{s}</span>;
        },
    },
    {
        id: "actions",
        header: "Actions",
        cell: (info) => {
            const id = info.row.original.id;

            return (
                <div className="flex gap-3 text-sm">
                    <Link to="/dashboard/quotations/$id" params={{ id }} className="text-blue-400">
                        View
                    </Link>

                    <Link to="/dashboard/quotations/$id/edit" params={{ id }} className="text-purple-400">
                        Edit
                    </Link>

                    <button
                        onClick={async () => {
                            await quotationApi.remove(id);
                            info.table.options.meta?.refetch?.();
                        }}
                        className="text-red-400"
                    >
                        Delete
                    </button>
                </div>
            );
        },
    },
];
