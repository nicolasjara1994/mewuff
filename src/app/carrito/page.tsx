import type { Metadata } from "next";

import { CartView } from "@/components/cart/CartView";
import { Container } from "@/components/ui/Container";
import { PageHeader } from "@/components/ui/PageHeader";

export const metadata: Metadata = {
  title: "Carro de compras",
  robots: { index: false, follow: false },
};

export default function CartPage() {
  return (
    <>
      <PageHeader eyebrow="Carro" title="TU CARRO DE COMPRAS" />
      <Container className="pb-24">
        <CartView />
      </Container>
    </>
  );
}
