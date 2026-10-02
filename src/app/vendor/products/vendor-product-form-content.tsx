"use client";

import * as React from "react";
import { useRouter } from "next/navigation";
import { ArrowLeft, Upload, Plus, X } from "lucide-react";
import { useUIStore } from "@/stores/ui";
import { DashboardShell, type DashboardNavItem } from "@/components/dashboard/dashboard-shell";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Select } from "@/components/ui/select";
import { Switch } from "@/components/ui/switch";
import { Separator } from "@/components/ui/separator";
import { TrendingUp, Package, ShoppingCart, Wallet, Percent } from "lucide-react";

const navItems: DashboardNavItem[] = [
  { label: "Dashboard", href: "/vendor/dashboard", icon: TrendingUp },
  { label: "Products", href: "/vendor/products", icon: Package },
  { label: "Orders", href: "/vendor/orders", icon: ShoppingCart },
  { label: "Analytics", href: "/vendor/analytics", icon: TrendingUp },
  { label: "Finance", href: "/vendor/finance", icon: Wallet },
  { label: "Coupons", href: "/vendor/coupons", icon: Percent },
];

export function VendorProductFormContent() {
  const router = useRouter();
  const addToast = useUIStore((s) => s.addToast);
  const [form, setForm] = React.useState({
    name: "",
    description: "",
    shortDescription: "",
    price: "",
    originalPrice: "",
    category: "",
    stock: "",
    sku: "",
    brand: "",
    freeShipping: false,
    status: "draft",
  });
  const [images, setImages] = React.useState<string[]>([]);
  const [variants, setVariants] = React.useState([{ name: "", options: "" }]);

  const handleImageUpload = () => {
    const newImages = [
      ...images,
      `https://images.unsplash.com/photo-1505740420928-5e560c06d30e?auto=format&fit=crop&w=800&q=80`,
    ];
    setImages(newImages);
  };

  const handleSave = () => {
    addToast({ title: "Product saved successfully", variant: "success" });
    router.push("/vendor/products");
  };

  return (
    <DashboardShell
      navItems={navItems}
      title="Add New Product"
      subtitle="Fill in the product details below"
      headerActions={
        <Button variant="outline" onClick={() => router.back()}>
          <ArrowLeft className="h-4 w-4" />
          Back
        </Button>
      }
    >
      <div className="grid gap-6 lg:grid-cols-3">
        <div className="space-y-6 lg:col-span-2">
          <Card>
            <CardHeader>
              <CardTitle>Basic Information</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div>
                <Label>Product Name</Label>
                <Input
                  value={form.name}
                  onChange={(e) => setForm({ ...form, name: e.target.value })}
                  placeholder="Enter product name"
                  className="mt-1"
                />
              </div>
              <div>
                <Label>Short Description</Label>
                <Input
                  value={form.shortDescription}
                  onChange={(e) => setForm({ ...form, shortDescription: e.target.value })}
                  placeholder="Brief product summary"
                  className="mt-1"
                />
              </div>
              <div>
                <Label>Full Description</Label>
                <Textarea
                  value={form.description}
                  onChange={(e) => setForm({ ...form, description: e.target.value })}
                  placeholder="Detailed product description"
                  rows={4}
                  className="mt-1"
                />
              </div>
              <div className="grid gap-4 sm:grid-cols-2">
                <div>
                  <Label>Category</Label>
                  <Select
                    value={form.category}
                    onValueChange={(v) => setForm({ ...form, category: v })}
                    placeholder="Select category"
                    options={[
                      { value: "electronics", label: "Electronics" },
                      { value: "fashion", label: "Fashion" },
                      { value: "audio", label: "Audio" },
                      { value: "wearables", label: "Wearables" },
                    ]}
                  />
                </div>
                <div>
                  <Label>Brand</Label>
                  <Input
                    value={form.brand}
                    onChange={(e) => setForm({ ...form, brand: e.target.value })}
                    placeholder="Brand name"
                    className="mt-1"
                  />
                </div>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>Pricing & Inventory</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="grid gap-4 sm:grid-cols-3">
                <div>
                  <Label>Price ($)</Label>
                  <Input
                    type="number"
                    value={form.price}
                    onChange={(e) => setForm({ ...form, price: e.target.value })}
                    placeholder="0.00"
                    className="mt-1"
                  />
                </div>
                <div>
                  <Label>Original Price ($)</Label>
                  <Input
                    type="number"
                    value={form.originalPrice}
                    onChange={(e) => setForm({ ...form, originalPrice: e.target.value })}
                    placeholder="0.00"
                    className="mt-1"
                  />
                </div>
                <div>
                  <Label>Stock</Label>
                  <Input
                    type="number"
                    value={form.stock}
                    onChange={(e) => setForm({ ...form, stock: e.target.value })}
                    placeholder="0"
                    className="mt-1"
                  />
                </div>
              </div>
              <div>
                <Label>SKU</Label>
                <Input
                  value={form.sku}
                  onChange={(e) => setForm({ ...form, sku: e.target.value })}
                  placeholder="TW-XXX-000"
                  className="mt-1"
                />
              </div>
              <div className="flex items-center justify-between">
                <div>
                  <Label>Free Shipping</Label>
                  <p className="text-sm text-muted-foreground">Offer free shipping on this product</p>
                </div>
                <Switch
                  checked={form.freeShipping}
                  onCheckedChange={(v) => setForm({ ...form, freeShipping: v })}
                />
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>Product Images</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-4 gap-4">
                {images.map((img, i) => (
                  <div key={i} className="relative aspect-square overflow-hidden rounded-lg border border-border">
                    <img src={img} alt="" className="h-full w-full object-cover" />
                    <button
                      onClick={() => setImages(images.filter((_, idx) => idx !== i))}
                      className="absolute right-1 top-1 rounded-full bg-black/50 p-1 text-white cursor-pointer"
                    >
                      <X className="h-3 w-3" />
                    </button>
                  </div>
                ))}
                <button
                  onClick={handleImageUpload}
                  className="flex aspect-square flex-col items-center justify-center rounded-lg border-2 border-dashed border-border text-muted-foreground hover:border-primary hover:text-primary cursor-pointer"
                >
                  <Upload className="h-6 w-6" />
                  <span className="mt-1 text-xs">Upload</span>
                </button>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>Variants</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              {variants.map((variant, i) => (
                <div key={i} className="flex gap-4">
                  <div className="flex-1">
                    <Label>Variant Name</Label>
                    <Input
                      value={variant.name}
                      onChange={(e) => {
                        const newVariants = [...variants];
                        newVariants[i].name = e.target.value;
                        setVariants(newVariants);
                      }}
                      placeholder="e.g., Color, Size"
                      className="mt-1"
                    />
                  </div>
                  <div className="flex-1">
                    <Label>Options (comma separated)</Label>
                    <Input
                      value={variant.options}
                      onChange={(e) => {
                        const newVariants = [...variants];
                        newVariants[i].options = e.target.value;
                        setVariants(newVariants);
                      }}
                      placeholder="e.g., Red, Blue, Green"
                      className="mt-1"
                    />
                  </div>
                  <Button
                    size="icon"
                    variant="ghost"
                    className="mt-6"
                    onClick={() => setVariants(variants.filter((_, idx) => idx !== i))}
                  >
                    <X className="h-4 w-4" />
                  </Button>
                </div>
              ))}
              <Button
                variant="outline"
                onClick={() => setVariants([...variants, { name: "", options: "" }])}
              >
                <Plus className="h-4 w-4" />
                Add Variant
              </Button>
            </CardContent>
          </Card>
        </div>

        <div className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle>Publish</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div>
                <Label>Status</Label>
                <Select
                  value={form.status}
                  onValueChange={(v) => setForm({ ...form, status: v })}
                  options={[
                    { value: "draft", label: "Draft" },
                    { value: "active", label: "Active" },
                    { value: "pending", label: "Pending Review" },
                  ]}
                />
              </div>
              <Separator />
              <div className="flex flex-col gap-2">
                <Button onClick={handleSave}>Save Product</Button>
                <Button variant="outline" onClick={() => router.push("/vendor/products")}>
                  Cancel
                </Button>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </DashboardShell>
  );
}
