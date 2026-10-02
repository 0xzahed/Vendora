"use client";

import * as React from "react";
import Link from "next/link";
import {
  BadgeCheck,
  Users,
  Package,
  Star,
  MapPin,
  Mail,
  Phone,
  Truck,
  RotateCcw,
  Calendar,
} from "lucide-react";
import { useQuery } from "@tanstack/react-query";
import { api } from "@/services/api";
import { getVendorBySlug } from "@/mock/vendors";
import { ProductCard } from "@/components/ecommerce/product-card";
import { ProductGridSkeleton } from "@/components/ecommerce/product-skeleton";
import { Avatar } from "@/components/ui/avatar";
import { Rating } from "@/components/ui/rating";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Separator } from "@/components/ui/separator";
import { Breadcrumb } from "@/components/ui/breadcrumb";
import { formatCompactNumber, formatDate } from "@/lib/utils";

export function VendorStoreContent({ slug }: { slug: string }) {
  const vendor = getVendorBySlug(slug);
  const { data: products, isLoading } = useQuery({
    queryKey: ["vendor-products", vendor?.id],
    queryFn: () => (vendor ? api.products.getByVendor(vendor.id) : Promise.resolve([])),
    enabled: !!vendor,
  });

  if (!vendor) return null;

  return (
    <div>
      <div className="relative h-48 overflow-hidden rounded-b-2xl lg:h-64">
        <img
          src={vendor.coverImage}
          alt={vendor.name}
          className="h-full w-full object-cover"
        />
        <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent" />
      </div>

      <div className="mx-auto max-w-7xl px-4">
        <div className="relative -mt-16 mb-8">
          <div className="flex flex-col gap-4 rounded-xl border border-border bg-card p-6 sm:flex-row sm:items-end">
            <Avatar
              fallback={vendor.logo}
              size="xl"
              className="border-4 border-card"
            />
            <div className="flex-1">
              <div className="flex items-center gap-2">
                <h1 className="text-2xl font-bold">{vendor.name}</h1>
                {vendor.verified && (
                  <BadgeCheck className="h-6 w-6 text-info" />
                )}
              </div>
              <div className="mt-1 flex items-center gap-3 text-sm text-muted-foreground">
                <span className="flex items-center gap-1">
                  <Rating value={vendor.rating} size="sm" />
                  {vendor.rating} ({formatCompactNumber(vendor.reviewCount)} reviews)
                </span>
                <span className="flex items-center gap-1">
                  <Users className="h-4 w-4" />
                  {formatCompactNumber(vendor.followers)} followers
                </span>
                <span className="flex items-center gap-1">
                  <Package className="h-4 w-4" />
                  {vendor.totalProducts} products
                </span>
              </div>
            </div>
            <div className="flex gap-2">
              <Button variant="outline">Follow</Button>
              <Button>Contact</Button>
            </div>
          </div>
        </div>

        <div className="grid gap-8 lg:grid-cols-4">
          <div className="space-y-6 lg:col-span-1">
            <div className="rounded-xl border border-border bg-card p-4">
              <h3 className="mb-3 font-semibold">About Store</h3>
              <p className="text-sm text-muted-foreground">{vendor.description}</p>
              <Separator className="my-4" />
              <div className="space-y-2 text-sm">
                <div className="flex items-center gap-2 text-muted-foreground">
                  <Calendar className="h-4 w-4" />
                  Joined {formatDate(vendor.joinedAt)}
                </div>
                <div className="flex items-center gap-2 text-muted-foreground">
                  <MapPin className="h-4 w-4" />
                  {vendor.contact.address}
                </div>
                <div className="flex items-center gap-2 text-muted-foreground">
                  <Mail className="h-4 w-4" />
                  {vendor.contact.email}
                </div>
                <div className="flex items-center gap-2 text-muted-foreground">
                  <Phone className="h-4 w-4" />
                  {vendor.contact.phone}
                </div>
              </div>
            </div>

            <div className="rounded-xl border border-border bg-card p-4">
              <h3 className="mb-3 font-semibold">Store Policies</h3>
              <div className="space-y-3 text-sm">
                <div>
                  <p className="flex items-center gap-2 font-medium">
                    <Truck className="h-4 w-4 text-primary" />
                    Shipping
                  </p>
                  <p className="mt-1 text-muted-foreground">{vendor.policies.shipping}</p>
                </div>
                <Separator />
                <div>
                  <p className="flex items-center gap-2 font-medium">
                    <RotateCcw className="h-4 w-4 text-primary" />
                    Returns
                  </p>
                  <p className="mt-1 text-muted-foreground">{vendor.policies.returns}</p>
                </div>
              </div>
            </div>

            <div className="rounded-xl border border-border bg-card p-4">
              <h3 className="mb-3 font-semibold">Categories</h3>
              <div className="flex flex-wrap gap-2">
                {vendor.categories.map((cat) => (
                  <Badge key={cat} variant="secondary">
                    {cat}
                  </Badge>
                ))}
              </div>
            </div>
          </div>

          <div className="lg:col-span-3">
            <h2 className="mb-4 text-xl font-bold">Products ({products?.length || 0})</h2>
            {isLoading ? (
              <ProductGridSkeleton count={8} />
            ) : (
              <div className="grid grid-cols-2 gap-4 sm:grid-cols-3">
                {products?.map((product) => (
                  <ProductCard key={product.id} product={product} />
                ))}
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
