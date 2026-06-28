"use client";

import { useState } from "react";

interface ToastMessage {
  id: string;
  message: string;
  type: "success" | "error" | "info";
}

let toastListeners: ((toasts: ToastMessage[]) => void)[] = [];
let currentToasts: ToastMessage[] = [];

function notify(toasts: ToastMessage[]) {
  currentToasts = toasts;
  toastListeners.forEach((listener) => listener(toasts));
}

export function toast(message: string, type: "success" | "error" | "info" = "info") {
  const id = Math.random().toString(36).slice(2);
  const newToast: ToastMessage = { id, message, type };
  notify([...currentToasts, newToast]);

  setTimeout(() => {
    notify(currentToasts.filter((t) => t.id !== id));
  }, 3500);
}

export function useToast() {
  const [toasts, setToasts] = useState<ToastMessage[]>(currentToasts);

  useState(() => {
    toastListeners.push(setToasts);
    return () => {
      toastListeners = toastListeners.filter((l) => l !== setToasts);
    };
  });

  return toasts;
}
