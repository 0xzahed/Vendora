"use client";

import * as React from "react";
import Link from "next/link";
import {
  Package,
  Clock,
  CheckCircle2,
  Heart,
  User,
  MapPin,
  Star,
  Ticket,
  Settings,
  ChevronRight,
} from "lucide-react";
import { useQuery } from "@tanstack/react-query";
import { api } from "@/services/api";
import { useWishlistStore } from "@/stores/wishlist";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Separator } from "@/components/ui/separator";
import { ProductCard } from "@/components/ecommerce/product-card";
import { formatPrice, formatDate } from "@/lib/utils";

const sidebarItems = [
  { label: "Dashboard", href: "/account", icon: User },
  { label: "Orders", href: "/orders", icon: Package },
  { label: "Wishlist", href: "/wishlist", icon: Heart },
  { label: "Reviews", href: "/account/reviews", icon: Star },
  { label: "Addresses", href: "/account/addresses", icon: MapPin },
  { label: "Coupons", href: "/coupons", icon: Ticket },
  { label: "Settings", href: "/account", icon: Settings },
];

export function AccountContent() {
  const wishlistCount = useWishlistStore((s) => s.getCount());
  const { data: orders } = useQuery({
    queryKey: ["account-orders"],
    queryFn: () => api.orders.list({ customerId: "cust-1" }),
  });
  const { data: recommended } = useQuery({
    queryKey: ["recommended"],
    queryFn: () => api.products.getBestSelling(),
  });

  const stats = [
    { label: "Total Orders", value: orders?.length || 0, icon: Package, color: "text-primary" },
    { label: "Pending", value: orders?.filter((o) => o.status === "pending" || o.status === "processing").length || 0, icon: Clock, color: "text-warning" },
    { label: "Delivered", value: orders?.filter((o) => o.status === "delivered").length || 0, icon: CheckCircle2, color: "text-success" },
    { label: "Wishlist", value: wishlistCount, icon: Heart, color: "text-destructive" },
  ];

  const recentOrders = orders?.slice(0, 3);

  return (
    <div className="mx-auto max-w-7xl px-4 py-6">
      <div className="mb-6">
        <h1 className="text-2xl font-bold">My Account</h1>
        <p className="text-sm text-muted-foreground">Welcome back, Sarah Johnson</p>
      </div>

      <div className="grid gap-6 lg:grid-cols-4">
        <div className="lg:col-span-1">
          <Card>
            <CardContent className="p-4">
              <nav className="flex flex-col gap-1">
                {sidebarItems.map((item) => (
                  <Link
                    key={item.label}
                    href={item.href}
                    className="flex items-center gap-3 rounded-lg px-3 py-2.5 text-sm font-medium text-muted-foreground transition-colors hover:bg-accent hover:text-foreground"
                  >
                    <item.icon className="h-4 w-4" />
                    {item.label}
                  </Link>
                ))}
              </nav>
            </CardContent>
          </Card>
        </div>

        <div className="space-y-6 lg:col-span-3">
          <div className="grid grid-cols-2 gap-4 lg:grid-cols-4">
            {stats.map((stat) => (
              <Card key={stat.label}>
                <CardContent className="p-4">
                  <stat.icon className={`h-5 w-5 ${stat.color}`} />
                  <p className="mt-2 text-2xl font-bold">{stat.value}</p>
                  <p className="text-xs text-muted-foreground">{stat.label}</p>
                </CardContent>
              </Card>
            ))}
          </div>

          <Card>
            <CardHeader>
              <CardTitle className="flex items-center justify-between">
                Recent Orders
                <Link href="/orders" className="text-sm font-normal text-primary hover:underline">
                  View All
                </Link>
              </CardTitle>
            </CardHeader>
            <CardContent>
              {recentOrders?.length === 0 ? (
                <p className="py-8 text-center text-sm text-muted-foreground">
                  No orders yet
                </p>
              ) : (
                <div className="space-y-3">
                  {recentOrders?.map((order) => (
                    <Link
                      key={order.id}
                      href={`/orders/${order.id}`}
                      className="flex items-center justify-between rounded-lg border border-border p-3 transition-colors hover:bg-accent"
                    >
                      <div>
                        <p className="text-sm font-medium">{order.orderNumber}</p>
                        <p className="text-xs text-muted-foreground">
                          {formatDate(order.createdAt)} · {order.items.length} items
                        </p>
                      </div>
                      <div className="flex items-center gap-3">
                        <Badge
                          variant={order.status === "delivered" ? "success" : order.status === "cancelled" ? "destructive" : "warning"}
                          className="capitalize"
                        >
                          {order.status}
                        </Badge>
                        <span className="text-sm font-bold">{formatPrice(order.total)}</span>
                        <ChevronRight className="h-4 w-4 text-muted-foreground" />
                      </div>
                    </Link>
                  ))}
                </div>
              )}
            </CardContent>
          </Card>

          <div>
            <h2 className="mb-4 text-lg font-semibold">Recommended for You</h2>
            <div className="grid grid-cols-2 gap-4 sm:grid-cols-3 lg:grid-cols-4">
              {recommended?.slice(0, 4).map((product) => (
                <ProductCard key={product.id} product={product} />
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
