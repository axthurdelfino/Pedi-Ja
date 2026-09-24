import { Dialog as Primitive } from "@base-ui/react/dialog";
import { createContext, useContext, type ReactNode } from "react";
import { useLeaveGuard } from "../contexts/LeaveGuardContext";

const CloseContext = createContext<(() => void) | null>(null);
export const useDialogClose = () => useContext(CloseContext);

export default function Dialog({
  title,
  children,
  open,
  onClose,
  onClosed,
  bodyClassName = "dialog-body",
}: {
  title: string;
  children: ReactNode;
  open: boolean;
  onClose: () => void;
  onClosed?: () => void;
  bodyClassName?: string;
}) {
  const { requestLeave } = useLeaveGuard();
  const close = () => requestLeave(onClose);
  return (
    <CloseContext.Provider value={close}>
      <Primitive.Root
        open={open}
        onOpenChange={(next, details) => {
          if (!next) {
            details.cancel();
            close();
          }
        }}
        onOpenChangeComplete={(next) => {
          if (!next) onClosed?.();
        }}
      >
        <Primitive.Portal>
          <Primitive.Backdrop className="dialog-scrim" />
          <Primitive.Viewport className="modal-backdrop">
            <Primitive.Popup
              className="modal-card"
              aria-describedby={undefined}
            >
              <header className="modal-header">
                <Primitive.Title>{title}</Primitive.Title>
                <Primitive.Close className="modal-close" aria-label="Fechar">
                  ×
                </Primitive.Close>
              </header>
              <div className={bodyClassName}>{children}</div>
            </Primitive.Popup>
          </Primitive.Viewport>
        </Primitive.Portal>
      </Primitive.Root>
    </CloseContext.Provider>
  );
}

export function DialogCancel() {
  const close = useDialogClose();
  return (
    <button type="button" className="outline-button" onClick={() => close?.()}>
      Cancelar
    </button>
  );
}
