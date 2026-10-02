import { Suspense } from "react";
import { Navbar } from "@/components/layout/navbar";
import { AnnouncementBar } from "@/components/layout/announcement-bar";
import { Footer } from "@/components/layout/footer";
import { CartDrawer } from "@/components/ecommerce/cart-drawer";
import { AdminReviewsContent } from "./admin-reviews-content";

export default function AdminReviewsPage() {
  return (
    <>
      <AnnouncementBar />
      <Navbar />
      <main className="flex-1">
        <Suspense fallback={null}>
          <AdminReviewsContent />
        </Suspense>
      </main>
      <Footer />
      <CartDrawer />
    </>
  );
}
