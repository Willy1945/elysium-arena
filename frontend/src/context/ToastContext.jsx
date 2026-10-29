import { createContext, useContext, useState, useCallback, useMemo } from 'react';
import ToastContainer from '../components/common/ToastContainer';

const ToastContext = createContext(null);

export function ToastProvider({ children }) {
  const [toasts, setToasts] = useState([]);

  const removeToast = useCallback((id) => {
    setToasts((prev) => prev.filter((t) => t.id !== id));
  }, []);

  const showToast = useCallback((type, message, duration = 4000) => {
    const id = `${Date.now()}-${Math.random()}`;
    setToasts((prev) => {

      const isDuplicate = prev.some((t) => t.message === message && t.type === type);
      if (isDuplicate) return prev;
      return [...prev, { id, type, message }];
    });
    if (duration) {
      setTimeout(() => removeToast(id), duration);
    }
  }, [removeToast]);

  const toast = useMemo(() => ({
    success: (message) => showToast('success', message),
    error: (message) => showToast('error', message),
    info: (message) => showToast('info', message),
  }), [showToast]);

  return (
    <ToastContext.Provider value={toast}>
      {children}
      <ToastContainer toasts={toasts} onRemove={removeToast} />
    </ToastContext.Provider>
  );
}

export function useToast() {
  const context = useContext(ToastContext);
  if (!context) {
    throw new Error('useToast harus dipakai di dalam ToastProvider');
  }
  return context;
}
