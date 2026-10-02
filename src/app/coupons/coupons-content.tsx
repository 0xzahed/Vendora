"use client";

import * as React from "react";
import { Ticket, Copy } from "lucide-react";
import { useQuery } from "@tanstack/react-query";
import { api } from "@/services/api";
import { useUIStore } from "@/stores/ui";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { EmptyState } from "@/components/ui/empty-state";
import { Breadcrumb } from "@/components/ui/breadcrumb";
import { formatDate } from "@/lib/utils";

export function CouponsContent() {
  const addToast = useUIStore((s) => s.addToast);
  const { data: coupons, isLoading } = useQuery({
    queryKey: ["coupons"],
    queryFn: () => api.coupons.getActive(),
  });

  const copyCode = (code: string) => {
    navigator.clipboard.writeText(code);
    addToast({ title: "Code copied!", description: code, variant: "success" });
  };

  return (
    <div className="mx-auto max-w-4xl px-4 py-6">
      <Breadcrumb items={[{ label: "Home", href: "/" }, { label: "Coupons" }]} className="mb-4" />

      <h1 className="mb-6 text-2xl font-bold">Available Coupons</h1>

      {isLoading ? (
        <div className="space-y-4">
          {Array.from({ length: 3 }).map((_, i) => (
            <div key={i} className="h-24 animate-shimmer rounded-xl" />
          ))}
        </div>
      ) : coupons?.length === 0 ? (
        <EmptyState
          icon={<Ticket className="h-8 w-8 text-muted-foreground" />}
          title="No coupons available"
          description="Check back later for new deals and offers"
        />
      ) : (
        <div className="grid gap-4 sm:grid-cols-2">
          {coupons?.map((coupon) => (
            <div
              key={coupon.id}
              className="flex overflow-hidden rounded-xl border border-border bg-card"
            >
              <div className="flex w-24 flex-col items-center justify-center bg-primary/10 p-4 text-center">
                <Ticket className="h-6 w-6 text-primary" />
                <p className="mt-1 text-lg font-bold text-primary">
                  {coupon.type === "percentage" ? `${coupon.value}%` : `$${coupon.value}`}
                </p>
                <p className="text-xs text-muted-foreground">OFF</p>
              </div>
              <div className="flex-1 p-4">
                <div className="flex items-start justify-between">
                  <div>
                    <p className="font-medium">{coupon.description}</p>
                    <p className="mt-1 text-xs text-muted-foreground">
                      Min. order: ${coupon.minOrder} · Expires {formatDate(coupon.expiresAt)}
                    </p>
                    {coupon.vendorName && (
                      <Badge variant="secondary" className="mt-2">
                        {coupon.vendorName}
                      </Badge>
                    )}
                  </div>
                  <Button
                    size="sm"
                    variant="outline"
                    onClick={() => copyCode(coupon.code)}
                    className="shrink-0"
                  >
                    <Copy className="h-3 w-3" />
                    {coupon.code}
                  </Button>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
