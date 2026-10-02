import type { Order, OrderStatus, PaymentStatus } from "@/types";
import { products } from "./products";

const statuses: OrderStatus[] = [
  "delivered",
  "delivered",
  "delivered",
  "shipped",
  "shipped",
  "processing",
  "processing",
  "confirmed",
  "pending",
  "cancelled",
  "returned",
];

const paymentMethods: Order["paymentMethod"][] = [
  "cod",
  "card",
  "mobile_banking",
  "online",
  "card",
  "cod",
];

const customers = [
  { id: "cust-1", name: "Sarah Johnson", email: "sarah.j@email.com" },
  { id: "cust-2", name: "Michael Chen", email: "m.chen@email.com" },
  { id: "cust-3", name: "Emily Rodriguez", email: "emily.r@email.com" },
  { id: "cust-4", name: "David Kim", email: "david.kim@email.com" },
  { id: "cust-5", name: "Jessica Taylor", email: "jess.t@email.com" },
  { id: "cust-6", name: "Ahmed Hassan", email: "ahmed.h@email.com" },
  { id: "cust-7", name: "Lisa Wang", email: "lisa.w@email.com" },
  { id: "cust-8", name: "Robert Brown", email: "r.brown@email.com" },
];

const addresses = [
  {
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
  },
  {
    id: "addr-2",
    label: "Office",
    name: "Sarah Johnson",
    phone: "+1 (555) 111-2222",
    street: "100 Market Street, Floor 5",
    city: "San Francisco",
    state: "CA",
    zip: "94105",
    country: "United States",
    isDefault: false,
  },
];

function randomDate(start: Date, end: Date): string {
  return new Date(
    start.getTime() + Math.random() * (end.getTime() - start.getTime())
  ).toISOString();
}

function generateOrderItems(count: number) {
  const shuffled = [...products].sort(() => 0.5 - Math.random());
  return shuffled.slice(0, count).map((p, i) => ({
    id: `oi-${Math.random().toString(36).slice(2, 9)}`,
    productId: p.id,
    productName: p.name,
    productImage: p.images[0],
    vendorId: p.vendorId,
    vendorName: p.vendorName,
    quantity: Math.floor(Math.random() * 3) + 1,
    price: p.price,
    variant: p.variants[0]?.options[0],
  }));
}

export const orders: Order[] = Array.from({ length: 48 }, (_, i) => {
  const customer = customers[i % customers.length];
  const itemCount = Math.floor(Math.random() * 3) + 1;
  const items = generateOrderItems(itemCount);
  const subtotal = items.reduce((sum, item) => sum + item.price * item.quantity, 0);
  const shippingCost = subtotal > 100 ? 0 : 5.99;
  const discount = Math.random() > 0.7 ? Math.round(subtotal * 0.1 * 100) / 100 : 0;
  const tax = Math.round(subtotal * 0.08 * 100) / 100;
  const total = Math.round((subtotal + shippingCost - discount + tax) * 100) / 100;
  const status = statuses[i % statuses.length];
  const paymentStatus: PaymentStatus =
    status === "cancelled"
      ? "refunded"
      : status === "pending"
        ? "pending"
        : "paid";
  const createdAt = randomDate(
    new Date("2025-06-01"),
    new Date("2026-10-01")
  );

  return {
    id: `ord-${1000 + i}`,
    orderNumber: `VD-${2026}${String(10000 + i).slice(-5)}`,
    customerId: customer.id,
    customerName: customer.name,
    customerEmail: customer.email,
    items,
    status,
    paymentStatus,
    paymentMethod: paymentMethods[i % paymentMethods.length],
    shippingAddress: addresses[i % addresses.length],
    subtotal: Math.round(subtotal * 100) / 100,
    shippingCost,
    discount,
    tax,
    total,
    couponCode: discount > 0 ? "SAVE10" : undefined,
    createdAt,
    updatedAt: createdAt,
    trackingNumber:
      status === "shipped" || status === "delivered"
        ? `TRK${Math.random().toString(36).slice(2, 10).toUpperCase()}`
        : undefined,
  };
});

export function getOrderById(id: string): Order | undefined {
  return orders.find((o) => o.id === id || o.orderNumber === id);
}

export function getOrdersByCustomer(customerId: string): Order[] {
  return orders.filter((o) => o.customerId === customerId);
}

export function getOrdersByVendor(vendorId: string): Order[] {
  return orders.filter((o) =>
    o.items.some((item) => item.vendorId === vendorId)
  );
}

export function getOrdersByStatus(status: OrderStatus): Order[] {
  return orders.filter((o) => o.status === status);
}
