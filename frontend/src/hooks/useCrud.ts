import { useCallback, useState } from "react";
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
    setBusy(true);
    setFailure("");
    try {
      if (id !== undefined) await service.update(id, input);
      else await service.create(input);
      await resource.reload();
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
      await resource.reload();
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
    save,
    remove,
  };
}
