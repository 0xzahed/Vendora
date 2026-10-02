import type {
  Product,
  Vendor,
  Category,
  Order,
  Review,
  Coupon,
  Customer,
  SearchFilters,
  PaginatedResponse,
  Address,
} from "@/types";
import {
  products,
  getProductBySlug,
  getProductById,
  getProductsByVendor,
  getProductsByCategory,
  getFeaturedProducts,
  getTrendingProducts,
  getBestSellingProducts,
  getFlashSaleProducts,
  getNewArrivals,
  getRelatedProducts,
  searchProducts,
  getProductBrands,
} from "@/mock/products";
import {
  vendors,
  getVendorBySlug,
  getVendorById,
  getActiveVendors,
} from "@/mock/vendors";
import {
  categories,
  getCategoryBySlug,
  getCategoryById,
  getSubcategories,
} from "@/mock/categories";
import {
  orders,
  getOrderById,
  getOrdersByCustomer,
  getOrdersByVendor,
  getOrdersByStatus,
} from "@/mock/orders";
import {
  reviews,
  getReviewsByProduct,
  getReviewsByVendor,
  getReviewsByCustomer,
  getProductRating,
} from "@/mock/reviews";
import {
  coupons,
  getCouponByCode,
  getActiveCoupons,
  getVendorCoupons,
  customers,
  getCustomerById,
  transactions,
  payouts,
  promotions,
  notifications,
} from "@/mock/coupons";
import {
  vendorAnalytics,
  adminAnalytics,
  categoryCommissions,
  generateAnalytics,
} from "@/mock/analytics";

const delay = (ms = 300) => new Promise((resolve) => setTimeout(resolve, ms));

