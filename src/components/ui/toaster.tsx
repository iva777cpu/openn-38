import { useToast } from "@/hooks/use-toast"
import {
  Toast,
  ToastClose,
  ToastDescription,
  ToastProvider,
  ToastTitle,
  ToastViewport,
} from "@/components/ui/toast"

export function Toaster() {
  const { toasts } = useToast()

  return (
    <ToastProvider>
      <ol className="fixed top-0 z-[100] flex max-h-screen w-full flex-col p-4 sm:top-0 sm:right-0 sm:flex-col md:max-w-[420px]">
        {toasts.map(function ({ id, title, description, action, ...props }) {
          return (
            <li key={id}>
              <Toast {...props}>
                <div className="grid gap-1">
                  {title && <ToastTitle>{title}</ToastTitle>}
                  {description && (
                    <ToastDescription>{description}</ToastDescription>
                  )}
                </div>
                {action}
                <ToastClose />
              </Toast>
            </li>
          )
        })}
      </ol>
      <ToastViewport />
    </ToastProvider>
  )
}