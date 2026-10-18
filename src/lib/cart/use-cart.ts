"use client";

import { useMemo, useSyncExternalStore } from "react";

import {
  addItem,
  parseStoredCart,
  removeItem,
  setQuantity,
  STORAGE_KEY,
  summarize,
  type CartItem,
  type CartSummary,
} from "./cart";

/**
 * Almacén del carro como store externo (useSyncExternalStore):
 * - Sin proveedor de contexto: cualquier componente cliente puede usarlo.
 * - En el servidor (y durante la hidratación) el carro es siempre vacío, así
 *   que no hay desajustes de hidratación; luego se sincroniza con localStorage.
 * - El evento `storage` mantiene sincronizadas varias pestañas.
 */
const EMPTY: readonly CartItem[] = [];

let items: readonly CartItem[] = EMPTY;
let loaded = false;
const listeners = new Set<() => void>();

function load() {
  if (loaded || typeof window === "undefined") return;
  loaded = true;
  try {
    items = parseStoredCart(window.localStorage.getItem(STORAGE_KEY));
  } catch {
    items = EMPTY; // localStorage bloqueado (modo privado, políticas del navegador).
  }
}

function commit(next: readonly CartItem[]) {
  items = next;
  try {
    window.localStorage.setItem(STORAGE_KEY, JSON.stringify(next));
  } catch {
    // Sin persistencia: el carro sigue funcionando durante la sesión.
  }
  listeners.forEach((listener) => listener());
}

function subscribe(listener: () => void) {
  load();
  listeners.add(listener);
  const onStorage = (event: StorageEvent) => {
    if (event.key !== STORAGE_KEY && event.key !== null) return;
    items = parseStoredCart(event.newValue);
    listener();
  };
  window.addEventListener("storage", onStorage);
  return () => {
    listeners.delete(listener);
    window.removeEventListener("storage", onStorage);
  };
}

const getSnapshot = () => {
  load();
  return items;
};
const getServerSnapshot = () => EMPTY;

const actions = {
  add: (productId: string, quantity = 1) => commit(addItem(items, productId, quantity)),
  setQuantity: (productId: string, quantity: number) => commit(setQuantity(items, productId, quantity)),
  remove: (productId: string) => commit(removeItem(items, productId)),
  clear: () => commit(EMPTY),
};

export function useCart(): CartSummary & { actions: typeof actions } {
  const current = useSyncExternalStore(subscribe, getSnapshot, getServerSnapshot);
  const summary = useMemo(() => summarize(current), [current]);
  return { ...summary, actions };
}
