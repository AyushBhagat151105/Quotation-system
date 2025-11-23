import { createFileRoute, useParams } from "@tanstack/react-router";
import { useQuery } from "@tanstack/react-query";
import { quotationApi } from "@/api/quotation";
import EditQuotationForm from "@/components/dashboard/EditQuotationForm";
// import EditQuotationForm from "@/components/dashboard/EditQuotationForm";

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

  if (isLoading) return <div className="p-10 text-white">Loading...</div>;

  return (
    <div className="p-8 text-white">
      <h1 className="text-3xl bg-linear-to-r from-purple-400 to-pink-400 bg-clip-text text-transparent font-bold mb-6">
        Edit Quotation
      </h1>

      <EditQuotationForm quotation={data} />
    </div>
  );
}
