"use client";

import * as React from "react";
import { Percent, Edit2, TrendingUp, Store, Users, Package, ShoppingCart, DollarSign } from "lucide-react";
import { useQuery } from "@tanstack/react-query";
import { api } from "@/services/api";
import { useUIStore } from "@/stores/ui";
import { DashboardShell, type DashboardNavItem } from "@/components/dashboard/dashboard-shell";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogClose } from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";

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

export function AdminCommissionsContent() {
  const addToast = useUIStore((s) => s.addToast);
  const [dialogOpen, setDialogOpen] = React.useState(false);
  const [selectedCategory, setSelectedCategory] = React.useState("");
  const [newRate, setNewRate] = React.useState("");

  const { data: commissions, isLoading } = useQuery({
    queryKey: ["commissions"],
    queryFn: () => api.analytics.getCategoryCommissions(),
  });

  const { data: vendors } = useQuery({
    queryKey: ["vendors"],
    queryFn: () => api.vendors.list(),
  });

  const handleSave = () => {
    addToast({ title: "Commission rate updated", variant: "success" });
    setDialogOpen(false);
    setNewRate("");
  };

  return (
    <DashboardShell navItems={navItems} title="Commissions" subtitle="Manage platform commission rates">
      <div className="grid gap-6 lg:grid-cols-2">
        <Card>
          <CardHeader>
            <CardTitle>Category Commission Rates</CardTitle>
          </CardHeader>
          <CardContent>
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Category</TableHead>
                  <TableHead>Rate</TableHead>
                  <TableHead className="text-right">Actions</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {isLoading ? (
                  Array.from({ length: 5 }).map((_, i) => (
                    <TableRow key={i}>
                      {Array.from({ length: 3 }).map((_, j) => (
                        <TableCell key={j}>
                          <div className="h-4 animate-shimmer rounded" />
                        </TableCell>
                      ))}
                    </TableRow>
                  ))
                ) : (
                  commissions?.map((comm) => (
                    <TableRow key={comm.category}>
                      <TableCell className="font-medium">{comm.category}</TableCell>
                      <TableCell>
                        <Badge variant="info">{comm.rate}%</Badge>
                      </TableCell>
                      <TableCell>
                        <div className="flex justify-end">
                          <Button
                            size="icon"
                            variant="ghost"
                            className="h-8 w-8"
                            onClick={() => {
                              setSelectedCategory(comm.category);
                              setNewRate(comm.rate.toString());
                              setDialogOpen(true);
                            }}
                            aria-label="Edit"
                          >
                            <Edit2 className="h-4 w-4" />
                          </Button>
                        </div>
                      </TableCell>
                    </TableRow>
                  ))
                )}
              </TableBody>
            </Table>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Vendor-Specific Rates</CardTitle>
          </CardHeader>
          <CardContent>
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Vendor</TableHead>
                  <TableHead>Rate</TableHead>
                  <TableHead className="text-right">Actions</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {vendors?.map((vendor) => (
                  <TableRow key={vendor.id}>
                    <TableCell className="font-medium">{vendor.name}</TableCell>
                    <TableCell>
                      <Badge variant="info">{vendor.commissionRate}%</Badge>
                    </TableCell>
                    <TableCell>
                      <div className="flex justify-end">
                        <Button
                          size="icon"
                          variant="ghost"
                          className="h-8 w-8"
                          onClick={() => {
                            setSelectedCategory(vendor.name);
                            setNewRate(vendor.commissionRate.toString());
                            setDialogOpen(true);
                          }}
                          aria-label="Edit"
                        >
                          <Edit2 className="h-4 w-4" />
                        </Button>
                      </div>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </CardContent>
        </Card>
      </div>

      <Dialog open={dialogOpen} onOpenChange={setDialogOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Edit Commission Rate</DialogTitle>
            <DialogClose />
          </DialogHeader>
          <div className="space-y-4">
            <div>
              <Label>Category/Vendor</Label>
              <Input value={selectedCategory} disabled className="mt-1" />
            </div>
            <div>
              <Label>Commission Rate (%)</Label>
              <Input
                type="number"
                value={newRate}
                onChange={(e) => setNewRate(e.target.value)}
                placeholder="10"
                className="mt-1"
              />
            </div>
            <Button onClick={handleSave} className="w-full">
              <Percent className="h-4 w-4" />
              Update Rate
            </Button>
          </div>
        </DialogContent>
      </Dialog>
    </DashboardShell>
  );
}
