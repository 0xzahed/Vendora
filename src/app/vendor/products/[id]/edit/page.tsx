import { Suspense } from "react";
import { Navbar } from "@/components/layout/navbar";
import { AnnouncementBar } from "@/components/layout/announcement-bar";
import { Footer } from "@/components/layout/footer";
import { CartDrawer } from "@/components/ecommerce/cart-drawer";
import { VendorProductFormContent } from "../../vendor-product-form-content";

export default function EditProductPage() {
  return (
    <>
      <AnnouncementBar />
      <Navbar />
      <main className="flex-1">
        <Suspense fallback={null}>
          <VendorProductFormContent />
        </Suspense>
      </main>
      <Footer />
      <CartDrawer />
    </>
  );
}
