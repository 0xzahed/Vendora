"use client";

import * as React from "react";
import { Plus, Megaphone, Zap, Ticket, Star, Image } from "lucide-react";
import { useQuery } from "@tanstack/react-query";
import { api } from "@/services/api";
import { useUIStore } from "@/stores/ui";
import { DashboardShell, type DashboardNavItem } from "@/components/dashboard/dashboard-shell";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { formatDate } from "@/lib/utils";
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

const typeIcons: Record<string, React.ComponentType<{ className?: string }>> = {
  campaign: Megaphone,
  flash_sale: Zap,
  coupon: Ticket,
  featured_product: Star,
  featured_vendor: Star,
  banner: Image,
};

const statusColors: Record<string, string> = {
  active: "success",
  scheduled: "info",
  ended: "secondary",
  draft: "warning",
};

export function AdminPromotionsContent() {
  const addToast = useUIStore((s) => s.addToast);

  const { data: promotions, isLoading } = useQuery({
    queryKey: ["promotions"],
    queryFn: () => api.promotions.list(),
  });

  return (
    <DashboardShell
      navItems={navItems}
      title="Promotions"
      subtitle="Manage campaigns and promotions"
      headerActions={
        <Button onClick={() => addToast({ title: "Promotion creator opened", variant: "default" })}>
          <Plus className="h-4 w-4" />
          Create Promotion
        </Button>
      }
    >
      <div className="rounded-xl border border-border bg-card">
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>Name</TableHead>
              <TableHead>Type</TableHead>
              <TableHead>Status</TableHead>
              <TableHead>Starts</TableHead>
              <TableHead>Ends</TableHead>
              <TableHead>Description</TableHead>
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
            ) : promotions?.length === 0 ? (
              <TableRow>
                <TableCell colSpan={6} className="py-12 text-center text-muted-foreground">
                  No promotions found
                </TableCell>
              </TableRow>
            ) : (
              promotions?.map((promo) => {
                const Icon = typeIcons[promo.type] || Megaphone;
                return (
                  <TableRow key={promo.id}>
                    <TableCell>
                      <div className="flex items-center gap-3">
                        <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-primary/10">
                          <Icon className="h-4 w-4 text-primary" />
                        </div>
                        <span className="font-medium">{promo.name}</span>
                      </div>
                    </TableCell>
                    <TableCell>
                      <Badge variant="secondary" className="capitalize">
                        {promo.type.replace("_", " ")}
                      </Badge>
                    </TableCell>
                    <TableCell>
                      <Badge variant={statusColors[promo.status] as "success" | "info" | "secondary" | "warning"} className="capitalize">
                        {promo.status}
                      </Badge>
                    </TableCell>
                    <TableCell>{formatDate(promo.startsAt)}</TableCell>
                    <TableCell>{formatDate(promo.endsAt)}</TableCell>
                    <TableCell className="max-w-xs truncate">{promo.description}</TableCell>
                  </TableRow>
                );
              })
            )}
          </TableBody>
        </Table>
      </div>
    </DashboardShell>
  );
}
