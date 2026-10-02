"use client";

import * as React from "react";
import { Search, Eye, Ban, Check } from "lucide-react";
import { useQuery } from "@tanstack/react-query";
import { api } from "@/services/api";
import { useUIStore } from "@/stores/ui";
import { DashboardShell, type DashboardNavItem } from "@/components/dashboard/dashboard-shell";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Avatar } from "@/components/ui/avatar";
import { formatPrice, formatDate } from "@/lib/utils";
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

export function AdminCustomersContent() {
  const addToast = useUIStore((s) => s.addToast);
  const [search, setSearch] = React.useState("");

  const { data: customers, isLoading } = useQuery({
    queryKey: ["admin-customers"],
    queryFn: () => api.customers.list(),
  });

  const filtered = customers?.filter(
    (c) =>
      c.name.toLowerCase().includes(search.toLowerCase()) ||
      c.email.toLowerCase().includes(search.toLowerCase())
  );

  const handleAction = (action: string, customerName: string) => {
    addToast({ title: `${action} ${customerName}`, variant: "success" });
  };

  return (
    <DashboardShell navItems={navItems} title="Customers" subtitle="Manage marketplace customers">
      <div className="mb-4 flex items-center justify-between">
        <div className="relative flex-1 max-w-md">
          <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
          <Input
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            placeholder="Search customers..."
            className="pl-9"
          />
        </div>
      </div>

      <div className="rounded-xl border border-border bg-card">
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>Customer</TableHead>
              <TableHead>Status</TableHead>
              <TableHead>Orders</TableHead>
              <TableHead>Total Spent</TableHead>
              <TableHead>Joined</TableHead>
              <TableHead className="text-right">Actions</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {isLoading ? (
              Array.from({ length: 5 }).map((_, i) => (
                <TableRow key={i}>
                  {Array.from({ length: 6 }).map((_, j) => (
                    <TableCell key={j}>
                      <div className="h-4 animate-shimmer rounded" />
                    </TableCell>
                  ))}
                </TableRow>
              ))
            ) : filtered?.length === 0 ? (
              <TableRow>
                <TableCell colSpan={6} className="py-12 text-center text-muted-foreground">
                  No customers found
                </TableCell>
              </TableRow>
            ) : (
              filtered?.map((customer) => (
                <TableRow key={customer.id}>
                  <TableCell>
                    <div className="flex items-center gap-3">
                      <Avatar fallback={customer.name} size="sm" />
                      <div>
                        <p className="font-medium">{customer.name}</p>
                        <p className="text-xs text-muted-foreground">{customer.email}</p>
                      </div>
                    </div>
                  </TableCell>
                  <TableCell>
                    <Badge
                      variant={customer.status === "active" ? "success" : "destructive"}
                      className="capitalize"
                    >
                      {customer.status}
                    </Badge>
                  </TableCell>
                  <TableCell>{customer.totalOrders}</TableCell>
                  <TableCell>{formatPrice(customer.totalSpent)}</TableCell>
                  <TableCell>{formatDate(customer.joinedAt)}</TableCell>
                  <TableCell>
                    <div className="flex justify-end gap-1">
                      <Button size="icon" variant="ghost" className="h-8 w-8" aria-label="View">
                        <Eye className="h-4 w-4" />
                      </Button>
                      {customer.status === "active" ? (
                        <Button
                          size="icon"
                          variant="ghost"
                          className="h-8 w-8 text-destructive"
                          onClick={() => handleAction("Suspended", customer.name)}
                          aria-label="Suspend"
                        >
                          <Ban className="h-4 w-4" />
                        </Button>
                      ) : (
                        <Button
                          size="icon"
                          variant="ghost"
                          className="h-8 w-8 text-success"
                          onClick={() => handleAction("Activated", customer.name)}
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
