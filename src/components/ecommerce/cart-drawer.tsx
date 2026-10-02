"use client";

import * as React from "react";
import Link from "next/link";
import { X, Plus, Minus, Trash2, ShoppingBag } from "lucide-react";
import { useCartStore } from "@/stores/cart";
import { useUIStore } from "@/stores/ui";
import { Drawer, DrawerHeader, DrawerTitle, DrawerClose, DrawerContent } from "@/components/ui/drawer";
import { Button } from "@/components/ui/button";
import { formatPrice } from "@/lib/utils";

export function CartDrawer() {
  const { cartDrawerOpen, setCartDrawerOpen } = useUIStore();
  const { items, removeItem, updateQuantity, getSubtotal } = useCartStore();
  const activeItems = items.filter((i) => !i.savedForLater);
  const subtotal = getSubtotal();

  return (
    <Drawer open={cartDrawerOpen} onOpenChange={setCartDrawerOpen} side="right" className="w-full max-w-md">
      <DrawerHeader>
        <DrawerTitle className="flex items-center gap-2">
          <ShoppingBag className="h-5 w-5" />
          Shopping Cart ({activeItems.length})
        </DrawerTitle>
        <DrawerClose />
      </DrawerHeader>
      <DrawerContent>
        {activeItems.length === 0 ? (
          <div className="flex flex-col items-center justify-center py-16 text-center">
            <ShoppingBag className="h-12 w-12 text-muted-foreground" />
            <p className="mt-4 font-medium">Your cart is empty</p>
            <p className="mt-1 text-sm text-muted-foreground">
              Add items to get started
            </p>
            <Button
              className="mt-4"
              onClick={() => {
                setCartDrawerOpen(false);
              }}
            >
              <Link href="/shop">Continue Shopping</Link>
            </Button>
          </div>
        ) : (
          <div className="flex flex-col gap-4">
            {activeItems.map((item) => (
              <div key={item.id} className="flex gap-3 rounded-lg border border-border p-3">
                <img
                  src={item.product.images[0]}
                  alt={item.product.name}
                  className="h-20 w-20 rounded-lg object-cover"
                />
                <div className="flex flex-1 flex-col">
                  <Link
                    href={`/product/${item.product.slug}`}
                    className="line-clamp-2 text-sm font-medium hover:text-primary"
                    onClick={() => setCartDrawerOpen(false)}
                  >
                    {item.product.name}
                  </Link>
                  <p className="text-xs text-muted-foreground">
                    {item.product.vendorName}
                  </p>
                  <div className="mt-auto flex items-center justify-between">
                    <div className="flex items-center gap-1">
                      <Button
                        size="icon"
                        variant="outline"
                        className="h-7 w-7"
                        onClick={() => updateQuantity(item.id, item.quantity - 1)}
                        aria-label="Decrease quantity"
                      >
                        <Minus className="h-3 w-3" />
                      </Button>
                      <span className="w-8 text-center text-sm font-medium">
                        {item.quantity}
                      </span>
                      <Button
                        size="icon"
                        variant="outline"
                        className="h-7 w-7"
                        onClick={() => updateQuantity(item.id, item.quantity + 1)}
                        aria-label="Increase quantity"
                      >
                        <Plus className="h-3 w-3" />
                      </Button>
                    </div>
                    <div className="flex items-center gap-2">
                      <span className="text-sm font-bold">
                        {formatPrice(item.product.price * item.quantity)}
                      </span>
                      <Button
                        size="icon"
                        variant="ghost"
                        className="h-7 w-7 text-destructive"
                        onClick={() => removeItem(item.id)}
                        aria-label="Remove item"
                      >
                        <Trash2 className="h-4 w-4" />
                      </Button>
                    </div>
                  </div>
                </div>
              </div>
            ))}

            <div className="border-t border-border pt-4">
              <div className="flex items-center justify-between text-sm">
                <span className="text-muted-foreground">Subtotal</span>
                <span className="text-lg font-bold">{formatPrice(subtotal)}</span>
              </div>
              <p className="mt-1 text-xs text-muted-foreground">
                Shipping and taxes calculated at checkout
              </p>
              <div className="mt-4 flex gap-2">
                <Button
                  variant="outline"
                  className="flex-1"
                  onClick={() => setCartDrawerOpen(false)}
                >
                  <Link href="/cart" className="w-full">View Cart</Link>
                </Button>
                <Button className="flex-1" onClick={() => setCartDrawerOpen(false)}>
                  <Link href="/checkout" className="w-full">Checkout</Link>
                </Button>
              </div>
            </div>
          </div>
        )}
      </DrawerContent>
    </Drawer>
  );
}
