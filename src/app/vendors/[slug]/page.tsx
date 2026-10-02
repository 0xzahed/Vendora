import { Suspense } from "react";
import { notFound } from "next/navigation";
import { Navbar } from "@/components/layout/navbar";
import { AnnouncementBar } from "@/components/layout/announcement-bar";
import { Footer } from "@/components/layout/footer";
import { CartDrawer } from "@/components/ecommerce/cart-drawer";
import { VendorStoreContent } from "./vendor-store-content";
import { getVendorBySlug } from "@/mock/vendors";

export function generateMetadata({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = params as unknown as { slug: string };
  const vendor = getVendorBySlug(slug);
  return {
    title: vendor?.name || "Vendor",
    description: vendor?.description || "Vendor storefront",
  };
}

export default function VendorStorePage({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = params as unknown as { slug: string };
  const vendor = getVendorBySlug(slug);
  if (!vendor) notFound();

  return (
    <>
      <AnnouncementBar />
      <Navbar />
      <main className="flex-1">
        <Suspense fallback={null}>
          <VendorStoreContent slug={slug} />
        </Suspense>
      </main>
      <Footer />
      <CartDrawer />
    </>
  );
}
