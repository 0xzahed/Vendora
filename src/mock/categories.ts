import type { Category } from "@/types";

export const categories: Category[] = [
  {
    id: "cat-1",
    name: "Electronics",
    slug: "electronics",
    description: "Latest gadgets, devices and tech accessories",
    image: "https://images.unsplash.com/photo-1498049794561-7780e7231661?auto=format&fit=crop&w=800&q=80",
    parentId: null,
    productCount: 12,
    active: true,
  },
  {
    id: "cat-2",
    name: "Fashion",
    slug: "fashion",
    description: "Clothing, shoes and accessories for everyone",
    image: "https://images.unsplash.com/photo-1441986300917-64674bd600d8?auto=format&fit=crop&w=800&q=80",
    parentId: null,
    productCount: 10,
    active: true,
  },
  {
    id: "cat-3",
    name: "Beauty & Personal Care",
    slug: "beauty",
    description: "Skincare, makeup and personal care essentials",
    image: "https://images.unsplash.com/photo-1596462502278-27bfdc403348?auto=format&fit=crop&w=800&q=80",
    parentId: null,
    productCount: 6,
    active: true,
  },
  {
    id: "cat-4",
    name: "Home & Living",
    slug: "home-living",
    description: "Furniture, decor and home essentials",
    image: "https://images.unsplash.com/photo-1586023492125-27b2c045efd7?auto=format&fit=crop&w=800&q=80",
    parentId: null,
    productCount: 8,
    active: true,
  },
  {
    id: "cat-5",
    name: "Books & Stationery",
    slug: "books",
    description: "Books, notebooks and office supplies",
    image: "https://images.unsplash.com/photo-1512820790803-83ca734da794?auto=format&fit=crop&w=800&q=80",
    parentId: null,
    productCount: 5,
    active: true,
  },
  {
    id: "cat-6",
    name: "Sports & Outdoors",
    slug: "sports",
    description: "Fitness gear, outdoor equipment and sportswear",
    image: "https://images.unsplash.com/photo-1461896836934-bd45ba8fcf9b?auto=format&fit=crop&w=800&q=80",
    parentId: null,
    productCount: 5,
    active: true,
  },
  {
    id: "cat-7",
    name: "Grocery & Gourmet",
    slug: "grocery",
    description: "Fresh produce, gourmet food and daily essentials",
    image: "https://images.unsplash.com/photo-1542838132-92c53300491e?auto=format&fit=crop&w=800&q=80",
    parentId: null,
    productCount: 4,
    active: true,
  },
  {
    id: "cat-8",
    name: "Accessories",
    slug: "accessories",
    description: "Watches, jewelry, bags and more",
    image: "https://images.unsplash.com/photo-1511499767150-a48a237f0083?auto=format&fit=crop&w=800&q=80",
    parentId: null,
    productCount: 6,
    active: true,
  },
  {
    id: "cat-9",
    name: "Audio",
    slug: "audio",
    description: "Headphones, speakers and audio equipment",
    image: "https://images.unsplash.com/photo-1505740420928-5e560c06d30e?auto=format&fit=crop&w=800&q=80",
    parentId: "cat-1",
    productCount: 4,
    active: true,
  },
  {
    id: "cat-10",
    name: "Wearables",
    slug: "wearables",
    description: "Smartwatches and fitness trackers",
    image: "https://images.unsplash.com/photo-1546868871-7041f2a55e12?auto=format&fit=crop&w=800&q=80",
    parentId: "cat-1",
    productCount: 3,
    active: true,
  },
  {
    id: "cat-11",
    name: "Men's Fashion",
    slug: "mens-fashion",
    description: "Clothing and accessories for men",
    image: "https://images.unsplash.com/photo-1488161628813-04466f872be2?auto=format&fit=crop&w=800&q=80",
    parentId: "cat-2",
    productCount: 5,
    active: true,
  },
  {
    id: "cat-12",
    name: "Women's Fashion",
    slug: "womens-fashion",
    description: "Clothing and accessories for women",
    image: "https://images.unsplash.com/photo-1483985988355-763728e1935b?auto=format&fit=crop&w=800&q=80",
    parentId: "cat-2",
    productCount: 5,
    active: true,
  },
];

export function getCategoryBySlug(slug: string): Category | undefined {
  return categories.find((c) => c.slug === slug);
}

export function getCategoryById(id: string): Category | undefined {
  return categories.find((c) => c.id === id);
}

export function getSubcategories(parentId: string): Category[] {
  return categories.filter((c) => c.parentId === parentId);
}
