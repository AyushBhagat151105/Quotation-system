import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { quotationApi } from "@/api/quotation";

import {
    CreateQuotationDtoSchema,
    type CreateQuotationDto,
} from "@/types/api";

import { zodResolver } from "@hookform/resolvers/zod";
import {
    useForm,
    useFieldArray,
    type SubmitHandler,
} from "react-hook-form";
import { useNavigate } from "@tanstack/react-router";
import { Loader2, Plus, Trash2 } from "lucide-react";
import { useState } from "react";
import QuotationPreview from "./QuotationPreview";

export default function CreateQuotationForm() {
    const [loading, setLoading] = useState(false);

    const navigate = useNavigate();
    const form = useForm<CreateQuotationDto>({
        resolver: zodResolver(CreateQuotationDtoSchema),
        defaultValues: {
            clientName: "",
            clientEmail: "",
            validityDate: "",
            items: [
                {
                    itemName: "",
                    description: "",
                    quantity: 1,
                    unitPrice: "0",
                    tax: "0",
                },
            ],
        },
    });

    const { register, handleSubmit, control } = form;

    const { fields, append, remove } = useFieldArray({
        control,
        name: "items",
    });

    const onSubmit: SubmitHandler<CreateQuotationDto> = async (values) => {
        try {
            setLoading(true);
            const q = await quotationApi.create(values);

            if (!q) return;

            navigate({
                to: "/dashboard/quotations/$id",
                params: { id: q.id },
            });
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="grid grid-cols-1 xl:grid-cols-2 gap-8 items-start">
            {/* LEFT: Form */}
            <form
                onSubmit={handleSubmit(onSubmit)}
                className="space-y-8"
            >
                {/* Client Information Section */}
                <div className="bg-slate-900 border border-slate-800 rounded-xl p-6">
                    <h2 className="text-lg font-semibold text-white mb-5">
                        Client Information
                    </h2>

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        <div>
                            <label className="block text-sm font-medium text-slate-300 mb-1.5">
                                Client Name
                            </label>
                            <Input
                                placeholder="e.g. Acme Corp"
                                {...register("clientName")}
                                className="bg-slate-800 border-slate-700 text-white placeholder:text-slate-500 focus:border-emerald-500"
                            />
                        </div>

                        <div>
                            <label className="block text-sm font-medium text-slate-300 mb-1.5">
                                Client Email
                            </label>
                            <Input
                                placeholder="client@example.com"
                                type="email"
                                {...register("clientEmail")}
                                className="bg-slate-800 border-slate-700 text-white placeholder:text-slate-500 focus:border-emerald-500"
                            />
                        </div>

                        <div>
                            <label className="block text-sm font-medium text-slate-300 mb-1.5">
                                Validity Date
                            </label>
                            <Input
                                type="date"
                                {...register("validityDate")}
                                className="bg-slate-800 border-slate-700 text-white focus:border-emerald-500 [color-scheme:dark]"
                            />
                        </div>
                    </div>
                </div>

                {/* Quotation Items Section */}
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
                                    {fields.length > 1 && (
                                        <button
                                            type="button"
                                            onClick={() => remove(index)}
                                            className="p-1.5 rounded-md text-slate-500 hover:text-red-400 hover:bg-slate-700 transition-colors"
                                        >
                                            <Trash2 size={16} />
                                        </button>
                                    )}
                                </div>

                                <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                                    <div>
                                        <label className="block text-xs font-medium text-slate-400 mb-1">
                                            Item Name
                                        </label>
                                        <Input
                                            placeholder="e.g. Web Development"
                                            {...register(`items.${index}.itemName` as const)}
                                            className="bg-slate-800 border-slate-700 text-white placeholder:text-slate-500 text-sm focus:border-emerald-500"
                                        />
                                    </div>

                                    <div>
                                        <label className="block text-xs font-medium text-slate-400 mb-1">
                                            Quantity
                                        </label>
                                        <Input
                                            placeholder="1"
                                            type="number"
                                            {...register(`items.${index}.quantity` as const, {
                                                valueAsNumber: true,
                                            })}
                                            className="bg-slate-800 border-slate-700 text-white placeholder:text-slate-500 text-sm focus:border-emerald-500"
                                        />
                                    </div>
                                </div>

                                <div>
                                    <label className="block text-xs font-medium text-slate-400 mb-1">
                                        Description (optional)
                                    </label>
                                    <Input
                                        placeholder="Brief description..."
                                        {...register(`items.${index}.description` as const)}
                                        className="bg-slate-800 border-slate-700 text-white placeholder:text-slate-500 text-sm focus:border-emerald-500"
                                    />
                                </div>

                                <div className="grid grid-cols-2 gap-3">
                                    <div>
                                        <label className="block text-xs font-medium text-slate-400 mb-1">
                                            Unit Price (₹)
                                        </label>
                                        <Input
                                            placeholder="2000"
                                            {...register(`items.${index}.unitPrice` as const)}
                                            className="bg-slate-800 border-slate-700 text-white placeholder:text-slate-500 text-sm focus:border-emerald-500"
                                        />
                                    </div>

                                    <div>
                                        <label className="block text-xs font-medium text-slate-400 mb-1">
                                            Tax (₹)
                                        </label>
                                        <Input
                                            placeholder="0"
                                            {...register(`items.${index}.tax` as const)}
                                            className="bg-slate-800 border-slate-700 text-white placeholder:text-slate-500 text-sm focus:border-emerald-500"
                                        />
                                    </div>
                                </div>
                            </div>
                        ))}

                        <Button
                            type="button"
                            onClick={() =>
                                append({
                                    itemName: "",
                                    description: "",
                                    quantity: 1,
                                    unitPrice: "0",
                                    tax: "0",
                                })
                            }
                            className="w-full py-2.5 bg-slate-800 hover:bg-slate-700 border border-slate-700 border-dashed text-slate-300 font-medium"
                        >
                            <Plus size={16} className="mr-2" /> Add Item
                        </Button>
                    </div>
                </div>

                {/* Submit Button */}
                <Button
                    className="w-full py-3 bg-emerald-600 hover:bg-emerald-500 text-white font-semibold rounded-lg text-base"
                    disabled={loading}
                >
                    {loading ? (
                        <Loader2 className="animate-spin w-5 h-5 text-white" />
                    ) : (
                        "Create Quotation"
                    )}
                </Button>
            </form>

            {/* RIGHT: Live Preview */}
            <QuotationPreview control={control} mode="create" />
        </div>
    );
}
