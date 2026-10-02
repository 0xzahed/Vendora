export type UserRole = "customer" | "vendor" | "admin";

export interface User {
  id: string;
  name: string;
  email: string;
  avatar?: string;
  role: UserRole;
  phone?: string;
  joinedAt: string;
  status: "active" | "suspended";
}

export interface Address {
  id: string;
  label: string;
  name: string;
  phone: string;
  street: string;
  city: string;
  state: string;
  zip: string;
  country: string;
  isDefault: boolean;
}

export interface Vendor {
  id: string;
  slug: string;
  name: string;
  logo: string;
  coverImage: string;
  description: string;
  rating: number;
  reviewCount: number;
  followers: number;
  totalProducts: number;
  totalSales: number;
  joinedAt: string;
  verified: boolean;
  status: "active" | "pending" | "suspended" | "rejected";
  categories: string[];
  policies: {
    shipping: string;
    returns: string;
  };
  contact: {
    email: string;
    phone: string;
    address: string;
  };
  commissionRate: number;
  balance: {
    available: number;
    pending: number;
    lifetime: number;
  };
}

export interface Category {
  id: string;
  name: string;
  slug: string;
  description: string;
  image: string;
  parentId: string | null;
  productCount: number;
  active: boolean;
  children?: Category[];
}

export interface ProductVariant {
  id: string;
  name: string;
  options: string[];
  priceModifier: number;
  stock: number;
  sku: string;
}

export interface Product {
  id: string;
  slug: string;
  name: string;
  description: string;
  shortDescription: string;
  price: number;
  originalPrice: number;
  images: string[];
  category: string;
  categorySlug: string;
  vendorId: string;
  vendorName: string;
  vendorSlug: string;
  vendorVerified: boolean;
  rating: number;
  reviewCount: number;
  stock: number;
  sold: number;
  sku: string;
  tags: string[];
  variants: ProductVariant[];
  specifications: Record<string, string>;
  featured: boolean;
  trending: boolean;
  bestSelling: boolean;
  flashSale: boolean;
  flashSaleEndsAt?: string;
  status: "active" | "pending" | "rejected" | "draft";
  createdAt: string;
  freeShipping: boolean;
  brand: string;
}

export interface CartItem {
  id: string;
  productId: string;
  product: Product;
  quantity: number;
  variant?: ProductVariant;
  savedForLater: boolean;
}

export interface OrderItem {
  id: string;
  productId: string;
  productName: string;
  productImage: string;
  vendorId: string;
  vendorName: string;
  quantity: number;
  price: number;
  variant?: string;
}

export type OrderStatus =
  | "pending"
  | "confirmed"
  | "processing"
  | "shipped"
  | "delivered"
  | "cancelled"
  | "returned";

export type PaymentStatus = "pending" | "paid" | "failed" | "refunded";

export type PaymentMethod = "cod" | "card" | "mobile_banking" | "online";

export interface Order {
  id: string;
  orderNumber: string;
  customerId: string;
  customerName: string;
  customerEmail: string;
  items: OrderItem[];
  status: OrderStatus;
  paymentStatus: PaymentStatus;
  paymentMethod: PaymentMethod;
  shippingAddress: Address;
  subtotal: number;
  shippingCost: number;
  discount: number;
  tax: number;
  total: number;
  couponCode?: string;
  notes?: string;
  createdAt: string;
  updatedAt: string;
  trackingNumber?: string;
}

export interface Review {
  id: string;
  productId: string;
  productName: string;
  productImage: string;
  customerId: string;
  customerName: string;
  customerAvatar?: string;
  rating: number;
  title: string;
  comment: string;
  images?: string[];
  helpful: number;
  verified: boolean;
  status: "approved" | "pending" | "hidden" | "reported";
  createdAt: string;
  vendorReply?: string;
}

export interface Coupon {
  id: string;
  code: string;
  type: "percentage" | "fixed";
  value: number;
  minOrder: number;
  maxDiscount: number;
  vendorId?: string;
  vendorName?: string;
  description: string;
  startsAt: string;
  expiresAt: string;
  usageLimit: number;
  usageCount: number;
  active: boolean;
}

export interface Transaction {
  id: string;
  type: "credit" | "debit" | "payout" | "commission" | "refund";
  amount: number;
  description: string;
  orderId?: string;
  status: "completed" | "pending" | "failed";
  createdAt: string;
}

export interface Payout {
  id: string;
  vendorId: string;
  vendorName: string;
  amount: number;
  method: string;
  status: "pending" | "processing" | "completed" | "rejected";
  requestedAt: string;
  completedAt?: string;
  reference: string;
}

export interface Customer {
  id: string;
  name: string;
  email: string;
  avatar?: string;
  phone: string;
  joinedAt: string;
  status: "active" | "suspended";
  totalOrders: number;
  totalSpent: number;
  lastOrderAt?: string;
  addresses: Address[];
}

export interface AnalyticsData {
  date: string;
  revenue: number;
  orders: number;
  visitors: number;
  conversion: number;
}

export interface DashboardStats {
  totalSales: number;
  totalOrders: number;
  totalProducts: number;
  totalCustomers: number;
  pendingOrders: number;
  revenue: number;
  commission: number;
  availableBalance: number;
}

export interface AdminStats {
  gmv: number;
  totalRevenue: number;
  platformCommission: number;
  totalVendors: number;
  activeVendors: number;
  totalCustomers: number;
  totalOrders: number;
  pendingOrders: number;
}

export interface Promotion {
  id: string;
  name: string;
  type: "campaign" | "flash_sale" | "coupon" | "featured_product" | "featured_vendor" | "banner";
  status: "active" | "scheduled" | "ended" | "draft";
  startsAt: string;
  endsAt: string;
  description: string;
  value?: number;
}

export interface Notification {
  id: string;
  type: "order" | "review" | "payout" | "system" | "vendor";
  title: string;
  message: string;
  read: boolean;
  createdAt: string;
}

export interface Toast {
  id: string;
  title: string;
  description?: string;
  variant: "default" | "success" | "error" | "warning";
}

export interface SearchFilters {
  query?: string;
  category?: string;
  vendor?: string;
  brand?: string;
  minPrice?: number;
  maxPrice?: number;
  minRating?: number;
  inStock?: boolean;
  onSale?: boolean;
  sortBy?: "relevance" | "price_asc" | "price_desc" | "rating" | "newest" | "best_selling";
  page?: number;
  limit?: number;
}

export interface PaginatedResponse<T> {
  data: T[];
  total: number;
  page: number;
  limit: number;
  totalPages: number;
}
