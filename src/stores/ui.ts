"use client";

import { create } from "zustand";
import { persist } from "zustand/middleware";
import type { Toast } from "@/types";

type Theme = "light" | "dark" | "system";

interface UIState {
  theme: Theme;
  setTheme: (theme: Theme) => void;
  toasts: Toast[];
  addToast: (toast: Omit<Toast, "id">) => void;
  removeToast: (id: string) => void;
  cartDrawerOpen: boolean;
  setCartDrawerOpen: (open: boolean) => void;
  searchOpen: boolean;
  setSearchOpen: (open: boolean) => void;
  mobileMenuOpen: boolean;
  setMobileMenuOpen: (open: boolean) => void;
  recentlyViewed: string[];
  addRecentlyViewed: (productId: string) => void;
}

export const useUIStore = create<UIState>()(
  persist(
    (set, get) => ({
      theme: "system",
      setTheme: (theme) => set({ theme }),

      toasts: [],
      addToast: (toast) => {
        const id = `toast-${Date.now()}`;
        set((state) => ({
          toasts: [...state.toasts, { ...toast, id }],
        }));
        setTimeout(() => {
          get().removeToast(id);
        }, 4000);
      },
      removeToast: (id) =>
        set((state) => ({
          toasts: state.toasts.filter((t) => t.id !== id),
        })),

      cartDrawerOpen: false,
      setCartDrawerOpen: (open) => set({ cartDrawerOpen: open }),

      searchOpen: false,
      setSearchOpen: (open) => set({ searchOpen: open }),

      mobileMenuOpen: false,
      setMobileMenuOpen: (open) => set({ mobileMenuOpen: open }),

      recentlyViewed: [],
      addRecentlyViewed: (productId) => {
        set((state) => {
          const filtered = state.recentlyViewed.filter((id) => id !== productId);
          return { recentlyViewed: [productId, ...filtered].slice(0, 10) };
        });
      },
    }),
    {
      name: "vendora-ui",
      partialize: (state) => ({
        theme: state.theme,
        recentlyViewed: state.recentlyViewed,
      }),
    }
  )
);
