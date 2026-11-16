import jsPDF from "jspdf";
import type { Order, OrderStatus, PaymentMethod } from "../types";
import { dateTime, money } from "./format";

const statusLabel: Record<OrderStatus, string> = {
  PENDENTE: "Pendente",
  PAGO: "Pago",
  ENVIADO: "Enviado",
  CANCELADO: "Cancelado",
};

const paymentLabel: Record<PaymentMethod, string> = {
  PIX: "PIX",
  CARTAO: "Cartão",
  DINHEIRO: "Dinheiro",
};

export function orderFileName(order: Order) {
  return `pedido-${order.id}.pdf`;
}

export function orderShareText(order: Order) {
  const items = order.items.length
    ? order.items.map(
        (item) =>
          `• ${item.quantidade}x ${item.produtoNome} — ${money(item.subtotal)}`,
      )
    : ["• Nenhum item informado"];

  return [
    `*PediJá — Pedido #${order.id}*`,
    `Cliente: ${order.clienteNome || `Cliente #${order.clienteId}`}`,
    `Data: ${dateTime(order.dataPedido)}`,
    `Status: ${statusLabel[order.status]}`,
    `Pagamento: ${paymentLabel[order.paymentMethod]}`,
    "",
    "*Itens:*",
    ...items,
    "",
    `*Total: ${money(order.valorTotal)}*`,
  ].join("\n");
}

function phoneDigits(phone?: string) {
  const digits = phone?.replace(/\D/g, "") || "";
  return digits.length === 10 || digits.length === 11 ? `55${digits}` : digits;
}

export function compartilharNoWhatsApp(order: Order, phone?: string) {
  const recipient = phoneDigits(phone);
  const target = recipient ? `https://wa.me/${recipient}` : "https://wa.me/";
  const url = `${target}?text=${encodeURIComponent(orderShareText(order))}`;
  window.open(url, "_blank", "noopener,noreferrer");
}

export function gerarPdfPedido(order: Order) {
  const pdf = new jsPDF();
  const pageWidth = pdf.internal.pageSize.getWidth();
  const pageHeight = pdf.internal.pageSize.getHeight();
  const margin = 18;
  const contentWidth = pageWidth - margin * 2;
  let y = margin;

  const ensureSpace = (height: number) => {
    if (y + height <= pageHeight - margin) return;
    pdf.addPage();
    y = margin;
  };

  const writeWrapped = (text: string, size = 10, bold = false) => {
    pdf.setFont("helvetica", bold ? "bold" : "normal");
    pdf.setFontSize(size);
    const lines = pdf.splitTextToSize(text, contentWidth) as string[];
    const lineHeight = size * 0.48;
    ensureSpace(lines.length * lineHeight + 3);
    pdf.text(lines, margin, y);
    y += lines.length * lineHeight + 3;
  };

  pdf.setTextColor(24, 35, 61);
  writeWrapped(`PediJá — Pedido #${order.id}`, 20, true);
  pdf.setDrawColor(220, 227, 238);
  pdf.line(margin, y, pageWidth - margin, y);
  y += 9;

  writeWrapped(`Cliente: ${order.clienteNome || `Cliente #${order.clienteId}`}`);
  writeWrapped(`Data: ${dateTime(order.dataPedido)}`);
  writeWrapped(`Status: ${statusLabel[order.status]}`);
  writeWrapped(`Forma de pagamento: ${paymentLabel[order.paymentMethod]}`);
  y += 5;

  writeWrapped("Itens do pedido", 13, true);
  pdf.setFillColor(247, 249, 253);
  pdf.rect(margin, y - 5, contentWidth, 8, "F");
  pdf.setFont("helvetica", "bold");
  pdf.setFontSize(9);
  pdf.text("Produto", margin + 2, y);
  pdf.text("Qtd.", pageWidth - margin - 59, y);
  pdf.text("Total", pageWidth - margin - 25, y);
  y += 10;

  for (const item of order.items) {
    const productLines = pdf.splitTextToSize(item.produtoNome, contentWidth - 78) as string[];
    const lineHeight = 4.5;
    ensureSpace(productLines.length * lineHeight + 7);
    pdf.setFont("helvetica", "normal");
    pdf.setFontSize(9);
    pdf.text(productLines, margin + 2, y);
    pdf.text(String(item.quantidade), pageWidth - margin - 59, y);
    pdf.text(money(item.subtotal), pageWidth - margin - 25, y, { align: "right" });
    y += productLines.length * lineHeight + 5;
    pdf.setDrawColor(237, 240, 245);
    pdf.line(margin, y - 2, pageWidth - margin, y - 2);
  }

  if (order.items.length === 0) writeWrapped("Nenhum item informado.");

  y += 6;
  ensureSpace(14);
  pdf.setFont("helvetica", "bold");
  pdf.setFontSize(13);
  pdf.text(`Total: ${money(order.valorTotal)}`, pageWidth - margin, y, {
    align: "right",
  });

  return pdf;
}

export function baixarPdfPedido(order: Order) {
  gerarPdfPedido(order).save(orderFileName(order));
}

export async function compartilharPdfPedido(order: Order) {
  const blob = gerarPdfPedido(order).output("blob");
  const file = new File([blob], orderFileName(order), { type: "application/pdf" });

  if (navigator.share && navigator.canShare?.({ files: [file] })) {
    await navigator.share({
      title: `Pedido #${order.id}`,
      text: `Pedido #${order.id} — ${order.clienteNome || `Cliente #${order.clienteId}`}`,
      files: [file],
    });
    return;
  }

  baixarPdfPedido(order);
}
