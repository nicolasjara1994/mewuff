/** Une clases condicionales sin agregar dependencias externas. */
export function cn(...classes: Array<string | false | null | undefined>): string {
  return classes.filter(Boolean).join(" ");
}
