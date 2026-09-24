import { useState } from "react";
import { clientService } from "../services/clientService";
import { productService } from "../services/productService";
import { orderService } from "../services/orderService";
import { useResource, errorMessage } from "./useResource";
import type { Client, Product, PaymentMethod } from "../types";
const load = async () => {
  const [clients, products] = await Promise.all([
    clientService.findAll(),
    productService.findAll(),
  ]);
  return { clients, products };
};
export function useNewOrder() {
  const resource = useResource(load, {
    clients: [] as Client[],
    products: [] as Product[],
  });
  const [clienteId, setClienteId] = useState("");
  const [paymentMethod, setPaymentMethod] = useState<PaymentMethod>("PIX");
  const [lines, setLines] = useState<
    { produtoId: number; quantidade: number }[]
  >([]);
  const [productId, setProductId] = useState("");
  const [quantity, setQuantity] = useState(1);
  const [failure, setFailure] = useState("");
  const [saving, setSaving] = useState(false);
  function addProduct() {
    const p = resource.data.products.find((p) => p.id === Number(productId));
    const previous = lines.find((l) => l.produtoId === p?.id)?.quantidade || 0;
    if (!p || !Number.isSafeInteger(quantity) || quantity < 1) {
      setFailure("Selecione um produto e uma quantidade inteira positiva.");
      return;
    }
    if (previous + quantity > p.estoque) {
      setFailure("Quantidade maior que o estoque disponível.");
      return;
    }
    setFailure("");
    setLines((current) =>
      previous
        ? current.map((l) =>
            l.produtoId === p.id
              ? { ...l, quantidade: l.quantidade + quantity }
              : l,
          )
        : [...current, { produtoId: p.id, quantidade: quantity }],
    );
    setProductId("");
    setQuantity(1);
  }
  async function save() {
    if (saving) return null;
    if (!clienteId || !lines.length) {
      setFailure("Selecione um cliente e adicione produtos.");
      return null;
    }
    setSaving(true);
    setFailure("");
    try {
      return await orderService.create({
        clienteId: Number(clienteId),
        paymentMethod,
        items: lines,
      });
    } catch (e) {
      setFailure(errorMessage(e));
      return null;
    } finally {
      setSaving(false);
    }
  }
  const total =
    lines.reduce(
      (s, l) =>
        s +
        Math.round(
          (resource.data.products.find((p) => p.id === l.produtoId)?.preco ||
            0) * 100,
        ) *
          l.quantidade,
      0,
    ) / 100;
  return {
    ...resource.data,
    loading: resource.loading,
    error: failure || resource.error,
    clienteId,
    setClienteId,
    paymentMethod,
    setPaymentMethod,
    lines,
    productId,
    setProductId,
    quantity,
    setQuantity,
    addProduct,
    removeProduct: (id: number) =>
      setLines((v) => v.filter((l) => l.produtoId !== id)),
    total,
    saving,
    save,
  };
}
