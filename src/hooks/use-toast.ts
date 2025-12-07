'use client';

import { useState, useCallback } from 'react';

export interface Toast {
  title?: string;
  description?: string;
  variant?: 'default' | 'destructive';
  duration?: number;
}

export function useToast() {
  const [toasts, setToasts] = useState<Toast[]>([]);

  const toast = useCallback((toastData: Toast) => {
    const newToast = { ...toastData, id: Date.now() };
    setToasts(prev => [...prev, newToast]);
    
    // Auto-remove after 3 seconds
    setTimeout(() => {
      setToasts(prev => prev.filter(t => (t as any).id !== newToast.id));
    }, 3000);
    
    console.log('Toast:', toastData.title, toastData.description);
  }, []);

  return {
    toast,
    toasts,
  };
}

