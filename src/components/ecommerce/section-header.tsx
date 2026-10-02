import Link from "next/link";
import { ArrowRight } from "lucide-react";
import { cn } from "@/lib/utils";

interface SectionHeaderProps {
  title: string;
  subtitle?: string;
  href?: string;
  actionLabel?: string;
  className?: string;
}

export function SectionHeader({
  title,
  subtitle,
  href,
  actionLabel = "View All",
  className,
}: SectionHeaderProps) {
  return (
    <div className={cn("mb-6 flex items-end justify-between", className)}>
      <div>
        <h2 className="text-2xl font-bold tracking-tight">{title}</h2>
        {subtitle && (
          <p className="mt-1 text-sm text-muted-foreground">{subtitle}</p>
        )}
      </div>
      {href && (
        <Link
          href={href}
          className="flex items-center gap-1 text-sm font-medium text-primary hover:underline"
        >
          {actionLabel}
          <ArrowRight className="h-4 w-4" />
        </Link>
      )}
    </div>
  );
}
