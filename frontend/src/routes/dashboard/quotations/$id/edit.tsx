import { createFileRoute, useParams } from "@tanstack/react-router";
import { useQuery } from "@tanstack/react-query";
import { quotationApi } from "@/api/quotation";
import EditQuotationForm from "@/components/dashboard/EditQuotationForm";
import { Loader2 } from "lucide-react";

export const Route = createFileRoute('/dashboard/quotations/$id/edit')({
  component: RouteComponent,
});

function RouteComponent() {
  const { id } = useParams({
    from: "/dashboard/quotations/$id/edit",
  });

  const { data, isLoading } = useQuery({
    queryKey: ["quotation-edit", id],
    queryFn: () => quotationApi.getOne(id).then((r) => r.data),
  });

  if (isLoading)
    return (
      <div className="flex items-center justify-center p-20">
        <Loader2 className="animate-spin text-slate-400 w-6 h-6" />
      </div>
    );

  return (
    <div className="p-6 lg:p-8">
      <h1 className="text-2xl font-bold text-white mb-6">
        Edit Quotation
      </h1>
      <EditQuotationForm quotation={data} />
    </div>
  );
}
