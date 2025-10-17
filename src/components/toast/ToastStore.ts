import { signal } from '@preact/signals-react';

export type ToastType = 'success' | 'error' | 'info';

export interface ToastMessage {
  id: string;
  message: string;
  type: ToastType;
  duration?: number;
}

export const toastMessages = signal<ToastMessage[]>([]);

export const showToast = (message: string, type: ToastType = 'info', duration: number = 2000) => {
  const id = Date.now().toString() + Math.random().toString(36).substr(2, 9);
  const toast: ToastMessage = {
    id,
    message,
    type,
    duration,
  };

  // Add toast to the beginning of the array (newest on top)
  toastMessages.value = [toast, ...toastMessages.value];

  // Auto remove after duration
  setTimeout(() => {
    removeToast(id);
  }, duration);
};

export const removeToast = (id: string) => {
  toastMessages.value = toastMessages.value.filter(toast => toast.id !== id);
};

export const clearAllToasts = () => {
  toastMessages.value = [];
};

// Convenience functions for different toast types
export const showSuccessToast = (message: string, duration?: number) => {
  showToast(message, 'success', duration);
};

export const showErrorToast = (message: string, duration?: number) => {
  showToast(message, 'error', duration);
};

export const showInfoToast = (message: string, duration?: number) => {
  showToast(message, 'info', duration);
};

