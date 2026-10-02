"use client";

import * as React from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import {
  Check,
  CreditCard,
  Truck,
  Banknote,
  Smartphone,
  Globe,
  MapPin,
  ShieldCheck,
  ArrowLeft,
  ArrowRight,
  PartyPopper,
} from "lucide-react";
import { useCartStore } from "@/stores/cart";
import { useUIStore } from "@/stores/ui";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Separator } from "@/components/ui/separator";
import { EmptyState } from "@/components/ui/empty-state";
import { Breadcrumb } from "@/components/ui/breadcrumb";
import { formatPrice } from "@/lib/utils";
import { cn } from "@/lib/utils";
import { api } from "@/services/api";
import type { Address, PaymentMethod } from "@/types";

const steps = ["Address", "Delivery", "Payment", "Review", "Complete"];

const paymentMethods: { value: PaymentMethod; label: string; icon: React.ComponentType<{ className?: string }>; desc: string }[] = [
  { value: "cod", label: "Cash on Delivery", icon: Banknote, desc: "Pay when your order arrives" },
  { value: "card", label: "Credit/Debit Card", icon: CreditCard, desc: "Visa, Mastercard, Amex" },
  { value: "mobile_banking", label: "Mobile Banking", icon: Smartphone, desc: "bKash, Nagad, Rocket" },
  { value: "online", label: "Online Payment", icon: Globe, desc: "PayPal, Stripe, Payoneer" },
];

const deliveryMethods = [
  { id: "standard", label: "Standard Delivery", time: "3-5 business days", price: 5.99 },
  { id: "express", label: "Express Delivery", time: "1-2 business days", price: 12.99 },
  { id: "overnight", label: "Overnight Delivery", time: "Next business day", price: 24.99 },
];

