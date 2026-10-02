import { Suspense } from "react";
import { notFound } from "next/navigation";
import { Navbar } from "@/components/layout/navbar";
import { AnnouncementBar } from "@/components/layout/announcement-bar";
import { Footer } from "@/components/layout/footer";
import { CartDrawer } from "@/components/ecommerce/cart-drawer";
import { ProductDetailContent } from "./product-detail-content";
import { getProductBySlug } from "@/mock/products";

export function generateMetadata({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = params as unknown as { slug: string };
  const product = getProductBySlug(slug);
  return {
    title: product?.name || "Product",
    description: product?.shortDescription || product?.description,
    openGraph: {
      title: product?.name || "Product",
      description: product?.shortDescription || "",
      images: product?.images || [],
    },
  };
}

export default function ProductPage({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = params as unknown as { slug: string };
  const product = getProductBySlug(slug);
  if (!product) notFound();

  return (
    <>
      <AnnouncementBar />
      <Navbar />
      <main className="flex-1">
        <Suspense fallback={null}>
          <ProductDetailContent slug={slug} />
        </Suspense>
      </main>
      <Footer />
      <CartDrawer />
    </>
  );
}
