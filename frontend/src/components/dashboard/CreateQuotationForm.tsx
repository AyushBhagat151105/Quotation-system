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
import { Loader2 } from "lucide-react";
import { useState } from "react";

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
        <form
            onSubmit={handleSubmit(onSubmit)}
            className="space-y-6 bg-white/5 backdrop-blur-xl p-6 rounded-xl border border-white/10 shadow-xl"
        >
            <h2 className="text-2xl font-bold bg-linear-to-r from-pink-400 to-purple-400 bg-clip-text text-transparent">
                Create New Quotation
            </h2>

            {/* Client Name */}
            <Input
                placeholder="Client Name"
                {...register("clientName")}
                className="bg-white/10 border-white/20 text-white"
            />

            {/* Client Email */}
            <Input
                placeholder="Client Email"
                {...register("clientEmail")}
                className="bg-white/10 border-white/20 text-white"
            />

            {/* Validity Date */}
            <Input
                type="date"
                {...register("validityDate")}
                className="bg-white/10 border-white/20 text-white"
            />

            {/* Items Section */}
            <div className="space-y-4">
                <h3 className="text-lg font-semibold text-white/90">
                    Quotation Items
                </h3>

                {fields.map((item, index) => (
                    <div
                        key={item.id}
                        className="p-4 border border-white/10 rounded-lg bg-white/5 space-y-3"
                    >
                        <div className="grid grid-cols-2 gap-3">
                            <Input
                                placeholder="Item Name"
                                {...register(`items.${index}.itemName` as const)}
                                className="bg-white/10 border-white/20 text-white"
                            />

                            <Input
                                placeholder="Quantity"
                                type="number"
                                {...register(`items.${index}.quantity` as const, {
                                    valueAsNumber: true,
                                })}
                                className="bg-white/10 border-white/20 text-white"
                            />
                        </div>

                        <Input
                            placeholder="Description (optional)"
                            {...register(`items.${index}.description` as const)}
                            className="bg-white/10 border-white/20 text-white"
                        />

                        <div className="grid grid-cols-2 gap-3">
                            <Input
                                placeholder="Unit Price (e.g., 2000)"
                                {...register(`items.${index}.unitPrice` as const)}
                                className="bg-white/10 border-white/20 text-white"
                            />

                            <Input
                                placeholder="Tax (optional)"
                                {...register(`items.${index}.tax` as const)}
                                className="bg-white/10 border-white/20 text-white"
                            />
                        </div>

                        {fields.length > 1 && (
                            <Button
                                type="button"
                                variant="destructive"
                                onClick={() => remove(index)}
                                className="w-full bg-red-500/40 hover:bg-red-500/60"
                            >
                                Remove Item
                            </Button>
                        )}
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
                    className="w-full bg-linear-to-r from-purple-500 to-pink-600"
                >
                    + Add Item
                </Button>
            </div>

            {/* Submit Button */}
            <Button
                className="w-full py-3 text-lg bg-linear-to-r from-pink-500 to-purple-600 hover:opacity-90"
                disabled={loading}
            >
                {loading ? (
                    <Loader2 className="animate-spin w-5 h-5 text-white" />
                ) : (
                    "Create Quotation"
                )}
            </Button>

        </form>
    );
}
