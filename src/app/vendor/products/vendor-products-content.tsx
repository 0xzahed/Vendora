"use client";

import * as React from "react";
import Link from "next/link";
import { Plus, Search, Edit2, Trash2, Eye, TrendingUp, Package, ShoppingCart, Wallet, Percent } from "lucide-react";
import { useQuery } from "@tanstack/react-query";
import { api } from "@/services/api";
import { useUIStore } from "@/stores/ui";
import { DashboardShell, type DashboardNavItem } from "@/components/dashboard/dashboard-shell";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Select } from "@/components/ui/select";
import { formatPrice } from "@/lib/utils";
import { cn } from "@/lib/utils";

const navItems: DashboardNavItem[] = [
  { label: "Dashboard", href: "/vendor/dashboard", icon: TrendingUp },
  { label: "Products", href: "/vendor/products", icon: Package },
  { label: "Orders", href: "/vendor/orders", icon: ShoppingCart },
  { label: "Analytics", href: "/vendor/analytics", icon: TrendingUp },
  { label: "Finance", href: "/vendor/finance", icon: Wallet },
  { label: "Coupons", href: "/vendor/coupons", icon: Percent },
];

export function VendorProductsContent() {
  const addToast = useUIStore((s) => s.addToast);
  const [search, setSearch] = React.useState("");
  const [statusFilter, setStatusFilter] = React.useState("all");
  const [selected, setSelected] = React.useState<string[]>([]);

  const { data: products, isLoading } = useQuery({
    queryKey: ["vendor-products"],
    queryFn: () => api.products.getByVendor("ven-1"),
  });

  const filtered = products?.filter((p) => {
    const matchesSearch = p.name.toLowerCase().includes(search.toLowerCase());
    const matchesStatus = statusFilter === "all" || p.status === statusFilter;
    return matchesSearch && matchesStatus;
  });

  const toggleSelect = (id: string) => {
    setSelected((prev) =>
      prev.includes(id) ? prev.filter((i) => i !== id) : [...prev, id]
    );
  };

  const toggleSelectAll = () => {
    if (selected.length === filtered?.length) {
      setSelected([]);
    } else {
      setSelected(filtered?.map((p) => p.id) || []);
    }
  };

  const handleBulkAction = (action: string) => {
    addToast({ title: `${action} applied to ${selected.length} products`, variant: "success" });
    setSelected([]);
  };

  return (
    <DashboardShell
      navItems={navItems}
      title="Products"
      subtitle="Manage your product catalog"
      headerActions={
        <Link href="/vendor/products/new">
          <Button>
            <Plus className="h-4 w-4" />
            Add Product
          </Button>
        </Link>
      }
    >
      <div className="mb-4 flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
        <div className="relative flex-1 max-w-md">
          <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
          <Input
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            placeholder="Search products..."
            className="pl-9"
          />
        </div>
        <div className="flex items-center gap-2">
          <Select
            value={statusFilter}
            onValueChange={setStatusFilter}
            options={[
              { value: "all", label: "All Status" },
              { value: "active", label: "Active" },
              { value: "draft", label: "Draft" },
              { value: "pending", label: "Pending" },
            ]}
            className="w-32"
          />
          {selected.length > 0 && (
            <Button variant="outline" onClick={() => handleBulkAction("Delete")}>
              <Trash2 className="h-4 w-4" />
              Delete ({selected.length})
            </Button>
          )}
        </div>
      </div>

      <div className="rounded-xl border border-border bg-card">
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead className="w-12">
                <input
                  type="checkbox"
                  checked={selected.length === filtered?.length && filtered?.length > 0}
                  onChange={toggleSelectAll}
                  className="h-4 w-4 rounded border-input cursor-pointer"
                />
              </TableHead>
              <TableHead>Product</TableHead>
              <TableHead>Category</TableHead>
              <TableHead>Price</TableHead>
              <TableHead>Stock</TableHead>
              <TableHead>Status</TableHead>
              <TableHead className="text-right">Actions</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {isLoading ? (
              Array.from({ length: 5 }).map((_, i) => (
                <TableRow key={i}>
                  {Array.from({ length: 7 }).map((_, j) => (
                    <TableCell key={j}>
                      <div className="h-4 animate-shimmer rounded" />
                    </TableCell>
                  ))}
                </TableRow>
              ))
            ) : filtered?.length === 0 ? (
              <TableRow>
                <TableCell colSpan={7} className="py-12 text-center text-muted-foreground">
                  No products found
                </TableCell>
              </TableRow>
            ) : (
              filtered?.map((product) => (
                <TableRow key={product.id}>
                  <TableCell>
                    <input
                      type="checkbox"
                      checked={selected.includes(product.id)}
                      onChange={() => toggleSelect(product.id)}
                      className="h-4 w-4 rounded border-input cursor-pointer"
                    />
                  </TableCell>
                  <TableCell>
                    <div className="flex items-center gap-3">
                      <img
                        src={product.images[0]}
                        alt={product.name}
                        className="h-10 w-10 rounded-lg object-cover"
                      />
                      <div>
                        <p className="font-medium">{product.name}</p>
                        <p className="text-xs text-muted-foreground">{product.sku}</p>
                      </div>
                    </div>
                  </TableCell>
                  <TableCell>{product.category}</TableCell>
                  <TableCell className="font-medium">{formatPrice(product.price)}</TableCell>
                  <TableCell>
                    <span
                      className={cn(
                        "font-medium",
                        product.stock < 10 ? "text-destructive" : "text-success"
                      )}
                    >
                      {product.stock}
                    </span>
                  </TableCell>
                  <TableCell>
                    <Badge
                      variant={
                        product.status === "active"
                          ? "success"
                          : product.status === "pending"
                            ? "warning"
                            : "secondary"
                      }
                      className="capitalize"
                    >
                      {product.status}
                    </Badge>
                  </TableCell>
                  <TableCell>
                    <div className="flex justify-end gap-1">
                      <Link href={`/product/${product.slug}`}>
                        <Button size="icon" variant="ghost" className="h-8 w-8" aria-label="View">
                          <Eye className="h-4 w-4" />
                        </Button>
                      </Link>
                      <Link href={`/vendor/products/${product.id}/edit`}>
                        <Button size="icon" variant="ghost" className="h-8 w-8" aria-label="Edit">
                          <Edit2 className="h-4 w-4" />
                        </Button>
                      </Link>
                      <Button
                        size="icon"
                        variant="ghost"
                        className="h-8 w-8 text-destructive"
                        onClick={() => addToast({ title: "Product deleted", variant: "default" })}
                        aria-label="Delete"
                      >
                        <Trash2 className="h-4 w-4" />
                      </Button>
                    </div>
                  </TableCell>
                </TableRow>
              ))
            )}
          </TableBody>
        </Table>
      </div>
    </DashboardShell>
  );
}
