import { useState, useCallback } from 'react'

interface Toast {
  title: string
  description?: string
  variant?: 'default' | 'destructive'
}

let toastCounter = 0

export function useToast() {
  const [toasts, setToasts] = useState<(Toast & { id: number })[]>([])

  const toast = useCallback((newToast: Toast) => {
    const id = ++toastCounter
    const toastWithId = { ...newToast, id }
    
    setToasts(prev => [...prev, toastWithId])
    
    // Auto-remove after 5 seconds
    setTimeout(() => {
      setToasts(prev => prev.filter(t => t.id !== id))
    }, 5000)

    // Log to console for debugging
    console.log(`🍞 Toast: ${newToast.title}`, newToast.description)
    
    // Show browser notification if available
    if (typeof window !== 'undefined' && 'Notification' in window) {
      if (Notification.permission === 'granted') {
        new Notification(newToast.title, {
          body: newToast.description,
          icon: '/vite.svg'
        })
      }
    }
  }, [])

  const removeToast = useCallback((id: number) => {
    setToasts(prev => prev.filter(t => t.id !== id))
  }, [])

  return {
    toast,
    toasts,
    removeToast
  }
}
