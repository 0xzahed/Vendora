import { Suspense } from "react";
import { Navbar } from "@/components/layout/navbar";
import { AnnouncementBar } from "@/components/layout/announcement-bar";
import { Footer } from "@/components/layout/footer";
import { CartDrawer } from "@/components/ecommerce/cart-drawer";
import { VendorAnalyticsContent } from "./vendor-analytics-content";

export default function VendorAnalyticsPage() {
  return (
    <>
      <AnnouncementBar />
      <Navbar />
      <main className="flex-1">
        <Suspense fallback={null}>
          <VendorAnalyticsContent />
        </Suspense>
      </main>
      <Footer />
      <CartDrawer />
    </>
  );
}
