"use client";

import * as React from "react";
import { useSearchParams } from "next/navigation";
import { Search } from "lucide-react";
import { useQuery } from "@tanstack/react-query";
import { api } from "@/services/api";
import { ProductCard } from "@/components/ecommerce/product-card";
import { ProductGridSkeleton } from "@/components/ecommerce/product-skeleton";
import { EmptyState } from "@/components/ui/empty-state";
import { Breadcrumb } from "@/components/ui/breadcrumb";

export function SearchContent() {
  const searchParams = useSearchParams();
  const query = searchParams.get("q") || "";

  const { data, isLoading } = useQuery({
    queryKey: ["search", query],
    queryFn: () => api.products.list({ query, limit: 50 }),
    enabled: !!query,
  });

  return (
    <div className="mx-auto max-w-7xl px-4 py-6">
      <Breadcrumb
        items={[
          { label: "Home", href: "/" },
          { label: "Search" },
        ]}
        className="mb-4"
      />

      <div className="mb-6">
        <h1 className="text-2xl font-bold">
          Search Results for &quot;{query}&quot;
        </h1>
        <p className="text-sm text-muted-foreground">
          {data?.total || 0} products found
        </p>
      </div>

      {isLoading ? (
        <ProductGridSkeleton count={8} />
      ) : data?.data.length === 0 ? (
        <EmptyState
          icon={<Search className="h-8 w-8 text-muted-foreground" />}
          title="No results found"
          description={`We couldn't find any products matching "${query}". Try different keywords.`}
          action={{ label: "Browse All", onClick: () => (window.location.href = "/shop") }}
        />
      ) : (
        <div className="grid grid-cols-2 gap-4 sm:grid-cols-3 lg:grid-cols-4">
          {data?.data.map((product) => (
            <ProductCard key={product.id} product={product} />
          ))}
        </div>
      )}
    </div>
  );
}
