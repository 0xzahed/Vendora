import { Suspense } from "react";
import { Navbar } from "@/components/layout/navbar";
import { AnnouncementBar } from "@/components/layout/announcement-bar";
import { Footer } from "@/components/layout/footer";
import { CartDrawer } from "@/components/ecommerce/cart-drawer";
import { AdminPayoutsContent } from "./admin-payouts-content";

export default function AdminPayoutsPage() {
  return (
    <>
      <AnnouncementBar />
      <Navbar />
      <main className="flex-1">
        <Suspense fallback={null}>
          <AdminPayoutsContent />
        </Suspense>
      </main>
      <Footer />
      <CartDrawer />
    </>
  );
}
