"use client";

import * as React from "react";
import { CheckCircle2, XCircle, AlertTriangle, Info, X } from "lucide-react";
import { cn } from "@/lib/utils";
import { useUIStore } from "@/stores/ui";

const icons = {
  default: Info,
  success: CheckCircle2,
  error: XCircle,
  warning: AlertTriangle,
};

const iconColors = {
  default: "text-info",
  success: "text-success",
  error: "text-destructive",
  warning: "text-warning",
};

export function ToastContainer() {
  const { toasts, removeToast } = useUIStore();

  return (
    <div className="fixed bottom-4 right-4 z-[100] flex flex-col gap-2">
      {toasts.map((toast) => {
        const Icon = icons[toast.variant];
        return (
          <div
            key={toast.id}
            className={cn(
              "flex items-start gap-3 rounded-lg border border-border bg-card p-4 shadow-lg animate-slide-in-right min-w-[300px] max-w-[400px]"
            )}
          >
            <Icon className={cn("h-5 w-5 shrink-0 mt-0.5", iconColors[toast.variant])} />
            <div className="flex-1 min-w-0">
              <p className="text-sm font-medium">{toast.title}</p>
              {toast.description && (
                <p className="mt-1 text-sm text-muted-foreground">
                  {toast.description}
                </p>
              )}
            </div>
            <button
              onClick={() => removeToast(toast.id)}
              className="shrink-0 rounded-sm opacity-70 hover:opacity-100 cursor-pointer"
            >
              <X className="h-4 w-4" />
            </button>
          </div>
        );
      })}
    </div>
  );
}
