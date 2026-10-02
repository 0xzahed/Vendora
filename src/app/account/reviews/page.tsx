import { Suspense } from "react";
import { Navbar } from "@/components/layout/navbar";
import { AnnouncementBar } from "@/components/layout/announcement-bar";
import { Footer } from "@/components/layout/footer";
import { CartDrawer } from "@/components/ecommerce/cart-drawer";
import { ReviewsContent } from "./reviews-content";

export default function ReviewsPage() {
  return (
    <>
      <AnnouncementBar />
      <Navbar />
      <main className="flex-1">
        <Suspense fallback={null}>
          <ReviewsContent />
        </Suspense>
      </main>
      <Footer />
      <CartDrawer />
    </>
  );
}
