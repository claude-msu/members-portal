import { useToast } from "@/hooks/use-toast";
import { Toast, ToastClose, ToastDescription, ToastProvider, ToastTitle, ToastViewport } from "@/components/ui/toast";
import { cn } from "@/lib/utils";

export function Toaster() {
  const { toasts, dismiss } = useToast();

  return (
    <ToastProvider>
      {toasts.map(function ({ id, title, description, action, onClick, ...props }) {
        const handleToastClick = (e: React.MouseEvent) => {
          const target = e.target as HTMLElement;
          if (target.closest("[data-toast-close], [data-toast-action]")) return;
          onClick?.();
          dismiss(id);
        };
        const handleKeyDown = onClick
          ? (e: React.KeyboardEvent) => {
              if (e.key === "Enter" || e.key === " ") {
                e.preventDefault();
                onClick();
                dismiss(id);
              }
            }
          : undefined;
        return (
          <Toast
            key={id}
            {...props}
            className={cn(props.className, onClick && "cursor-pointer")}
            onClick={onClick ? handleToastClick : undefined}
            role={onClick ? "button" : undefined}
            tabIndex={onClick ? 0 : undefined}
            onKeyDown={handleKeyDown}
          >
            <div className="grid gap-1 flex-1 min-w-0">
              {title && <ToastTitle>{title}</ToastTitle>}
              {description && <ToastDescription>{description}</ToastDescription>}
            </div>
            {action ? <span data-toast-action>{action}</span> : null}
            <ToastClose />
          </Toast>
        );
      })}
      <ToastViewport />
    </ToastProvider>
  );
}
