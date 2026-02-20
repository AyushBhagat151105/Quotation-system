import { useWatch } from "react-hook-form";
import { FileText, User, Mail, Calendar } from "lucide-react";

interface QuotationPreviewProps {
    control: any;
    clientName?: string;
    clientEmail?: string;
    mode?: "create" | "edit";
}

export default function QuotationPreview({
    control,
    clientName: fixedName,
    clientEmail: fixedEmail,
    mode = "create",
}: QuotationPreviewProps) {
    const watched = useWatch({ control });
    const clientName = fixedName || watched.clientName || "Client Name";
    const clientEmail = fixedEmail || watched.clientEmail || "client@email.com";
    const validityDate = watched.validityDate || "";
    const items = watched.items || [];

    const grandTotal = items.reduce((sum: number, item: any) => {
        const qty = Number(item?.quantity) || 0;
        const price = Number(item?.unitPrice) || 0;
        const tax = Number(item?.tax) || 0;
        return sum + qty * price + tax;
    }, 0);

    const badgeLabel = mode === "edit" ? "EDITING" : "DRAFT";
    const badgeBg = mode === "edit" ? "rgba(96,165,250,0.15)" : "rgba(250,204,21,0.15)";
    const badgeColor = mode === "edit" ? "#60a5fa" : "#facc15";

    return (
        <div className="sticky top-6">
            <div className="flex items-center gap-2 mb-4">
                <div className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse" />
                <p className="text-xs font-medium text-slate-400 uppercase tracking-wider">
                    Live Preview
                </p>
            </div>

            <div className="bg-slate-900 border border-slate-800 rounded-xl overflow-hidden">
                {/* Header */}
                <div className="px-6 py-4 border-b border-slate-800 flex items-center justify-between">
                    <div className="flex items-center gap-3">
                        <div className="w-9 h-9 rounded-lg bg-emerald-500/10 border border-emerald-500/20 flex items-center justify-center">
                            <FileText className="w-4 h-4 text-emerald-400" />
                        </div>
                        <div>
                            <h3 className="text-sm font-bold text-white">Quotation</h3>
                            <p className="text-[10px] text-slate-500">
                                {mode === "edit" ? "Edit Preview" : "Draft Preview"}
                            </p>
                        </div>
                    </div>
                    <span
                        className="inline-flex px-2.5 py-0.5 rounded-full text-[10px] font-medium border"
                        style={{ background: badgeBg, color: badgeColor, borderColor: `${badgeColor}33` }}
                    >
                        {badgeLabel}
                    </span>
                </div>

                {/* Client Info */}
                <div className="px-6 py-4 border-b border-slate-800">
                    <p className="text-[10px] uppercase tracking-wider text-slate-500 font-medium mb-3">
                        Client Information
                    </p>
                    <div className="grid grid-cols-2 gap-3">
                        <div className="flex items-center gap-2">
                            <User size={12} className="text-slate-500 flex-shrink-0" />
                            <span className="text-xs text-white truncate">{clientName}</span>
                        </div>
                        <div className="flex items-center gap-2 min-w-0">
                            <Mail size={12} className="text-slate-500 flex-shrink-0" />
                            <span className="text-xs text-white truncate">{clientEmail}</span>
                        </div>
                        {validityDate && (
                            <div className="flex items-center gap-2">
                                <Calendar size={12} className="text-slate-500 flex-shrink-0" />
                                <span className="text-xs text-white">
                                    {new Date(validityDate).toLocaleDateString()}
                                </span>
                            </div>
                        )}
                    </div>
                </div>

                {/* Items Table */}
                <div className="px-6 py-4 border-b border-slate-800">
                    <p className="text-[10px] uppercase tracking-wider text-slate-500 font-medium mb-3">
                        Items
                    </p>

                    {items.length > 0 && items.some((i: any) => i?.itemName) ? (
                        <table className="w-full text-xs">
                            <thead>
                                <tr className="border-b border-slate-800">
                                    <th className="text-left py-1.5 text-slate-400 font-medium text-[10px] uppercase tracking-wider">Item</th>
                                    <th className="text-right py-1.5 text-slate-400 font-medium text-[10px] uppercase tracking-wider">Qty</th>
                                    <th className="text-right py-1.5 text-slate-400 font-medium text-[10px] uppercase tracking-wider">Price</th>
                                    <th className="text-right py-1.5 text-slate-400 font-medium text-[10px] uppercase tracking-wider">Tax</th>
                                    <th className="text-right py-1.5 text-slate-400 font-medium text-[10px] uppercase tracking-wider">Total</th>
                                </tr>
                            </thead>
                            <tbody>
                                {items.map((item: any, i: number) => {
                                    if (!item?.itemName) return null;
                                    const qty = Number(item.quantity) || 0;
                                    const price = Number(item.unitPrice) || 0;
                                    const tax = Number(item.tax) || 0;
                                    const total = qty * price + tax;
                                    return (
                                        <tr key={i} className="border-b border-slate-800/50">
                                            <td className="py-2 text-white">
                                                <div>{item.itemName}</div>
                                                {item.description && (
                                                    <div className="text-[10px] text-slate-500 mt-0.5">{item.description}</div>
                                                )}
                                            </td>
                                            <td className="py-2 text-right text-slate-300">{qty}</td>
                                            <td className="py-2 text-right text-slate-300">₹{price}</td>
                                            <td className="py-2 text-right text-slate-300">₹{tax}</td>
                                            <td className="py-2 text-right text-white font-medium">₹{total}</td>
                                        </tr>
                                    );
                                })}
                            </tbody>
                        </table>
                    ) : (
                        <div className="py-6 text-center text-slate-600 text-xs">
                            Start adding items to see them here...
                        </div>
                    )}
                </div>

                {/* Grand Total */}
                <div className="px-6 py-4 flex justify-end">
                    <div className="text-right">
                        <p className="text-[10px] text-slate-500 uppercase tracking-wider mb-0.5">
                            Grand Total
                        </p>
                        <p className="text-2xl font-bold text-emerald-400">
                            ₹{grandTotal.toLocaleString()}
                        </p>
                    </div>
                </div>
            </div>
        </div>
    );
}
