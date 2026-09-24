import {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useLayoutEffect,
  useRef,
  useState,
  type ReactNode,
} from "react";
import { useBlocker } from "react-router-dom";
import { AlertDialog } from "@base-ui/react/alert-dialog";
import { toast } from "sonner";

type Guard = { dirty: boolean; busy: boolean };
type GuardApi = {
  register: (id: symbol, read: () => Guard) => () => void;
  requestLeave: (action: () => void) => void;
  complete: (action: () => void) => void;
};
const Context = createContext<GuardApi | null>(null);

export function LeaveGuardProvider({ children }: { children: ReactNode }) {
  const guards = useRef(new Map<symbol, () => Guard>());
  const bypass = useRef(false);
  const [pending, setPending] = useState<(() => void) | null>(null);
  const read = useCallback(() => {
    const values = [...guards.current.values()].map((get) => get());
    return {
      dirty: values.some((v) => v.dirty),
      busy: values.some((v) => v.busy),
    };
  }, []);
  const register = useCallback((id: symbol, get: () => Guard) => {
    guards.current.set(id, get);
    return () => {
      guards.current.delete(id);
    };
  }, []);
  const complete = useCallback((action: () => void) => {
    bypass.current = true;
    try {
      action();
    } finally {
      bypass.current = false;
    }
  }, []);
  const requestLeave = useCallback(
    (action: () => void) => {
      const state = read();
      if (state.busy) {
        toast.info("Aguarde a conclusão da operação.", {
          id: "operation-busy",
        });
      } else if (state.dirty) {
        setPending(() => action);
      } else {
        complete(action);
      }
    },
    [read, complete],
  );
  const blocker = useBlocker(() => {
    const state = read();
    return !bypass.current && (state.busy || state.dirty);
  });
  useEffect(() => {
    if (blocker.state !== "blocked") return;
    if (read().busy) {
      blocker.reset();
      toast.info("Aguarde a conclusão da operação.", { id: "operation-busy" });
    } else {
      setPending(() => () => blocker.proceed());
    }
  }, [blocker, read]);
  useEffect(() => {
    const beforeUnload = (event: BeforeUnloadEvent) => {
      const state = read();
      if (state.dirty || state.busy) {
        event.preventDefault();
        event.returnValue = "";
      }
    };
    window.addEventListener("beforeunload", beforeUnload);
    return () => window.removeEventListener("beforeunload", beforeUnload);
  }, [read]);
  function cancel() {
    setPending(null);
    if (blocker.state === "blocked") blocker.reset();
  }
  return (
    <Context.Provider value={{ register, requestLeave, complete }}>
      {children}
      <AlertDialog.Root
        open={pending !== null}
        onOpenChange={(open) => {
          if (!open) cancel();
        }}
      >
        <AlertDialog.Portal>
          <AlertDialog.Backdrop className="dialog-scrim confirmation-layer" />
          <AlertDialog.Viewport className="modal-backdrop confirmation-layer">
            <AlertDialog.Popup className="modal-card confirmation-card">
              <AlertDialog.Title>Descartar alterações?</AlertDialog.Title>
              <AlertDialog.Description>
                Os dados não salvos serão perdidos. Você pode continuar
                editando.
              </AlertDialog.Description>
              <div className="heading-actions">
                <AlertDialog.Close className="outline-button">
                  Continuar editando
                </AlertDialog.Close>
                <button
                  className="danger-button"
                  onClick={() => {
                    const action = pending;
                    setPending(null);
                    if (action) complete(action);
                  }}
                >
                  Descartar alterações
                </button>
              </div>
            </AlertDialog.Popup>
          </AlertDialog.Viewport>
        </AlertDialog.Portal>
      </AlertDialog.Root>
    </Context.Provider>
  );
}

export function useLeaveGuard() {
  const context = useContext(Context);
  if (!context) throw new Error("LeaveGuardProvider ausente");
  return context;
}

export function useFormGuard(state: Guard) {
  const { register } = useLeaveGuard();
  const latest = useRef(state);
  useLayoutEffect(() => {
    latest.current = state;
  });
  useLayoutEffect(
    () => register(Symbol("form"), () => latest.current),
    [register],
  );
}
