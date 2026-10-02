import { Suspense } from "react";
import { notFound } from "next/navigation";
import { Navbar } from "@/components/layout/navbar";
import { AnnouncementBar } from "@/components/layout/announcement-bar";
import { Footer } from "@/components/layout/footer";
import { CartDrawer } from "@/components/ecommerce/cart-drawer";
import { CategoryContent } from "./category-content";
import { getCategoryBySlug } from "@/mock/categories";

export function generateMetadata({ params }: { params: Promise<{ category: string }> }) {
  const { category } = params as unknown as { category: string };
  const cat = getCategoryBySlug(category);
  return {
    title: cat?.name || "Category",
    description: cat?.description || "Browse products in this category",
  };
}

export default function CategoryPage({ params }: { params: Promise<{ category: string }> }) {
  const { category } = params as unknown as { category: string };
  const cat = getCategoryBySlug(category);
  if (!cat) notFound();

  return (
    <>
      <AnnouncementBar />
      <Navbar />
      <main className="flex-1">
        <Suspense fallback={null}>
          <CategoryContent categorySlug={category} />
        </Suspense>
      </main>
      <Footer />
      <CartDrawer />
    </>
  );
}
