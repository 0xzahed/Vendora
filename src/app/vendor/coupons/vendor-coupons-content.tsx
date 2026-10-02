"use client";

import * as React from "react";
import { Plus, Ticket, Edit2, Trash2 } from "lucide-react";
import { useQuery } from "@tanstack/react-query";
import { api } from "@/services/api";
import { useUIStore } from "@/stores/ui";
import { DashboardShell, type DashboardNavItem } from "@/components/dashboard/dashboard-shell";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Switch } from "@/components/ui/switch";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogClose } from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select } from "@/components/ui/select";
import { formatDate } from "@/lib/utils";
import { TrendingUp, Package, ShoppingCart, Wallet, Percent } from "lucide-react";

const navItems: DashboardNavItem[] = [
  { label: "Dashboard", href: "/vendor/dashboard", icon: TrendingUp },
  { label: "Products", href: "/vendor/products", icon: Package },
  { label: "Orders", href: "/vendor/orders", icon: ShoppingCart },
  { label: "Analytics", href: "/vendor/analytics", icon: TrendingUp },
  { label: "Finance", href: "/vendor/finance", icon: Wallet },
  { label: "Coupons", href: "/vendor/coupons", icon: Percent },
];

export function VendorCouponsContent() {
  const addToast = useUIStore((s) => s.addToast);
  const [dialogOpen, setDialogOpen] = React.useState(false);
  const [form, setForm] = React.useState({
    code: "",
    type: "percentage",
    value: "",
    minOrder: "",
    maxDiscount: "",
    usageLimit: "",
    expiresAt: "",
  });

  const { data: coupons, isLoading } = useQuery({
    queryKey: ["vendor-coupons"],
    queryFn: () => api.coupons.getByVendor("ven-1"),
  });

  const handleSave = () => {
    addToast({ title: "Coupon created successfully", variant: "success" });
    setDialogOpen(false);
    setForm({ code: "", type: "percentage", value: "", minOrder: "", maxDiscount: "", usageLimit: "", expiresAt: "" });
  };

  return (
    <DashboardShell
      navItems={navItems}
      title="Coupons"
      subtitle="Create and manage discount coupons"
      headerActions={
        <Button onClick={() => setDialogOpen(true)}>
          <Plus className="h-4 w-4" />
          Create Coupon
        </Button>
      }
    >
      <div className="rounded-xl border border-border bg-card">
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>Code</TableHead>
              <TableHead>Type</TableHead>
              <TableHead>Value</TableHead>
              <TableHead>Min Order</TableHead>
              <TableHead>Usage</TableHead>
              <TableHead>Expires</TableHead>
              <TableHead>Status</TableHead>
              <TableHead className="text-right">Actions</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {isLoading ? (
              Array.from({ length: 3 }).map((_, i) => (
                <TableRow key={i}>
                  {Array.from({ length: 8 }).map((_, j) => (
                    <TableCell key={j}>
                      <div className="h-4 animate-shimmer rounded" />
                    </TableCell>
                  ))}
                </TableRow>
              ))
            ) : coupons?.length === 0 ? (
              <TableRow>
                <TableCell colSpan={8} className="py-12 text-center text-muted-foreground">
                  No coupons created yet
                </TableCell>
              </TableRow>
            ) : (
              coupons?.map((coupon) => (
                <TableRow key={coupon.id}>
                  <TableCell className="font-medium">{coupon.code}</TableCell>
                  <TableCell className="capitalize">{coupon.type}</TableCell>
                  <TableCell>
                    {coupon.type === "percentage" ? `${coupon.value}%` : `$${coupon.value}`}
                  </TableCell>
                  <TableCell>${coupon.minOrder}</TableCell>
                  <TableCell>
                    {coupon.usageCount}/{coupon.usageLimit}
                  </TableCell>
                  <TableCell>{formatDate(coupon.expiresAt)}</TableCell>
                  <TableCell>
                    <Switch checked={coupon.active} onCheckedChange={() => {}} />
                  </TableCell>
                  <TableCell>
                    <div className="flex justify-end gap-1">
                      <Button size="icon" variant="ghost" className="h-8 w-8" aria-label="Edit">
                        <Edit2 className="h-4 w-4" />
                      </Button>
                      <Button
                        size="icon"
                        variant="ghost"
                        className="h-8 w-8 text-destructive"
                        onClick={() => addToast({ title: "Coupon deleted", variant: "default" })}
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

      <Dialog open={dialogOpen} onOpenChange={setDialogOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Create New Coupon</DialogTitle>
            <DialogClose />
          </DialogHeader>
          <div className="space-y-4">
            <div>
              <Label>Coupon Code</Label>
              <Input
                value={form.code}
                onChange={(e) => setForm({ ...form, code: e.target.value.toUpperCase() })}
                placeholder="e.g., SAVE20"
                className="mt-1"
              />
            </div>
            <div className="grid gap-4 sm:grid-cols-2">
              <div>
                <Label>Type</Label>
                <Select
                  value={form.type}
                  onValueChange={(v) => setForm({ ...form, type: v })}
                  options={[
                    { value: "percentage", label: "Percentage" },
                    { value: "fixed", label: "Fixed Amount" },
                  ]}
                />
              </div>
              <div>
                <Label>Value</Label>
                <Input
                  type="number"
                  value={form.value}
                  onChange={(e) => setForm({ ...form, value: e.target.value })}
                  placeholder={form.type === "percentage" ? "20" : "10"}
                  className="mt-1"
                />
              </div>
            </div>
            <div className="grid gap-4 sm:grid-cols-2">
              <div>
                <Label>Min Order ($)</Label>
                <Input
                  type="number"
                  value={form.minOrder}
                  onChange={(e) => setForm({ ...form, minOrder: e.target.value })}
                  placeholder="50"
                  className="mt-1"
                />
              </div>
              <div>
                <Label>Max Discount ($)</Label>
                <Input
                  type="number"
                  value={form.maxDiscount}
                  onChange={(e) => setForm({ ...form, maxDiscount: e.target.value })}
                  placeholder="100"
                  className="mt-1"
                />
              </div>
            </div>
            <div className="grid gap-4 sm:grid-cols-2">
              <div>
                <Label>Usage Limit</Label>
                <Input
                  type="number"
                  value={form.usageLimit}
                  onChange={(e) => setForm({ ...form, usageLimit: e.target.value })}
                  placeholder="100"
                  className="mt-1"
                />
              </div>
              <div>
                <Label>Expires At</Label>
                <Input
                  type="date"
                  value={form.expiresAt}
                  onChange={(e) => setForm({ ...form, expiresAt: e.target.value })}
                  className="mt-1"
                />
              </div>
            </div>
            <Button onClick={handleSave} className="w-full">
              <Ticket className="h-4 w-4" />
              Create Coupon
            </Button>
          </div>
        </DialogContent>
      </Dialog>
    </DashboardShell>
  );
}
