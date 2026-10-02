import type { AnalyticsData } from "@/types";

function seededRandom(seed: number) {
  let s = seed;
  return () => {
    s = (s * 16807) % 2147483647;
    return (s - 1) / 2147483646;
  };
}

export function generateAnalytics(days: number, seed = 42): AnalyticsData[] {
  const rand = seededRandom(seed);
  const data: AnalyticsData[] = [];
  const now = new Date();

  for (let i = days - 1; i >= 0; i--) {
    const date = new Date(now);
    date.setDate(date.getDate() - i);
    const dayOfWeek = date.getDay();
    const weekendBoost = dayOfWeek === 0 || dayOfWeek === 6 ? 1.3 : 1;
    const trend = 1 + (days - i) / days * 0.5;

    const revenue = Math.round((rand() * 3000 + 1500) * weekendBoost * trend);
    const orders = Math.round((rand() * 40 + 20) * weekendBoost * trend);
    const visitors = Math.round((rand() * 800 + 400) * weekendBoost * trend);
    const conversion = Math.round((rand() * 2 + 2.5) * 10) / 10;

    data.push({
      date: date.toISOString().split("T")[0],
      revenue,
      orders,
      visitors,
      conversion,
    });
  }

  return data;
}

export const vendorAnalytics = {
  salesOverview: generateAnalytics(30, 100),
  revenueByMonth: [
    { month: "Jan", revenue: 12400, orders: 89 },
    { month: "Feb", revenue: 15200, orders: 102 },
    { month: "Mar", revenue: 13800, orders: 95 },
    { month: "Apr", revenue: 18600, orders: 124 },
    { month: "May", revenue: 21400, orders: 143 },
    { month: "Jun", revenue: 19800, orders: 132 },
    { month: "Jul", revenue: 24200, orders: 161 },
    { month: "Aug", revenue: 26800, orders: 178 },
    { month: "Sep", revenue: 23400, orders: 156 },
  ],
  topProducts: [
    { name: "ProSound Headphones", sales: 2840, revenue: 539296 },
    { name: "AirBeat Pro Earbuds", sales: 5670, revenue: 453543 },
    { name: "MechForce Keyboard", sales: 3450, revenue: 310466 },
    { name: "SmartFit Pro Watch", sales: 1920, revenue: 249581 },
    { name: "BoomBox Speaker", sales: 4230, revenue: 295958 },
  ],
  topCategories: [
    { name: "Audio", revenue: 1288027, percentage: 38 },
    { name: "Electronics", revenue: 892450, percentage: 26 },
    { name: "Wearables", revenue: 499162, percentage: 15 },
    { name: "Accessories", revenue: 387200, percentage: 11 },
    { name: "Other", revenue: 342161, percentage: 10 },
  ],
  customerGrowth: [
    { month: "Jan", customers: 120 },
    { month: "Feb", customers: 185 },
    { month: "Mar", customers: 240 },
    { month: "Apr", customers: 310 },
    { month: "May", customers: 425 },
    { month: "Jun", customers: 510 },
    { month: "Jul", customers: 680 },
    { month: "Aug", customers: 820 },
    { month: "Sep", customers: 945 },
  ],
};

export const adminAnalytics = {
  marketplaceRevenue: generateAnalytics(30, 200),
  gmv: generateAnalytics(30, 300),
  vendorGrowth: [
    { month: "Jan", vendors: 4 },
    { month: "Feb", vendors: 5 },
    { month: "Mar", vendors: 6 },
    { month: "Apr", vendors: 7 },
    { month: "May", vendors: 8 },
    { month: "Jun", vendors: 9 },
    { month: "Jul", vendors: 10 },
    { month: "Aug", vendors: 11 },
    { month: "Sep", vendors: 12 },
  ],
  customerGrowth: [
    { month: "Jan", customers: 850 },
    { month: "Feb", customers: 1120 },
    { month: "Mar", customers: 1480 },
    { month: "Apr", customers: 1890 },
    { month: "May", customers: 2340 },
    { month: "Jun", customers: 2890 },
    { month: "Jul", customers: 3520 },
    { month: "Aug", customers: 4210 },
    { month: "Sep", customers: 4980 },
  ],
  commissionRevenue: [
    { month: "Jan", commission: 1240 },
    { month: "Feb", commission: 1520 },
    { month: "Mar", commission: 1380 },
    { month: "Apr", commission: 1860 },
    { month: "May", commission: 2140 },
    { month: "Jun", commission: 1980 },
    { month: "Jul", commission: 2420 },
    { month: "Aug", commission: 2680 },
    { month: "Sep", commission: 2340 },
  ],
  ordersByStatus: [
    { status: "Delivered", count: 1847 },
    { status: "Shipped", count: 423 },
    { status: "Processing", count: 312 },
    { status: "Confirmed", count: 198 },
    { status: "Pending", count: 156 },
    { status: "Cancelled", count: 89 },
    { status: "Returned", count: 34 },
  ],
  categoryDistribution: [
    { name: "Electronics", value: 32 },
    { name: "Fashion", value: 24 },
    { name: "Home & Living", value: 16 },
    { name: "Beauty", value: 12 },
    { name: "Sports", value: 8 },
    { name: "Books", value: 5 },
    { name: "Other", value: 3 },
  ],
};

export const categoryCommissions = [
  { category: "Electronics", rate: 8 },
  { category: "Fashion", rate: 10 },
  { category: "Beauty & Personal Care", rate: 12 },
  { category: "Home & Living", rate: 10 },
  { category: "Books & Stationery", rate: 5 },
  { category: "Sports & Outdoors", rate: 10 },
  { category: "Grocery & Gourmet", rate: 7 },
  { category: "Accessories", rate: 12 },
];
