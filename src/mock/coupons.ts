import type { Coupon, Customer, Transaction, Payout, Promotion, Notification } from "@/types";

export const coupons: Coupon[] = [
  {
    id: "cpn-1",
    code: "SAVE10",
    type: "percentage",
    value: 10,
    minOrder: 50,
    maxDiscount: 50,
    description: "10% off your first order",
    startsAt: "2026-01-01",
    expiresAt: "2026-12-31",
    usageLimit: 1000,
    usageCount: 456,
    active: true,
  },
  {
    id: "cpn-2",
    code: "FLASH20",
    type: "percentage",
    value: 20,
    minOrder: 100,
    maxDiscount: 100,
    description: "Flash sale: 20% off electronics",
    startsAt: "2026-10-01",
    expiresAt: "2026-10-07",
    usageLimit: 500,
    usageCount: 234,
    active: true,
  },
  {
    id: "cpn-3",
    code: "FREESHIP",
    type: "fixed",
    value: 5.99,
    minOrder: 25,
    maxDiscount: 5.99,
    description: "Free shipping on any order",
    startsAt: "2026-01-01",
    expiresAt: "2026-12-31",
    usageLimit: 2000,
    usageCount: 892,
    active: true,
  },
  {
    id: "cpn-4",
    code: "TECH15",
    type: "percentage",
    value: 15,
    minOrder: 75,
    maxDiscount: 75,
    vendorId: "ven-1",
    vendorName: "TechWorld",
    description: "15% off at TechWorld",
    startsAt: "2026-09-01",
    expiresAt: "2026-11-30",
    usageLimit: 300,
    usageCount: 89,
    active: true,
  },
  {
    id: "cpn-5",
    code: "STYLE25",
    type: "percentage",
    value: 25,
    minOrder: 150,
    maxDiscount: 100,
    vendorId: "ven-2",
    vendorName: "StyleHub",
    description: "25% off fashion at StyleHub",
    startsAt: "2026-09-15",
    expiresAt: "2026-10-15",
    usageLimit: 200,
    usageCount: 45,
    active: true,
  },
  {
    id: "cpn-6",
    code: "BEAUTY5",
    type: "fixed",
    value: 5,
    minOrder: 30,
    maxDiscount: 5,
    vendorId: "ven-3",
    vendorName: "Beauty Essentials",
    description: "$5 off beauty products",
    startsAt: "2026-08-01",
    expiresAt: "2026-10-31",
    usageLimit: 500,
    usageCount: 167,
    active: true,
  },
  {
    id: "cpn-7",
    code: "WELCOME",
    type: "fixed",
    value: 10,
    minOrder: 0,
    maxDiscount: 10,
    description: "$10 welcome bonus",
    startsAt: "2026-01-01",
    expiresAt: "2026-12-31",
    usageLimit: 5000,
    usageCount: 2341,
    active: true,
  },
  {
    id: "cpn-8",
    code: "BOOKS10",
    type: "percentage",
    value: 10,
    minOrder: 20,
    maxDiscount: 20,
    vendorId: "ven-5",
    vendorName: "Book Haven",
    description: "10% off all books",
    startsAt: "2026-01-01",
    expiresAt: "2026-12-31",
    usageLimit: 1000,
    usageCount: 345,
    active: true,
  },
];

export function getCouponByCode(code: string): Coupon | undefined {
  return coupons.find((c) => c.code.toLowerCase() === code.toLowerCase());
}

export function getActiveCoupons(): Coupon[] {
  return coupons.filter((c) => c.active);
}

export function getVendorCoupons(vendorId: string): Coupon[] {
  return coupons.filter((c) => c.vendorId === vendorId);
}

