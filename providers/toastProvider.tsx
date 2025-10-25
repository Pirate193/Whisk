import { Toast, ToastVariant } from '@/components/ui/toast';
import React, { createContext, useCallback, useContext, useState } from 'react';
import { StyleSheet, View } from 'react-native';
import { SafeAreaView } from "react-native-safe-area-context";

interface ToastOptions {
  title: string;
  description?: string;
  variant?: ToastVariant;
  duration?: number;
}

interface ToastItem extends ToastOptions {
  id: string;
}

interface ToastContextType {
  toast: (options: ToastOptions) => void;
  success: (title: string, description?: string) => void;
  error: (title: string, description?: string) => void;
  warning: (title: string, description?: string) => void;
  dismiss: (id: string) => void;
}

const ToastContext = createContext<ToastContextType | undefined>(undefined);

export function ToastProvider({ children }: { children: React.ReactNode }) {
  const [toasts, setToasts] = useState<ToastItem[]>([]);

  const dismiss = useCallback((id: string) => {
    setToasts((prev) => prev.filter((toast) => toast.id !== id));
  }, []);

  const toast = useCallback(
    ({ title, description, variant = 'default', duration = 4000 }: ToastOptions) => {
      const id = Math.random().toString(36).substring(7);
      const newToast: ToastItem = { id, title, description, variant, duration };

      setToasts((prev) => [...prev, newToast]);

      // Auto dismiss after duration
      setTimeout(() => {
        dismiss(id);
      }, duration);
    },
    [dismiss]
  );

  const success = useCallback(
    (title: string, description?: string) => {
      toast({ title, description, variant: 'success' });
    },
    [toast]
  );

  const error = useCallback(
    (title: string, description?: string) => {
      toast({ title, description, variant: 'error' });
    },
    [toast]
  );

  const warning = useCallback(
    (title: string, description?: string) => {
      toast({ title, description, variant: 'warning' });
    },
    [toast]
  );

  return (
    <ToastContext.Provider value={{ toast, success, error, warning, dismiss }}>
      {children}
      <SafeAreaView style={toastStyles.container} pointerEvents="box-none">
        <View style={toastStyles.toastList}>
          {toasts.map((toastItem) => (
            <Toast
              key={toastItem.id}
              id={toastItem.id}
              title={toastItem.title}
              description={toastItem.description}
              variant={toastItem.variant}
              duration={toastItem.duration}
              onDismiss={dismiss}
            />
          ))}
        </View>
      </SafeAreaView>
    </ToastContext.Provider>
  );
}

const toastStyles = StyleSheet.create({
  container: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    zIndex: 9999,
  },
  toastList: {
    paddingTop: 8,
  },
});

export function useToast() {
  const context = useContext(ToastContext);
  if (!context) {
    throw new Error('useToast must be used within a ToastProvider');
  }
  return context;
}