export function CheckoutContent() {
  const router = useRouter();
  const { items, getSubtotal, clearCart } = useCartStore();
  const addToast = useUIStore((s) => s.addToast);

  const [step, setStep] = React.useState(0);
  const [orderComplete, setOrderComplete] = React.useState(false);
  const [orderId, setOrderId] = React.useState("");
  const [processing, setProcessing] = React.useState(false);

  const [address, setAddress] = React.useState<Address>({
    id: "addr-1",
    label: "Home",
    name: "Sarah Johnson",
    phone: "+1 (555) 111-2222",
    street: "742 Maple Street, Apt 3B",
    city: "San Francisco",
    state: "CA",
    zip: "94102",
    country: "United States",
    isDefault: true,
  });

  const [deliveryMethod, setDeliveryMethod] = React.useState("standard");
  const [paymentMethod, setPaymentMethod] = React.useState<PaymentMethod>("cod");
  const [couponCode, setCouponCode] = React.useState("");
  const [couponApplied, setCouponApplied] = React.useState(false);

  const activeItems = items.filter((i) => !i.savedForLater);
  const subtotal = getSubtotal();
  const delivery = deliveryMethods.find((d) => d.id === deliveryMethod);
  const shippingCost = subtotal > 100 && deliveryMethod === "standard" ? 0 : delivery?.price || 0;
  const discount = couponApplied ? Math.round(subtotal * 0.1 * 100) / 100 : 0;
  const tax = Math.round((subtotal - discount) * 0.08 * 100) / 100;
  const total = Math.round((subtotal - discount + shippingCost + tax) * 100) / 100;

  const applyCoupon = async () => {
    if (!couponCode.trim()) return;
    const coupon = await api.coupons.getByCode(couponCode);
    if (coupon && coupon.active) {
      setCouponApplied(true);
      addToast({ title: "Coupon applied!", description: coupon.description, variant: "success" });
    } else {
      addToast({ title: "Invalid coupon", description: "Please check the code and try again", variant: "error" });
    }
  };

  const placeOrder = async () => {
    setProcessing(true);
    try {
      const order = await api.orders.create({
        customerId: "cust-1",
        customerName: address.name,
        customerEmail: "sarah.j@email.com",
        items: activeItems.map((item) => ({
          id: item.id,
          productId: item.productId,
          productName: item.product.name,
          productImage: item.product.images[0],
          vendorId: item.product.vendorId,
          vendorName: item.product.vendorName,
          quantity: item.quantity,
          price: item.product.price,
          variant: item.variant?.options[0],
        })),
        status: "pending",
        paymentStatus: paymentMethod === "cod" ? "pending" : "paid",
        paymentMethod,
        shippingAddress: address,
        subtotal,
        shippingCost,
        discount,
        tax,
        total,
        couponCode: couponApplied ? couponCode : undefined,
      });
      setOrderId(order.id);
      setOrderComplete(true);
      clearCart();
      setStep(4);
    } catch {
      addToast({ title: "Error", description: "Failed to place order. Please try again.", variant: "error" });
    } finally {
      setProcessing(false);
    }
  };

  if (activeItems.length === 0 && !orderComplete) {
    return (
      <div className="mx-auto max-w-7xl px-4 py-6">
        <Breadcrumb items={[{ label: "Home", href: "/" }, { label: "Checkout" }]} className="mb-4" />
        <EmptyState
          title="Nothing to checkout"
          description="Your cart is empty. Add some products before checking out."
          action={{ label: "Go Shopping", onClick: () => router.push("/shop") }}
        />
      </div>
    );
  }

  if (orderComplete) {
    return (
      <div className="mx-auto max-w-2xl px-4 py-16 text-center">
        <div className="mx-auto mb-6 flex h-20 w-20 items-center justify-center rounded-full bg-success/10">
          <PartyPopper className="h-10 w-10 text-success" />
        </div>
        <h1 className="text-3xl font-bold">Order Confirmed!</h1>
        <p className="mt-2 text-muted-foreground">
          Thank you for your purchase. Your order <span className="font-medium text-foreground">{orderId}</span> has been placed successfully.
        </p>
        <div className="mt-8 rounded-xl border border-border bg-card p-6 text-left">
          <h3 className="font-semibold">Order Details</h3>
          <div className="mt-3 space-y-2 text-sm">
            <div className="flex justify-between">
              <span className="text-muted-foreground">Order ID</span>
              <span className="font-medium">{orderId}</span>
            </div>
            <div className="flex justify-between">
              <span className="text-muted-foreground">Payment</span>
              <span className="font-medium capitalize">{paymentMethod.replace("_", " ")}</span>
            </div>
            <div className="flex justify-between">
              <span className="text-muted-foreground">Delivery</span>
              <span className="font-medium">{delivery?.label}</span>
            </div>
            <Separator />
            <div className="flex justify-between font-bold">
              <span>Total</span>
              <span>{formatPrice(total)}</span>
            </div>
          </div>
        </div>
        <div className="mt-6 flex justify-center gap-3">
          <Link href="/orders">
            <Button>View Orders</Button>
          </Link>
          <Link href="/shop">
            <Button variant="outline">Continue Shopping</Button>
          </Link>
        </div>
      </div>
    );
  }

  return (
    <div className="mx-auto max-w-7xl px-4 py-6">
      <Breadcrumb items={[{ label: "Home", href: "/" }, { label: "Checkout" }]} className="mb-4" />

      <h1 className="mb-6 text-2xl font-bold">Checkout</h1>

      <div className="mb-8 flex items-center justify-center">
        {steps.map((s, i) => (
          <React.Fragment key={s}>
            <div className="flex items-center gap-2">
              <div
                className={cn(
                  "flex h-8 w-8 items-center justify-center rounded-full text-sm font-medium",
                  i < step
                    ? "bg-success text-white"
                    : i === step
                      ? "bg-primary text-primary-foreground"
                      : "bg-muted text-muted-foreground"
                )}
              >
                {i < step ? <Check className="h-4 w-4" /> : i + 1}
              </div>
              <span
                className={cn(
                  "hidden text-sm sm:block",
                  i === step ? "font-medium" : "text-muted-foreground"
                )}
              >
                {s}
              </span>
            </div>
            {i < steps.length - 1 && (
              <div className={cn("mx-2 h-px w-8 sm:w-16", i < step ? "bg-success" : "bg-border")} />
            )}
          </React.Fragment>
        ))}
      </div>

      <div className="grid gap-8 lg:grid-cols-3">
        <div className="lg:col-span-2">
          {step === 0 && (
            <div className="rounded-xl border border-border bg-card p-6">
              <h2 className="mb-4 flex items-center gap-2 text-lg font-semibold">
                <MapPin className="h-5 w-5" />
                Shipping Address
              </h2>
              <div className="grid gap-4 sm:grid-cols-2">
                <div>
                  <Label htmlFor="name">Full Name</Label>
                  <Input id="name" value={address.name} onChange={(e) => setAddress({ ...address, name: e.target.value })} className="mt-1" />
                </div>
                <div>
                  <Label htmlFor="phone">Phone</Label>
                  <Input id="phone" value={address.phone} onChange={(e) => setAddress({ ...address, phone: e.target.value })} className="mt-1" />
                </div>
                <div className="sm:col-span-2">
                  <Label htmlFor="street">Street Address</Label>
                  <Input id="street" value={address.street} onChange={(e) => setAddress({ ...address, street: e.target.value })} className="mt-1" />
                </div>
                <div>
                  <Label htmlFor="city">City</Label>
                  <Input id="city" value={address.city} onChange={(e) => setAddress({ ...address, city: e.target.value })} className="mt-1" />
                </div>
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <Label htmlFor="state">State</Label>
                    <Input id="state" value={address.state} onChange={(e) => setAddress({ ...address, state: e.target.value })} className="mt-1" />
                  </div>
                  <div>
                    <Label htmlFor="zip">ZIP</Label>
                    <Input id="zip" value={address.zip} onChange={(e) => setAddress({ ...address, zip: e.target.value })} className="mt-1" />
                  </div>
                </div>
              </div>
              <div className="mt-6 flex justify-end">
                <Button onClick={() => setStep(1)}>
                  Continue to Delivery
                  <ArrowRight className="h-4 w-4" />
                </Button>
              </div>
            </div>
          )}

          {step === 1 && (
            <div className="rounded-xl border border-border bg-card p-6">
              <h2 className="mb-4 flex items-center gap-2 text-lg font-semibold">
                <Truck className="h-5 w-5" />
                Delivery Method
              </h2>
              <div className="space-y-3">
                {deliveryMethods.map((method) => (
                  <button
                    key={method.id}
                    onClick={() => setDeliveryMethod(method.id)}
                    className={cn(
                      "flex w-full items-center justify-between rounded-lg border p-4 text-left transition-colors cursor-pointer",
                      deliveryMethod === method.id
                        ? "border-primary bg-primary/5"
                        : "border-border hover:border-muted-foreground"
                    )}
                  >
                    <div>
                      <p className="font-medium">{method.label}</p>
                      <p className="text-sm text-muted-foreground">{method.time}</p>
                    </div>
                    <span className="font-bold">
                      {method.price === 0 || (subtotal > 100 && method.id === "standard")
                        ? "Free"
                        : formatPrice(method.price)}
                    </span>
                  </button>
                ))}
              </div>
              <div className="mt-6 flex justify-between">
                <Button variant="outline" onClick={() => setStep(0)}>
                  <ArrowLeft className="h-4 w-4" />
                  Back
                </Button>
                <Button onClick={() => setStep(2)}>
                  Continue to Payment
                  <ArrowRight className="h-4 w-4" />
                </Button>
              </div>
            </div>
          )}

          {step === 2 && (
            <div className="rounded-xl border border-border bg-card p-6">
              <h2 className="mb-4 flex items-center gap-2 text-lg font-semibold">
                <CreditCard className="h-5 w-5" />
                Payment Method
              </h2>
              <div className="space-y-3">
                {paymentMethods.map((method) => (
                  <button
                    key={method.value}
                    onClick={() => setPaymentMethod(method.value)}
                    className={cn(
                      "flex w-full items-center gap-4 rounded-lg border p-4 text-left transition-colors cursor-pointer",
                      paymentMethod === method.value
                        ? "border-primary bg-primary/5"
                        : "border-border hover:border-muted-foreground"
                    )}
                  >
                    <method.icon className="h-6 w-6 text-primary" />
                    <div>
                      <p className="font-medium">{method.label}</p>
                      <p className="text-sm text-muted-foreground">{method.desc}</p>
                    </div>
                  </button>
                ))}
              </div>
              {paymentMethod === "card" && (
                <div className="mt-4 grid gap-4 sm:grid-cols-2">
                  <div className="sm:col-span-2">
                    <Label>Card Number</Label>
                    <Input placeholder="4242 4242 4242 4242" className="mt-1" />
                  </div>
                  <div>
                    <Label>Expiry</Label>
                    <Input placeholder="MM/YY" className="mt-1" />
                  </div>
                  <div>
                    <Label>CVV</Label>
                    <Input placeholder="123" className="mt-1" />
                  </div>
                </div>
              )}
              <div className="mt-6 flex justify-between">
                <Button variant="outline" onClick={() => setStep(1)}>
                  <ArrowLeft className="h-4 w-4" />
                  Back
                </Button>
                <Button onClick={() => setStep(3)}>
                  Review Order
                  <ArrowRight className="h-4 w-4" />
                </Button>
              </div>
            </div>
          )}

          {step === 3 && (
            <div className="rounded-xl border border-border bg-card p-6">
              <h2 className="mb-4 text-lg font-semibold">Order Review</h2>
              <div className="space-y-4">
                <div className="rounded-lg border border-border p-4">
                  <p className="text-sm font-medium text-muted-foreground">Shipping to</p>
                  <p className="mt-1 font-medium">{address.name}</p>
                  <p className="text-sm text-muted-foreground">
                    {address.street}, {address.city}, {address.state} {address.zip}
                  </p>
                </div>
                <div className="rounded-lg border border-border p-4">
                  <p className="text-sm font-medium text-muted-foreground">Delivery</p>
                  <p className="mt-1 font-medium">{delivery?.label}</p>
                  <p className="text-sm text-muted-foreground">{delivery?.time}</p>
                </div>
                <div className="rounded-lg border border-border p-4">
                  <p className="text-sm font-medium text-muted-foreground">Payment</p>
                  <p className="mt-1 font-medium capitalize">{paymentMethod.replace("_", " ")}</p>
                </div>
                <div className="rounded-lg border border-border p-4">
                  <p className="mb-2 text-sm font-medium text-muted-foreground">Items ({activeItems.length})</p>
                  {activeItems.map((item) => (
                    <div key={item.id} className="flex items-center gap-3 py-2">
                      <img src={item.product.images[0]} alt="" className="h-12 w-12 rounded-lg object-cover" />
                      <div className="flex-1">
                        <p className="line-clamp-1 text-sm font-medium">{item.product.name}</p>
                        <p className="text-xs text-muted-foreground">Qty: {item.quantity}</p>
                      </div>
                      <span className="text-sm font-medium">
                        {formatPrice(item.product.price * item.quantity)}
                      </span>
                    </div>
                  ))}
                </div>
              </div>
              <div className="mt-6 flex justify-between">
                <Button variant="outline" onClick={() => setStep(2)}>
                  <ArrowLeft className="h-4 w-4" />
                  Back
                </Button>
                <Button onClick={placeOrder} loading={processing}>
                  <ShieldCheck className="h-4 w-4" />
                  Place Order — {formatPrice(total)}
                </Button>
              </div>
            </div>
          )}
        </div>

        <div className="lg:col-span-1">
          <div className="sticky top-20 rounded-xl border border-border bg-card p-6">
            <h2 className="mb-4 text-lg font-semibold">Order Summary</h2>
            <div className="space-y-3 text-sm">
              <div className="flex justify-between">
                <span className="text-muted-foreground">Subtotal ({activeItems.length} items)</span>
                <span>{formatPrice(subtotal)}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-muted-foreground">Shipping</span>
                <span>{shippingCost === 0 ? "Free" : formatPrice(shippingCost)}</span>
              </div>
              {couponApplied && (
                <div className="flex justify-between text-success">
                  <span>Discount</span>
                  <span>-{formatPrice(discount)}</span>
                </div>
              )}
              <div className="flex justify-between">
                <span className="text-muted-foreground">Tax</span>
                <span>{formatPrice(tax)}</span>
              </div>
              <Separator />
              <div className="flex justify-between text-base font-bold">
                <span>Total</span>
                <span>{formatPrice(total)}</span>
              </div>
            </div>

            {!couponApplied && (
              <div className="mt-4">
                <Label htmlFor="coupon">Coupon Code</Label>
                <div className="mt-1 flex gap-2">
                  <Input
                    id="coupon"
                    value={couponCode}
                    onChange={(e) => setCouponCode(e.target.value)}
                    placeholder="Enter code"
                  />
                  <Button variant="outline" onClick={applyCoupon}>
                    Apply
                  </Button>
                </div>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
