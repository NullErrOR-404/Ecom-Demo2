import { useEffect, useRef, type ReactNode } from 'react';

interface ModalDialogProps {
  open: boolean;
  onClose: () => void;
  ariaLabel: string;
  variant?: 'drawer' | 'center';
  children: ReactNode;
}

export function ModalDialog({
  open,
  onClose,
  ariaLabel,
  variant = 'drawer',
  children,
}: ModalDialogProps) {
  const ref = useRef<HTMLDialogElement>(null);

  useEffect(() => {
    const dialog = ref.current;
    if (!dialog) return;
    if (open && !dialog.open) {
      dialog.showModal();
    } else if (!open && dialog.open) {
      dialog.close();
    }
  }, [open]);

  // Progressive fallback for browsers without native `closedby="any"`
  useEffect(() => {
    const dialog = ref.current;
    if (!dialog || 'closedBy' in HTMLDialogElement.prototype) return;

    const isOutside = (e: PointerEvent) => {
      const r = dialog.getBoundingClientRect();
      return e.clientX < r.left || e.clientX > r.right || e.clientY < r.top || e.clientY > r.bottom;
    };

    let pressedOutside = false;
    const onDown = (e: PointerEvent) => {
      pressedOutside = isOutside(e);
    };
    const onUp = (e: PointerEvent) => {
      if (pressedOutside && isOutside(e)) dialog.close();
    };
    dialog.addEventListener('pointerdown', onDown);
    dialog.addEventListener('pointerup', onUp);
    return () => {
      dialog.removeEventListener('pointerdown', onDown);
      dialog.removeEventListener('pointerup', onUp);
    };
  }, []);

  if (!open) return null;

  const variantClasses =
    variant === 'drawer'
      ? 'm-0 ml-auto h-full max-h-none w-full max-w-md border-l border-[var(--gs-border)] bg-[var(--gs-surface)] text-[var(--gs-ink)] p-0'
      : 'm-auto w-[calc(100%-2rem)] max-w-md rounded-[6px] border border-[var(--gs-border)] bg-[var(--gs-surface)] text-[var(--gs-ink)] p-0';

  return (
    <dialog
      ref={ref}
      aria-label={ariaLabel}
      onClose={onClose}
      data-lenis-prevent
      {...({ closedby: 'any' } as Record<string, string>)}
      className={variantClasses}
    >
      {children}
    </dialog>
  );
}
