import { Suspense } from "react";
import { Navbar } from "@/components/layout/navbar";
import { AnnouncementBar } from "@/components/layout/announcement-bar";
import { Footer } from "@/components/layout/footer";
import { CartDrawer } from "@/components/ecommerce/cart-drawer";
import { AdminProductsContent } from "./admin-products-content";

export default function AdminProductsPage() {
  return (
    <>
      <AnnouncementBar />
      <Navbar />
      <main className="flex-1">
        <Suspense fallback={null}>
          <AdminProductsContent />
        </Suspense>
      </main>
      <Footer />
      <CartDrawer />
    </>
  );
}
