"use client";

import * as React from "react";
import Link from "next/link";
import { Search, Eye } from "lucide-react";
import { useQuery } from "@tanstack/react-query";
import { api } from "@/services/api";
import { DashboardShell, type DashboardNavItem } from "@/components/dashboard/dashboard-shell";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Select } from "@/components/ui/select";
import { formatPrice, formatDate } from "@/lib/utils";
import { TrendingUp, Package, ShoppingCart, Wallet, Percent } from "lucide-react";
import type { OrderStatus } from "@/types";

const navItems: DashboardNavItem[] = [
  { label: "Dashboard", href: "/vendor/dashboard", icon: TrendingUp },
  { label: "Products", href: "/vendor/products", icon: Package },
  { label: "Orders", href: "/vendor/orders", icon: ShoppingCart },
  { label: "Analytics", href: "/vendor/analytics", icon: TrendingUp },
  { label: "Finance", href: "/vendor/finance", icon: Wallet },
  { label: "Coupons", href: "/vendor/coupons", icon: Percent },
];

const statusColors: Record<OrderStatus, string> = {
  pending: "warning",
  confirmed: "info",
  processing: "info",
  shipped: "info",
  delivered: "success",
  cancelled: "destructive",
  returned: "destructive",
};

export function VendorOrdersContent() {
  const [search, setSearch] = React.useState("");
  const [statusFilter, setStatusFilter] = React.useState("all");

  const { data: orders, isLoading } = useQuery({
    queryKey: ["vendor-orders"],
    queryFn: () => api.orders.list({ vendorId: "ven-1" }),
  });

  const filtered = orders?.filter((o) => {
    const matchesSearch =
      o.orderNumber.toLowerCase().includes(search.toLowerCase()) ||
      o.customerName.toLowerCase().includes(search.toLowerCase());
    const matchesStatus = statusFilter === "all" || o.status === statusFilter;
    return matchesSearch && matchesStatus;
  });

  return (
    <DashboardShell navItems={navItems} title="Orders" subtitle="Manage your store orders">
      <div className="mb-4 flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
        <div className="relative flex-1 max-w-md">
          <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
          <Input
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            placeholder="Search orders..."
            className="pl-9"
          />
        </div>
        <Select
          value={statusFilter}
          onValueChange={setStatusFilter}
          options={[
            { value: "all", label: "All Status" },
            { value: "pending", label: "Pending" },
            { value: "confirmed", label: "Confirmed" },
            { value: "processing", label: "Processing" },
            { value: "shipped", label: "Shipped" },
            { value: "delivered", label: "Delivered" },
            { value: "cancelled", label: "Cancelled" },
          ]}
          className="w-40"
        />
      </div>

      <div className="rounded-xl border border-border bg-card">
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>Order</TableHead>
              <TableHead>Customer</TableHead>
              <TableHead>Items</TableHead>
              <TableHead>Status</TableHead>
              <TableHead>Payment</TableHead>
              <TableHead>Date</TableHead>
              <TableHead className="text-right">Total</TableHead>
              <TableHead></TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {isLoading ? (
              Array.from({ length: 5 }).map((_, i) => (
                <TableRow key={i}>
                  {Array.from({ length: 8 }).map((_, j) => (
                    <TableCell key={j}>
                      <div className="h-4 animate-shimmer rounded" />
                    </TableCell>
                  ))}
                </TableRow>
              ))
            ) : filtered?.length === 0 ? (
              <TableRow>
                <TableCell colSpan={8} className="py-12 text-center text-muted-foreground">
                  No orders found
                </TableCell>
              </TableRow>
            ) : (
              filtered?.map((order) => (
                <TableRow key={order.id}>
                  <TableCell className="font-medium">{order.orderNumber}</TableCell>
                  <TableCell>{order.customerName}</TableCell>
                  <TableCell>{order.items.length}</TableCell>
                  <TableCell>
                    <Badge variant={statusColors[order.status] as "warning" | "info" | "success" | "destructive"} className="capitalize">
                      {order.status}
                    </Badge>
                  </TableCell>
                  <TableCell>
                    <Badge
                      variant={order.paymentStatus === "paid" ? "success" : order.paymentStatus === "pending" ? "warning" : "destructive"}
                      className="capitalize"
                    >
                      {order.paymentStatus}
                    </Badge>
                  </TableCell>
                  <TableCell>{formatDate(order.createdAt)}</TableCell>
                  <TableCell className="text-right font-medium">{formatPrice(order.total)}</TableCell>
                  <TableCell>
                    <Link href={`/vendor/orders/${order.id}`}>
                      <Badge variant="outline" className="cursor-pointer">
                        <Eye className="h-3 w-3" />
                        View
                      </Badge>
                    </Link>
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
