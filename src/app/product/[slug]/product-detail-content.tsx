"use client";

import * as React from "react";
import Link from "next/link";
import {
  Heart,
  ShoppingCart,
  Share2,
  Truck,
  RotateCcw,
  ShieldCheck,
  BadgeCheck,
  Minus,
  Plus,
  Star,
  ChevronRight,
  Store,
  Package,
  Zap,
} from "lucide-react";
import { useQuery } from "@tanstack/react-query";
import { api } from "@/services/api";
import { useCartStore } from "@/stores/cart";
import { useWishlistStore } from "@/stores/wishlist";
import { useUIStore } from "@/stores/ui";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Rating } from "@/components/ui/rating";
import { Breadcrumb } from "@/components/ui/breadcrumb";
import { Separator } from "@/components/ui/separator";
import { ProductCard } from "@/components/ecommerce/product-card";
import { ProductGridSkeleton } from "@/components/ecommerce/product-skeleton";
import { SectionHeader } from "@/components/ecommerce/section-header";
import { formatPrice, getDiscountPercentage } from "@/lib/utils";
import { cn } from "@/lib/utils";
import { getProductBySlug } from "@/mock/products";

export function ProductDetailContent({ slug }: { slug: string }) {
  const product = getProductBySlug(slug);
  const addItem = useCartStore((s) => s.addItem);
  const toggleWishlist = useWishlistStore((s) => s.toggleItem);
  const isInWishlist = useWishlistStore((s) => s.isInWishlist(product?.id || ""));
  const addToast = useUIStore((s) => s.addToast);
  const setCartDrawerOpen = useUIStore((s) => s.setCartDrawerOpen);
  const addRecentlyViewed = useUIStore((s) => s.addRecentlyViewed);

  const [selectedImage, setSelectedImage] = React.useState(0);
  const [selectedVariant, setSelectedVariant] = React.useState(0);
  const [quantity, setQuantity] = React.useState(1);
  const [activeTab, setActiveTab] = React.useState("description");

  const { data: relatedProducts, isLoading: relatedLoading } = useQuery({
    queryKey: ["related-products", product?.id],
    queryFn: () => (product ? api.products.getRelated(product) : Promise.resolve([])),
    enabled: !!product,
  });

  const { data: productReviews } = useQuery({
    queryKey: ["product-reviews", product?.id],
    queryFn: () => (product ? api.reviews.list({ productId: product.id }) : Promise.resolve([])),
    enabled: !!product,
  });

  React.useEffect(() => {
    if (product) {
      addRecentlyViewed(product.id);
    }
  }, [product, addRecentlyViewed]);

  if (!product) return null;

  const discount = getDiscountPercentage(product.price, product.originalPrice);
  const outOfStock = product.stock === 0;
  const variant = product.variants[selectedVariant];
  const currentPrice = product.price + (variant?.priceModifier || 0);

  const handleAddToCart = () => {
    if (outOfStock) return;
    addItem(product, quantity, variant);
    addToast({
      title: "Added to cart",
      description: product.name,
      variant: "success",
    });
    setCartDrawerOpen(true);
  };

  const handleBuyNow = () => {
    if (outOfStock) return;
    addItem(product, quantity, variant);
    setCartDrawerOpen(false);
    window.location.href = "/checkout";
  };

  const handleShare = () => {
    navigator.clipboard.writeText(window.location.href);
    addToast({
      title: "Link copied",
      description: "Product link copied to clipboard",
      variant: "success",
    });
  };

  return (
    <div className="mx-auto max-w-7xl px-4 py-6">
      <Breadcrumb
        items={[
          { label: "Home", href: "/" },
          { label: "Shop", href: "/shop" },
          { label: product.category, href: `/shop/${product.categorySlug}` },
          { label: product.name },
        ]}
        className="mb-6"
      />

      <div className="grid gap-8 lg:grid-cols-2">
        <div className="space-y-4">
          <div className="relative aspect-square overflow-hidden rounded-xl border border-border bg-muted">
            <img
              src={product.images[selectedImage]}
              alt={product.name}
              className="h-full w-full object-cover"
            />
            {discount > 0 && (
              <Badge variant="destructive" className="absolute left-3 top-3 text-sm">
                -{discount}%
              </Badge>
            )}
            {product.flashSale && (
              <Badge variant="warning" className="absolute right-3 top-3">
                <Zap className="mr-1 h-3 w-3" />
                Flash Sale
              </Badge>
            )}
          </div>
          <div className="flex gap-2">
            {product.images.map((img, i) => (
              <button
                key={i}
                onClick={() => setSelectedImage(i)}
                className={cn(
                  "h-20 w-20 overflow-hidden rounded-lg border-2 transition-colors cursor-pointer",
                  selectedImage === i
                    ? "border-primary"
                    : "border-border hover:border-muted-foreground"
                )}
              >
                <img src={img} alt="" className="h-full w-full object-cover" />
              </button>
            ))}
          </div>
        </div>

        <div className="space-y-6">
          <div>
            <Link
              href={`/vendors/${product.vendorSlug}`}
              className="flex items-center gap-1 text-sm text-muted-foreground hover:text-foreground"
            >
              <Store className="h-4 w-4" />
              {product.vendorName}
              {product.vendorVerified && (
                <BadgeCheck className="h-4 w-4 text-info" />
              )}
            </Link>
            <h1 className="mt-2 text-2xl font-bold lg:text-3xl">{product.name}</h1>
            <div className="mt-2 flex items-center gap-3">
              <Rating value={product.rating} showValue />
              <span className="text-sm text-muted-foreground">
                ({product.reviewCount} reviews)
              </span>
              <span className="text-sm text-muted-foreground">
                {product.sold.toLocaleString()} sold
              </span>
            </div>
          </div>

          <div className="flex items-baseline gap-3">
            <span className="text-3xl font-bold">{formatPrice(currentPrice)}</span>
            {product.originalPrice > product.price && (
              <>
                <span className="text-lg text-muted-foreground line-through">
                  {formatPrice(product.originalPrice)}
                </span>
                <Badge variant="destructive">Save {discount}%</Badge>
              </>
            )}
          </div>

          <p className="text-muted-foreground">{product.shortDescription}</p>

          {product.variants.length > 0 && (
            <div>
              <p className="mb-2 text-sm font-medium">
                {product.variants[0].name}:
              </p>
              <div className="flex flex-wrap gap-2">
                {product.variants[0].options.map((option, i) => (
                  <button
                    key={option}
                    onClick={() => setSelectedVariant(i)}
                    className={cn(
                      "rounded-lg border px-4 py-2 text-sm font-medium transition-colors cursor-pointer",
                      selectedVariant === i
                        ? "border-primary bg-primary/5 text-primary"
                        : "border-border hover:border-muted-foreground"
                    )}
                  >
                    {option}
                  </button>
                ))}
              </div>
            </div>
          )}

          <div className="flex items-center gap-4">
            <div className="flex items-center rounded-lg border border-border">
              <Button
                size="icon"
                variant="ghost"
                className="h-10 w-10"
                onClick={() => setQuantity(Math.max(1, quantity - 1))}
                aria-label="Decrease quantity"
              >
                <Minus className="h-4 w-4" />
              </Button>
              <span className="w-12 text-center font-medium">{quantity}</span>
              <Button
                size="icon"
                variant="ghost"
                className="h-10 w-10"
                onClick={() => setQuantity(Math.min(product.stock, quantity + 1))}
                aria-label="Increase quantity"
              >
                <Plus className="h-4 w-4" />
              </Button>
            </div>
            <span
              className={cn(
                "text-sm",
                outOfStock ? "text-destructive" : "text-success"
              )}
            >
              {outOfStock
                ? "Out of Stock"
                : product.stock < 10
                  ? `Only ${product.stock} left!`
                  : "In Stock"}
            </span>
          </div>

          <div className="flex gap-3">
            <Button
              size="lg"
              className="flex-1"
              onClick={handleAddToCart}
              disabled={outOfStock}
            >
              <ShoppingCart className="h-5 w-5" />
              Add to Cart
            </Button>
            <Button
              size="lg"
              variant="outline"
              className="flex-1"
              onClick={handleBuyNow}
              disabled={outOfStock}
            >
              Buy Now
            </Button>
            <Button
              size="icon"
              variant="outline"
              className="h-11 w-11"
              onClick={() => {
                toggleWishlist(product);
                addToast({
                  title: isInWishlist ? "Removed from wishlist" : "Added to wishlist",
                  variant: "default",
                });
              }}
              aria-label="Toggle wishlist"
            >
              <Heart
                className={cn("h-5 w-5", isInWishlist && "fill-destructive text-destructive")}
              />
            </Button>
            <Button
              size="icon"
              variant="outline"
              className="h-11 w-11"
              onClick={handleShare}
              aria-label="Share"
            >
              <Share2 className="h-5 w-5" />
            </Button>
          </div>

          <div className="space-y-3 rounded-xl border border-border bg-card p-4">
            <div className="flex items-center gap-3 text-sm">
              <Truck className="h-5 w-5 text-primary" />
              <div>
                <p className="font-medium">
                  {product.freeShipping ? "Free Shipping" : "Standard Shipping"}
                </p>
                <p className="text-muted-foreground">
                  Estimated delivery: 3-5 business days
                </p>
              </div>
            </div>
            <Separator />
            <div className="flex items-center gap-3 text-sm">
              <RotateCcw className="h-5 w-5 text-primary" />
              <div>
                <p className="font-medium">30-Day Returns</p>
                <p className="text-muted-foreground">
                  Easy returns within 30 days of delivery
                </p>
              </div>
            </div>
            <Separator />
            <div className="flex items-center gap-3 text-sm">
              <ShieldCheck className="h-5 w-5 text-primary" />
              <div>
                <p className="font-medium">Buyer Protection</p>
                <p className="text-muted-foreground">
                  Full refund if item doesn&apos;t arrive or as described
                </p>
              </div>
            </div>
          </div>

          <div className="rounded-xl border border-border bg-card p-4">
            <div className="flex items-center gap-3">
              <div className="flex h-12 w-12 items-center justify-center rounded-full bg-primary/10">
                <Store className="h-6 w-6 text-primary" />
              </div>
              <div>
                <Link
                  href={`/vendors/${product.vendorSlug}`}
                  className="flex items-center gap-1 font-medium hover:text-primary"
                >
                  {product.vendorName}
                  {product.vendorVerified && (
                    <BadgeCheck className="h-4 w-4 text-info" />
                  )}
                </Link>
                <div className="flex items-center gap-2 text-sm text-muted-foreground">
                  <Rating value={product.rating} size="sm" />
                  <span>{product.rating} rating</span>
                </div>
              </div>
              <Link href={`/vendors/${product.vendorSlug}`} className="ml-auto">
                <Button variant="outline" size="sm">Visit Store</Button>
              </Link>
            </div>
          </div>
        </div>
      </div>

      <div className="mt-12">
        <div className="flex gap-1 border-b border-border">
          {["description", "specifications", "reviews"].map((tab) => (
            <button
              key={tab}
              onClick={() => setActiveTab(tab)}
              className={cn(
                "px-4 py-3 text-sm font-medium capitalize transition-colors cursor-pointer",
                activeTab === tab
                  ? "border-b-2 border-primary text-primary"
                  : "text-muted-foreground hover:text-foreground"
              )}
            >
              {tab}
              {tab === "reviews" && ` (${product.reviewCount})`}
            </button>
          ))}
        </div>
        <div className="py-6">
          {activeTab === "description" && (
            <div className="prose max-w-none">
              <p>{product.description}</p>
            </div>
          )}
          {activeTab === "specifications" && (
            <div className="grid gap-4 sm:grid-cols-2">
              {Object.entries(product.specifications).map(([key, value]) => (
                <div
                  key={key}
                  className="flex justify-between rounded-lg border border-border p-3"
                >
                  <span className="text-sm text-muted-foreground">{key}</span>
                  <span className="text-sm font-medium">{value}</span>
                </div>
              ))}
            </div>
          )}
          {activeTab === "reviews" && (
            <div className="space-y-6">
              {productReviews?.length === 0 ? (
                <p className="text-center text-muted-foreground">
                  No reviews yet. Be the first to review this product!
                </p>
              ) : (
                productReviews?.map((review) => (
                  <div key={review.id} className="border-b border-border pb-6">
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-3">
                        <div className="flex h-10 w-10 items-center justify-center rounded-full bg-primary/10 text-sm font-medium text-primary">
                          {review.customerName[0]}
                        </div>
                        <div>
                          <p className="font-medium">{review.customerName}</p>
                          <div className="flex items-center gap-2">
                            <Rating value={review.rating} size="sm" />
                            {review.verified && (
                              <Badge variant="success" className="text-xs">
                                Verified
                              </Badge>
                            )}
                          </div>
                        </div>
                      </div>
                      <span className="text-sm text-muted-foreground">
                        {new Date(review.createdAt).toLocaleDateString()}
                      </span>
                    </div>
                    <h4 className="mt-3 font-medium">{review.title}</h4>
                    <p className="mt-1 text-sm text-muted-foreground">
                      {review.comment}
                    </p>
                    {review.vendorReply && (
                      <div className="mt-3 rounded-lg bg-muted p-3">
                        <p className="text-xs font-medium text-muted-foreground">
                          Vendor Response:
                        </p>
                        <p className="mt-1 text-sm">{review.vendorReply}</p>
                      </div>
                    )}
                  </div>
                ))
              )}
            </div>
          )}
        </div>
      </div>

      <div className="mt-12">
        <SectionHeader title="Related Products" subtitle="You might also like" />
        {relatedLoading ? (
          <ProductGridSkeleton count={4} />
        ) : (
          <div className="grid grid-cols-2 gap-4 sm:grid-cols-3 lg:grid-cols-4">
            {relatedProducts?.slice(0, 4).map((p) => (
              <ProductCard key={p.id} product={p} />
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
