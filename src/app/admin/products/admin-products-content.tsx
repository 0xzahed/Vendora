"use client";

import * as React from "react";
import { Search, Check, X, Ban, Eye } from "lucide-react";
import { useQuery } from "@tanstack/react-query";
import { api } from "@/services/api";
import { useUIStore } from "@/stores/ui";
import { DashboardShell, type DashboardNavItem } from "@/components/dashboard/dashboard-shell";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Select } from "@/components/ui/select";
import { formatPrice } from "@/lib/utils";
import { TrendingUp, Store, Users, Package, ShoppingCart, DollarSign, Percent } from "lucide-react";

const navItems: DashboardNavItem[] = [
  { label: "Dashboard", href: "/admin/dashboard", icon: TrendingUp },
  { label: "Vendors", href: "/admin/vendors", icon: Store },
  { label: "Customers", href: "/admin/customers", icon: Users },
  { label: "Products", href: "/admin/products", icon: Package },
  { label: "Orders", href: "/admin/orders", icon: ShoppingCart },
  { label: "Categories", href: "/admin/categories", icon: Package },
  { label: "Commissions", href: "/admin/commissions", icon: Percent },
  { label: "Payouts", href: "/admin/payouts", icon: DollarSign },
  { label: "Promotions", href: "/admin/promotions", icon: TrendingUp },
  { label: "Reviews", href: "/admin/reviews", icon: Users },
];

export function AdminProductsContent() {
  const addToast = useUIStore((s) => s.addToast);
  const [search, setSearch] = React.useState("");
  const [statusFilter, setStatusFilter] = React.useState("all");

  const { data: products, isLoading } = useQuery({
    queryKey: ["admin-products"],
    queryFn: () => api.products.list({ limit: 50 }),
  });

  const filtered = products?.data.filter((p) => {
    const matchesSearch = p.name.toLowerCase().includes(search.toLowerCase());
    const matchesStatus = statusFilter === "all" || p.status === statusFilter;
    return matchesSearch && matchesStatus;
  });

  const handleAction = (action: string, productName: string) => {
    addToast({ title: `${action} ${productName}`, variant: "success" });
  };

  return (
    <DashboardShell navItems={navItems} title="Products" subtitle="Manage all marketplace products">
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
        <Select
          value={statusFilter}
          onValueChange={setStatusFilter}
          options={[
            { value: "all", label: "All Status" },
            { value: "active", label: "Active" },
            { value: "pending", label: "Pending" },
            { value: "rejected", label: "Rejected" },
            { value: "draft", label: "Draft" },
          ]}
          className="w-40"
        />
      </div>

      <div className="rounded-xl border border-border bg-card">
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>Product</TableHead>
              <TableHead>Vendor</TableHead>
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
                  <TableCell>{product.vendorName}</TableCell>
                  <TableCell>{product.category}</TableCell>
                  <TableCell className="font-medium">{formatPrice(product.price)}</TableCell>
                  <TableCell>{product.stock}</TableCell>
                  <TableCell>
                    <Badge
                      variant={
                        product.status === "active"
                          ? "success"
                          : product.status === "pending"
                            ? "warning"
                            : "destructive"
                      }
                      className="capitalize"
                    >
                      {product.status}
                    </Badge>
                  </TableCell>
                  <TableCell>
                    <div className="flex justify-end gap-1">
                      <Button size="icon" variant="ghost" className="h-8 w-8" aria-label="View">
                        <Eye className="h-4 w-4" />
                      </Button>
                      {product.status === "pending" && (
                        <Button
                          size="icon"
                          variant="ghost"
                          className="h-8 w-8 text-success"
                          onClick={() => handleAction("Approved", product.name)}
                          aria-label="Approve"
                        >
                          <Check className="h-4 w-4" />
                        </Button>
                      )}
                      {product.status === "active" && (
                        <Button
                          size="icon"
                          variant="ghost"
                          className="h-8 w-8 text-destructive"
                          onClick={() => handleAction("Disabled", product.name)}
                          aria-label="Disable"
                        >
                          <Ban className="h-4 w-4" />
                        </Button>
                      )}
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
