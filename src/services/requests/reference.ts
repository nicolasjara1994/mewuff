import "server-only";

import { randomInt } from "node:crypto";

// Sin caracteres ambiguos (0/O, 1/I/L) para que el cliente pueda dictarlo.
const ALPHABET = "23456789ABCDEFGHJKMNPQRSTUVWXYZ";

/** Código legible para el cliente, p. ej. "MW-7KD3QX". No revela el UUID interno. */
export function generateRequestReference(): string {
  let code = "";
  for (let i = 0; i < 6; i += 1) code += ALPHABET[randomInt(ALPHABET.length)];
  return `MW-${code}`;
}
