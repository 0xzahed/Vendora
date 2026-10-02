import type { Review } from "@/types";
import { products } from "./products";

const reviewData = [
  { rating: 5, title: "Exceeded expectations", comment: "Absolutely love this product! The quality is outstanding and it arrived faster than expected. Would definitely buy again." },
  { rating: 5, title: "Perfect purchase", comment: "This is exactly what I was looking for. Great build quality, works flawlessly, and the packaging was excellent." },
  { rating: 4, title: "Very good, minor issues", comment: "Overall very satisfied with this purchase. The product works great, just wish the instructions were clearer." },
  { rating: 5, title: "Highly recommend", comment: "I've been using this for a month now and it's been fantastic. Great value for money and excellent customer service." },
  { rating: 4, title: "Solid quality", comment: "Good product at a reasonable price. Does what it's supposed to do. Shipping was quick too." },
  { rating: 5, title: "Best in class", comment: "I've tried many similar products and this one stands out. Premium feel, great performance, and looks amazing." },
  { rating: 3, title: "Decent but not great", comment: "The product is okay for the price. It works but doesn't feel as premium as I expected based on the photos." },
  { rating: 5, title: "Love it!", comment: "This exceeded all my expectations. The attention to detail is impressive and it works perfectly." },
  { rating: 4, title: "Great value", comment: "You get a lot for your money here. Quality is good, delivery was fast, and the seller was responsive." },
  { rating: 5, title: "Fantastic", comment: "Couldn't be happier with this purchase. It's well-made, looks great, and functions perfectly." },
  { rating: 2, title: "Disappointed", comment: "The product didn't match the description well. Quality feels cheap and it stopped working after a week." },
  { rating: 4, title: "Good purchase", comment: "Happy with this overall. Took a star off because delivery took longer than expected, but the product itself is great." },
  { rating: 5, title: "Worth every penny", comment: "Premium quality, fast shipping, and excellent packaging. This seller really cares about their customers." },
  { rating: 1, title: "Do not buy", comment: "Arrived damaged and the seller refused to help. Complete waste of money." },
  { rating: 5, title: "My new favorite", comment: "I use this every single day. It's become an essential part of my routine. Highly recommended!" },
];

const customerNames = [
  "Alex M.", "Jordan P.", "Casey L.", "Taylor R.", "Morgan S.",
  "Riley K.", "Quinn D.", "Avery B.", "Jamie F.", "Drew H.",
  "Sam T.", "Pat W.", "Chris N.", "Robin G.", "Skyler J.",
];

export const reviews: Review[] = Array.from({ length: 60 }, (_, i) => {
  const product = products[i % products.length];
  const data = reviewData[i % reviewData.length];
  const created = new Date(
    new Date("2025-08-01").getTime() +
      Math.random() * (new Date("2026-10-01").getTime() - new Date("2025-08-01").getTime())
  ).toISOString();

  return {
    id: `rev-${i + 1}`,
    productId: product.id,
    productName: product.name,
    productImage: product.images[0],
    customerId: `cust-${(i % 8) + 1}`,
    customerName: customerNames[i % customerNames.length],
    rating: data.rating,
    title: data.title,
    comment: data.comment,
    helpful: Math.floor(Math.random() * 45),
    verified: Math.random() > 0.25,
    status: i === 13 ? "reported" : i % 11 === 0 ? "pending" : "approved",
    createdAt: created,
    vendorReply:
      data.rating <= 3
        ? "Thank you for your feedback. We're sorry to hear about your experience and would like to make it right. Please contact our support team."
        : undefined,
  };
});

export function getReviewsByProduct(productId: string): Review[] {
  return reviews.filter((r) => r.productId === productId && r.status === "approved");
}

export function getReviewsByVendor(vendorId: string): Review[] {
  const vendorProducts = products.filter((p) => p.vendorId === vendorId);
  return reviews.filter(
    (r) => vendorProducts.some((p) => p.id === r.productId) && r.status === "approved"
  );
}

export function getReviewsByCustomer(customerId: string): Review[] {
  return reviews.filter((r) => r.customerId === customerId);
}

export function getProductRating(productId: string): { rating: number; count: number } {
  const productReviews = reviews.filter(
    (r) => r.productId === productId && r.status === "approved"
  );
  if (productReviews.length === 0) return { rating: 0, count: 0 };
  const avg =
    productReviews.reduce((sum, r) => sum + r.rating, 0) / productReviews.length;
  return { rating: Math.round(avg * 10) / 10, count: productReviews.length };
}
