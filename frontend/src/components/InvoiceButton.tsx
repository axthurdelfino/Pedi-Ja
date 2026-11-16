import { useState } from "react";
import { toast } from "sonner";
import type { Order } from "../types";
import { baixarInvoicePdf } from "../utils/invoice";

export default function InvoiceButton({ pedido }: { pedido: Order }) {
  const [busy, setBusy] = useState(false);

  function download() {
    setBusy(true);
    try {
      baixarInvoicePdf(pedido);
      toast.success("Invoice PDF baixado.");
    } catch {
      toast.error("Não foi possível gerar o invoice do pedido.");
    } finally {
      setBusy(false);
    }
  }

  return (
    <div
      className="order-invoice-actions"
      aria-label={`Invoice do pedido #${pedido.id}`}
    >
      <button
        type="button"
        className="outline-button invoice-button"
        disabled={busy}
        title="Gerar e baixar o invoice em PDF"
        onClick={download}
      >
        {busy ? "Gerando invoice…" : "Baixar invoice PDF"}
      </button>
    </div>
  );
}
