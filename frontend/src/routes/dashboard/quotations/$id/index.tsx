import { createFileRoute, useParams } from "@tanstack/react-router";
import { useQuery } from "@tanstack/react-query";
import { quotationApi } from "@/api/quotation";
import { useState } from "react";
import { Loader2, Send, User, Mail, Calendar, Hash } from "lucide-react";
import { Button } from "@/components/ui/button";
import { toast } from "sonner";
import SendMailAnimation from "@/components/animations/SendMailAnimation";
import { motion } from "motion/react";

export const Route = createFileRoute('/dashboard/quotations/$id/')({
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
  const { id } = useParams({ from: "/dashboard/quotations/$id/" });

  const [showSendModal, setShowSendModal] = useState(false);
  const [loading, setLoading] = useState(false);
  const [sendSuccess, setSendSuccess] = useState(false);

  const { data, isLoading } = useQuery({
    queryKey: ["quotation", id],
    queryFn: () => quotationApi.getOne(id).then((r) => r.data),
  });

  if (isLoading)
    return (
      <div className="flex justify-center p-20">
        <Loader2 className="animate-spin text-slate-400 w-6 h-6" />
      </div>
    );

  const q = data;

  const latestResponse = q.responses?.filter(
    (r: any) => r.status === "APPROVED" || r.status === "REJECTED"
  )?.slice(-1)[0];

  const sendEmail = async () => {
    if (!q?.clientEmail) {
      toast.error("Quotation missing client email");
      return;
    }

    setLoading(true);
    setSendSuccess(false);

    try {
      await quotationApi.sendEmail(id, q.clientEmail);
      setSendSuccess(true);
      setTimeout(() => {
        setShowSendModal(false);
        setSendSuccess(false);
      }, 1400);
    } catch (err) {
      console.error(err);
      toast.error("Failed to send email. Try again.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="p-6 lg:p-8">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-6">
        <div>
          <h1 className="text-2xl font-bold text-white">Quotation Details</h1>
          <p className="text-slate-400 text-sm mt-1">Quotation #{id.slice(0, 8)}</p>
        </div>

        <div className="flex items-center gap-3">
          <StatusBadge status={q.status} />
          <Button
            onClick={() => setShowSendModal(true)}
            className="bg-emerald-600 hover:bg-emerald-500 text-white text-sm font-medium flex items-center gap-2"
          >
            <Send className="w-4 h-4" />
            Send Email
          </Button>
        </div>
      </div>

      {/* Invoice-style card */}
      <div className="bg-slate-900 border border-slate-800 rounded-xl overflow-hidden">
        {/* Client Info */}
        <div className="p-6 border-b border-slate-800">
          <h2 className="text-xs uppercase tracking-wider text-slate-500 font-medium mb-4">Client Information</h2>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div className="flex items-start gap-3 min-w-0">
              <div className="w-8 h-8 rounded-lg bg-slate-800 flex items-center justify-center flex-shrink-0">
                <User size={14} className="text-slate-400" />
              </div>
              <div className="min-w-0">
                <p className="text-xs text-slate-500">Client</p>
                <p className="text-sm text-white font-medium truncate">{q.clientName}</p>
              </div>
            </div>
            <div className="flex items-start gap-3 min-w-0">
              <div className="w-8 h-8 rounded-lg bg-slate-800 flex items-center justify-center flex-shrink-0">
                <Mail size={14} className="text-slate-400" />
              </div>
              <div className="min-w-0">
                <p className="text-xs text-slate-500">Email</p>
                <p className="text-sm text-white font-medium truncate">{q.clientEmail}</p>
              </div>
            </div>
            <div className="flex items-start gap-3">
              <div className="w-8 h-8 rounded-lg bg-slate-800 flex items-center justify-center flex-shrink-0">
                <Calendar size={14} className="text-slate-400" />
              </div>
              <div>
                <p className="text-xs text-slate-500">Valid Until</p>
                <p className="text-sm text-white font-medium">
                  {q.validityDate ? new Date(q.validityDate).toLocaleDateString() : "—"}
                </p>
              </div>
            </div>
            <div className="flex items-start gap-3">
              <div className="w-8 h-8 rounded-lg bg-slate-800 flex items-center justify-center flex-shrink-0">
                <Hash size={14} className="text-slate-400" />
              </div>
              <div>
                <p className="text-xs text-slate-500">Items</p>
                <p className="text-sm text-white font-medium">{q.items.length}</p>
              </div>
            </div>
          </div>
        </div>

        {/* Items table */}
        <div className="p-6 border-b border-slate-800">
          <h2 className="text-xs uppercase tracking-wider text-slate-500 font-medium mb-4">Items</h2>
          <div className="overflow-x-auto">
            <table className="w-full text-sm">
              <thead>
                <tr className="border-b border-slate-800">
                  <th className="text-left py-2 pr-4 text-slate-400 font-medium text-xs uppercase tracking-wider">Item</th>
                  <th className="text-left py-2 pr-4 text-slate-400 font-medium text-xs uppercase tracking-wider">Description</th>
                  <th className="text-right py-2 pr-4 text-slate-400 font-medium text-xs uppercase tracking-wider">Qty</th>
                  <th className="text-right py-2 pr-4 text-slate-400 font-medium text-xs uppercase tracking-wider">Unit Price</th>
                  <th className="text-right py-2 pr-4 text-slate-400 font-medium text-xs uppercase tracking-wider">Tax</th>
                  <th className="text-right py-2 text-slate-400 font-medium text-xs uppercase tracking-wider">Total</th>
                </tr>
              </thead>
              <tbody>
                {q.items.map((it: any) => (
                  <tr key={it.id} className="border-b border-slate-800/50">
                    <td className="py-3 pr-4 text-white font-medium">{it.itemName}</td>
                    <td className="py-3 pr-4 text-slate-400">{it.description || "—"}</td>
                    <td className="py-3 pr-4 text-right text-slate-300">{it.quantity}</td>
                    <td className="py-3 pr-4 text-right text-slate-300">₹{it.unitPrice}</td>
                    <td className="py-3 pr-4 text-right text-slate-300">₹{it.tax || 0}</td>
                    <td className="py-3 text-right text-white font-medium">₹{it.totalPrice}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>

        {/* Total */}
        <div className="p-6 flex justify-end">
          <div className="text-right">
            <p className="text-xs text-slate-500 uppercase tracking-wider mb-1">Grand Total</p>
            <p className="text-3xl font-bold text-emerald-400">₹{q.totalAmount}</p>
          </div>
        </div>
      </div>

      {/* Client Response */}
      {latestResponse && (
        <div className="mt-6 bg-slate-900 border border-slate-800 rounded-xl p-6">
          <h2 className="text-xs uppercase tracking-wider text-slate-500 font-medium mb-4">Client Response</h2>
          <div className="flex items-start gap-4">
            <StatusBadge status={latestResponse.status} />
            <div className="flex-1 space-y-2">
              {latestResponse.rejectionComment && (
                <p className="text-slate-300 text-sm">
                  "{latestResponse.rejectionComment}"
                </p>
              )}
              <div className="flex flex-wrap gap-4 text-xs text-slate-500">
                <span>
                  At: {new Date(latestResponse.respondedAt).toLocaleString()}
                </span>
                {latestResponse.clientIp && (
                  <span>IP: {latestResponse.clientIp}</span>
                )}
              </div>
            </div>
          </div>
        </div>
      )}

      {/* SEND EMAIL MODAL */}
      {showSendModal && (
        <div
          className="fixed inset-0 bg-black/60 backdrop-blur-sm flex items-center justify-center z-50"
          aria-modal="true"
          role="dialog"
        >
          <motion.div
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.15 }}
            className="bg-slate-900 border border-slate-700 p-6 rounded-xl w-full max-w-md shadow-2xl"
          >
            <h2 className="text-xl font-bold text-white mb-2">Send Quotation</h2>
            <p className="text-slate-400 text-sm mb-4">This will be sent to:</p>

            <div className="p-3 rounded-lg bg-slate-800 border border-slate-700 mb-4 text-white text-sm">
              {q.clientEmail}
            </div>

            <SendMailAnimation success={sendSuccess} />

            <div className="mt-4 flex justify-between items-center gap-3">
              <div className="text-sm text-slate-400">
                {sendSuccess ? "Sent successfully" : loading ? "Sending..." : "Ready to send"}
              </div>

              <div className="flex gap-3">
                <Button
                  variant="ghost"
                  className="text-slate-300 hover:text-white"
                  onClick={() => { if (!loading) setShowSendModal(false); }}
                >
                  Cancel
                </Button>

                <Button
                  disabled={loading || sendSuccess}
                  onClick={sendEmail}
                  className="bg-emerald-600 hover:bg-emerald-500 text-white"
                >
                  {loading ? "Sending..." : sendSuccess ? "Sent" : "Send Email"}
                </Button>
              </div>
            </div>
          </motion.div>
        </div>
      )}
    </div>
  );
}
