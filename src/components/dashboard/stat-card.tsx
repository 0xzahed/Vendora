import * as React from "react";
import { cn, formatPrice, formatCompactNumber } from "@/lib/utils";
import { Card, CardContent } from "@/components/ui/card";
import { TrendingUp, TrendingDown } from "lucide-react";

interface StatCardProps {
  title: string;
  value: string | number;
  change?: number;
  changeLabel?: string;
  icon: React.ComponentType<{ className?: string }>;
  prefix?: string;
  format?: "price" | "number" | "compact";
  className?: string;
}

export function StatCard({
  title,
  value,
  change,
  changeLabel = "vs last period",
  icon: Icon,
  prefix,
  format = "number",
  className,
}: StatCardProps) {
  const formattedValue =
    format === "price"
      ? formatPrice(typeof value === "number" ? value : parseFloat(value))
      : format === "compact"
        ? formatCompactNumber(typeof value === "number" ? value : parseFloat(value))
        : typeof value === "number"
          ? value.toLocaleString()
          : value;

  return (
    <Card className={className}>
      <CardContent className="p-4 lg:p-6">
        <div className="flex items-center justify-between">
          <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-primary/10">
            <Icon className="h-5 w-5 text-primary" />
          </div>
          {change !== undefined && (
            <div
              className={cn(
                "flex items-center gap-1 text-xs font-medium",
                change >= 0 ? "text-success" : "text-destructive"
              )}
            >
              {change >= 0 ? (
                <TrendingUp className="h-3.5 w-3.5" />
              ) : (
                <TrendingDown className="h-3.5 w-3.5" />
              )}
              {Math.abs(change)}%
            </div>
          )}
        </div>
        <div className="mt-3">
          <p className="text-sm text-muted-foreground">{title}</p>
          <p className="mt-1 text-2xl font-bold tracking-tight">
            {prefix}
            {formattedValue}
          </p>
          {change !== undefined && (
            <p className="mt-1 text-xs text-muted-foreground">{changeLabel}</p>
          )}
        </div>
      </CardContent>
    </Card>
  );
}
