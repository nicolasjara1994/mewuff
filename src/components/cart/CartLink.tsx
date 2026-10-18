"use client";

import Link from "next/link";

import { useCart } from "@/lib/cart/use-cart";

/** Acceso al carro en el encabezado, con contador de unidades. */
export function CartLink() {
  const { count } = useCart();
  return (
    <Link
      href="/carrito"
      aria-label={count > 0 ? `Carro de compras, ${count} ${count === 1 ? "producto" : "productos"}` : "Carro de compras"}
      className="relative inline-flex size-10 items-center justify-center rounded-full text-ink-soft transition-colors hover:text-ink"
    >
      <svg aria-hidden="true" viewBox="0 0 24 24" fill="none" className="size-5">
        <path
          d="M3 4h2.2l2 11h10.4l2-8H6.2"
          stroke="currentColor"
          strokeWidth="1.7"
          strokeLinecap="round"
          strokeLinejoin="round"
        />
        <circle cx="9.5" cy="19.5" r="1.2" fill="currentColor" />
        <circle cx="16.5" cy="19.5" r="1.2" fill="currentColor" />
      </svg>
      {count > 0 && (
        <span
          aria-hidden="true"
          className="absolute -top-0.5 -right-0.5 flex min-w-5 items-center justify-center rounded-full bg-accent px-1 text-[0.7rem] leading-5 font-medium text-white"
        >
          {count}
        </span>
      )}
    </Link>
  );
}
