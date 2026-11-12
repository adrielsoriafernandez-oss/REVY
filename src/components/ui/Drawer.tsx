import { useEffect, useRef, type ReactNode } from 'react';
import { X } from 'lucide-react';
export function Drawer({
  open,
  onClose,
  title,
  children,
  className = '',
}: {
  open: boolean;
  onClose: () => void;
  title: string;
  children: ReactNode;
  className?: string;
}) {
  const ref = useRef<HTMLDialogElement>(null);
  useEffect(() => {
    const dialog = ref.current;
    if (!dialog) return;
    const previous = document.activeElement instanceof HTMLElement ? document.activeElement : null;
    if (open) {
      dialog.showModal();
      document.body.style.overflow = 'hidden';
    } else {
      dialog.close();
      document.body.style.overflow = '';
    }
    return () => {
      dialog.close();
      document.body.style.overflow = '';
      previous?.focus();
    };
  }, [open]);
  return (
    <dialog
      ref={ref}
      className={`drawer ${className}`}
      onKeyDown={(event) => {
        if (event.key !== 'Tab') return;
        const controls = [
          ...event.currentTarget.querySelectorAll<HTMLElement>(
            'button:not([disabled]), a[href], input:not([disabled]), select:not([disabled]), textarea:not([disabled]), [tabindex="0"]',
          ),
        ].filter((element) => element.getClientRects().length > 0);
        const first = controls[0],
          last = controls[controls.length - 1];
        if (!first || !last) return;
        if (
          event.shiftKey &&
          (document.activeElement === first || document.activeElement === event.currentTarget)
        ) {
          event.preventDefault();
          last.focus();
        } else if (!event.shiftKey && document.activeElement === last) {
          event.preventDefault();
          first.focus();
        }
      }}
      onCancel={onClose}
      onClick={(e) => {
        if (e.target === e.currentTarget) onClose();
      }}
      aria-label={title}
      onClose={() => {
        if (open) onClose();
      }}
    >
      <div className="drawer-inner">
        <div className="drawer-heading">
          <h2>{title}</h2>
          <button
            className="icon-button"
            aria-label={`Cerrar ${title.toLowerCase()}`}
            onClick={onClose}
          >
            <X size={22} />
          </button>
        </div>
        {children}
      </div>
    </dialog>
  );
}
