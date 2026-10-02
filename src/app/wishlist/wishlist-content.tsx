"use client";

import * as React from "react";
import { Heart } from "lucide-react";
import { useWishlistStore } from "@/stores/wishlist";
import { ProductCard } from "@/components/ecommerce/product-card";
import { EmptyState } from "@/components/ui/empty-state";
import { Breadcrumb } from "@/components/ui/breadcrumb";

export function WishlistContent() {
  const items = useWishlistStore((s) => s.items);

  return (
    <div className="mx-auto max-w-7xl px-4 py-6">
      <Breadcrumb items={[{ label: "Home", href: "/" }, { label: "Wishlist" }]} className="mb-4" />

      <h1 className="mb-6 text-2xl font-bold">My Wishlist ({items.length})</h1>

      {items.length === 0 ? (
        <EmptyState
          icon={<Heart className="h-8 w-8 text-muted-foreground" />}
          title="Your wishlist is empty"
          description="Save items you love to your wishlist and they'll appear here"
          action={{ label: "Discover Products", onClick: () => (window.location.href = "/shop") }}
        />
      ) : (
        <div className="grid grid-cols-2 gap-4 sm:grid-cols-3 lg:grid-cols-4">
          {items.map((product) => (
            <ProductCard key={product.id} product={product} />
          ))}
        </div>
      )}
    </div>
  );
}