export const customers: Customer[] = [
  {
    id: "cust-1",
    name: "Sarah Johnson",
    email: "sarah.j@email.com",
    phone: "+1 (555) 111-2222",
    joinedAt: "2024-03-15",
    status: "active",
    totalOrders: 23,
    totalSpent: 2847.5,
    lastOrderAt: "2026-09-28",
    addresses: [
      { id: "addr-1", label: "Home", name: "Sarah Johnson", phone: "+1 (555) 111-2222", street: "742 Maple Street, Apt 3B", city: "San Francisco", state: "CA", zip: "94102", country: "United States", isDefault: true },
      { id: "addr-2", label: "Office", name: "Sarah Johnson", phone: "+1 (555) 111-2222", street: "100 Market Street, Floor 5", city: "San Francisco", state: "CA", zip: "94105", country: "United States", isDefault: false },
    ],
  },
  {
    id: "cust-2",
    name: "Michael Chen",
    email: "m.chen@email.com",
    phone: "+1 (555) 222-3333",
    joinedAt: "2024-06-20",
    status: "active",
    totalOrders: 15,
    totalSpent: 1923.75,
    lastOrderAt: "2026-09-25",
    addresses: [
      { id: "addr-3", label: "Home", name: "Michael Chen", phone: "+1 (555) 222-3333", street: "88 Oak Avenue", city: "Seattle", state: "WA", zip: "98101", country: "United States", isDefault: true },
    ],
  },
  {
    id: "cust-3",
    name: "Emily Rodriguez",
    email: "emily.r@email.com",
    phone: "+1 (555) 333-4444",
    joinedAt: "2024-01-10",
    status: "active",
    totalOrders: 31,
    totalSpent: 4125.0,
    lastOrderAt: "2026-09-30",
    addresses: [
      { id: "addr-4", label: "Home", name: "Emily Rodriguez", phone: "+1 (555) 333-4444", street: "456 Pine Road", city: "Austin", state: "TX", zip: "73301", country: "United States", isDefault: true },
    ],
  },
  {
    id: "cust-4",
    name: "David Kim",
    email: "david.kim@email.com",
    phone: "+1 (555) 444-5555",
    joinedAt: "2024-09-05",
    status: "active",
    totalOrders: 8,
    totalSpent: 892.25,
    lastOrderAt: "2026-09-15",
    addresses: [
      { id: "addr-5", label: "Home", name: "David Kim", phone: "+1 (555) 444-5555", street: "233 Elm Street", city: "New York", state: "NY", zip: "10001", country: "United States", isDefault: true },
    ],
  },
  {
    id: "cust-5",
    name: "Jessica Taylor",
    email: "jess.t@email.com",
    phone: "+1 (555) 555-6666",
    joinedAt: "2025-02-14",
    status: "active",
    totalOrders: 12,
    totalSpent: 1456.8,
    lastOrderAt: "2026-09-20",
    addresses: [
      { id: "addr-6", label: "Home", name: "Jessica Taylor", phone: "+1 (555) 555-6666", street: "77 Birch Lane", city: "Chicago", state: "IL", zip: "60601", country: "United States", isDefault: true },
    ],
  },
  {
    id: "cust-6",
    name: "Ahmed Hassan",
    email: "ahmed.h@email.com",
    phone: "+1 (555) 666-7777",
    joinedAt: "2025-05-22",
    status: "active",
    totalOrders: 6,
    totalSpent: 678.5,
    lastOrderAt: "2026-09-10",
    addresses: [
      { id: "addr-7", label: "Home", name: "Ahmed Hassan", phone: "+1 (555) 666-7777", street: "1900 Cedar Court", city: "Houston", state: "TX", zip: "77001", country: "United States", isDefault: true },
    ],
  },
  {
    id: "cust-7",
    name: "Lisa Wang",
    email: "lisa.w@email.com",
    phone: "+1 (555) 777-8888",
    joinedAt: "2025-08-30",
    status: "suspended",
    totalOrders: 3,
    totalSpent: 234.0,
    lastOrderAt: "2026-07-15",
    addresses: [
      { id: "addr-8", label: "Home", name: "Lisa Wang", phone: "+1 (555) 777-8888", street: "55 Spruce Way", city: "Portland", state: "OR", zip: "97201", country: "United States", isDefault: true },
    ],
  },
  {
    id: "cust-8",
    name: "Robert Brown",
    email: "r.brown@email.com",
    phone: "+1 (555) 888-9999",
    joinedAt: "2024-11-11",
    status: "active",
    totalOrders: 19,
    totalSpent: 2134.6,
    lastOrderAt: "2026-09-27",
    addresses: [
      { id: "addr-9", label: "Home", name: "Robert Brown", phone: "+1 (555) 888-9999", street: "310 Willow Drive", city: "Denver", state: "CO", zip: "80201", country: "United States", isDefault: true },
    ],
  },
];

export function getCustomerById(id: string): Customer | undefined {
  return customers.find((c) => c.id === id);
}

export const transactions: Transaction[] = Array.from({ length: 40 }, (_, i) => {
  const types: Transaction["type"][] = ["credit", "debit", "commission", "refund", "payout"];
  const type = types[i % types.length];
  const amount =
    type === "commission"
      ? Math.round(Math.random() * 200 * 100) / 100 + 10
      : type === "payout"
        ? Math.round((Math.random() * 2000 + 500) * 100) / 100
        : Math.round((Math.random() * 500 + 20) * 100) / 100;

  return {
    id: `txn-${i + 1}`,
    type,
    amount,
    description:
      type === "credit"
        ? `Order #VD-2026${10000 + i} payment`
        : type === "commission"
          ? `Platform commission - Order #VD-2026${10000 + i}`
          : type === "payout"
            ? `Payout to bank account`
            : type === "refund"
              ? `Refund for Order #VD-2026${10000 + i}`
              : `Order #VD-2026${10000 + i} payout`,
    orderId: `ord-${1000 + (i % 20)}`,
    status: i % 7 === 0 ? "pending" : "completed",
    createdAt: new Date(
      new Date("2026-07-01").getTime() +
        Math.random() * (new Date("2026-10-01").getTime() - new Date("2026-07-01").getTime())
    ).toISOString(),
  };
});

