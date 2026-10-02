"use client";

import * as React from "react";
import { Check, X, Trash2, Eye, Flag } from "lucide-react";
import { useQuery } from "@tanstack/react-query";
import { api } from "@/services/api";
import { useUIStore } from "@/stores/ui";
import { DashboardShell, type DashboardNavItem } from "@/components/dashboard/dashboard-shell";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Rating } from "@/components/ui/rating";
import { Select } from "@/components/ui/select";
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

const statusColors: Record<string, string> = {
  approved: "success",
  pending: "warning",
  hidden: "secondary",
  reported: "destructive",
};

export function AdminReviewsContent() {
  const addToast = useUIStore((s) => s.addToast);
  const [statusFilter, setStatusFilter] = React.useState("all");

  const { data: reviews, isLoading } = useQuery({
    queryKey: ["admin-reviews"],
    queryFn: () => api.reviews.list(),
  });

  const filtered = reviews?.filter(
    (r) => statusFilter === "all" || r.status === statusFilter
  );

  const handleAction = (action: string, reviewId: string) => {
    addToast({ title: `${action} review`, variant: "success" });
  };

  return (
    <DashboardShell navItems={navItems} title="Reviews" subtitle="Moderate product reviews">
      <div className="mb-4 flex items-center justify-between">
        <Select
          value={statusFilter}
          onValueChange={setStatusFilter}
          options={[
            { value: "all", label: "All Reviews" },
            { value: "approved", label: "Approved" },
            { value: "pending", label: "Pending" },
            { value: "reported", label: "Reported" },
            { value: "hidden", label: "Hidden" },
          ]}
          className="w-40"
        />
      </div>

      <div className="rounded-xl border border-border bg-card">
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>Product</TableHead>
              <TableHead>Customer</TableHead>
              <TableHead>Rating</TableHead>
              <TableHead>Comment</TableHead>
              <TableHead>Status</TableHead>
              <TableHead>Date</TableHead>
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
                  No reviews found
                </TableCell>
              </TableRow>
            ) : (
              filtered?.map((review) => (
                <TableRow key={review.id}>
                  <TableCell>
                    <div className="flex items-center gap-3">
                      <img
                        src={review.productImage}
                        alt={review.productName}
                        className="h-10 w-10 rounded-lg object-cover"
                      />
                      <span className="font-medium">{review.productName}</span>
                    </div>
                  </TableCell>
                  <TableCell>{review.customerName}</TableCell>
                  <TableCell>
                    <Rating value={review.rating} size="sm" />
                  </TableCell>
                  <TableCell className="max-w-xs">
                    <p className="line-clamp-2 text-sm">{review.comment}</p>
                  </TableCell>
                  <TableCell>
                    <Badge variant={statusColors[review.status] as "success" | "warning" | "secondary" | "destructive"} className="capitalize">
                      {review.status}
                    </Badge>
                  </TableCell>
                  <TableCell>{formatDate(review.createdAt)}</TableCell>
                  <TableCell>
                    <div className="flex justify-end gap-1">
                      {review.status === "pending" && (
                        <Button
                          size="icon"
                          variant="ghost"
                          className="h-8 w-8 text-success"
                          onClick={() => handleAction("Approved", review.id)}
                          aria-label="Approve"
                        >
                          <Check className="h-4 w-4" />
                        </Button>
                      )}
                      {review.status === "reported" && (
                        <Button
                          size="icon"
                          variant="ghost"
                          className="h-8 w-8 text-success"
                          onClick={() => handleAction("Resolved", review.id)}
                          aria-label="Resolve"
                        >
                          <Check className="h-4 w-4" />
                        </Button>
                      )}
                      <Button
                        size="icon"
                        variant="ghost"
                        className="h-8 w-8"
                        onClick={() => handleAction("Hidden", review.id)}
                        aria-label="Hide"
                      >
                        <Eye className="h-4 w-4" />
                      </Button>
                      <Button
                        size="icon"
                        variant="ghost"
                        className="h-8 w-8 text-destructive"
                        onClick={() => handleAction("Deleted", review.id)}
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
