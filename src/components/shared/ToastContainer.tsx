"use client";

import { useToast } from "@/hooks/useToast";

export function ToastContainer() {
  const toasts = useToast();

  if (toasts.length === 0) return null;

  return (
    <div className="toast toast-top toast-end z-50">
      {toasts.map((toast) => (
        <div
          key={toast.id}
          className={`alert shadow-lg animate-in slide-in-from-right duration-300 ${
            toast.type === "success"
              ? "alert-success"
              : toast.type === "error"
              ? "alert-error"
              : "alert-info"
          }`}
        >
          <span className="text-sm font-medium">{toast.message}</span>
        </div>
      ))}
    </div>
  );
}
