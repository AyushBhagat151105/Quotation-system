import { useForm, useFieldArray } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import {
    UpdateQuotationDtoSchema,
    type UpdateQuotationDto,
} from "@/types/api";
import { quotationApi } from "@/api/quotation";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { toast } from "sonner";
import { Plus, Trash2 } from "lucide-react";
import QuotationPreview from "./QuotationPreview";

export default function EditQuotationForm({ quotation }: { quotation: any }) {
    const form = useForm<UpdateQuotationDto>({
        resolver: zodResolver(UpdateQuotationDtoSchema),
        defaultValues: {
            validityDate: quotation.validityDate?.slice(0, 10),
            items: quotation.items.map((it: any) => ({
                itemName: it.itemName,
                description: it.description,
                quantity: Number(it.quantity),
                unitPrice: String(it.unitPrice),
                tax: String(it.tax ?? "0"),
            })),
        },
    });

    const { fields, append, remove } = useFieldArray({
        control: form.control,
        name: "items",
    });

    const submit = async (values: UpdateQuotationDto) => {
        await quotationApi.update(quotation.id, values);
        toast.success("Quotation updated!");
    };

    return (
        <div className="grid grid-cols-1 xl:grid-cols-2 gap-8 items-start">
            {/* LEFT: Form */}
            <form
                onSubmit={form.handleSubmit(submit)}
                className="space-y-8"
            >
                {/* Client Info (read-only context) */}
                <div className="bg-slate-900 border border-slate-800 rounded-xl p-6">
                    <h2 className="text-lg font-semibold text-white mb-4">
                        Client Information
                    </h2>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-sm">
                        <div>
                            <p className="text-slate-400 text-xs mb-1">Client Name</p>
                            <p className="text-white font-medium">{quotation.clientName}</p>
                        </div>
                        <div>
                            <p className="text-slate-400 text-xs mb-1">Client Email</p>
                            <p className="text-white font-medium">{quotation.clientEmail}</p>
                        </div>
                    </div>

                    <div className="mt-4">
                        <label className="block text-sm font-medium text-slate-300 mb-1.5">
                            Validity Date
                        </label>
                        <Input
                            type="date"
                            {...form.register("validityDate")}
                            className="bg-slate-800 border-slate-700 text-white focus:border-emerald-500 [color-scheme:dark] max-w-xs"
                        />
                    </div>
                </div>

                {/* Items Section */}
                <div className="bg-slate-900 border border-slate-800 rounded-xl p-6">
                    <div className="flex items-center justify-between mb-5">
                        <h2 className="text-lg font-semibold text-white">
                            Quotation Items
                        </h2>
                        <span className="text-sm text-slate-500">{fields.length} item(s)</span>
                    </div>

                    <div className="space-y-4">
                        {fields.map((item, index) => (
                            <div
                                key={item.id}
                                className="p-5 border border-slate-700/50 rounded-lg bg-slate-800/50 space-y-4"
                            >
                                <div className="flex items-center justify-between">
                                    <span className="text-sm font-medium text-slate-400">
                                        Item #{index + 1}
                                    </span>
                                    <button
                                        type="button"
                                        onClick={() => remove(index)}
                                        className="p-1.5 rounded-md text-slate-500 hover:text-red-400 hover:bg-slate-700 transition-colors"
                                    >
                                        <Trash2 size={16} />
                                    </button>
                                </div>

                                <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                                    <div>
                                        <label className="block text-xs font-medium text-slate-400 mb-1">
                                            Item Name
                                        </label>
                                        <Input
                                            placeholder="Item Name"
                                            {...form.register(`items.${index}.itemName`)}
                                            className="bg-slate-800 border-slate-700 text-white text-sm focus:border-emerald-500"
                                        />
                                    </div>

                                    <div>
                                        <label className="block text-xs font-medium text-slate-400 mb-1">
                                            Quantity
                                        </label>
                                        <Input
                                            type="number"
                                            placeholder="1"
                                            {...form.register(`items.${index}.quantity`, { valueAsNumber: true })}
                                            className="bg-slate-800 border-slate-700 text-white text-sm focus:border-emerald-500"
                                        />
                                    </div>
                                </div>

                                <div>
                                    <label className="block text-xs font-medium text-slate-400 mb-1">
                                        Description
                                    </label>
                                    <Input
                                        placeholder="Description"
                                        {...form.register(`items.${index}.description`)}
                                        className="bg-slate-800 border-slate-700 text-white text-sm focus:border-emerald-500"
                                    />
                                </div>

                                <div className="grid grid-cols-2 gap-3">
                                    <div>
                                        <label className="block text-xs font-medium text-slate-400 mb-1">
                                            Unit Price (₹)
                                        </label>
                                        <Input
                                            placeholder="0"
                                            {...form.register(`items.${index}.unitPrice`)}
                                            className="bg-slate-800 border-slate-700 text-white text-sm focus:border-emerald-500"
                                        />
                                    </div>

                                    <div>
                                        <label className="block text-xs font-medium text-slate-400 mb-1">
                                            Tax (₹)
                                        </label>
                                        <Input
                                            placeholder="0"
                                            {...form.register(`items.${index}.tax`)}
                                            className="bg-slate-800 border-slate-700 text-white text-sm focus:border-emerald-500"
                                        />
                                    </div>
                                </div>
                            </div>
                        ))}

                        <Button
                            type="button"
                            className="w-full py-2.5 bg-slate-800 hover:bg-slate-700 border border-slate-700 border-dashed text-slate-300 font-medium"
                            onClick={() =>
                                append({
                                    itemName: "",
                                    description: "",
                                    quantity: 1,
                                    unitPrice: "0",
                                    tax: "0",
                                })
                            }
                        >
                            <Plus size={16} className="mr-2" /> Add Item
                        </Button>
                    </div>
                </div>

                {/* Save Button */}
                <Button className="w-full py-3 bg-emerald-600 hover:bg-emerald-500 text-white font-semibold rounded-lg text-base">
                    Save Changes
                </Button>
            </form>

            {/* RIGHT: Live Preview */}
            <QuotationPreview
                control={form.control}
                clientName={quotation.clientName}
                clientEmail={quotation.clientEmail}
                mode="edit"
            />
        </div>
    );
}
