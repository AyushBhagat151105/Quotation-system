import { quotationApi } from "@/api/quotation";
import { useParams, createFileRoute } from "@tanstack/react-router";

export const Route = createFileRoute("/quotation-public/$id-response")({
  component: RouteComponent,
});

function RouteComponent() {
  const { "id-response": id } = useParams({ from: "/quotation-public/$id-response" });

  const approve = () =>
    quotationApi.clientRespond(id, { status: "APPROVED" });

  const reject = () =>
    quotationApi.clientRespond(id, { status: "REJECTED" });

  return (
    <div className="min-h-screen flex flex-col items-center justify-center text-white">
      <h1 className="text-3xl mb-6">Respond to Quotation</h1>

      <div className="flex gap-6">
        <button
          onClick={approve}
          className="px-6 py-3 bg-green-600 rounded-lg"
        >
          Approve
        </button>

        <button
          onClick={reject}
          className="px-6 py-3 bg-red-600 rounded-lg"
        >
          Reject
        </button>
      </div>
    </div>
  );
}
