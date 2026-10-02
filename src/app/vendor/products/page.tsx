import { Suspense } from "react";
import { Navbar } from "@/components/layout/navbar";
import { AnnouncementBar } from "@/components/layout/announcement-bar";
import { Footer } from "@/components/layout/footer";
import { CartDrawer } from "@/components/ecommerce/cart-drawer";
import { VendorProductsContent } from "./vendor-products-content";

export default function VendorProductsPage() {
  return (
    <>
      <AnnouncementBar />
      <Navbar />
      <main className="flex-1">
        <Suspense fallback={null}>
          <VendorProductsContent />
        </Suspense>
      </main>
      <Footer />
      <CartDrawer />
    </>
  );
}
