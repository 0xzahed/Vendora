"use client";

import * as React from "react";
import { useQuery } from "@tanstack/react-query";
import { api } from "@/services/api";
import { VendorCard } from "@/components/ecommerce/vendor-card";
import { Input } from "@/components/ui/input";
import { Breadcrumb } from "@/components/ui/breadcrumb";
import { Search } from "lucide-react";

export function VendorsContent() {
  const [search, setSearch] = React.useState("");
  const { data: vendors, isLoading } = useQuery({
    queryKey: ["vendors"],
    queryFn: () => api.vendors.list(),
  });

  const filtered = vendors?.filter(
    (v) =>
      v.name.toLowerCase().includes(search.toLowerCase()) ||
      v.categories.some((c) => c.toLowerCase().includes(search.toLowerCase()))
  );

  return (
    <div className="mx-auto max-w-7xl px-4 py-6">
      <Breadcrumb
        items={[
          { label: "Home", href: "/" },
          { label: "Vendors" },
        ]}
        className="mb-4"
      />

      <div className="mb-6">
        <h1 className="text-2xl font-bold">All Vendors</h1>
        <p className="text-sm text-muted-foreground">
          Discover trusted sellers on Vendora
        </p>
      </div>

      <div className="relative mb-6 max-w-md">
        <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
        <Input
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          placeholder="Search vendors..."
          className="pl-9"
        />
      </div>

      {isLoading ? (
        <div className="grid grid-cols-2 gap-4 sm:grid-cols-3 lg:grid-cols-4">
          {Array.from({ length: 8 }).map((_, i) => (
            <div key={i} className="h-48 animate-shimmer rounded-xl" />
          ))}
        </div>
      ) : (
        <div className="grid grid-cols-2 gap-4 sm:grid-cols-3 lg:grid-cols-4">
          {filtered?.map((vendor) => (
            <VendorCard key={vendor.id} vendor={vendor} />
          ))}
        </div>
      )}
    </div>
  );
}
