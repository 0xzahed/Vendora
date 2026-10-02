import { Suspense } from "react";
import { Navbar } from "@/components/layout/navbar";
import { AnnouncementBar } from "@/components/layout/announcement-bar";
import { Footer } from "@/components/layout/footer";
import { CartDrawer } from "@/components/ecommerce/cart-drawer";
import { CheckoutContent } from "./checkout-content";

export default function CheckoutPage() {
  return (
    <>
      <AnnouncementBar />
      <Navbar />
      <main className="flex-1">
        <Suspense fallback={null}>
          <CheckoutContent />
        </Suspense>
      </main>
      <Footer />
      <CartDrawer />
    </>
  );
}
