"use client";

import { useEffect, useState } from "react";

import { buttonStyles } from "@/components/ui/ButtonLink";
import { useCart } from "@/lib/cart/use-cart";

export function AddToCartButton({ productId, productName }: { productId: string; productName: string }) {
  const { actions } = useCart();
  const [added, setAdded] = useState(false);

  useEffect(() => {
    if (!added) return;
    const timeout = setTimeout(() => setAdded(false), 1800);
    return () => clearTimeout(timeout);
  }, [added]);

  return (
    <>
      <button
        type="button"
        className={buttonStyles("primary", "w-full")}
        onClick={() => {
          actions.add(productId);
          setAdded(true);
        }}
      >
        {added ? "Agregado ✓" : "Agregar al carro"}
        <span className="sr-only"> {productName}</span>
      </button>
      {/* Anuncia el resultado a lectores de pantalla. */}
      <span role="status" className="sr-only">
        {added ? `${productName} agregado al carro` : ""}
      </span>
    </>
  );
}
