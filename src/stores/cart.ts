"use client";

import { create } from "zustand";
import { persist } from "zustand/middleware";
import type { CartItem, Product, ProductVariant } from "@/types";

interface CartState {
  items: CartItem[];
  addItem: (product: Product, quantity?: number, variant?: ProductVariant) => void;
  removeItem: (itemId: string) => void;
  updateQuantity: (itemId: string, quantity: number) => void;
  toggleSaveForLater: (itemId: string) => void;
  clearCart: () => void;
  getSubtotal: () => number;
  getItemCount: () => number;
  getGroupedItems: () => Map<string, CartItem[]>;
}

export const useCartStore = create<CartState>()(
  persist(
    (set, get) => ({
      items: [],

      addItem: (product, quantity = 1, variant) => {
        set((state) => {
          const existing = state.items.find(
            (item) =>
              item.productId === product.id &&
              item.variant?.id === variant?.id &&
              !item.savedForLater
          );
          if (existing) {
            return {
              items: state.items.map((item) =>
                item.id === existing.id
                  ? { ...item, quantity: item.quantity + quantity }
                  : item
              ),
            };
          }
          const newItem: CartItem = {
            id: `cart-${Date.now()}-${Math.random().toString(36).slice(2, 7)}`,
            productId: product.id,
            product,
            quantity,
            variant,
            savedForLater: false,
          };
          return { items: [...state.items, newItem] };
        });
      },

      removeItem: (itemId) => {
        set((state) => ({
          items: state.items.filter((item) => item.id !== itemId),
        }));
      },

      updateQuantity: (itemId, quantity) => {
        if (quantity < 1) return;
        set((state) => ({
          items: state.items.map((item) =>
            item.id === itemId ? { ...item, quantity } : item
          ),
        }));
      },

      toggleSaveForLater: (itemId) => {
        set((state) => ({
          items: state.items.map((item) =>
            item.id === itemId
              ? { ...item, savedForLater: !item.savedForLater }
              : item
          ),
        }));
      },

      clearCart: () => set({ items: [] }),

      getSubtotal: () => {
        return get()
          .items.filter((i) => !i.savedForLater)
          .reduce(
            (sum, item) =>
              sum +
              (item.product.price + (item.variant?.priceModifier || 0)) *
                item.quantity,
            0
          );
      },

      getItemCount: () => {
        return get()
          .items.filter((i) => !i.savedForLater)
          .reduce((sum, item) => sum + item.quantity, 0);
      },

      getGroupedItems: () => {
        const grouped = new Map<string, CartItem[]>();
        get()
          .items.filter((i) => !i.savedForLater)
          .forEach((item) => {
            const vendorId = item.product.vendorId;
            const existing = grouped.get(vendorId) || [];
            grouped.set(vendorId, [...existing, item]);
          });
        return grouped;
      },
    }),
    {
      name: "vendora-cart",
    }
  )
);
