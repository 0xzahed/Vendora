"use client";

import * as React from "react";
import { useSearchParams, useRouter } from "next/navigation";
import { SlidersHorizontal, Grid3X3, List, X } from "lucide-react";
import { useQuery } from "@tanstack/react-query";
import { api } from "@/services/api";
import { ProductCard } from "@/components/ecommerce/product-card";
import { ProductGridSkeleton } from "@/components/ecommerce/product-skeleton";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select } from "@/components/ui/select";
import { Switch } from "@/components/ui/switch";
import { Badge } from "@/components/ui/badge";
import { Pagination } from "@/components/ui/pagination";
import { EmptyState } from "@/components/ui/empty-state";
import { Drawer, DrawerHeader, DrawerTitle, DrawerContent } from "@/components/ui/drawer";
import { Breadcrumb } from "@/components/ui/breadcrumb";
import { categories } from "@/mock/categories";
import { vendors } from "@/mock/vendors";
import { cn } from "@/lib/utils";
import type { SearchFilters } from "@/types";

export function ShopContent() {
  const searchParams = useSearchParams();
  const router = useRouter();
  const [mobileFiltersOpen, setMobileFiltersOpen] = React.useState(false);
  const [viewMode, setViewMode] = React.useState<"grid" | "list">("grid");

  const [filters, setFilters] = React.useState<SearchFilters>({
    query: searchParams.get("q") || undefined,
    category: searchParams.get("category") || undefined,
    vendor: searchParams.get("vendor") || undefined,
    brand: searchParams.get("brand") || undefined,
    minPrice: searchParams.get("minPrice") ? Number(searchParams.get("minPrice")) : undefined,
    maxPrice: searchParams.get("maxPrice") ? Number(searchParams.get("maxPrice")) : undefined,
    minRating: searchParams.get("minRating") ? Number(searchParams.get("minRating")) : undefined,
    inStock: searchParams.get("inStock") === "true",
    onSale: searchParams.get("onSale") === "true",
    sortBy: (searchParams.get("sortBy") as SearchFilters["sortBy"]) || "relevance",
    page: Number(searchParams.get("page")) || 1,
    limit: 12,
  });

  const { data, isLoading } = useQuery({
    queryKey: ["products", filters],
    queryFn: () => api.products.list(filters),
  });

  const { data: brands } = useQuery({
    queryKey: ["brands"],
    queryFn: () => api.products.getBrands(),
  });

  const updateFilters = (updates: Partial<SearchFilters>) => {
    setFilters((prev) => ({ ...prev, ...updates, page: 1 }));
  };

  const clearFilters = () => {
    setFilters({
      sortBy: "relevance",
      page: 1,
      limit: 12,
    });
  };

  const activeFilterCount = [
    filters.category,
    filters.vendor,
    filters.brand,
    filters.minPrice,
    filters.maxPrice,
    filters.minRating,
    filters.inStock,
    filters.onSale,
  ].filter(Boolean).length;

  const filterContent = (
    <div className="flex flex-col gap-6">
      <div>
        <Label className="mb-2 block text-sm font-medium">Category</Label>
        <Select
          placeholder="All Categories"
          value={filters.category || ""}
          onValueChange={(v) => updateFilters({ category: v || undefined })}
          options={[
            { value: "", label: "All Categories" },
            ...categories
              .filter((c) => !c.parentId)
              .map((c) => ({ value: c.slug, label: c.name })),
          ]}
        />
      </div>

      <div>
        <Label className="mb-2 block text-sm font-medium">Vendor</Label>
        <Select
          placeholder="All Vendors"
          value={filters.vendor || ""}
          onValueChange={(v) => updateFilters({ vendor: v || undefined })}
          options={[
            { value: "", label: "All Vendors" },
            ...vendors.map((v) => ({ value: v.id, label: v.name })),
          ]}
        />
      </div>

      <div>
        <Label className="mb-2 block text-sm font-medium">Brand</Label>
        <Select
          placeholder="All Brands"
          value={filters.brand || ""}
          onValueChange={(v) => updateFilters({ brand: v || undefined })}
          options={[
            { value: "", label: "All Brands" },
            ...(brands || []).map((b) => ({ value: b, label: b })),
          ]}
        />
      </div>

      <div>
        <Label className="mb-2 block text-sm font-medium">Price Range</Label>
        <div className="flex items-center gap-2">
          <Input
            type="number"
            placeholder="Min"
            value={filters.minPrice || ""}
            onChange={(e) =>
              updateFilters({ minPrice: e.target.value ? Number(e.target.value) : undefined })
            }
          />
          <span className="text-muted-foreground">-</span>
          <Input
            type="number"
            placeholder="Max"
            value={filters.maxPrice || ""}
            onChange={(e) =>
              updateFilters({ maxPrice: e.target.value ? Number(e.target.value) : undefined })
            }
          />
        </div>
      </div>

      <div>
        <Label className="mb-2 block text-sm font-medium">Minimum Rating</Label>
        <Select
          placeholder="Any Rating"
          value={filters.minRating?.toString() || ""}
          onValueChange={(v) => updateFilters({ minRating: v ? Number(v) : undefined })}
          options={[
            { value: "", label: "Any Rating" },
            { value: "4", label: "4+ Stars" },
            { value: "3", label: "3+ Stars" },
            { value: "2", label: "2+ Stars" },
          ]}
        />
      </div>

      <div className="space-y-3">
        <div className="flex items-center justify-between">
          <Label className="text-sm font-medium">In Stock</Label>
          <Switch
            checked={filters.inStock || false}
            onCheckedChange={(v) => updateFilters({ inStock: v || undefined })}
          />
        </div>
        <div className="flex items-center justify-between">
          <Label className="text-sm font-medium">On Sale</Label>
          <Switch
            checked={filters.onSale || false}
            onCheckedChange={(v) => updateFilters({ onSale: v || undefined })}
          />
        </div>
      </div>

      {activeFilterCount > 0 && (
        <Button variant="outline" onClick={clearFilters} className="w-full">
          <X className="h-4 w-4" />
          Clear All Filters
        </Button>
      )}
    </div>
  );

  return (
    <div className="mx-auto max-w-7xl px-4 py-6">
      <Breadcrumb
        items={[
          { label: "Home", href: "/" },
          { label: "Shop" },
        ]}
        className="mb-4"
      />

      <div className="mb-6 flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold">All Products</h1>
          <p className="text-sm text-muted-foreground">
            {data?.total || 0} products found
          </p>
        </div>
        <div className="flex items-center gap-2">
          <Button
            variant="outline"
            size="sm"
            className="lg:hidden"
            onClick={() => setMobileFiltersOpen(true)}
          >
            <SlidersHorizontal className="h-4 w-4" />
            Filters
            {activeFilterCount > 0 && (
              <Badge variant="secondary" className="ml-1 h-5 w-5 p-0 text-center text-xs">
                {activeFilterCount}
              </Badge>
            )}
          </Button>
          <div className="hidden items-center gap-1 rounded-lg border border-border p-1 sm:flex">
            <Button
              size="icon"
              variant={viewMode === "grid" ? "default" : "ghost"}
              className="h-8 w-8"
              onClick={() => setViewMode("grid")}
              aria-label="Grid view"
            >
              <Grid3X3 className="h-4 w-4" />
            </Button>
            <Button
              size="icon"
              variant={viewMode === "list" ? "default" : "ghost"}
              className="h-8 w-8"
              onClick={() => setViewMode("list")}
              aria-label="List view"
            >
              <List className="h-4 w-4" />
            </Button>
          </div>
          <Select
            value={filters.sortBy || "relevance"}
            onValueChange={(v) => updateFilters({ sortBy: v as SearchFilters["sortBy"] })}
            options={[
              { value: "relevance", label: "Relevance" },
              { value: "price_asc", label: "Price: Low to High" },
              { value: "price_desc", label: "Price: High to Low" },
              { value: "rating", label: "Highest Rated" },
              { value: "newest", label: "Newest" },
              { value: "best_selling", label: "Best Selling" },
            ]}
            className="w-40"
          />
        </div>
      </div>

      <div className="flex gap-6">
        <aside className="hidden w-64 shrink-0 lg:block">
          <div className="sticky top-20 rounded-xl border border-border bg-card p-4">
            <h2 className="mb-4 font-semibold">Filters</h2>
            {filterContent}
          </div>
        </aside>

        <div className="flex-1">
          {isLoading ? (
            <ProductGridSkeleton count={8} />
          ) : data?.data.length === 0 ? (
            <EmptyState
              title="No products found"
              description="Try adjusting your filters or search terms"
              action={{ label: "Clear Filters", onClick: clearFilters }}
            />
          ) : (
            <>
              <div
                className={cn(
                  "grid gap-4",
                  viewMode === "grid"
                    ? "grid-cols-2 sm:grid-cols-3 xl:grid-cols-4"
                    : "grid-cols-1"
                )}
              >
                {data?.data.map((product) => (
                  <ProductCard key={product.id} product={product} />
                ))}
              </div>
              <Pagination
                currentPage={filters.page || 1}
                totalPages={data?.totalPages || 1}
                onPageChange={(page) => updateFilters({ page })}
                className="mt-8"
              />
            </>
          )}
        </div>
      </div>

      <Drawer open={mobileFiltersOpen} onOpenChange={setMobileFiltersOpen} side="left" className="w-80">
        <DrawerHeader>
          <DrawerTitle>Filters</DrawerTitle>
        </DrawerHeader>
        <DrawerContent>{filterContent}</DrawerContent>
      </Drawer>
    </div>
  );
}
