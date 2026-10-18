"use client";

import Image from "next/image";
import { useState } from "react";

import { ArrowIcon, ButtonLink, buttonStyles } from "@/components/ui/ButtonLink";
import { formatClp, MAX_QUANTITY } from "@/lib/cart/cart";
import { useCart } from "@/lib/cart/use-cart";

const stepperButton =
  "flex size-9 items-center justify-center rounded-full border border-line text-ink transition-colors hover:bg-linen disabled:pointer-events-none disabled:opacity-40";

export function CartView() {
  const { lines, count, total, actions } = useCart();
  const [ordered, setOrdered] = useState(false);

  if (ordered) {
    return (
      <div role="status" className="rounded-[1.75rem] border border-line bg-linen/50 p-8 text-center sm:p-12">
        <h2 className="font-display text-2xl text-ink">PEDIDO SIMULADO</h2>
        <p className="mx-auto mt-3 max-w-md leading-relaxed text-muted">
          Esto es solo una demo de aprendizaje: no se registró ningún pedido ni se realizó ningún cobro.
        </p>
        <ButtonLink href="/tienda" className="mt-8" onClick={() => setOrdered(false)}>
          Volver a la tienda
        </ButtonLink>
      </div>
    );
  }

  if (lines.length === 0) {
    return (
      <div className="rounded-[1.75rem] border border-line bg-linen/50 p-8 text-center sm:p-12">
        <h2 className="font-display text-2xl text-ink">TU CARRO ESTÁ VACÍO</h2>
        <p className="mt-3 text-muted">Agrega alguna figura para verla aquí.</p>
        <ButtonLink href="/tienda" className="mt-8">
          Ver la tienda
          <ArrowIcon />
        </ButtonLink>
      </div>
    );
  }

  return (
    <div className="grid gap-12 lg:grid-cols-[1fr_22rem] lg:items-start lg:gap-16">
      <ul className="divide-y divide-line border-y border-line">
        {lines.map(({ product, quantity, total: lineTotal }) => (
          <li key={product.id} className="flex gap-4 py-6 sm:gap-6">
            <Image
              src={product.image}
              alt={product.imageAlt}
              sizes="(min-width: 640px) 8rem, 6rem"
              className="size-24 shrink-0 object-cover sm:size-32"
            />
            <div className="flex min-w-0 flex-1 flex-col">
              <div className="flex justify-between gap-4">
                <h3 className="font-display text-lg text-ink">{product.name}</h3>
                <p className="font-medium whitespace-nowrap text-ink">{formatClp(lineTotal)}</p>
              </div>
              <p className="mt-1 text-sm text-muted">{formatClp(product.priceClp)} c/u</p>
              <div className="mt-auto flex items-center justify-between gap-4 pt-4">
                <div role="group" aria-label={`Cantidad de ${product.name}`} className="flex items-center gap-3">
                  <button
                    type="button"
                    className={stepperButton}
                    aria-label={`Quitar una unidad de ${product.name}`}
                    onClick={() => actions.setQuantity(product.id, quantity - 1)}
                  >
                    −
                  </button>
                  <span aria-live="polite" className="w-6 text-center tabular-nums">
                    {quantity}
                  </span>
                  <button
                    type="button"
                    className={stepperButton}
                    aria-label={`Agregar una unidad de ${product.name}`}
                    disabled={quantity >= MAX_QUANTITY}
                    onClick={() => actions.setQuantity(product.id, quantity + 1)}
                  >
                    +
                  </button>
                </div>
                <button
                  type="button"
                  className="text-sm text-muted underline underline-offset-4 hover:text-ink"
                  onClick={() => actions.remove(product.id)}
                >
                  Eliminar<span className="sr-only"> {product.name}</span>
                </button>
              </div>
            </div>
          </li>
        ))}
      </ul>

      <aside
        aria-labelledby="summary-title"
        className="rounded-2xl border border-line bg-linen/50 p-6 lg:sticky lg:top-28"
      >
        <h2 id="summary-title" className="font-display text-xl text-ink">
          RESUMEN
        </h2>
        <dl className="mt-5 space-y-3 text-sm">
          <div className="flex justify-between">
            <dt className="text-muted">Productos ({count})</dt>
            <dd className="text-ink">{formatClp(total)}</dd>
          </div>
          <div className="flex justify-between border-t border-line pt-3 text-base">
            <dt className="font-medium text-ink">Total</dt>
            <dd className="font-medium text-ink">{formatClp(total)}</dd>
          </div>
        </dl>
        <p className="mt-4 text-xs leading-relaxed text-muted">
          Demo de aprendizaje: no hay método de pago ni envío real. Los precios son de ejemplo.
        </p>
        <button
          type="button"
          className={buttonStyles("primary", "mt-6 w-full")}
          onClick={() => {
            actions.clear();
            setOrdered(true);
          }}
        >
          Simular pedido
        </button>
        <button
          type="button"
          className="mt-3 w-full text-center text-sm text-muted underline underline-offset-4 hover:text-ink"
          onClick={() => actions.clear()}
        >
          Vaciar carro
        </button>
      </aside>
    </div>
  );
}
