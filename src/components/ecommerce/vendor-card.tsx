import Link from "next/link";
import { BadgeCheck, Users, Package } from "lucide-react";
import type { Vendor } from "@/types";
import { Avatar } from "@/components/ui/avatar";
import { Rating } from "@/components/ui/rating";
import { formatCompactNumber } from "@/lib/utils";

interface VendorCardProps {
  vendor: Vendor;
}

export function VendorCard({ vendor }: VendorCardProps) {
  return (
    <Link
      href={`/vendors/${vendor.slug}`}
      className="group flex flex-col items-center rounded-xl border border-border bg-card p-6 text-center transition-all hover:shadow-md"
    >
      <div className="relative">
        <Avatar
          fallback={vendor.logo}
          size="xl"
          className="border-2 border-border"
        />
        {vendor.verified && (
          <BadgeCheck className="absolute -bottom-1 -right-1 h-6 w-6 rounded-full bg-card text-info" />
        )}
      </div>
      <h3 className="mt-3 font-semibold group-hover:text-primary">
        {vendor.name}
      </h3>
      <div className="mt-1 flex items-center gap-1">
        <Rating value={vendor.rating} size="sm" />
        <span className="text-xs text-muted-foreground">
          ({formatCompactNumber(vendor.reviewCount)})
        </span>
      </div>
      <div className="mt-3 flex items-center gap-4 text-xs text-muted-foreground">
        <span className="flex items-center gap-1">
          <Package className="h-3.5 w-3.5" />
          {vendor.totalProducts} products
        </span>
        <span className="flex items-center gap-1">
          <Users className="h-3.5 w-3.5" />
          {formatCompactNumber(vendor.followers)}
        </span>
      </div>
    </Link>
  );
}
