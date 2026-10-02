"use client";

import * as React from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import {
  Search,
  ShoppingCart,
  Heart,
  User,
  Menu,
  X,
  Sun,
  Moon,
  Monitor,
  ChevronDown,
  Package,
  Store,
  LayoutGrid,
} from "lucide-react";
import { useCartStore } from "@/stores/cart";
import { useWishlistStore } from "@/stores/wishlist";
import { useUIStore } from "@/stores/ui";
import { categories } from "@/mock/categories";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { DropdownMenu, DropdownMenuItem, DropdownMenuSeparator } from "@/components/ui/dropdown-menu";
import { cn } from "@/lib/utils";

export function Navbar() {
  const router = useRouter();
  const cartCount = useCartStore((s) => s.getItemCount());
  const wishlistCount = useWishlistStore((s) => s.getCount());
  const { theme, setTheme, mobileMenuOpen, setMobileMenuOpen, setSearchOpen } = useUIStore();
  const [searchQuery, setSearchQuery] = React.useState("");
  const [scrolled, setScrolled] = React.useState(false);

  React.useEffect(() => {
    const handleScroll = () => setScrolled(window.scrollY > 10);
    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    if (searchQuery.trim()) {
      router.push(`/search?q=${encodeURIComponent(searchQuery.trim())}`);
      setSearchOpen(false);
    }
  };

  const themeOptions = [
    { value: "light", label: "Light", icon: Sun },
    { value: "dark", label: "Dark", icon: Moon },
    { value: "system", label: "System", icon: Monitor },
  ];

  return (
    <header
      className={cn(
        "sticky top-0 z-40 border-b border-border bg-card/95 backdrop-blur-sm transition-shadow",
        scrolled && "shadow-sm"
      )}
    >
      <div className="mx-auto max-w-7xl px-4">
        <div className="flex h-16 items-center gap-4">
          <button
            className="lg:hidden cursor-pointer"
            onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
            aria-label="Toggle menu"
          >
            {mobileMenuOpen ? <X className="h-6 w-6" /> : <Menu className="h-6 w-6" />}
          </button>

          <Link href="/" className="flex items-center gap-2">
            <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-primary text-sm font-bold text-primary-foreground">
              V
            </div>
            <span className="text-xl font-bold tracking-tight hidden sm:block">
              Vendora
            </span>
          </Link>

          <div className="hidden lg:block">
            <DropdownMenu
              align="start"
              trigger={
                <Button variant="ghost" className="gap-1.5 cursor-pointer">
                  <LayoutGrid className="h-4 w-4" />
                  Categories
                  <ChevronDown className="h-3.5 w-3.5" />
                </Button>
              }
            >
              {categories
                .filter((c) => !c.parentId)
                .map((cat) => (
                  <DropdownMenuItem
                    key={cat.id}
                    onClick={() => router.push(`/shop/${cat.slug}`)}
                  >
                    {cat.name}
                  </DropdownMenuItem>
                ))}
            </DropdownMenu>
          </div>

          <form onSubmit={handleSearch} className="hidden flex-1 md:flex">
            <div className="relative w-full max-w-xl">
              <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
              <Input
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                placeholder="Search products, brands, vendors..."
                className="pl-9"
              />
            </div>
          </form>

          <div className="ml-auto flex items-center gap-1">
            <button
              className="md:hidden cursor-pointer"
              onClick={() => setSearchOpen(true)}
              aria-label="Search"
            >
              <Search className="h-5 w-5" />
            </button>

            <DropdownMenu
              trigger={
                <Button variant="ghost" size="icon" className="cursor-pointer" aria-label="Theme">
                  {theme === "dark" ? (
                    <Moon className="h-5 w-5" />
                  ) : theme === "light" ? (
                    <Sun className="h-5 w-5" />
                  ) : (
                    <Monitor className="h-5 w-5" />
                  )}
                </Button>
              }
            >
              {themeOptions.map((opt) => (
                <DropdownMenuItem
                  key={opt.value}
                  onClick={() => setTheme(opt.value as "light" | "dark" | "system")}
                >
                  <opt.icon className="h-4 w-4" />
                  {opt.label}
                </DropdownMenuItem>
              ))}
            </DropdownMenu>

            <Link href="/wishlist">
              <Button variant="ghost" size="icon" className="relative cursor-pointer" aria-label="Wishlist">
                <Heart className="h-5 w-5" />
                {wishlistCount > 0 && (
                  <span className="absolute -right-0.5 -top-0.5 flex h-4 w-4 items-center justify-center rounded-full bg-destructive text-[10px] font-bold text-destructive-foreground">
                    {wishlistCount}
                  </span>
                )}
              </Button>
            </Link>

            <Link href="/cart">
              <Button variant="ghost" size="icon" className="relative cursor-pointer" aria-label="Cart">
                <ShoppingCart className="h-5 w-5" />
                {cartCount > 0 && (
                  <span className="absolute -right-0.5 -top-0.5 flex h-4 w-4 items-center justify-center rounded-full bg-primary text-[10px] font-bold text-primary-foreground">
                    {cartCount}
                  </span>
                )}
              </Button>
            </Link>

            <DropdownMenu
              trigger={
                <Button variant="ghost" size="icon" className="cursor-pointer" aria-label="Account">
                  <User className="h-5 w-5" />
                </Button>
              }
            >
              <DropdownMenuItem onClick={() => router.push("/account")}>
                <User className="h-4 w-4" />
                My Account
              </DropdownMenuItem>
              <DropdownMenuItem onClick={() => router.push("/orders")}>
                <Package className="h-4 w-4" />
                My Orders
              </DropdownMenuItem>
              <DropdownMenuSeparator />
              <DropdownMenuItem onClick={() => router.push("/vendor/dashboard")}>
                <Store className="h-4 w-4" />
                Vendor Dashboard
              </DropdownMenuItem>
              <DropdownMenuItem onClick={() => router.push("/admin/dashboard")}>
                <LayoutGrid className="h-4 w-4" />
                Admin Dashboard
              </DropdownMenuItem>
            </DropdownMenu>
          </div>
        </div>
      </div>

      {mobileMenuOpen && (
        <div className="border-t border-border bg-card p-4 lg:hidden animate-fade-in">
          <form onSubmit={handleSearch} className="mb-4 md:hidden">
            <div className="relative">
              <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
              <Input
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                placeholder="Search products..."
                className="pl-9"
              />
            </div>
          </form>
          <nav className="flex flex-col gap-1">
            <Link
              href="/shop"
              className="rounded-lg px-3 py-2 text-sm font-medium hover:bg-accent"
              onClick={() => setMobileMenuOpen(false)}
            >
              All Products
            </Link>
            {categories
              .filter((c) => !c.parentId)
              .map((cat) => (
                <Link
                  key={cat.id}
                  href={`/shop/${cat.slug}`}
                  className="rounded-lg px-3 py-2 text-sm text-muted-foreground hover:bg-accent"
                  onClick={() => setMobileMenuOpen(false)}
                >
                  {cat.name}
                </Link>
              ))}
            <div className="my-2 border-t border-border" />
            <Link
              href="/vendors"
              className="rounded-lg px-3 py-2 text-sm font-medium hover:bg-accent"
              onClick={() => setMobileMenuOpen(false)}
            >
              All Vendors
            </Link>
            <Link
              href="/coupons"
              className="rounded-lg px-3 py-2 text-sm font-medium hover:bg-accent"
              onClick={() => setMobileMenuOpen(false)}
            >
              Coupons
            </Link>
          </nav>
        </div>
      )}
    </header>
  );
}
