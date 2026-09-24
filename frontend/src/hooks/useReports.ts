import { useState } from "react";
import { orderService, ordersChanged } from "../services/orderService";
import { useResource } from "./useResource";
const load = () => orderService.findAll();
export function useReports() {
  const resource = useResource(load, [], ordersChanged);
  const [start, setStart] = useState("");
  const [end, setEnd] = useState("");
  const invalid = Boolean(start && end && start > end);
  const orders = invalid
    ? []
    : resource.data.filter(
        (o) =>
          (!start || o.dataPedido.slice(0, 10) >= start) &&
          (!end || o.dataPedido.slice(0, 10) <= end),
      );
  const sum = (statuses: string[]) =>
    orders
      .filter((o) => statuses.includes(o.status))
      .reduce((s, o) => s + o.valorTotal, 0);
  return {
    ...resource,
    orders,
    start,
    end,
    setStart,
    setEnd,
    invalid,
    paid: sum(["PAGO", "ENVIADO"]),
    pending: sum(["PENDENTE"]),
    cancelled: sum(["CANCELADO"]),
  };
}
