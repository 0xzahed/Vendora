"use client";

import * as React from "react";
import { Star } from "lucide-react";
import { useQuery } from "@tanstack/react-query";
import { api } from "@/services/api";
import { Rating } from "@/components/ui/rating";
import { Badge } from "@/components/ui/badge";
import { EmptyState } from "@/components/ui/empty-state";
import { formatDate } from "@/lib/utils";

export function ReviewsContent() {
  const { data: reviews, isLoading } = useQuery({
    queryKey: ["customer-reviews"],
    queryFn: () => api.reviews.list({ customerId: "cust-1" }),
  });

  return (
    <div className="mx-auto max-w-4xl px-4 py-6">
      <div className="mb-6">
        <h1 className="text-2xl font-bold">My Reviews</h1>
        <p className="text-sm text-muted-foreground">Products you've reviewed</p>
      </div>

      {isLoading ? (
        <div className="space-y-4">
          {Array.from({ length: 3 }).map((_, i) => (
            <div key={i} className="h-32 animate-shimmer rounded-xl" />
          ))}
        </div>
      ) : reviews?.length === 0 ? (
        <EmptyState
          icon={<Star className="h-8 w-8 text-muted-foreground" />}
          title="No reviews yet"
          description="Share your experience with products you've purchased"
        />
      ) : (
        <div className="space-y-4">
          {reviews?.map((review) => (
            <div key={review.id} className="rounded-xl border border-border bg-card p-4">
              <div className="flex items-start gap-4">
                <img
                  src={review.productImage}
                  alt={review.productName}
                  className="h-16 w-16 rounded-lg object-cover"
                />
                <div className="flex-1">
                  <p className="font-medium">{review.productName}</p>
                  <div className="mt-1 flex items-center gap-2">
                    <Rating value={review.rating} size="sm" />
                    <Badge variant="success" className="text-xs">Verified</Badge>
                  </div>
                  <h4 className="mt-2 text-sm font-medium">{review.title}</h4>
                  <p className="mt-1 text-sm text-muted-foreground">{review.comment}</p>
                  <p className="mt-2 text-xs text-muted-foreground">
                    {formatDate(review.createdAt)}
                  </p>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
