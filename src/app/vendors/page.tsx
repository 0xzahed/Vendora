import { Suspense } from "react";
import { Navbar } from "@/components/layout/navbar";
import { AnnouncementBar } from "@/components/layout/announcement-bar";
import { Footer } from "@/components/layout/footer";
import { CartDrawer } from "@/components/ecommerce/cart-drawer";
import { VendorsContent } from "./vendors-content";

export default function VendorsPage() {
  return (
    <>
      <AnnouncementBar />
      <Navbar />
      <main className="flex-1">
        <Suspense fallback={null}>
          <VendorsContent />
        </Suspense>
      </main>
      <Footer />
      <CartDrawer />
    </>
  );
}
