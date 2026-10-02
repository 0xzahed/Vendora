import { Suspense } from "react";
import { Navbar } from "@/components/layout/navbar";
import { AnnouncementBar } from "@/components/layout/announcement-bar";
import { Footer } from "@/components/layout/footer";
import { CartDrawer } from "@/components/ecommerce/cart-drawer";
import { VendorCouponsContent } from "./vendor-coupons-content";

export default function VendorCouponsPage() {
  return (
    <>
      <AnnouncementBar />
      <Navbar />
      <main className="flex-1">
        <Suspense fallback={null}>
          <VendorCouponsContent />
        </Suspense>
      </main>
      <Footer />
      <CartDrawer />
    </>
  );
}
