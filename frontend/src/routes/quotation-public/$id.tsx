import { createFileRoute, useParams } from "@tanstack/react-router";
import { useQuery, useMutation } from "@tanstack/react-query";
import { quotationApi } from "@/api/quotation";
import { motion } from "motion/react";
import { toast } from "sonner";
import { Button } from "@/components/ui/button";
import { Loader2, CheckCircle, XCircle } from "lucide-react";
import { useState } from "react";

export const Route = createFileRoute('/quotation-public/$id')({
  component: RouteComponent,
});

function RouteComponent() {
  const { id } = useParams({ from: "/quotation-public/$id" });

  const [reasonModal, setReasonModal] = useState(false);
  const [rejectMessage, setRejectMessage] = useState("");

  const query = useQuery({
    queryKey: ["quotation-public", id],
    queryFn: () => quotationApi.publicView(id).then((r) => r.data),
  });

  const { data: q, isLoading } = query;

  const respondMutation = useMutation({
    mutationFn: (payload: { status: "APPROVED" | "REJECTED"; comment?: string }) =>
      quotationApi.clientRespond(id, payload),
    onSuccess: () => {
      toast.success("Response submitted!");
      query.refetch();
      setReasonModal(false);
    },
  });

  if (isLoading)
    return (
      <div className="text-white p-10 flex justify-center">
        <Loader2 className="animate-spin" />
      </div>
    );

  const disabled =
    q.status === "APPROVED" ||
    q.status === "REJECTED" ||
    q.status === "EXPIRED";

  return (
    <div className="min-h-screen p-8 text-white flex justify-center">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="w-full max-w-2xl bg-white/5 p-8 rounded-2xl border border-white/10 backdrop-blur-xl shadow-xl"
      >
        {/* Title */}
        <h1 className="text-4xl font-bold text-center 
          bg-linear-to-r from-pink-400 to-purple-400 bg-clip-text text-transparent mb-6">
          Quotation Preview
        </h1>

        {/* Client Info */}
        <div className="space-y-2">
          <p><strong>Client:</strong> {q.clientName}</p>
          <p><strong>Email:</strong> {q.clientEmail}</p>
          <p><strong>Status:</strong> {q.status}</p>
          <p><strong>Total:</strong> ₹{q.totalAmount}</p>
        </div>

        {/* Items */}
        <h2 className="text-xl font-semibold mt-6">Items</h2>
        <div className="space-y-3">
          {q.items.map((i: any) => (
            <div key={i.id} className="p-4 bg-white/10 rounded-lg">
              <p className="font-bold">{i.itemName}</p>
              <p className="text-white/70">{i.description}</p>
              <p>Qty: {i.quantity}</p>
              <p>Total: ₹{i.totalPrice}</p>
            </div>
          ))}
        </div>

        {/* Previous client message */}
        {q.clientComment && (
          <div className="mt-6 p-4 bg-red-500/20 border border-red-400/30 rounded-lg">
            <p className="font-semibold text-red-300 mb-1">Client Response:</p>
            <p className="text-red-200">{q.clientComment}</p>
          </div>
        )}

        {/* Response Buttons */}
        <div className="mt-8 flex flex-col md:flex-row gap-4 justify-center">
          {/* Approve */}
          <Button
            disabled={disabled}
            className="flex items-center gap-2 bg-green-600 hover:bg-green-700 w-full md:w-auto"
            onClick={() => respondMutation.mutate({ status: "APPROVED" })}
          >
            <CheckCircle className="w-5 h-5" />
            Approve
          </Button>

          {/* Reject */}
          <Button
            disabled={disabled}
            className="flex items-center gap-2 bg-red-600 hover:bg-red-700 w-full md:w-auto"
            onClick={() => setReasonModal(true)}
          >
            <XCircle className="w-5 h-5" />
            Reject
          </Button>
        </div>

        {/* Already responded message */}
        {disabled && (
          <p className="text-center text-white/60 mt-4">
            You have already responded to this quotation.
          </p>
        )}

        {/* Reject Modal */}
        {reasonModal && (
          <div className="fixed inset-0 bg-black/60 backdrop-blur-sm flex items-center justify-center z-50">
            <motion.div
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              className="bg-white/10 border border-white/20 p-6 rounded-xl w-full max-w-md backdrop-blur-xl shadow-2xl"
            >
              <h3 className="text-xl font-bold mb-3">Reason for Rejection</h3>

              <textarea
                className="w-full bg-white/10 border border-white/20 rounded-lg p-3 text-white"
                rows={4}
                placeholder="Write your reason..."
                onChange={(e) => setRejectMessage(e.target.value)}
              />

              <div className="flex justify-end gap-3 mt-4">
                <Button
                  variant="ghost"
                  className="text-white"
                  onClick={() => setReasonModal(false)}
                >
                  Cancel
                </Button>

                <Button
                  className="bg-red-600 hover:bg-red-700"
                  onClick={() =>
                    respondMutation.mutate({
                      status: "REJECTED",
                      comment: rejectMessage,
                    })
                  }
                >
                  Submit
                </Button>
              </div>
            </motion.div>
          </div>
        )}
      </motion.div>
    </div>
  );
}
