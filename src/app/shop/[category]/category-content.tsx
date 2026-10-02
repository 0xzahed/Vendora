"use client";

import * as React from "react";
import { useQuery } from "@tanstack/react-query";
import { api } from "@/services/api";
import { ProductCard } from "@/components/ecommerce/product-card";
import { ProductGridSkeleton } from "@/components/ecommerce/product-skeleton";
import { Breadcrumb } from "@/components/ui/breadcrumb";
import { EmptyState } from "@/components/ui/empty-state";

export function CategoryContent({ categorySlug }: { categorySlug: string }) {
  const { data: category } = useQuery({
    queryKey: ["category", categorySlug],
    queryFn: () => api.categories.getBySlug(categorySlug),
  });

  const { data: products, isLoading } = useQuery({
    queryKey: ["category-products", categorySlug],
    queryFn: () => api.products.getByCategory(categorySlug),
  });

  return (
    <div className="mx-auto max-w-7xl px-4 py-6">
      <Breadcrumb
        items={[
          { label: "Home", href: "/" },
          { label: "Shop", href: "/shop" },
          { label: category?.name || "Category" },
        ]}
        className="mb-4"
      />

      <div className="mb-6">
        <h1 className="text-2xl font-bold">{category?.name}</h1>
        <p className="text-sm text-muted-foreground">{category?.description}</p>
      </div>

      {isLoading ? (
        <ProductGridSkeleton count={8} />
      ) : products?.length === 0 ? (
        <EmptyState
          title="No products in this category"
          description="Check back later for new arrivals"
          action={{ label: "Browse All", onClick: () => (window.location.href = "/shop") }}
        />
      ) : (
        <div className="grid grid-cols-2 gap-4 sm:grid-cols-3 lg:grid-cols-4">
          {products?.map((product) => (
            <ProductCard key={product.id} product={product} />
          ))}
        </div>
      )}
    </div>
  );
}
