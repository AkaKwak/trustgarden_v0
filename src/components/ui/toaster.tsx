import React from 'react'
import { useToast } from '../../hooks/use-toast'
import { cn } from '../../lib/utils'

export function Toaster() {
  const { toasts, removeToast } = useToast()

  return (
    <div className="fixed top-0 right-0 z-50 w-full max-w-sm p-4 space-y-2">
      {toasts.map((toast) => (
        <div
          key={toast.id}
          className={cn(
            "relative rounded-lg border p-4 shadow-lg",
            toast.variant === 'destructive' 
              ? "border-destructive bg-destructive text-destructive-foreground"
              : "border-border bg-background text-foreground"
          )}
        >
          <button
            onClick={() => removeToast(toast.id)}
            className="absolute top-2 right-2 text-muted-foreground hover:text-foreground"
          >
            ×
          </button>
          <div className="font-semibold">{toast.title}</div>
          {toast.description && (
            <div className="text-sm opacity-90">{toast.description}</div>
          )}
        </div>
      ))}
    </div>
  )
}
