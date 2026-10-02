"use client";

import * as React from "react";
import Link from "next/link";
import { Minus, Plus, Trash2, ArrowRight, ShoppingBag, Heart } from "lucide-react";
import { useCartStore } from "@/stores/cart";
import { useUIStore } from "@/stores/ui";
import { Button } from "@/components/ui/button";
import { Separator } from "@/components/ui/separator";
import { EmptyState } from "@/components/ui/empty-state";
import { Breadcrumb } from "@/components/ui/breadcrumb";
import { formatPrice } from "@/lib/utils";
import { getVendorById } from "@/mock/vendors";

export function CartContent() {
  const { items, removeItem, updateQuantity, toggleSaveForLater, getSubtotal, getGroupedItems } =
    useCartStore();
  const addToast = useUIStore((s) => s.addToast);

  const activeItems = items.filter((i) => !i.savedForLater);
  const savedItems = items.filter((i) => i.savedForLater);
  const subtotal = getSubtotal();
  const shipping = subtotal > 100 ? 0 : 5.99;
  const tax = Math.round(subtotal * 0.08 * 100) / 100;
  const total = Math.round((subtotal + shipping + tax) * 100) / 100;
  const grouped = getGroupedItems();

  if (items.length === 0) {
    return (
      <div className="mx-auto max-w-7xl px-4 py-6">
        <Breadcrumb items={[{ label: "Home", href: "/" }, { label: "Cart" }]} className="mb-4" />
        <EmptyState
          icon={<ShoppingBag className="h-8 w-8 text-muted-foreground" />}
          title="Your cart is empty"
          description="Looks like you haven't added anything to your cart yet"
          action={{ label: "Start Shopping", onClick: () => (window.location.href = "/shop") }}
        />
      </div>
    );
  }

  return (
    <div className="mx-auto max-w-7xl px-4 py-6">
      <Breadcrumb items={[{ label: "Home", href: "/" }, { label: "Cart" }]} className="mb-4" />

      <h1 className="mb-6 text-2xl font-bold">Shopping Cart ({activeItems.length} items)</h1>

      <div className="grid gap-8 lg:grid-cols-3">
        <div className="space-y-6 lg:col-span-2">
          {Array.from(grouped.entries()).map(([vendorId, vendorItems]) => {
            const vendor = getVendorById(vendorId);
            const vendorSubtotal = vendorItems.reduce(
              (sum, item) => sum + item.product.price * item.quantity,
              0
            );
            return (
              <div key={vendorId} className="rounded-xl border border-border bg-card">
                <div className="flex items-center gap-2 border-b border-border p-4">
                  <Link
                    href={`/vendors/${vendor?.slug}`}
                    className="font-medium hover:text-primary"
                  >
                    {vendor?.name || "Unknown Vendor"}
                  </Link>
                  {vendor?.verified && (
                    <span className="text-xs text-info">Verified</span>
                  )}
                </div>
                <div className="divide-y divide-border">
                  {vendorItems.map((item) => (
                    <div key={item.id} className="flex gap-4 p-4">
                      <Link href={`/product/${item.product.slug}`}>
                        <img
                          src={item.product.images[0]}
                          alt={item.product.name}
                          className="h-24 w-24 rounded-lg object-cover"
                        />
                      </Link>
                      <div className="flex flex-1 flex-col">
                        <Link
                          href={`/product/${item.product.slug}`}
                          className="line-clamp-2 text-sm font-medium hover:text-primary"
                        >
                          {item.product.name}
                        </Link>
                        {item.variant && (
                          <p className="text-xs text-muted-foreground">
                            {item.variant.name}: {item.variant.options[0]}
                          </p>
                        )}
                        <div className="mt-auto flex items-center justify-between">
                          <div className="flex items-center gap-1">
                            <Button
                              size="icon"
                              variant="outline"
                              className="h-8 w-8"
                              onClick={() => updateQuantity(item.id, item.quantity - 1)}
                              aria-label="Decrease"
                            >
                              <Minus className="h-3 w-3" />
                            </Button>
                            <span className="w-10 text-center text-sm font-medium">
                              {item.quantity}
                            </span>
                            <Button
                              size="icon"
                              variant="outline"
                              className="h-8 w-8"
                              onClick={() => updateQuantity(item.id, item.quantity + 1)}
                              aria-label="Increase"
                            >
                              <Plus className="h-3 w-3" />
                            </Button>
                          </div>
                          <div className="flex items-center gap-3">
                            <span className="font-bold">
                              {formatPrice(item.product.price * item.quantity)}
                            </span>
                            <div className="flex gap-1">
                              <Button
                                size="icon"
                                variant="ghost"
                                className="h-8 w-8"
                                onClick={() => toggleSaveForLater(item.id)}
                                aria-label="Save for later"
                              >
                                <Heart className="h-4 w-4" />
                              </Button>
                              <Button
                                size="icon"
                                variant="ghost"
                                className="h-8 w-8 text-destructive"
                                onClick={() => {
                                  removeItem(item.id);
                                  addToast({ title: "Removed from cart", variant: "default" });
                                }}
                                aria-label="Remove"
                              >
                                <Trash2 className="h-4 w-4" />
                              </Button>
                            </div>
                          </div>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
                <div className="border-t border-border p-4 text-right text-sm">
                  <span className="text-muted-foreground">Vendor subtotal: </span>
                  <span className="font-bold">{formatPrice(vendorSubtotal)}</span>
                </div>
              </div>
            );
          })}

          {savedItems.length > 0 && (
            <div className="rounded-xl border border-border bg-card">
              <div className="border-b border-border p-4">
                <h3 className="font-medium">Saved for Later ({savedItems.length})</h3>
              </div>
              <div className="divide-y divide-border">
                {savedItems.map((item) => (
                  <div key={item.id} className="flex items-center gap-4 p-4">
                    <img
                      src={item.product.images[0]}
                      alt={item.product.name}
                      className="h-16 w-16 rounded-lg object-cover"
                    />
                    <div className="flex-1">
                      <Link
                        href={`/product/${item.product.slug}`}
                        className="line-clamp-1 text-sm font-medium hover:text-primary"
                      >
                        {item.product.name}
                      </Link>
                      <p className="text-sm font-bold">{formatPrice(item.product.price)}</p>
                    </div>
                    <div className="flex gap-2">
                      <Button
                        size="sm"
                        variant="outline"
                        onClick={() => toggleSaveForLater(item.id)}
                      >
                        Move to Cart
                      </Button>
                      <Button
                        size="icon"
                        variant="ghost"
                        className="text-destructive"
                        onClick={() => removeItem(item.id)}
                        aria-label="Remove"
                      >
                        <Trash2 className="h-4 w-4" />
                      </Button>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>

        <div className="lg:col-span-1">
          <div className="sticky top-20 rounded-xl border border-border bg-card p-6">
            <h2 className="mb-4 text-lg font-semibold">Order Summary</h2>
            <div className="space-y-3 text-sm">
              <div className="flex justify-between">
                <span className="text-muted-foreground">Subtotal</span>
                <span>{formatPrice(subtotal)}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-muted-foreground">Shipping</span>
                <span>{shipping === 0 ? "Free" : formatPrice(shipping)}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-muted-foreground">Tax</span>
                <span>{formatPrice(tax)}</span>
              </div>
              <Separator />
              <div className="flex justify-between text-base font-bold">
                <span>Total</span>
                <span>{formatPrice(total)}</span>
              </div>
            </div>
            <Link href="/checkout" className="mt-6 block">
              <Button className="w-full" size="lg">
                Proceed to Checkout
                <ArrowRight className="h-4 w-4" />
              </Button>
            </Link>
            <Link
              href="/shop"
              className="mt-3 block text-center text-sm text-primary hover:underline"
            >
              Continue Shopping
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
}
