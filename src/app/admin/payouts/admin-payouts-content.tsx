"use client";

import * as React from "react";
import { Check, X, Clock, DollarSign, TrendingUp, Store, Users, Package, ShoppingCart, Percent } from "lucide-react";
import { useQuery } from "@tanstack/react-query";
import { api } from "@/services/api";
import { useUIStore } from "@/stores/ui";
import { DashboardShell, type DashboardNavItem } from "@/components/dashboard/dashboard-shell";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { formatPrice, formatDate } from "@/lib/utils";

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

export function AdminPayoutsContent() {
  const addToast = useUIStore((s) => s.addToast);

  const { data: payouts, isLoading } = useQuery({
    queryKey: ["admin-payouts"],
    queryFn: () => api.payouts.list(),
  });

  const handleAction = (action: string, reference: string) => {
    addToast({ title: `${action} ${reference}`, variant: "success" });
  };

  const statusColors: Record<string, string> = {
    pending: "warning",
    processing: "info",
    completed: "success",
    rejected: "destructive",
  };

  return (
    <DashboardShell navItems={navItems} title="Payouts" subtitle="Manage vendor payouts">
      <div className="rounded-xl border border-border bg-card">
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>Reference</TableHead>
              <TableHead>Vendor</TableHead>
              <TableHead>Amount</TableHead>
              <TableHead>Method</TableHead>
              <TableHead>Status</TableHead>
              <TableHead>Requested</TableHead>
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
            ) : payouts?.length === 0 ? (
              <TableRow>
                <TableCell colSpan={7} className="py-12 text-center text-muted-foreground">
                  No payouts found
                </TableCell>
              </TableRow>
            ) : (
              payouts?.map((payout) => (
                <TableRow key={payout.id}>
                  <TableCell className="font-medium">{payout.reference}</TableCell>
                  <TableCell>{payout.vendorName}</TableCell>
                  <TableCell className="font-medium">{formatPrice(payout.amount)}</TableCell>
                  <TableCell>{payout.method}</TableCell>
                  <TableCell>
                    <Badge variant={statusColors[payout.status] as "warning" | "info" | "success" | "destructive"} className="capitalize">
                      {payout.status}
                    </Badge>
                  </TableCell>
                  <TableCell>{formatDate(payout.requestedAt)}</TableCell>
                  <TableCell>
                    <div className="flex justify-end gap-1">
                      {payout.status === "pending" && (
                        <>
                          <Button
                            size="icon"
                            variant="ghost"
                            className="h-8 w-8 text-success"
                            onClick={() => handleAction("Approved", payout.reference)}
                            aria-label="Approve"
                          >
                            <Check className="h-4 w-4" />
                          </Button>
                          <Button
                            size="icon"
                            variant="ghost"
                            className="h-8 w-8 text-destructive"
                            onClick={() => handleAction("Rejected", payout.reference)}
                            aria-label="Reject"
                          >
                            <X className="h-4 w-4" />
                          </Button>
                        </>
                      )}
                      {payout.status === "processing" && (
                        <Button
                          size="icon"
                          variant="ghost"
                          className="h-8 w-8 text-success"
                          onClick={() => handleAction("Completed", payout.reference)}
                          aria-label="Complete"
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
