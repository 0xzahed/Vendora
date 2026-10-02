import { Suspense } from "react";
import { notFound } from "next/navigation";
import { Navbar } from "@/components/layout/navbar";
import { AnnouncementBar } from "@/components/layout/announcement-bar";
import { Footer } from "@/components/layout/footer";
import { CartDrawer } from "@/components/ecommerce/cart-drawer";
import { OrderDetailContent } from "./order-detail-content";
import { getOrderById } from "@/mock/orders";

export default function OrderDetailPage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = params as unknown as { id: string };
  const order = getOrderById(id);
  if (!order) notFound();

  return (
    <>
      <AnnouncementBar />
      <Navbar />
      <main className="flex-1">
        <Suspense fallback={null}>
          <OrderDetailContent orderId={id} />
        </Suspense>
      </main>
      <Footer />
      <CartDrawer />
    </>
  );
}
