import { Suspense } from "react";
import { Navbar } from "@/components/layout/navbar";
import { AnnouncementBar } from "@/components/layout/announcement-bar";
import { Footer } from "@/components/layout/footer";
import { CartDrawer } from "@/components/ecommerce/cart-drawer";
import { AdminDashboardContent } from "./admin-dashboard-content";

export default function AdminDashboardPage() {
  return (
    <>
      <AnnouncementBar />
      <Navbar />
      <main className="flex-1">
        <Suspense fallback={null}>
          <AdminDashboardContent />
        </Suspense>
      </main>
      <Footer />
      <CartDrawer />
    </>
  );
}
