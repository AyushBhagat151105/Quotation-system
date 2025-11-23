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
        <form
            onSubmit={form.handleSubmit(submit)}
            className="space-y-6 bg-white/5 p-6 rounded-xl border border-white/10 backdrop-blur-xl"
        >
            {/* Validity Date */}
            <div>
                <label className="text-white text-sm">Validity Date</label>
                <Input
                    type="date"
                    {...form.register("validityDate")}
                    className="bg-white/10 text-white"
                />
            </div>

            {/* ITEMS */}
            <div className="space-y-4">
                <h3 className="text-xl font-semibold">Items</h3>

                {fields.map((item, index) => (
                    <div
                        key={item.id}
                        className="p-4 bg-white/10 border border-white/10 rounded-xl space-y-3"
                    >
                        <Input
                            placeholder="Item Name"
                            {...form.register(`items.${index}.itemName`)}
                            className="bg-white/10 text-white"
                        />

                        <Input
                            placeholder="Description"
                            {...form.register(`items.${index}.description`)}
                            className="bg-white/10 text-white"
                        />

                        <Input
                            type="number"
                            placeholder="Quantity"
                            {...form.register(`items.${index}.quantity`, { valueAsNumber: true })}
                            className="bg-white/10 text-white"
                        />

                        <Input
                            placeholder="Unit Price"
                            {...form.register(`items.${index}.unitPrice`)}
                            className="bg-white/10 text-white"
                        />

                        <Input
                            placeholder="Tax"
                            {...form.register(`items.${index}.tax`)}
                            className="bg-white/10 text-white"
                        />

                        <Button
                            type="button"
                            variant="destructive"
                            className="bg-red-700/50"
                            onClick={() => remove(index)}
                        >
                            Remove
                        </Button>
                    </div>
                ))}

                <Button
                    type="button"
                    className="bg-linear-to-r from-blue-500 to-purple-600"
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
                    + Add Item
                </Button>
            </div>

            <Button className="w-full bg-linear-to-r from-pink-500 to-purple-600">
                Save Changes
            </Button>
        </form>
    );
}