export const payouts: Payout[] = [
  { id: "po-1", vendorId: "ven-1", vendorName: "TechWorld", amount: 5000, method: "Bank Transfer", status: "completed", requestedAt: "2026-09-01", completedAt: "2026-09-03", reference: "PAY-2026-001" },
  { id: "po-2", vendorId: "ven-2", vendorName: "StyleHub", amount: 3500, method: "Bank Transfer", status: "completed", requestedAt: "2026-09-05", completedAt: "2026-09-07", reference: "PAY-2026-002" },
  { id: "po-3", vendorId: "ven-3", vendorName: "Beauty Essentials", amount: 2800, method: "PayPal", status: "processing", requestedAt: "2026-09-28", reference: "PAY-2026-003" },
  { id: "po-4", vendorId: "ven-4", vendorName: "Home & Living Co.", amount: 4200, method: "Bank Transfer", status: "pending", requestedAt: "2026-09-30", reference: "PAY-2026-004" },
  { id: "po-5", vendorId: "ven-5", vendorName: "Book Haven", amount: 1900, method: "Bank Transfer", status: "completed", requestedAt: "2026-08-25", completedAt: "2026-08-27", reference: "PAY-2026-005" },
  { id: "po-6", vendorId: "ven-8", vendorName: "Luxe Accessories", amount: 6100, method: "Wire Transfer", status: "completed", requestedAt: "2026-09-10", completedAt: "2026-09-12", reference: "PAY-2026-006" },
  { id: "po-7", vendorId: "ven-10", vendorName: "Urban Threads", amount: 2200, method: "PayPal", status: "rejected", requestedAt: "2026-09-15", reference: "PAY-2026-007" },
  { id: "po-8", vendorId: "ven-11", vendorName: "Wellness Hub", amount: 3100, method: "Bank Transfer", status: "pending", requestedAt: "2026-10-01", reference: "PAY-2026-008" },
];

export const promotions: Promotion[] = [
  { id: "prm-1", name: "Summer Flash Sale", type: "flash_sale", status: "active", startsAt: "2026-10-01", endsAt: "2026-10-07", description: "Up to 40% off on selected electronics", value: 40 },
  { id: "prm-2", name: "New Customer Welcome", type: "coupon", status: "active", startsAt: "2026-01-01", endsAt: "2026-12-31", description: "$10 off first order with code WELCOME", value: 10 },
  { id: "prm-3", name: "Tech Week", type: "campaign", status: "scheduled", startsAt: "2026-10-15", endsAt: "2026-10-22", description: "Week-long tech deals and exclusive launches" },
  { id: "prm-4", name: "Featured: TechWorld", type: "featured_vendor", status: "active", startsAt: "2026-09-01", endsAt: "2026-10-31", description: "TechWorld featured on homepage" },
  { id: "prm-5", name: "Fashion Forward", type: "campaign", status: "ended", startsAt: "2026-08-01", endsAt: "2026-08-31", description: "End of season fashion sale", value: 30 },
  { id: "prm-6", name: "Hero Banner - Fall Collection", type: "banner", status: "active", startsAt: "2026-09-15", endsAt: "2026-11-15", description: "Main homepage hero banner" },
  { id: "prm-7", name: "Book Lovers Special", type: "coupon", status: "active", startsAt: "2026-09-01", endsAt: "2026-10-31", description: "10% off all books at Book Haven", value: 10 },
  { id: "prm-8", name: "Featured: ProSound Headphones", type: "featured_product", status: "active", startsAt: "2026-10-01", endsAt: "2026-10-15", description: "Featured in trending section" },
];

export const notifications: Notification[] = [
  { id: "ntf-1", type: "order", title: "New order received", message: "Order #VD-202610048 from Sarah Johnson", read: false, createdAt: "2026-10-01T10:30:00Z" },
  { id: "ntf-2", type: "review", title: "New 5-star review", message: "ProSound Headphones received a 5-star review", read: false, createdAt: "2026-10-01T09:15:00Z" },
  { id: "ntf-3", type: "payout", title: "Payout processed", message: "Your payout of $5,000 has been processed", read: true, createdAt: "2026-09-30T14:00:00Z" },
  { id: "ntf-4", type: "vendor", title: "New vendor application", message: "Gadget Garage has applied to become a vendor", read: false, createdAt: "2026-09-29T11:45:00Z" },
  { id: "ntf-5", type: "system", title: "Scheduled maintenance", message: "Platform maintenance scheduled for Oct 5, 2-4 AM UTC", read: true, createdAt: "2026-09-28T08:00:00Z" },
  { id: "ntf-6", type: "order", title: "Order shipped", message: "Order #VD-202610045 has been shipped", read: true, createdAt: "2026-09-27T16:20:00Z" },
];
