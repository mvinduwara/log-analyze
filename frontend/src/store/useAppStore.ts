import { create } from "zustand";
import type { Toast, AlertRule, LogFilter } from "@/types";

interface AppState {
  toasts: Toast[];
  addToast: (toast: Omit<Toast, "id">) => void;
  removeToast: (id: string) => void;

  alertRules: AlertRule[];
  setAlertRules: (rules: AlertRule[]) => void;

  filter: LogFilter;
  setFilter: (filter: Partial<LogFilter>) => void;
  resetFilter: () => void;

  isUploading: boolean;
  setUploading: (v: boolean) => void;

  uploadedFile: string | null;
  setUploadedFile: (name: string | null) => void;
}

const defaultFilter: LogFilter = {
  search: "",
  method: "",
  statusMin: "",
  statusMax: "",
  ip: "",
  path: "",
  dateFrom: "",
  dateTo: "",
};

export const useAppStore = create<AppState>((set) => ({
  toasts: [],
  addToast: (toast) => {
    const id = Math.random().toString(36).slice(2);
    set((s) => ({ toasts: [...s.toasts, { ...toast, id }] }));
    setTimeout(
      () => set((s) => ({ toasts: s.toasts.filter((t) => t.id !== id) })),
      toast.duration ?? 4000
    );
  },
  removeToast: (id) =>
    set((s) => ({ toasts: s.toasts.filter((t) => t.id !== id) })),

  alertRules: [],
  setAlertRules: (rules) => set({ alertRules: rules }),

  filter: defaultFilter,
  setFilter: (f) => set((s) => ({ filter: { ...s.filter, ...f } })),
  resetFilter: () => set({ filter: defaultFilter }),

  isUploading: false,
  setUploading: (v) => set({ isUploading: v }),

  uploadedFile: null,
  setUploadedFile: (name) => set({ uploadedFile: name }),
}));