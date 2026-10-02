"use client";

import * as React from "react";
import Link from "next/link";
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
import { Avatar } from "@/components/ui/avatar";
import { formatPrice, formatCompactNumber, formatDate } from "@/lib/utils";
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

export function AdminVendorsContent() {
  const addToast = useUIStore((s) => s.addToast);
  const [search, setSearch] = React.useState("");
  const [statusFilter, setStatusFilter] = React.useState("all");

  const { data: vendors, isLoading } = useQuery({
    queryKey: ["admin-vendors"],
    queryFn: () => api.vendors.list(),
  });

  const filtered = vendors?.filter((v) => {
    const matchesSearch = v.name.toLowerCase().includes(search.toLowerCase());
    const matchesStatus = statusFilter === "all" || v.status === statusFilter;
    return matchesSearch && matchesStatus;
  });

  const handleAction = (action: string, vendorName: string) => {
    addToast({ title: `${action} ${vendorName}`, variant: "success" });
  };

  return (
    <DashboardShell navItems={navItems} title="Vendors" subtitle="Manage marketplace vendors">
      <div className="mb-4 flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
        <div className="relative flex-1 max-w-md">
          <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
          <Input
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            placeholder="Search vendors..."
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
            { value: "suspended", label: "Suspended" },
          ]}
          className="w-40"
        />
      </div>

      <div className="rounded-xl border border-border bg-card">
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>Vendor</TableHead>
              <TableHead>Status</TableHead>
              <TableHead>Products</TableHead>
              <TableHead>Sales</TableHead>
              <TableHead>Commission</TableHead>
              <TableHead>Joined</TableHead>
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
                  No vendors found
                </TableCell>
              </TableRow>
            ) : (
              filtered?.map((vendor) => (
                <TableRow key={vendor.id}>
                  <TableCell>
                    <div className="flex items-center gap-3">
                      <Avatar fallback={vendor.logo} size="sm" />
                      <div>
                        <p className="font-medium">{vendor.name}</p>
                        <p className="text-xs text-muted-foreground">{vendor.contact.email}</p>
                      </div>
                    </div>
                  </TableCell>
                  <TableCell>
                    <Badge
                      variant={
                        vendor.status === "active"
                          ? "success"
                          : vendor.status === "pending"
                            ? "warning"
                            : "destructive"
                      }
                      className="capitalize"
                    >
                      {vendor.status}
                    </Badge>
                  </TableCell>
                  <TableCell>{vendor.totalProducts}</TableCell>
                  <TableCell>{formatCompactNumber(vendor.totalSales)}</TableCell>
                  <TableCell>{vendor.commissionRate}%</TableCell>
                  <TableCell>{formatDate(vendor.joinedAt)}</TableCell>
                  <TableCell>
                    <div className="flex justify-end gap-1">
                      <Link href={`/vendors/${vendor.slug}`}>
                        <Button size="icon" variant="ghost" className="h-8 w-8" aria-label="View">
                          <Eye className="h-4 w-4" />
                        </Button>
                      </Link>
                      {vendor.status === "pending" && (
                        <Button
                          size="icon"
                          variant="ghost"
                          className="h-8 w-8 text-success"
                          onClick={() => handleAction("Approved", vendor.name)}
                          aria-label="Approve"
                        >
                          <Check className="h-4 w-4" />
                        </Button>
                      )}
                      {vendor.status === "active" && (
                        <Button
                          size="icon"
                          variant="ghost"
                          className="h-8 w-8 text-destructive"
                          onClick={() => handleAction("Suspended", vendor.name)}
                          aria-label="Suspend"
                        >
                          <Ban className="h-4 w-4" />
                        </Button>
                      )}
                      {vendor.status === "suspended" && (
                        <Button
                          size="icon"
                          variant="ghost"
                          className="h-8 w-8 text-success"
                          onClick={() => handleAction("Activated", vendor.name)}
                          aria-label="Activate"
                        >
                          <Check className="h-4 w-4" />
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
