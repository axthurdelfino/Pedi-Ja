import { useCallback, useEffect, useRef, useState } from "react";
export const errorMessage = (error: unknown) =>
  error instanceof Error
    ? error.message
    : "Não foi possível concluir a operação.";
export function useResource<T>(
  loader: () => Promise<T>,
  initial: T,
  refreshEvent?: string,
) {
  const [data, setData] = useState<T>(initial);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const generation = useRef(0);
  const reload = useCallback(
    async (silent = false) => {
      const current = ++generation.current;
      if (!silent) setLoading(true);
      setError("");
      try {
        const result = await loader();
        if (current === generation.current) setData(result);
      } catch (e) {
        if (current === generation.current) setError(errorMessage(e));
      } finally {
        if (current === generation.current) setLoading(false);
      }
    },
    [loader],
  );
  useEffect(() => {
    void reload();
    return () => {
      generation.current++;
    };
  }, [reload]);
  useEffect(() => {
    if (!refreshEvent) return;
    const refresh = () => {
      void reload(true);
    };
    window.addEventListener(refreshEvent, refresh);
    return () => window.removeEventListener(refreshEvent, refresh);
  }, [refreshEvent, reload]);
  return { data, loading, error, reload };
}
