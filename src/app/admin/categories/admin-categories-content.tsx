"use client";

import * as React from "react";
import { Plus, Edit2, Trash2, ChevronRight } from "lucide-react";
import { useQuery } from "@tanstack/react-query";
import { api } from "@/services/api";
import { useUIStore } from "@/stores/ui";
import { DashboardShell, type DashboardNavItem } from "@/components/dashboard/dashboard-shell";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Switch } from "@/components/ui/switch";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogClose } from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Select } from "@/components/ui/select";
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

export function AdminCategoriesContent() {
  const addToast = useUIStore((s) => s.addToast);
  const [dialogOpen, setDialogOpen] = React.useState(false);
  const [form, setForm] = React.useState({
    name: "",
    description: "",
    parentId: "",
    image: "",
  });

  const { data: categories, isLoading } = useQuery({
    queryKey: ["admin-categories"],
    queryFn: () => api.categories.list(),
  });

  const parentCategories = categories?.filter((c) => !c.parentId) || [];
  const childCategories = categories?.filter((c) => c.parentId) || [];

  const handleSave = () => {
    addToast({ title: "Category saved successfully", variant: "success" });
    setDialogOpen(false);
    setForm({ name: "", description: "", parentId: "", image: "" });
  };

  return (
    <DashboardShell
      navItems={navItems}
      title="Categories"
      subtitle="Manage product categories"
      headerActions={
        <Button onClick={() => setDialogOpen(true)}>
          <Plus className="h-4 w-4" />
          Add Category
        </Button>
      }
    >
      <div className="grid gap-6 lg:grid-cols-2">
        <Card>
          <CardHeader>
            <CardTitle>Parent Categories</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-3">
              {isLoading ? (
                Array.from({ length: 4 }).map((_, i) => (
                  <div key={i} className="h-16 animate-shimmer rounded-lg" />
                ))
              ) : (
                parentCategories.map((cat) => (
                  <div
                    key={cat.id}
                    className="flex items-center justify-between rounded-lg border border-border p-3"
                  >
                    <div className="flex items-center gap-3">
                      <img
                        src={cat.image}
                        alt={cat.name}
                        className="h-12 w-12 rounded-lg object-cover"
                      />
                      <div>
                        <p className="font-medium">{cat.name}</p>
                        <p className="text-xs text-muted-foreground">
                          {cat.productCount} products
                        </p>
                      </div>
                    </div>
                    <div className="flex items-center gap-2">
                      <Switch checked={cat.active} onCheckedChange={() => {}} />
                      <Button size="icon" variant="ghost" className="h-8 w-8" aria-label="Edit">
                        <Edit2 className="h-4 w-4" />
                      </Button>
                      <Button
                        size="icon"
                        variant="ghost"
                        className="h-8 w-8 text-destructive"
                        onClick={() => addToast({ title: "Category deleted", variant: "default" })}
                        aria-label="Delete"
                      >
                        <Trash2 className="h-4 w-4" />
                      </Button>
                    </div>
                  </div>
                ))
              )}
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Subcategories</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-3">
              {isLoading ? (
                Array.from({ length: 4 }).map((_, i) => (
                  <div key={i} className="h-16 animate-shimmer rounded-lg" />
                ))
              ) : (
                childCategories.map((cat) => {
                  const parent = parentCategories.find((p) => p.id === cat.parentId);
                  return (
                    <div
                      key={cat.id}
                      className="flex items-center justify-between rounded-lg border border-border p-3"
                    >
                      <div className="flex items-center gap-3">
                        <img
                          src={cat.image}
                          alt={cat.name}
                          className="h-12 w-12 rounded-lg object-cover"
                        />
                        <div>
                          <p className="font-medium">{cat.name}</p>
                          <p className="text-xs text-muted-foreground">
                            Under {parent?.name} · {cat.productCount} products
                          </p>
                        </div>
                      </div>
                      <div className="flex items-center gap-2">
                        <Switch checked={cat.active} onCheckedChange={() => {}} />
                        <Button size="icon" variant="ghost" className="h-8 w-8" aria-label="Edit">
                          <Edit2 className="h-4 w-4" />
                        </Button>
                        <Button
                          size="icon"
                          variant="ghost"
                          className="h-8 w-8 text-destructive"
                          onClick={() => addToast({ title: "Category deleted", variant: "default" })}
                          aria-label="Delete"
                        >
                          <Trash2 className="h-4 w-4" />
                        </Button>
                      </div>
                    </div>
                  );
                })
              )}
            </div>
          </CardContent>
        </Card>
      </div>

      <Dialog open={dialogOpen} onOpenChange={setDialogOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Add New Category</DialogTitle>
            <DialogClose />
          </DialogHeader>
          <div className="space-y-4">
            <div>
              <Label>Category Name</Label>
              <Input
                value={form.name}
                onChange={(e) => setForm({ ...form, name: e.target.value })}
                placeholder="Enter category name"
                className="mt-1"
              />
            </div>
            <div>
              <Label>Description</Label>
              <Textarea
                value={form.description}
                onChange={(e) => setForm({ ...form, description: e.target.value })}
                placeholder="Category description"
                className="mt-1"
              />
            </div>
            <div>
              <Label>Parent Category</Label>
              <Select
                value={form.parentId}
                onValueChange={(v) => setForm({ ...form, parentId: v })}
                placeholder="None (Top level)"
                options={[
                  { value: "", label: "None (Top level)" },
                  ...parentCategories.map((c) => ({ value: c.id, label: c.name })),
                ]}
              />
            </div>
            <div>
              <Label>Image URL</Label>
              <Input
                value={form.image}
                onChange={(e) => setForm({ ...form, image: e.target.value })}
                placeholder="https://..."
                className="mt-1"
              />
            </div>
            <Button onClick={handleSave} className="w-full">
              Save Category
            </Button>
          </div>
        </DialogContent>
      </Dialog>
    </DashboardShell>
  );
}
