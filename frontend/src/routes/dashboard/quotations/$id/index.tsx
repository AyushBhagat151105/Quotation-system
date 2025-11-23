import { createFileRoute, useParams } from "@tanstack/react-router";
import { useQuery } from "@tanstack/react-query";
import { quotationApi } from "@/api/quotation";
import { useState } from "react";
import { Loader2, Send } from "lucide-react";
import { Button } from "@/components/ui/button";
import { toast } from "sonner";
import SendMailAnimation from "@/components/animations/SendMailAnimation";
import { motion } from "motion/react";

export const Route = createFileRoute('/dashboard/quotations/$id/')({
  component: RouteComponent,
});

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
      <div className="flex justify-center p-10">
        <Loader2 className="animate-spin text-white" />
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
    <div className="p-8 text-white">

      {/* Title Row */}
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-4xl font-bold bg-linear-to-r from-pink-400 to-purple-400 bg-clip-text text-transparent">
          Quotation Details
        </h1>

        <Button
          onClick={() => setShowSendModal(true)}
          className="bg-linear-to-r from-blue-500 to-purple-600 shadow-lg hover:opacity-90 flex items-center gap-2"
        >
          <Send className="w-4 h-4" />
          Send Email
        </Button>
      </div>

      {/* CONTENT BOX */}
      <div className="bg-white/5 p-6 rounded-xl border border-white/10 backdrop-blur-xl space-y-4">
        <p><strong>Client:</strong> {q.clientName}</p>
        <p><strong>Email:</strong> {q.clientEmail}</p>
        <p><strong>Status:</strong> {q.status}</p>
        <p><strong>Total:</strong> ₹{q.totalAmount}</p>

        <h2 className="text-xl font-semibold mt-4">Items</h2>
        <div className="space-y-3">
          {q.items.map((it: any) => (
            <div key={it.id} className="p-4 bg-white/10 rounded-lg">
              <p className="font-bold">{it.itemName}</p>
              <p className="text-white/70">{it.description}</p>
              <p>Qty: {it.quantity}</p>
              <p>Unit: ₹{it.unitPrice}</p>
              <p>Total: ₹{it.totalPrice}</p>
            </div>
          ))}

        </div>

        {latestResponse && (
          <div className="p-4 bg-red-500/20 border border-red-400/30 rounded-lg mt-4">
            <p className="text-red-300 font-semibold">Client Response:</p>

            <p className="text-red-200 mt-1">
              Status: {latestResponse.status}
            </p>

            {latestResponse.rejectionComment && (
              <p className="text-red-200 mt-2">
                Message: {latestResponse.rejectionComment}
              </p>
            )}

            <p className="text-white/50 text-xs mt-2">
              At: {new Date(latestResponse.respondedAt).toLocaleString()}
            </p>

            {latestResponse.clientIp && (
              <p className="text-white/50 text-xs">
                IP: {latestResponse.clientIp}
              </p>
            )}

            {latestResponse.userAgent && (
              <p className="text-white/50 text-xs">
                Device: {latestResponse.userAgent}
              </p>
            )}
          </div>
        )}


      </div>

      {/* SEND EMAIL MODAL */}
      {showSendModal && (
        <div
          className="fixed inset-0 bg-black/60 backdrop-blur-sm flex items-center justify-center z-50"
          aria-modal="true"
          role="dialog"
        >
          <motion.div
            initial={{ opacity: 0, scale: 0.95, y: 12 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.95 }}
            transition={{ duration: 0.18 }}
            className="bg-white/10 border border-white/20 p-6 rounded-xl w-full max-w-md 
                 backdrop-blur-xl shadow-2xl relative"
          >
            <h2 className="text-2xl font-bold mb-2">Send Quotation</h2>
            <p className="text-white/70 text-sm mb-4">
              This will be sent to:
            </p>

            <div className="p-3 rounded-lg bg-white/10 border border-white/20 mb-4 text-white">
              {q.clientEmail}
            </div>

            <SendMailAnimation success={sendSuccess} />

            <div className="mt-4 flex justify-between items-center gap-3">
              <div className="text-sm text-white/80">
                {sendSuccess ? "Sent successfully" : loading ? "Sending..." : "Ready to send"}
              </div>

              <div className="flex gap-3">
                <Button
                  variant="ghost"
                  className="text-white"
                  onClick={() => {
                    if (!loading) setShowSendModal(false);
                  }}
                >
                  Cancel
                </Button>

                <Button
                  disabled={loading || sendSuccess}
                  onClick={sendEmail}
                  className="bg-linear-to-r from-purple-500 to-pink-600"
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
