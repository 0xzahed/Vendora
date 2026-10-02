"use client";

import * as React from "react";
import { X } from "lucide-react";
import { cn } from "@/lib/utils";

interface DrawerProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  children: React.ReactNode;
  side?: "left" | "right" | "bottom";
  className?: string;
}

export function Drawer({
  open,
  onOpenChange,
  children,
  side = "right",
  className,
}: DrawerProps) {
  if (!open) return null;

  const positionClasses = {
    left: "inset-y-0 left-0 animate-slide-in-right",
    right: "inset-y-0 right-0 animate-slide-in-right",
    bottom: "inset-x-0 bottom-0 animate-slide-in-up",
  };

  return (
    <div className="fixed inset-0 z-50">
      <div
        className="fixed inset-0 bg-black/50 backdrop-blur-sm"
        onClick={() => onOpenChange(false)}
      />
      <div
        className={cn(
          "fixed z-50 flex flex-col border border-border bg-card shadow-lg",
          positionClasses[side],
          className
        )}
      >
        {children}
      </div>
    </div>
  );
}

export function DrawerHeader({
  className,
  children,
  ...props
}: React.HTMLAttributes<HTMLDivElement>) {
  return (
    <div
      className={cn("flex items-center justify-between border-b border-border p-4", className)}
      {...props}
    >
      {children}
    </div>
  );
}

export function DrawerTitle({
  className,
  ...props
}: React.HTMLAttributes<HTMLHeadingElement>) {
  return (
    <h2 className={cn("text-lg font-semibold", className)} {...props} />
  );
}

export function DrawerClose({
  className,
  ...props
}: React.ButtonHTMLAttributes<HTMLButtonElement>) {
  return (
    <button
      className={cn(
        "rounded-sm opacity-70 ring-offset-background transition-opacity hover:opacity-100 focus:outline-none focus:ring-2 focus:ring-ring focus:ring-offset-2 cursor-pointer",
        className
      )}
      {...props}
    >
      <X className="h-5 w-5" />
      <span className="sr-only">Close</span>
    </button>
  );
}

export function DrawerContent({
  className,
  ...props
}: React.HTMLAttributes<HTMLDivElement>) {
  return (
    <div className={cn("flex-1 overflow-y-auto p-4", className)} {...props} />
  );
}
