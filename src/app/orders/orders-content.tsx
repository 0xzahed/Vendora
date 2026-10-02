"use client";

import * as React from "react";
import Link from "next/link";
import { Package, ChevronRight } from "lucide-react";
import { useQuery } from "@tanstack/react-query";
import { api } from "@/services/api";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Select } from "@/components/ui/select";
import { EmptyState } from "@/components/ui/empty-state";
import { Breadcrumb } from "@/components/ui/breadcrumb";
import { formatPrice, formatDate } from "@/lib/utils";
import { cn } from "@/lib/utils";
import type { OrderStatus } from "@/types";

const statusColors: Record<OrderStatus, string> = {
  pending: "warning",
  confirmed: "info",
  processing: "info",
  shipped: "info",
  delivered: "success",
  cancelled: "destructive",
  returned: "destructive",
};

export function OrdersContent() {
  const [statusFilter, setStatusFilter] = React.useState("all");
  const { data: orders, isLoading } = useQuery({
    queryKey: ["orders"],
    queryFn: () => api.orders.list({ customerId: "cust-1" }),
  });

  const filtered = orders?.filter(
    (o) => statusFilter === "all" || o.status === statusFilter
  );

  return (
    <div className="mx-auto max-w-7xl px-4 py-6">
      <Breadcrumb items={[{ label: "Home", href: "/" }, { label: "My Orders" }]} className="mb-4" />

      <div className="mb-6 flex items-center justify-between">
        <h1 className="text-2xl font-bold">My Orders</h1>
        <Select
          value={statusFilter}
          onValueChange={setStatusFilter}
          options={[
            { value: "all", label: "All Orders" },
            { value: "pending", label: "Pending" },
            { value: "processing", label: "Processing" },
            { value: "shipped", label: "Shipped" },
            { value: "delivered", label: "Delivered" },
            { value: "cancelled", label: "Cancelled" },
          ]}
          className="w-40"
        />
      </div>

      {isLoading ? (
        <div className="space-y-4">
          {Array.from({ length: 3 }).map((_, i) => (
            <div key={i} className="h-32 animate-shimmer rounded-xl" />
          ))}
        </div>
      ) : filtered?.length === 0 ? (
        <EmptyState
          icon={<Package className="h-8 w-8 text-muted-foreground" />}
          title="No orders found"
          description="You haven't placed any orders yet"
          action={{ label: "Start Shopping", onClick: () => (window.location.href = "/shop") }}
        />
      ) : (
        <div className="space-y-4">
          {filtered?.map((order) => (
            <Link
              key={order.id}
              href={`/orders/${order.id}`}
              className="block rounded-xl border border-border bg-card p-4 transition-shadow hover:shadow-md"
            >
              <div className="flex items-center justify-between">
                <div>
                  <p className="font-medium">{order.orderNumber}</p>
                  <p className="text-sm text-muted-foreground">
                    Placed {formatDate(order.createdAt)}
                  </p>
                </div>
                <div className="flex items-center gap-3">
                  <Badge variant={statusColors[order.status] as "warning" | "info" | "success" | "destructive"} className="capitalize">
                    {order.status}
                  </Badge>
                  <span className="font-bold">{formatPrice(order.total)}</span>
                  <ChevronRight className="h-4 w-4 text-muted-foreground" />
                </div>
              </div>
              <div className="mt-3 flex items-center gap-2">
                {order.items.slice(0, 3).map((item) => (
                  <img
                    key={item.id}
                    src={item.productImage}
                    alt={item.productName}
                    className="h-12 w-12 rounded-lg object-cover"
                  />
                ))}
                {order.items.length > 3 && (
                  <span className="text-sm text-muted-foreground">
                    +{order.items.length - 3} more
                  </span>
                )}
              </div>
            </Link>
          ))}
        </div>
      )}
    </div>
  );
}
