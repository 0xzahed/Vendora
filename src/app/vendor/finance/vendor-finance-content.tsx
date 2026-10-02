"use client";

import * as React from "react";
import { DollarSign, TrendingUp, Clock, Wallet, ArrowUpRight, ArrowDownRight, Package, ShoppingCart, Percent } from "lucide-react";
import { useQuery } from "@tanstack/react-query";
import { api } from "@/services/api";
import { useUIStore } from "@/stores/ui";
import { DashboardShell, type DashboardNavItem } from "@/components/dashboard/dashboard-shell";
import { StatCard } from "@/components/dashboard/stat-card";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Separator } from "@/components/ui/separator";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogClose } from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { formatPrice, formatDate } from "@/lib/utils";

const navItems: DashboardNavItem[] = [
  { label: "Dashboard", href: "/vendor/dashboard", icon: TrendingUp },
  { label: "Products", href: "/vendor/products", icon: Package },
  { label: "Orders", href: "/vendor/orders", icon: ShoppingCart },
  { label: "Analytics", href: "/vendor/analytics", icon: TrendingUp },
  { label: "Finance", href: "/vendor/finance", icon: Wallet },
  { label: "Coupons", href: "/vendor/coupons", icon: Percent },
];

export function VendorFinanceContent() {
  const addToast = useUIStore((s) => s.addToast);
  const [payoutDialogOpen, setPayoutDialogOpen] = React.useState(false);
  const [payoutAmount, setPayoutAmount] = React.useState("");

  const { data: transactions } = useQuery({
    queryKey: ["transactions"],
    queryFn: () => api.transactions.list(),
  });

  const { data: payouts } = useQuery({
    queryKey: ["payouts"],
    queryFn: () => api.payouts.list(),
  });

  const stats = [
    { title: "Total Earnings", value: 24580, change: 12.5, icon: DollarSign, format: "price" as const },
    { title: "Platform Commission", value: 1966, change: 12.5, icon: TrendingUp, format: "price" as const },
    { title: "Available Balance", value: 12450, change: undefined, icon: Wallet, format: "price" as const },
    { title: "Pending Balance", value: 3200, change: undefined, icon: Clock, format: "price" as const },
  ];

  const handleRequestPayout = () => {
    addToast({ title: "Payout requested", description: `$${payoutAmount} will be processed within 2-3 business days`, variant: "success" });
    setPayoutDialogOpen(false);
    setPayoutAmount("");
  };

  return (
    <DashboardShell
      navItems={navItems}
      title="Finance"
      subtitle="Manage your earnings and payouts"
      headerActions={
        <Button onClick={() => setPayoutDialogOpen(true)}>
          <Wallet className="h-4 w-4" />
          Request Payout
        </Button>
      }
    >
      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
        {stats.map((stat) => (
          <StatCard key={stat.title} {...stat} />
        ))}
      </div>

      <div className="mt-6 grid gap-6 lg:grid-cols-2">
        <Card>
          <CardHeader>
            <CardTitle>Recent Transactions</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-3">
              {transactions?.slice(0, 8).map((txn) => (
                <div key={txn.id} className="flex items-center justify-between">
                  <div className="flex items-center gap-3">
                    <div
                      className={
                        txn.type === "credit"
                          ? "flex h-8 w-8 items-center justify-center rounded-full bg-success/10"
                          : "flex h-8 w-8 items-center justify-center rounded-full bg-destructive/10"
                      }
                    >
                      {txn.type === "credit" ? (
                        <ArrowUpRight className="h-4 w-4 text-success" />
                      ) : (
                        <ArrowDownRight className="h-4 w-4 text-destructive" />
                      )}
                    </div>
                    <div>
                      <p className="text-sm font-medium">{txn.description}</p>
                      <p className="text-xs text-muted-foreground">{formatDate(txn.createdAt)}</p>
                    </div>
                  </div>
                  <span
                    className={
                      txn.type === "credit"
                        ? "text-sm font-bold text-success"
                        : "text-sm font-bold text-destructive"
                    }
                  >
                    {txn.type === "credit" ? "+" : "-"}${txn.amount.toFixed(2)}
                  </span>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Payout History</CardTitle>
          </CardHeader>
          <CardContent>
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Reference</TableHead>
                  <TableHead>Amount</TableHead>
                  <TableHead>Method</TableHead>
                  <TableHead>Status</TableHead>
                  <TableHead>Date</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {payouts?.slice(0, 6).map((payout) => (
                  <TableRow key={payout.id}>
                    <TableCell className="font-medium">{payout.reference}</TableCell>
                    <TableCell>{formatPrice(payout.amount)}</TableCell>
                    <TableCell>{payout.method}</TableCell>
                    <TableCell>
                      <Badge
                        variant={
                          payout.status === "completed"
                            ? "success"
                            : payout.status === "pending"
                              ? "warning"
                              : payout.status === "processing"
                                ? "info"
                                : "destructive"
                        }
                        className="capitalize"
                      >
                        {payout.status}
                      </Badge>
                    </TableCell>
                    <TableCell>{formatDate(payout.requestedAt)}</TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </CardContent>
        </Card>
      </div>

      <Dialog open={payoutDialogOpen} onOpenChange={setPayoutDialogOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Request Payout</DialogTitle>
            <DialogClose />
          </DialogHeader>
          <div className="space-y-4">
            <div className="rounded-lg bg-muted p-3">
              <p className="text-sm text-muted-foreground">Available Balance</p>
              <p className="text-2xl font-bold">$12,450.00</p>
            </div>
            <div>
              <Label>Amount</Label>
              <Input
                type="number"
                value={payoutAmount}
                onChange={(e) => setPayoutAmount(e.target.value)}
                placeholder="Enter amount"
                className="mt-1"
              />
            </div>
            <div>
              <Label>Payout Method</Label>
              <div className="mt-1 space-y-2">
                {["Bank Transfer", "PayPal", "Wire Transfer"].map((method) => (
                  <div key={method} className="flex items-center gap-2 rounded-lg border border-border p-3">
                    <input type="radio" name="method" id={method} className="h-4 w-4" />
                    <Label htmlFor={method} className="cursor-pointer">{method}</Label>
                  </div>
                ))}
              </div>
            </div>
            <Button onClick={handleRequestPayout} className="w-full">
              Request Payout
            </Button>
          </div>
        </DialogContent>
      </Dialog>
    </DashboardShell>
  );
}
