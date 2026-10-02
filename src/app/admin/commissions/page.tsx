import { Suspense } from "react";
import { Navbar } from "@/components/layout/navbar";
import { AnnouncementBar } from "@/components/layout/announcement-bar";
import { Footer } from "@/components/layout/footer";
import { CartDrawer } from "@/components/ecommerce/cart-drawer";
import { AdminCommissionsContent } from "./admin-commissions-content";

export default function AdminCommissionsPage() {
  return (
    <>
      <AnnouncementBar />
      <Navbar />
      <main className="flex-1">
        <Suspense fallback={null}>
          <AdminCommissionsContent />
        </Suspense>
      </main>
      <Footer />
      <CartDrawer />
    </>
  );
}
