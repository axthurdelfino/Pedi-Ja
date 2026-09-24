import { useState, type ReactNode } from "react";
import { useNavigate } from "react-router-dom";
import Dialog from "./Dialog";
import { useLeaveGuard } from "../contexts/LeaveGuardContext";

export default function Modal({
  title,
  children,
}: {
  title: string;
  children: ReactNode;
}) {
  const navigate = useNavigate();
  const [open, setOpen] = useState(true);
  const { complete } = useLeaveGuard();
  return (
    <Dialog
      title={title}
      open={open}
      onClose={() => setOpen(false)}
      onClosed={() => complete(() => navigate(-1))}
      bodyClassName="modal-body"
    >
      {children}
    </Dialog>
  );
}
