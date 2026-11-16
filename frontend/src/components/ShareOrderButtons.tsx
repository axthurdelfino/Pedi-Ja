import { useState } from "react";
import { toast } from "sonner";
import type { Order } from "../types";
import { enviarPdfWhatsApp } from "../utils/shareOrder";

export default function ShareOrderButtons({ pedido }: { pedido: Order }) {
  const [busy, setBusy] = useState(false);

  function share() {
    setBusy(true);
    enviarPdfWhatsApp(pedido)
      .then((result) => {
        if (result === "downloaded") {
          toast.success("PDF baixado. O WhatsApp foi aberto para o cliente.");
        }
      })
      .catch((error: unknown) => {
        if (error instanceof DOMException && error.name === "AbortError") return;
        toast.error("Não foi possível compartilhar o PDF do pedido.");
      })
      .finally(() => setBusy(false));
  }

  return (
    <div className="order-share-actions" aria-label={`Compartilhar pedido #${pedido.id}`}>
      <button
        type="button"
        className="outline-button share-button share-whatsapp"
        disabled={busy}
        title="Enviar o PDF do pedido pelo WhatsApp"
        onClick={share}
      >
        {busy ? "Preparando PDF…" : "Enviar PDF via WhatsApp"}
      </button>
    </div>
  );
}
