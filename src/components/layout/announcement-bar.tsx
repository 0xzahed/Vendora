"use client";

import * as React from "react";
import { X, Truck } from "lucide-react";
import { useUIStore } from "@/stores/ui";

export function AnnouncementBar() {
  const [visible, setVisible] = React.useState(true);
  const addToast = useUIStore((s) => s.addToast);

  if (!visible) return null;

  return (
    <div className="relative bg-primary px-4 py-2 text-center text-sm text-primary-foreground">
      <div className="flex items-center justify-center gap-2">
        <Truck className="h-4 w-4" />
        <span>
          Free shipping on orders over $100 | Use code{" "}
          <button
            className="font-semibold underline cursor-pointer"
            onClick={() => {
              navigator.clipboard.writeText("WELCOME");
              addToast({
                title: "Code copied",
                description: "WELCOME - $10 off your first order",
                variant: "success",
              });
            }}
          >
            WELCOME
          </button>{" "}
          for $10 off
        </span>
      </div>
      <button
        onClick={() => setVisible(false)}
        className="absolute right-3 top-1/2 -translate-y-1/2 rounded-sm opacity-70 hover:opacity-100 cursor-pointer"
        aria-label="Dismiss announcement"
      >
        <X className="h-4 w-4" />
      </button>
    </div>
  );
}
