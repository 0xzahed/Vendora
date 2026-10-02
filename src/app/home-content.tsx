"use client";

import * as React from "react";
import Link from "next/link";
import {
  ArrowRight,
  Zap,
  TrendingUp,
  Award,
  Sparkles,
  Star,
  Quote,
  ChevronRight,
  ShieldCheck,
  Truck,
  RotateCcw,
  Headphones,
} from "lucide-react";
import { useQuery } from "@tanstack/react-query";
import { api } from "@/services/api";
import { ProductCard } from "@/components/ecommerce/product-card";
import { ProductGridSkeleton } from "@/components/ecommerce/product-skeleton";
import { SectionHeader } from "@/components/ecommerce/section-header";
import { VendorCard } from "@/components/ecommerce/vendor-card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Rating } from "@/components/ui/rating";
import { categories } from "@/mock/categories";
import { getFlashSaleProducts, getProductBySlug } from "@/mock/products";
import { useUIStore } from "@/stores/ui";
import { formatPrice } from "@/lib/utils";

function HeroBanner() {
  return (
    <section className="relative overflow-hidden rounded-2xl bg-gradient-to-br from-primary/10 via-primary/5 to-transparent">
      <div className="mx-auto max-w-7xl px-4 py-12 lg:py-20">
        <div className="grid items-center gap-8 lg:grid-cols-2">
          <div className="space-y-6">
            <Badge variant="secondary" className="text-sm">
              <Sparkles className="mr-1 h-3.5 w-3.5" />
              New Season Collection
            </Badge>
            <h1 className="text-4xl font-bold leading-tight tracking-tight lg:text-5xl">
              Discover Products
              <br />
              From{" "}
              <span className="text-primary">Verified Vendors</span>
            </h1>
            <p className="max-w-md text-lg text-muted-foreground">
              Shop from thousands of trusted sellers. Quality products, competitive
              prices, and fast delivery — all in one marketplace.
            </p>
            <div className="flex flex-wrap gap-3">
              <Link href="/shop">
                <Button size="lg" className="gap-2">
                  Shop Now
                  <ArrowRight className="h-4 w-4" />
                </Button>
              </Link>
              <Link href="/vendors">
                <Button size="lg" variant="outline" className="gap-2">
                  Explore Vendors
                </Button>
              </Link>
            </div>
            <div className="flex items-center gap-6 pt-2">
              <div>
                <p className="text-2xl font-bold">10K+</p>
                <p className="text-sm text-muted-foreground">Products</p>
              </div>
              <div className="h-10 w-px bg-border" />
              <div>
                <p className="text-2xl font-bold">500+</p>
                <p className="text-sm text-muted-foreground">Vendors</p>
              </div>
              <div className="h-10 w-px bg-border" />
              <div>
                <p className="text-2xl font-bold">50K+</p>
                <p className="text-sm text-muted-foreground">Customers</p>
              </div>
            </div>
          </div>
          <div className="relative hidden lg:block">
            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-4">
                <div className="overflow-hidden rounded-xl">
                  <img
                    src="https://images.unsplash.com/photo-1505740420928-5e560c06d30e?auto=format&fit=crop&w=400&q=80"
                    alt="Featured product"
                    className="h-48 w-full object-cover"
                  />
                </div>
                <div className="overflow-hidden rounded-xl">
                  <img
                    src="https://images.unsplash.com/photo-1523275335684-37898b6baf30?auto=format&fit=crop&w=400&q=80"
                    alt="Featured product"
                    className="h-32 w-full object-cover"
                  />
                </div>
              </div>
              <div className="space-y-4 pt-8">
                <div className="overflow-hidden rounded-xl">
                  <img
                    src="https://images.unsplash.com/photo-1542291026-7eec264c27ff?auto=format&fit=crop&w=400&q=80"
                    alt="Featured product"
                    className="h-32 w-full object-cover"
                  />
                </div>
                <div className="overflow-hidden rounded-xl">
                  <img
                    src="https://images.unsplash.com/photo-1592078615290-033ee584e267?auto=format&fit=crop&w=400&q=80"
                    alt="Featured product"
                    className="h-48 w-full object-cover"
                  />
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}

function CategoryGrid() {
  const topCategories = categories.filter((c) => !c.parentId).slice(0, 8);
  return (
    <section className="py-12">
      <SectionHeader
        title="Shop by Category"
        subtitle="Find exactly what you need"
        href="/shop"
      />
      <div className="grid grid-cols-2 gap-4 sm:grid-cols-4 lg:grid-cols-8">
        {topCategories.map((cat) => (
          <Link
            key={cat.id}
            href={`/shop/${cat.slug}`}
            className="group flex flex-col items-center rounded-xl border border-border bg-card p-4 text-center transition-all hover:shadow-md"
          >
            <div className="mb-3 h-16 w-16 overflow-hidden rounded-full">
              <img
                src={cat.image}
                alt={cat.name}
                className="h-full w-full object-cover transition-transform group-hover:scale-110"
                loading="lazy"
              />
            </div>
            <span className="text-sm font-medium group-hover:text-primary">
              {cat.name}
            </span>
          </Link>
        ))}
      </div>
    </section>
  );
}

function FlashSaleSection() {
  const flashProducts = getFlashSaleProducts().slice(0, 4);
  return (
    <section className="py-12">
      <div className="mb-6 flex items-center justify-between">
        <div className="flex items-center gap-3">
          <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-destructive/10">
            <Zap className="h-5 w-5 text-destructive" />
          </div>
          <div>
            <h2 className="text-2xl font-bold tracking-tight">Flash Sale</h2>
            <p className="text-sm text-muted-foreground">
              Limited time deals — up to 40% off
            </p>
          </div>
        </div>
        <Link
          href="/shop?onSale=true"
          className="flex items-center gap-1 text-sm font-medium text-primary hover:underline"
        >
          View All
          <ArrowRight className="h-4 w-4" />
        </Link>
      </div>
      <div className="grid grid-cols-2 gap-4 sm:grid-cols-3 lg:grid-cols-4">
        {flashProducts.map((product) => (
          <ProductCard key={product.id} product={product} />
        ))}
      </div>
    </section>
  );
}

function TrendingSection() {
  const { data, isLoading } = useQuery({
    queryKey: ["trending-products"],
    queryFn: () => api.products.getTrending(),
  });

  return (
    <section className="py-12">
      <SectionHeader
        title="Trending Now"
        subtitle="Most popular this week"
        href="/shop?sortBy=best_selling"
      />
      {isLoading ? (
        <ProductGridSkeleton count={8} />
      ) : (
        <div className="grid grid-cols-2 gap-4 sm:grid-cols-3 lg:grid-cols-4">
          {data?.slice(0, 8).map((product) => (
            <ProductCard key={product.id} product={product} />
          ))}
        </div>
      )}
    </section>
  );
}

function BestSellingSection() {
  const { data, isLoading } = useQuery({
    queryKey: ["best-selling-products"],
    queryFn: () => api.products.getBestSelling(),
  });

  return (
    <section className="py-12">
      <SectionHeader
        title="Best Sellers"
        subtitle="Customer favorites"
        href="/shop?sortBy=best_selling"
      />
      {isLoading ? (
        <ProductGridSkeleton count={4} />
      ) : (
        <div className="grid grid-cols-2 gap-4 sm:grid-cols-3 lg:grid-cols-4">
          {data?.slice(0, 4).map((product) => (
            <ProductCard key={product.id} product={product} />
          ))}
        </div>
      )}
    </section>
  );
}

function FeaturedVendors() {
  const { data, isLoading } = useQuery({
    queryKey: ["vendors"],
    queryFn: () => api.vendors.getActive(),
  });

  return (
    <section className="py-12">
      <SectionHeader
        title="Featured Vendors"
        subtitle="Trusted sellers with top ratings"
        href="/vendors"
      />
      {isLoading ? (
        <div className="grid grid-cols-2 gap-4 sm:grid-cols-3 lg:grid-cols-4">
          {Array.from({ length: 4 }).map((_, i) => (
            <div key={i} className="h-48 animate-shimmer rounded-xl" />
          ))}
        </div>
      ) : (
        <div className="grid grid-cols-2 gap-4 sm:grid-cols-3 lg:grid-cols-4">
          {data?.slice(0, 4).map((vendor) => (
            <VendorCard key={vendor.id} vendor={vendor} />
          ))}
        </div>
      )}
    </section>
  );
}

function PromoBanners() {
  return (
    <section className="py-12">
      <div className="grid gap-4 md:grid-cols-2">
        <div className="relative overflow-hidden rounded-2xl bg-gradient-to-r from-blue-600 to-blue-800 p-8 text-white">
          <div className="relative z-10">
            <Badge className="mb-3 bg-white/20 text-white">Electronics</Badge>
            <h3 className="text-2xl font-bold">Tech Week Sale</h3>
            <p className="mt-2 max-w-xs text-blue-100">
              Up to 30% off on all electronics. Limited time only.
            </p>
            <Link href="/shop/electronics">
              <Button className="mt-4 bg-white text-blue-700 hover:bg-white/90">
                Shop Electronics
              </Button>
            </Link>
          </div>
          <div className="absolute -right-8 -top-8 h-40 w-40 rounded-full bg-white/10" />
          <div className="absolute -bottom-12 -right-4 h-32 w-32 rounded-full bg-white/10" />
        </div>
        <div className="relative overflow-hidden rounded-2xl bg-gradient-to-r from-amber-500 to-orange-600 p-8 text-white">
          <div className="relative z-10">
            <Badge className="mb-3 bg-white/20 text-white">Fashion</Badge>
            <h3 className="text-2xl font-bold">New Season Arrivals</h3>
            <p className="mt-2 max-w-xs text-amber-100">
              Fresh styles for the new season. Discover the latest trends.
            </p>
            <Link href="/shop/fashion">
              <Button className="mt-4 bg-white text-amber-700 hover:bg-white/90">
                Shop Fashion
              </Button>
            </Link>
          </div>
          <div className="absolute -right-8 -top-8 h-40 w-40 rounded-full bg-white/10" />
          <div className="absolute -bottom-12 -right-4 h-32 w-32 rounded-full bg-white/10" />
        </div>
      </div>
    </section>
  );
}

function RecentlyViewed() {
  const recentlyViewed = useUIStore((s) => s.recentlyViewed);
  if (recentlyViewed.length === 0) return null;

  const products = recentlyViewed
    .map((id) => getProductBySlug(id))
    .filter(Boolean)
    .slice(0, 8);

  if (products.length === 0) return null;

  return (
    <section className="py-12">
      <SectionHeader title="Recently Viewed" subtitle="Pick up where you left off" />
      <div className="grid grid-cols-2 gap-4 sm:grid-cols-3 lg:grid-cols-4">
        {products.map(
          (product) =>
            product && <ProductCard key={product.id} product={product} />
        )}
      </div>
    </section>
  );
}

function Testimonials() {
  const testimonials = [
    {
      name: "Sarah M.",
      role: "Verified Buyer",
      comment:
        "Vendora has become my go-to marketplace. The variety of vendors and products is unmatched, and delivery is always fast.",
      rating: 5,
    },
    {
      name: "James K.",
      role: "Verified Buyer",
      comment:
        "I love being able to compare products from different sellers in one place. The vendor verification gives me confidence in every purchase.",
      rating: 5,
    },
    {
      name: "Emily R.",
      role: "Verified Buyer",
      comment:
        "Great customer service and easy returns. I've recommended Vendora to all my friends and family.",
      rating: 4,
    },
  ];

  return (
    <section className="py-12">
      <SectionHeader title="What Customers Say" subtitle="Real reviews from real buyers" />
      <div className="grid gap-4 md:grid-cols-3">
        {testimonials.map((t, i) => (
          <div
            key={i}
            className="rounded-xl border border-border bg-card p-6"
          >
            <Quote className="h-8 w-8 text-primary/20" />
            <p className="mt-3 text-sm leading-relaxed">{t.comment}</p>
            <div className="mt-4 flex items-center justify-between">
              <div>
                <p className="font-medium">{t.name}</p>
                <p className="text-xs text-muted-foreground">{t.role}</p>
              </div>
              <Rating value={t.rating} size="sm" />
            </div>
          </div>
        ))}
      </div>
    </section>
  );
}

function TrustBadges() {
  const badges = [
    { icon: ShieldCheck, title: "Secure Payments", desc: "256-bit SSL encryption" },
    { icon: Truck, title: "Fast Delivery", desc: "Free shipping over $100" },
    { icon: RotateCcw, title: "Easy Returns", desc: "30-day return policy" },
    { icon: Headphones, title: "24/7 Support", desc: "Always here to help" },
  ];

  return (
    <section className="border-y border-border bg-card py-8">
      <div className="mx-auto max-w-7xl px-4">
        <div className="grid grid-cols-2 gap-6 md:grid-cols-4">
          {badges.map((badge, i) => (
            <div key={i} className="flex items-center gap-3">
              <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-lg bg-primary/10">
                <badge.icon className="h-5 w-5 text-primary" />
              </div>
              <div>
                <p className="text-sm font-medium">{badge.title}</p>
                <p className="text-xs text-muted-foreground">{badge.desc}</p>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}

export function HomeContent() {
  return (
    <div className="mx-auto max-w-7xl px-4">
      <HeroBanner />
      <TrustBadges />
      <CategoryGrid />
      <FlashSaleSection />
      <TrendingSection />
      <PromoBanners />
      <BestSellingSection />
      <FeaturedVendors />
      <RecentlyViewed />
      <Testimonials />
    </div>
  );
}
