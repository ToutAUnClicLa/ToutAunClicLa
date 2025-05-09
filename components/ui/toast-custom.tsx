```tsx
import { toast as sonnerToast } from 'sonner';
import { Check, X, AlertCircle, Info } from 'lucide-react';

interface ToastOptions {
  description?: string;
  action?: {
    label: string;
    onClick: () => void;
  };
}

const defaultIcons = {
  success: <Check className="h-5 w-5 text-green-500" />,
  error: <X className="h-5 w-5 text-red-500" />,
  warning: <AlertCircle className="h-5 w-5 text-yellow-500" />,
  info: <Info className="h-5 w-5 text-blue-500" />
};

export const toast = {
  success: (message: string, options?: ToastOptions) => {
    sonnerToast(message, {
      className: 'bg-white border border-gray-100 shadow-lg',
      duration: 3000,
      icon: defaultIcons.success,
      ...options,
      style: {
        backgroundColor: 'white',
        border: '1px solid #e5e7eb',
        borderRadius: '0.5rem',
        padding: '1rem',
      },
    });
  },
  error: (message: string, options?: ToastOptions) => {
    sonnerToast(message, {
      className: 'bg-white border border-gray-100 shadow-lg',
      duration: 4000,
      icon: defaultIcons.error,
      ...options,
      style: {
        backgroundColor: 'white',
        border: '1px solid #e5e7eb',
        borderRadius: '0.5rem',
        padding: '1rem',
      },
    });
  },
  warning: (message: string, options?: ToastOptions) => {
    sonnerToast(message, {
      className: 'bg-white border border-gray-100 shadow-lg',
      duration: 4000,
      icon: defaultIcons.warning,
      ...options,
      style: {
        backgroundColor: 'white',
        border: '1px solid #e5e7eb',
        borderRadius: '0.5rem',
        padding: '1rem',
      },
    });
  },
  info: (message: string, options?: ToastOptions) => {
    sonnerToast(message, {
      className: 'bg-white border border-gray-100 shadow-lg',
      duration: 3000,
      icon: defaultIcons.info,
      ...options,
      style: {
        backgroundColor: 'white',
        border: '1px solid #e5e7eb',
        borderRadius: '0.5rem',
        padding: '1rem',
      },
    });
  },
  promise: async <T,>(
    promise: Promise<T>,
    {
      loading = 'Cargando...',
      success = 'Operación completada',
      error = 'Ha ocurrido un error'
    } = {}
  ) => {
    return sonnerToast.promise(promise, {
      loading: {
        title: loading,
        className: 'bg-white border border-gray-100 shadow-lg',
      },
      success: {
        title: success,
        className: 'bg-white border border-gray-100 shadow-lg',
        icon: defaultIcons.success,
      },
      error: {
        title: error,
        className: 'bg-white border border-gray-100 shadow-lg',
        icon: defaultIcons.error,
      },
      style: {
        backgroundColor: 'white',
        border: '1px solid #e5e7eb',
        borderRadius: '0.5rem',
        padding: '1rem',
      },
    });
  }
};
```