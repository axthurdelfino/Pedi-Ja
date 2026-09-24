import { useCallback, useState } from "react";
import { toast } from "sonner";
import { errorMessage, useResource } from "./useResource";
export function useCrud<T extends { id: number }, I>(service: {
  findAll: (name?: string) => Promise<T[]>;
  create: (input: I) => Promise<T>;
  update: (id: number, input: I) => Promise<T>;
  remove: (id: number) => Promise<void>;
}) {
  const [search, setSearch] = useState("");
  const [busy, setBusy] = useState(false);
  const [failure, setFailure] = useState("");
  const loader = useCallback(() => service.findAll(search), [service, search]);
  const resource = useResource(loader, []);
  async function save(input: I, id?: number) {
    if (busy) return false;
    setBusy(true);
    setFailure("");
    try {
      if (id !== undefined) await service.update(id, input);
      else await service.create(input);
      toast.success(
        id !== undefined ? "Alterações salvas." : "Cadastro realizado.",
      );
      await resource.reload(true);
      return true;
    } catch (e) {
      setFailure(errorMessage(e));
      return false;
    } finally {
      setBusy(false);
    }
  }
  async function remove(id: number) {
    if (
      !window.confirm("Excluir este registro? Esta ação não pode ser desfeita.")
    )
      return;
    setBusy(true);
    setFailure("");
    try {
      await service.remove(id);
      toast.success("Registro excluído.");
      await resource.reload(true);
    } catch (e) {
      setFailure(errorMessage(e));
    } finally {
      setBusy(false);
    }
  }
  return {
    ...resource,
    error: failure || resource.error,
    search,
    setSearch,
    busy,
    clearFailure: () => setFailure(""),
    save,
    remove,
  };
}
