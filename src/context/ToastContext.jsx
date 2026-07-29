// ============================================
// TOAST NOTIFICATIONS
// App-wide status banners for form submissions (and anything else).
// Usage from any component:
//   const showToast = useToast();
//   showToast('Saved!', 'success');          // green
//   showToast('Missing information', 'warning'); // yellow
//   showToast('Something went wrong', 'error');   // red
// ============================================

import React, { createContext, useCallback, useContext, useRef, useState } from 'react';
import ToastContainer from '../components/Toast/Toast';

const ToastContext = createContext(null);

// Errors stay onscreen longer than a plain success message.
const AUTO_DISMISS_MS = { success: 4000, warning: 5000, error: 6000 };

let nextId = 0;

export function ToastProvider({ children }) {
  const [toasts, setToasts] = useState([]);
  const timers = useRef({});

  const dismissToast = useCallback((id) => {
    setToasts((prev) => prev.filter((t) => t.id !== id));
    clearTimeout(timers.current[id]);
    delete timers.current[id];
  }, []);

  const showToast = useCallback((message, type = 'success') => {
    const id = ++nextId;
    setToasts((prev) => [...prev, { id, message, type }]);
    timers.current[id] = setTimeout(() => dismissToast(id), AUTO_DISMISS_MS[type] || 5000);
  }, [dismissToast]);

  return (
    <ToastContext.Provider value={showToast}>
      {children}
      <ToastContainer toasts={toasts} onDismiss={dismissToast} />
    </ToastContext.Provider>
  );
}

export function useToast() {
  const showToast = useContext(ToastContext);
  if (!showToast) throw new Error('useToast must be used within a ToastProvider');
  return showToast;
}
