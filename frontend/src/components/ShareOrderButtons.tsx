import { useState } from "react";
import { toast } from "sonner";
import type { Order } from "../types";
import {
  baixarPdfPedido,
  compartilharNoWhatsApp,
  compartilharPdfPedido,
} from "../utils/shareOrder";

type Action = "whatsapp" | "share" | "download" | null;

export default function ShareOrderButtons({ pedido }: { pedido: Order }) {
  const [busy, setBusy] = useState<Action>(null);

  function run(action: Exclude<Action, null>, operation: () => void | Promise<void>) {
    setBusy(action);
    const handleError = (error: unknown) => {
      if (error instanceof DOMException && error.name === "AbortError") return;
      toast.error("Não foi possível compartilhar o pedido.");
    };

    try {
      Promise.resolve(operation())
        .catch(handleError)
        .finally(() => setBusy(null));
    } catch (error) {
      handleError(error);
      setBusy(null);
    }
  }

  return (
    <div className="order-share-actions" aria-label={`Compartilhar pedido #${pedido.id}`}>
      <button
        type="button"
        className="outline-button share-button share-whatsapp"
        disabled={busy !== null}
        title="Enviar resumo pelo WhatsApp"
        onClick={() => run("whatsapp", () => compartilharNoWhatsApp(pedido, pedido.clienteTelefone))}
      >
        {busy === "whatsapp" ? "Abrindo…" : "WhatsApp"}
      </button>
      <button
        type="button"
        className="outline-button share-button"
        disabled={busy !== null}
        title="Compartilhar o PDF do pedido"
        onClick={() => run("share", () => compartilharPdfPedido(pedido))}
      >
        {busy === "share" ? "Gerando…" : "Compartilhar PDF"}
      </button>
      <button
        type="button"
        className="outline-button share-button"
        disabled={busy !== null}
        title="Baixar o PDF do pedido"
        onClick={() => run("download", () => baixarPdfPedido(pedido))}
      >
        {busy === "download" ? "Gerando…" : "Baixar PDF"}
      </button>
    </div>
  );
}
