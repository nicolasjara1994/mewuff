import type { Metadata } from "next";
import Image from "next/image";

import { AddToCartButton } from "@/components/cart/AddToCartButton";
import { Container } from "@/components/ui/Container";
import { PageHeader } from "@/components/ui/PageHeader";
import { products } from "@/content/products";
import { formatClp } from "@/lib/cart/cart";

export const metadata: Metadata = {
  title: "Tienda",
  description: "Elige el tamaño de tu figura y agrégala al carro. Demo de aprendizaje, sin pagos.",
  alternates: { canonical: "/tienda" },
};

export default function ShopPage() {
  return (
    <>
      <PageHeader
        eyebrow="Tienda"
        title="ELIGE EL TAMAÑO DE TU FIGURA"
        description="Demo de aprendizaje de un carro de compras: los productos y precios son de ejemplo y no hay pagos."
      />
      <Container className="pb-24">
        <ul className="grid gap-10 sm:grid-cols-2 lg:grid-cols-3">
          {products.map((product) => (
            <li key={product.id} className="flex flex-col">
              <Image
                src={product.image}
                alt={product.imageAlt}
                placeholder="blur"
                sizes="(min-width: 1024px) 30vw, (min-width: 640px) 45vw, 92vw"
                className="aspect-4/3 w-full object-cover"
              />
              <span className="mt-5 self-start rounded-full bg-sage px-3 py-0.5 text-xs font-medium text-white">
                Hecho a mano
              </span>
              <h2 className="mt-3 font-display text-xl text-ink">{product.name}</h2>
              <p className="mt-2 flex-1 leading-relaxed text-muted">{product.description}</p>
              <p className="mt-4 mb-5 text-lg font-medium text-ink">{formatClp(product.priceClp)}</p>
              <AddToCartButton productId={product.id} productName={product.name} />
            </li>
          ))}
        </ul>
      </Container>
    </>
  );
}
