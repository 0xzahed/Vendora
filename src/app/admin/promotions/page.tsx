import { Suspense } from "react";
import { Navbar } from "@/components/layout/navbar";
import { AnnouncementBar } from "@/components/layout/announcement-bar";
import { Footer } from "@/components/layout/footer";
import { CartDrawer } from "@/components/ecommerce/cart-drawer";
import { AdminPromotionsContent } from "./admin-promotions-content";

export default function AdminPromotionsPage() {
  return (
    <>
      <AnnouncementBar />
      <Navbar />
      <main className="flex-1">
        <Suspense fallback={null}>
          <AdminPromotionsContent />
        </Suspense>
      </main>
      <Footer />
      <CartDrawer />
    </>
  );
}
