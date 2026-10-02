"use client";

import * as React from "react";
import Link from "next/link";
import { ArrowLeft, MapPin, CreditCard, Truck } from "lucide-react";
import { useQuery } from "@tanstack/react-query";
import { api } from "@/services/api";
import { DashboardShell, type DashboardNavItem } from "@/components/dashboard/dashboard-shell";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Separator } from "@/components/ui/separator";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { formatPrice, formatDateTime } from "@/lib/utils";
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

export function VendorOrderDetailContent({ orderId }: { orderId: string }) {
  const { data: order } = useQuery({
    queryKey: ["vendor-order", orderId],
    queryFn: () => api.orders.getById(orderId),
  });

  if (!order) return null;

  return (
    <DashboardShell
      navItems={navItems}
      title={`Order ${order.orderNumber}`}
      subtitle={`Placed ${formatDateTime(order.createdAt)}`}
      headerActions={
        <Link href="/vendor/orders">
          <Button variant="outline">
            <ArrowLeft className="h-4 w-4" />
            Back to Orders
          </Button>
        </Link>
      }
    >
      <div className="grid gap-6 lg:grid-cols-3">
        <div className="space-y-6 lg:col-span-2">
          <Card>
            <CardHeader>
              <CardTitle>Order Items</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {order.items.map((item) => (
                  <div key={item.id} className="flex gap-4">
                    <img
                      src={item.productImage}
                      alt={item.productName}
                      className="h-20 w-20 rounded-lg object-cover"
                    />
                    <div className="flex-1">
                      <p className="font-medium">{item.productName}</p>
                      <p className="text-sm text-muted-foreground">
                        {item.vendorName} · Qty: {item.quantity}
                      </p>
                      {item.variant && (
                        <p className="text-xs text-muted-foreground">{item.variant}</p>
                      )}
                    </div>
                    <span className="font-medium">
                      {formatPrice(item.price * item.quantity)}
                    </span>
                  </div>
                ))}
              </div>
              <Separator className="my-4" />
              <div className="space-y-2 text-sm">
                <div className="flex justify-between">
                  <span className="text-muted-foreground">Subtotal</span>
                  <span>{formatPrice(order.subtotal)}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-muted-foreground">Shipping</span>
                  <span>{order.shippingCost === 0 ? "Free" : formatPrice(order.shippingCost)}</span>
                </div>
                {order.discount > 0 && (
                  <div className="flex justify-between text-success">
                    <span>Discount</span>
                    <span>-{formatPrice(order.discount)}</span>
                  </div>
                )}
                <div className="flex justify-between">
                  <span className="text-muted-foreground">Tax</span>
                  <span>{formatPrice(order.tax)}</span>
                </div>
                <Separator />
                <div className="flex justify-between text-base font-bold">
                  <span>Total</span>
                  <span>{formatPrice(order.total)}</span>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>

        <div className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle>Customer</CardTitle>
            </CardHeader>
            <CardContent>
              <p className="font-medium">{order.customerName}</p>
              <p className="text-sm text-muted-foreground">{order.customerEmail}</p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <MapPin className="h-4 w-4" />
                Shipping Address
              </CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-sm font-medium">{order.shippingAddress.name}</p>
              <p className="text-sm text-muted-foreground">{order.shippingAddress.street}</p>
              <p className="text-sm text-muted-foreground">
                {order.shippingAddress.city}, {order.shippingAddress.state} {order.shippingAddress.zip}
              </p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <CreditCard className="h-4 w-4" />
                Payment
              </CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-sm font-medium capitalize">
                {order.paymentMethod.replace("_", " ")}
              </p>
              <Badge
                variant={order.paymentStatus === "paid" ? "success" : order.paymentStatus === "pending" ? "warning" : "destructive"}
                className="mt-2 capitalize"
              >
                {order.paymentStatus}
              </Badge>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Truck className="h-4 w-4" />
                Fulfillment
              </CardTitle>
            </CardHeader>
            <CardContent>
              <Badge
                variant={statusColors[order.status] as "warning" | "info" | "success" | "destructive"}
                className="capitalize text-sm px-3 py-1"
              >
                {order.status}
              </Badge>
              {order.trackingNumber && (
                <p className="mt-2 text-sm font-medium">{order.trackingNumber}</p>
              )}
            </CardContent>
          </Card>
        </div>
      </div>
    </DashboardShell>
  );
}
