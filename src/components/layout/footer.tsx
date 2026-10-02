"use client";

import * as React from "react";
import Link from "next/link";
import { Mail, MapPin, Phone, Globe, MessageCircle, Camera, Send } from "lucide-react";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { useUIStore } from "@/stores/ui";

export function Footer() {
  const addToast = useUIStore((s) => s.addToast);
  const [email, setEmail] = React.useState("");

  const handleSubscribe = (e: React.FormEvent) => {
    e.preventDefault();
    if (email.trim()) {
      addToast({
        title: "Subscribed!",
        description: "You'll receive our latest deals and updates.",
        variant: "success",
      });
      setEmail("");
    }
  };

  return (
    <footer className="border-t border-border bg-card">
      <div className="mx-auto max-w-7xl px-4 py-12">
        <div className="grid gap-8 md:grid-cols-2 lg:grid-cols-4">
          <div>
            <Link href="/" className="flex items-center gap-2">
              <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-primary text-sm font-bold text-primary-foreground">
                V
              </div>
              <span className="text-xl font-bold">Vendora</span>
            </Link>
            <p className="mt-3 text-sm text-muted-foreground">
              The trusted multi-vendor marketplace. Discover quality products
              from verified sellers worldwide.
            </p>
            <div className="mt-4 flex gap-2">
              {[Globe, MessageCircle, Camera, Send].map((Icon, i) => (
                <button
                  key={i}
                  className="flex h-9 w-9 items-center justify-center rounded-lg border border-border text-muted-foreground transition-colors hover:bg-accent hover:text-foreground cursor-pointer"
                  aria-label="Social media"
                >
                  <Icon className="h-4 w-4" />
                </button>
              ))}
            </div>
          </div>

          <div>
            <h3 className="font-semibold">Marketplace</h3>
            <ul className="mt-3 space-y-2 text-sm text-muted-foreground">
              <li><Link href="/shop" className="hover:text-foreground">All Products</Link></li>
              <li><Link href="/vendors" className="hover:text-foreground">Vendors</Link></li>
              <li><Link href="/coupons" className="hover:text-foreground">Coupons</Link></li>
              <li><Link href="/shop/electronics" className="hover:text-foreground">Electronics</Link></li>
              <li><Link href="/shop/fashion" className="hover:text-foreground">Fashion</Link></li>
            </ul>
          </div>

          <div>
            <h3 className="font-semibold">For Vendors</h3>
            <ul className="mt-3 space-y-2 text-sm text-muted-foreground">
              <li><Link href="/vendor/dashboard" className="hover:text-foreground">Vendor Dashboard</Link></li>
              <li><Link href="/vendor/products" className="hover:text-foreground">Manage Products</Link></li>
              <li><Link href="/vendor/orders" className="hover:text-foreground">Orders</Link></li>
              <li><Link href="/vendor/analytics" className="hover:text-foreground">Analytics</Link></li>
              <li><Link href="/vendor/finance" className="hover:text-foreground">Finance</Link></li>
            </ul>
          </div>

          <div>
            <h3 className="font-semibold">Contact</h3>
            <ul className="mt-3 space-y-2 text-sm text-muted-foreground">
              <li className="flex items-center gap-2">
                <Mail className="h-4 w-4" /> support@vendora.com
              </li>
              <li className="flex items-center gap-2">
                <Phone className="h-4 w-4" /> +1 (555) 000-0000
              </li>
              <li className="flex items-center gap-2">
                <MapPin className="h-4 w-4" /> San Francisco, CA
              </li>
            </ul>
            <form onSubmit={handleSubscribe} className="mt-4">
              <p className="mb-2 text-sm font-medium">Newsletter</p>
              <div className="flex gap-2">
                <Input
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="Your email"
                  className="h-9"
                />
                <Button type="submit" size="sm" className="h-9">
                  Subscribe
                </Button>
              </div>
            </form>
          </div>
        </div>

        <div className="mt-8 flex flex-col items-center justify-between gap-4 border-t border-border pt-8 text-sm text-muted-foreground md:flex-row">
          <p>&copy; 2026 Vendora Inc. All rights reserved.</p>
          <div className="flex gap-4">
            <Link href="#" className="hover:text-foreground">Privacy Policy</Link>
            <Link href="#" className="hover:text-foreground">Terms of Service</Link>
            <Link href="#" className="hover:text-foreground">Cookie Policy</Link>
          </div>
        </div>
      </div>
    </footer>
  );
}
