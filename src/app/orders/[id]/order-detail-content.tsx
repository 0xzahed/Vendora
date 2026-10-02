"use client";

import * as React from "react";
import Link from "next/link";
import { Package, Truck, CheckCircle2, XCircle, RotateCcw, MapPin, CreditCard } from "lucide-react";
import { useQuery } from "@tanstack/react-query";
import { api } from "@/services/api";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Separator } from "@/components/ui/separator";
import { Breadcrumb } from "@/components/ui/breadcrumb";
import { formatPrice, formatDateTime } from "@/lib/utils";
import { cn } from "@/lib/utils";
import type { OrderStatus } from "@/types";

const statusSteps: { status: OrderStatus; label: string; icon: React.ComponentType<{ className?: string }> }[] = [
  { status: "pending", label: "Pending", icon: Package },
  { status: "confirmed", label: "Confirmed", icon: CheckCircle2 },
  { status: "processing", label: "Processing", icon: Package },
  { status: "shipped", label: "Shipped", icon: Truck },
  { status: "delivered", label: "Delivered", icon: CheckCircle2 },
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

export function OrderDetailContent({ orderId }: { orderId: string }) {
  const { data: order } = useQuery({
    queryKey: ["order", orderId],
    queryFn: () => api.orders.getById(orderId),
  });

  if (!order) return null;

  const currentStepIndex = statusSteps.findIndex((s) => s.status === order.status);
  const isCancelled = order.status === "cancelled" || order.status === "returned";

  return (
    <div className="mx-auto max-w-4xl px-4 py-6">
      <Breadcrumb
        items={[
          { label: "Home", href: "/" },
          { label: "Orders", href: "/orders" },
          { label: order.orderNumber },
        ]}
        className="mb-4"
      />

      <div className="mb-6 flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold">{order.orderNumber}</h1>
          <p className="text-sm text-muted-foreground">
            Placed {formatDateTime(order.createdAt)}
          </p>
        </div>
        <Badge
          variant={statusColors[order.status] as "warning" | "info" | "success" | "destructive"}
          className="capitalize text-sm px-3 py-1"
        >
          {order.status}
        </Badge>
      </div>

      {!isCancelled && (
        <div className="mb-8 rounded-xl border border-border bg-card p-6">
          <h2 className="mb-4 font-semibold">Order Progress</h2>
          <div className="flex items-center justify-between">
            {statusSteps.map((step, i) => {
              const isCompleted = i <= currentStepIndex;
              const isCurrent = i === currentStepIndex;
              return (
                <React.Fragment key={step.status}>
                  <div className="flex flex-col items-center gap-2">
                    <div
                      className={cn(
                        "flex h-10 w-10 items-center justify-center rounded-full",
                        isCompleted
                          ? "bg-success text-white"
                          : "bg-muted text-muted-foreground"
                      )}
                    >
                      <step.icon className="h-5 w-5" />
                    </div>
                    <span
                      className={cn(
                        "text-xs",
                        isCurrent ? "font-medium" : "text-muted-foreground"
                      )}
                    >
                      {step.label}
                    </span>
                  </div>
                  {i < statusSteps.length - 1 && (
                    <div
                      className={cn(
                        "h-0.5 flex-1",
                        i < currentStepIndex ? "bg-success" : "bg-border"
                      )}
                    />
                  )}
                </React.Fragment>
              );
            })}
          </div>
        </div>
      )}

      <div className="grid gap-6 lg:grid-cols-3">
        <div className="space-y-6 lg:col-span-2">
          <div className="rounded-xl border border-border bg-card p-6">
            <h2 className="mb-4 font-semibold">Items ({order.items.length})</h2>
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
                  <span>Discount {order.couponCode && `(${order.couponCode})`}</span>
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
          </div>
        </div>

        <div className="space-y-6">
          <div className="rounded-xl border border-border bg-card p-4">
            <h3 className="mb-3 flex items-center gap-2 font-semibold">
              <MapPin className="h-4 w-4" />
              Shipping Address
            </h3>
            <p className="text-sm font-medium">{order.shippingAddress.name}</p>
            <p className="text-sm text-muted-foreground">
              {order.shippingAddress.street}
            </p>
            <p className="text-sm text-muted-foreground">
              {order.shippingAddress.city}, {order.shippingAddress.state}{" "}
              {order.shippingAddress.zip}
            </p>
          </div>

          <div className="rounded-xl border border-border bg-card p-4">
            <h3 className="mb-3 flex items-center gap-2 font-semibold">
              <CreditCard className="h-4 w-4" />
              Payment
            </h3>
            <p className="text-sm font-medium capitalize">
              {order.paymentMethod.replace("_", " ")}
            </p>
            <Badge
              variant={order.paymentStatus === "paid" ? "success" : order.paymentStatus === "pending" ? "warning" : "destructive"}
              className="mt-2 capitalize"
            >
              {order.paymentStatus}
            </Badge>
          </div>

          {order.trackingNumber && (
            <div className="rounded-xl border border-border bg-card p-4">
              <h3 className="mb-2 flex items-center gap-2 font-semibold">
                <Truck className="h-4 w-4" />
                Tracking
              </h3>
              <p className="text-sm font-medium">{order.trackingNumber}</p>
            </div>
          )}

          <div className="flex gap-2">
            <Link href="/shop" className="flex-1">
              <Button variant="outline" className="w-full">Continue Shopping</Button>
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
}