export const api = {
  products: {
    async list(filters: SearchFilters = {}): Promise<PaginatedResponse<Product>> {
      await delay();
      let result = [...products].filter((p) => p.status === "active");

      if (filters.query) {
        result = searchProducts(filters.query);
      }
      if (filters.category) {
        result = result.filter((p) => p.categorySlug === filters.category);
      }
      if (filters.vendor) {
        result = result.filter((p) => p.vendorId === filters.vendor);
      }
      if (filters.brand) {
        result = result.filter((p) => p.brand === filters.brand);
      }
      if (filters.minPrice !== undefined) {
        result = result.filter((p) => p.price >= filters.minPrice!);
      }
      if (filters.maxPrice !== undefined) {
        result = result.filter((p) => p.price <= filters.maxPrice!);
      }
      if (filters.minRating) {
        result = result.filter((p) => p.rating >= filters.minRating!);
      }
      if (filters.inStock) {
        result = result.filter((p) => p.stock > 0);
      }
      if (filters.onSale) {
        result = result.filter((p) => p.originalPrice > p.price);
      }

      switch (filters.sortBy) {
        case "price_asc":
          result.sort((a, b) => a.price - b.price);
          break;
        case "price_desc":
          result.sort((a, b) => b.price - a.price);
          break;
        case "rating":
          result.sort((a, b) => b.rating - a.rating);
          break;
        case "newest":
          result.sort(
            (a, b) =>
              new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime()
          );
          break;
        case "best_selling":
          result.sort((a, b) => b.sold - a.sold);
          break;
        default:
          result.sort((a, b) => b.sold - a.sold);
      }

      const page = filters.page || 1;
      const limit = filters.limit || 12;
      const total = result.length;
      const totalPages = Math.ceil(total / limit);
      const start = (page - 1) * limit;

      return {
        data: result.slice(start, start + limit),
        total,
        page,
        limit,
        totalPages,
      };
    },

    async getBySlug(slug: string): Promise<Product | null> {
      await delay(200);
      return getProductBySlug(slug) || null;
    },

    async getById(id: string): Promise<Product | null> {
      await delay(200);
      return getProductById(id) || null;
    },

    async getFeatured(): Promise<Product[]> {
      await delay(200);
      return getFeaturedProducts();
    },

    async getTrending(): Promise<Product[]> {
      await delay(200);
      return getTrendingProducts();
    },

    async getBestSelling(): Promise<Product[]> {
      await delay(200);
      return getBestSellingProducts();
    },

    async getFlashSale(): Promise<Product[]> {
      await delay(200);
      return getFlashSaleProducts();
    },

    async getNewArrivals(): Promise<Product[]> {
      await delay(200);
      return getNewArrivals();
    },

    async getRelated(product: Product): Promise<Product[]> {
      await delay(200);
      return getRelatedProducts(product);
    },

    async getByVendor(vendorId: string): Promise<Product[]> {
      await delay(200);
      return getProductsByVendor(vendorId);
    },

    async getByCategory(categorySlug: string): Promise<Product[]> {
      await delay(200);
      return getProductsByCategory(categorySlug);
    },

    async getBrands(): Promise<string[]> {
      await delay(100);
      return getProductBrands();
    },
  },

  vendors: {
    async list(): Promise<Vendor[]> {
      await delay();
      return vendors;
    },

    async getActive(): Promise<Vendor[]> {
      await delay();
      return getActiveVendors();
    },

    async getBySlug(slug: string): Promise<Vendor | null> {
      await delay(200);
      return getVendorBySlug(slug) || null;
    },

    async getById(id: string): Promise<Vendor | null> {
      await delay(200);
      return getVendorById(id) || null;
    },
  },

  categories: {
    async list(): Promise<Category[]> {
      await delay();
      return categories;
    },

    async getBySlug(slug: string): Promise<Category | null> {
      await delay(200);
      return getCategoryBySlug(slug) || null;
    },

    async getById(id: string): Promise<Category | null> {
      await delay(200);
      return getCategoryById(id) || null;
    },

    async getSubcategories(parentId: string): Promise<Category[]> {
      await delay(200);
      return getSubcategories(parentId);
    },
  },

  orders: {
    async list(filters?: {
      customerId?: string;
      vendorId?: string;
      status?: string;
    }): Promise<Order[]> {
      await delay();
      if (filters?.customerId) return getOrdersByCustomer(filters.customerId);
      if (filters?.vendorId) return getOrdersByVendor(filters.vendorId);
      if (filters?.status)
        return getOrdersByStatus(filters.status as Order["status"]);
      return orders;
    },

    async getById(id: string): Promise<Order | null> {
      await delay(200);
      return getOrderById(id) || null;
    },

    async create(
      order: Omit<Order, "id" | "orderNumber" | "createdAt" | "updatedAt">
    ): Promise<Order> {
      await delay(500);
      const newOrder: Order = {
        ...order,
        id: `ord-${Date.now()}`,
        orderNumber: `VD-2026${String(Math.floor(Math.random() * 90000) + 10000)}`,
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString(),
      };
      orders.unshift(newOrder);
      return newOrder;
    },
  },

  reviews: {
    async list(filters?: {
      productId?: string;
      vendorId?: string;
      customerId?: string;
    }): Promise<Review[]> {
      await delay();
      if (filters?.productId) return getReviewsByProduct(filters.productId);
      if (filters?.vendorId) return getReviewsByVendor(filters.vendorId);
      if (filters?.customerId) return getReviewsByCustomer(filters.customerId);
      return reviews;
    },

    async getProductRating(productId: string): Promise<{
      rating: number;
      count: number;
    }> {
      await delay(100);
      return getProductRating(productId);
    },
  },

  coupons: {
    async list(): Promise<Coupon[]> {
      await delay();
      return coupons;
    },

    async getActive(): Promise<Coupon[]> {
      await delay();
      return getActiveCoupons();
    },

    async getByCode(code: string): Promise<Coupon | null> {
      await delay(200);
      return getCouponByCode(code) || null;
    },

    async getByVendor(vendorId: string): Promise<Coupon[]> {
      await delay(200);
      return getVendorCoupons(vendorId);
    },
  },

  customers: {
    async list(): Promise<Customer[]> {
      await delay();
      return customers;
    },

    async getById(id: string): Promise<Customer | null> {
      await delay(200);
      return getCustomerById(id) || null;
    },
  },

  analytics: {
    async getVendorAnalytics(days: number) {
      await delay();
      return {
        salesOverview: generateAnalytics(days, 100),
        revenueByMonth: vendorAnalytics.revenueByMonth,
        topProducts: vendorAnalytics.topProducts,
        topCategories: vendorAnalytics.topCategories,
        customerGrowth: vendorAnalytics.customerGrowth,
      };
    },

    async getAdminAnalytics() {
      await delay();
      return adminAnalytics;
    },

    async getCategoryCommissions() {
      await delay();
      return categoryCommissions;
    },
  },

  transactions: {
    async list() {
      await delay();
      return transactions;
    },
  },

  payouts: {
    async list() {
      await delay();
      return payouts;
    },
  },

  promotions: {
    async list() {
      await delay();
      return promotions;
    },
  },

  notifications: {
    async list() {
      await delay();
      return notifications;
    },
  },

  addresses: {
    async list(): Promise<Address[]> {
      await delay();
      return customers[0]?.addresses || [];
    },
  },
};
