"use client";

import * as React from "react";
import Link from "next/link";
import { Heart, ShoppingCart, Eye, BadgeCheck } from "lucide-react";
import type { Product } from "@/types";
import { cn, formatPrice, getDiscountPercentage } from "@/lib/utils";
import { Rating } from "@/components/ui/rating";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { useCartStore } from "@/stores/cart";
import { useWishlistStore } from "@/stores/wishlist";
import { useUIStore } from "@/stores/ui";

interface ProductCardProps {
  product: Product;
  className?: string;
}

export function ProductCard({ product, className }: ProductCardProps) {
  const addItem = useCartStore((s) => s.addItem);
  const toggleWishlist = useWishlistStore((s) => s.toggleItem);
  const isInWishlist = useWishlistStore((s) => s.isInWishlist(product.id));
  const addToast = useUIStore((s) => s.addToast);
  const setCartDrawerOpen = useUIStore((s) => s.setCartDrawerOpen);
  const [imageIndex, setImageIndex] = React.useState(0);
  const [isHovered, setIsHovered] = React.useState(false);

  const discount = getDiscountPercentage(product.price, product.originalPrice);
  const outOfStock = product.stock === 0;

  const handleAddToCart = (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    if (outOfStock) return;
    addItem(product);
    addToast({
      title: "Added to cart",
      description: product.name,
      variant: "success",
    });
    setCartDrawerOpen(true);
  };

  const handleToggleWishlist = (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    toggleWishlist(product);
    addToast({
      title: isInWishlist ? "Removed from wishlist" : "Added to wishlist",
      description: product.name,
      variant: "default",
    });
  };

  return (
    <div
      className={cn(
        "group relative flex flex-col overflow-hidden rounded-xl border border-border bg-card transition-all hover:shadow-md",
        className
      )}
      onMouseEnter={() => {
        setIsHovered(true);
        if (product.images.length > 1) setImageIndex(1);
      }}
      onMouseLeave={() => {
        setIsHovered(false);
        setImageIndex(0);
      }}
    >
      <Link
        href={`/product/${product.slug}`}
        className="relative aspect-square overflow-hidden bg-muted"
      >
        <img
          src={product.images[imageIndex]}
          alt={product.name}
          className="h-full w-full object-cover transition-transform duration-300 group-hover:scale-105"
          loading="lazy"
        />
        {discount > 0 && (
          <Badge
            variant="destructive"
            className="absolute left-2 top-2"
          >
            -{discount}%
          </Badge>
        )}
        {outOfStock && (
          <div className="absolute inset-0 flex items-center justify-center bg-black/40">
            <Badge variant="secondary" className="text-sm">
              Out of Stock
            </Badge>
          </div>
        )}
        {product.flashSale && !outOfStock && (
          <Badge
            variant="warning"
            className="absolute right-2 top-2"
          >
            Flash Sale
          </Badge>
        )}
        <div
          className={cn(
            "absolute right-2 top-10 flex flex-col gap-1 transition-opacity",
            isHovered ? "opacity-100" : "opacity-0"
          )}
        >
          <Button
            size="icon"
            variant="secondary"
            className="h-8 w-8 rounded-full shadow-sm"
            onClick={handleToggleWishlist}
            aria-label="Toggle wishlist"
          >
            <Heart
              className={cn(
                "h-4 w-4",
                isInWishlist && "fill-destructive text-destructive"
              )}
            />
          </Button>
          <Link href={`/product/${product.slug}`}>
            <Button
              size="icon"
              variant="secondary"
              className="h-8 w-8 rounded-full shadow-sm"
              aria-label="Quick view"
            >
              <Eye className="h-4 w-4" />
            </Button>
          </Link>
        </div>
      </Link>

      <div className="flex flex-1 flex-col gap-1.5 p-3">
        <Link
          href={`/vendors/${product.vendorSlug}`}
          className="flex items-center gap-1 text-xs text-muted-foreground hover:text-foreground"
        >
          {product.vendorName}
          {product.vendorVerified && (
            <BadgeCheck className="h-3.5 w-3.5 text-info" />
          )}
        </Link>
        <Link
          href={`/product/${product.slug}`}
          className="line-clamp-2 text-sm font-medium leading-snug hover:text-primary"
        >
          {product.name}
        </Link>
        <div className="flex items-center gap-1.5">
          <Rating value={product.rating} size="sm" />
          <span className="text-xs text-muted-foreground">
            ({product.reviewCount})
          </span>
        </div>
        <div className="mt-auto flex items-center justify-between pt-1">
          <div className="flex flex-col">
            <span className="text-base font-bold">
              {formatPrice(product.price)}
            </span>
            {product.originalPrice > product.price && (
              <span className="text-xs text-muted-foreground line-through">
                {formatPrice(product.originalPrice)}
              </span>
            )}
          </div>
          <Button
            size="icon"
            className="h-8 w-8"
            onClick={handleAddToCart}
            disabled={outOfStock}
            aria-label="Add to cart"
          >
            <ShoppingCart className="h-4 w-4" />
          </Button>
        </div>
      </div>
    </div>
  );
}
