import { createFileRoute, useParams } from "@tanstack/react-router";
import { useQuery, useMutation } from "@tanstack/react-query";
import { quotationApi } from "@/api/quotation";
import { motion } from "motion/react";
import { toast } from "sonner";
import { Button } from "@/components/ui/button";
import { Loader2, CheckCircle, XCircle, FileText } from "lucide-react";
import { useState } from "react";

export const Route = createFileRoute('/quotation-public/$id')({
  component: RouteComponent,
});

function StatusBadge({ status }: { status: string }) {
  const styles: Record<string, string> = {
    APPROVED: "bg-emerald-500/15 text-emerald-400 border-emerald-500/20",
    REJECTED: "bg-red-500/15 text-red-400 border-red-500/20",
    EXPIRED: "bg-slate-500/15 text-slate-400 border-slate-500/20",
    PENDING: "bg-yellow-500/15 text-yellow-400 border-yellow-500/20",
    SENT: "bg-blue-500/15 text-blue-400 border-blue-500/20",
  };
  return (
    <span className={`inline-flex px-3 py-1 rounded-full text-xs font-medium border ${styles[status] || styles.PENDING}`}>
      {status}
    </span>
  );
}

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
      <div className="min-h-screen flex items-center justify-center bg-slate-950">
        <Loader2 className="animate-spin text-slate-400 w-6 h-6" />
      </div>
    );

  const disabled =
    q.status === "APPROVED" ||
    q.status === "REJECTED" ||
    q.status === "EXPIRED";

  return (
    <div className="min-h-screen bg-slate-950 py-8 px-4 flex justify-center">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="w-full max-w-3xl"
      >
        {/* Header card */}
        <div className="bg-slate-900 border border-slate-800 rounded-xl overflow-hidden">
          {/* Top bar */}
          <div className="px-6 py-5 border-b border-slate-800 flex items-center justify-between">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-lg bg-emerald-500/10 border border-emerald-500/20 flex items-center justify-center">
                <FileText className="w-5 h-5 text-emerald-400" />
              </div>
              <div>
                <h1 className="text-lg font-bold text-white">Quotation</h1>
                <p className="text-xs text-slate-500">#{id.slice(0, 8)}</p>
              </div>
            </div>
            <StatusBadge status={q.status} />
          </div>

          {/* Client info */}
          <div className="px-6 py-5 border-b border-slate-800">
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
              <div>
                <p className="text-xs text-slate-500 uppercase tracking-wider mb-1">Client</p>
                <p className="text-sm text-white font-medium">{q.clientName}</p>
              </div>
              <div>
                <p className="text-xs text-slate-500 uppercase tracking-wider mb-1">Email</p>
                <p className="text-sm text-white font-medium">{q.clientEmail}</p>
              </div>
              <div>
                <p className="text-xs text-slate-500 uppercase tracking-wider mb-1">Status</p>
                <p className="text-sm text-white font-medium">{q.status}</p>
              </div>
            </div>
          </div>

          {/* Items table */}
          <div className="px-6 py-5 border-b border-slate-800">
            <h2 className="text-xs uppercase tracking-wider text-slate-500 font-medium mb-4">Items</h2>
            <div className="overflow-x-auto">
              <table className="w-full text-sm">
                <thead>
                  <tr className="border-b border-slate-800">
                    <th className="text-left py-2 pr-4 text-slate-400 font-medium text-xs uppercase tracking-wider">Item</th>
                    <th className="text-left py-2 pr-4 text-slate-400 font-medium text-xs uppercase tracking-wider">Description</th>
                    <th className="text-right py-2 pr-4 text-slate-400 font-medium text-xs uppercase tracking-wider">Qty</th>
                    <th className="text-right py-2 text-slate-400 font-medium text-xs uppercase tracking-wider">Total</th>
                  </tr>
                </thead>
                <tbody>
                  {q.items.map((i: any) => (
                    <tr key={i.id} className="border-b border-slate-800/50">
                      <td className="py-3 pr-4 text-white font-medium">{i.itemName}</td>
                      <td className="py-3 pr-4 text-slate-400">{i.description || "—"}</td>
                      <td className="py-3 pr-4 text-right text-slate-300">{i.quantity}</td>
                      <td className="py-3 text-right text-white font-medium">₹{i.totalPrice}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>

          {/* Grand total */}
          <div className="px-6 py-5 flex justify-end">
            <div className="text-right">
              <p className="text-xs text-slate-500 uppercase tracking-wider mb-1">Grand Total</p>
              <p className="text-3xl font-bold text-emerald-400">₹{q.totalAmount}</p>
            </div>
          </div>
        </div>

        {/* Client previous comment */}
        {q.clientComment && (
          <div className="mt-6 bg-slate-900 border border-slate-800 rounded-xl p-6">
            <h2 className="text-xs uppercase tracking-wider text-slate-500 font-medium mb-3">Previous Response</h2>
            <p className="text-slate-300 text-sm">"{q.clientComment}"</p>
          </div>
        )}

        {/* Response Buttons */}
        {!disabled && (
          <div className="mt-6 flex flex-col md:flex-row gap-4">
            <Button
              className="flex-1 py-4 bg-emerald-600 hover:bg-emerald-500 text-white text-base font-semibold rounded-xl flex items-center justify-center gap-2"
              onClick={() => respondMutation.mutate({ status: "APPROVED" })}
            >
              <CheckCircle className="w-5 h-5" />
              Approve Quotation
            </Button>

            <Button
              className="flex-1 py-4 bg-red-600/80 hover:bg-red-600 text-white text-base font-semibold rounded-xl flex items-center justify-center gap-2"
              onClick={() => setReasonModal(true)}
            >
              <XCircle className="w-5 h-5" />
              Reject Quotation
            </Button>
          </div>
        )}

        {/* Already responded */}
        {disabled && (
          <div className="mt-6 bg-slate-900 border border-slate-800 rounded-xl p-6 text-center">
            <p className="text-slate-400 text-sm">
              This quotation has already been responded to.
            </p>
          </div>
        )}

        {/* Reject Modal */}
        {reasonModal && (
          <div className="fixed inset-0 bg-black/60 backdrop-blur-sm flex items-center justify-center z-50 px-4">
            <motion.div
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              className="bg-slate-900 border border-slate-700 p-6 rounded-xl w-full max-w-md shadow-2xl"
            >
              <h3 className="text-xl font-bold text-white mb-3">Reason for Rejection</h3>

              <textarea
                className="w-full bg-slate-800 border border-slate-700 rounded-lg p-3 text-white text-sm placeholder:text-slate-500 focus:border-emerald-500 focus:outline-none"
                rows={4}
                placeholder="Tell the sender why you're rejecting..."
                onChange={(e) => setRejectMessage(e.target.value)}
              />

              <div className="flex justify-end gap-3 mt-4">
                <Button
                  variant="ghost"
                  className="text-slate-300 hover:text-white"
                  onClick={() => setReasonModal(false)}
                >
                  Cancel
                </Button>

                <Button
                  className="bg-red-600 hover:bg-red-500 text-white"
                  onClick={() =>
                    respondMutation.mutate({
                      status: "REJECTED",
                      comment: rejectMessage,
                    })
                  }
                  disabled={respondMutation.isPending}
                >
                  {respondMutation.isPending ? (
                    <Loader2 className="animate-spin w-5 h-5" />
                  ) : (
                    "Submit"
                  )}
                </Button>
              </div>
            </motion.div>
          </div>
        )}
      </motion.div>
    </div>
  );
}
