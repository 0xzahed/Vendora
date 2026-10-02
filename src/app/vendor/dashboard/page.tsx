import { Suspense } from "react";
import { Navbar } from "@/components/layout/navbar";
import { AnnouncementBar } from "@/components/layout/announcement-bar";
import { Footer } from "@/components/layout/footer";
import { CartDrawer } from "@/components/ecommerce/cart-drawer";
import { VendorDashboardContent } from "./vendor-dashboard-content";

export default function VendorDashboardPage() {
  return (
    <>
      <AnnouncementBar />
      <Navbar />
      <main className="flex-1">
        <Suspense fallback={null}>
          <VendorDashboardContent />
        </Suspense>
      </main>
      <Footer />
      <CartDrawer />
    </>
  );
}
