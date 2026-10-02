import { Suspense } from "react";
import { Navbar } from "@/components/layout/navbar";
import { AnnouncementBar } from "@/components/layout/announcement-bar";
import { Footer } from "@/components/layout/footer";
import { CartDrawer } from "@/components/ecommerce/cart-drawer";
import { AdminCategoriesContent } from "./admin-categories-content";

export default function AdminCategoriesPage() {
  return (
    <>
      <AnnouncementBar />
      <Navbar />
      <main className="flex-1">
        <Suspense fallback={null}>
          <AdminCategoriesContent />
        </Suspense>
      </main>
      <Footer />
      <CartDrawer />
    </>
  );
}
