import { siteConfig } from "@/lib/site";

const buttonClass =
  "flex size-13 items-center justify-center rounded-full text-white shadow-lg shadow-black/25 transition-transform duration-300 hover:scale-110 focus-visible:scale-110 sm:size-14";

/** Botones flotantes fijos al costado derecho: WhatsApp y teléfono. */
export function FloatingContact() {
  return (
    <div className="fixed top-1/2 right-4 z-40 flex -translate-y-1/2 flex-col gap-3 sm:right-6">
      <a
        href={siteConfig.contact.whatsappUrl}
        target="_blank"
        rel="noopener noreferrer"
        aria-label="Escríbenos por WhatsApp"
        className={`${buttonClass} bg-sage`}
      >
        <svg viewBox="0 0 24 24" fill="currentColor" aria-hidden="true" className="size-7">
          <path d="M12.04 2a9.9 9.9 0 0 0-8.5 14.9L2 22l5.25-1.38A9.9 9.9 0 1 0 12.04 2Zm0 18.1a8.2 8.2 0 0 1-4.18-1.14l-.3-.18-3.1.82.83-3.03-.2-.31a8.2 8.2 0 1 1 6.95 3.84Zm4.5-6.14c-.25-.12-1.46-.72-1.69-.8-.23-.09-.39-.13-.56.12-.16.25-.64.8-.78.97-.14.16-.29.18-.54.06a6.7 6.7 0 0 1-1.98-1.22 7.4 7.4 0 0 1-1.37-1.7c-.14-.25-.02-.38.1-.5.11-.11.25-.29.37-.43.12-.15.16-.25.25-.41.08-.17.04-.31-.02-.43-.06-.12-.56-1.35-.77-1.85-.2-.48-.4-.42-.56-.42h-.47c-.16 0-.43.06-.65.31-.22.25-.85.83-.85 2.03s.87 2.35.99 2.52c.12.16 1.71 2.61 4.15 3.66.58.25 1.03.4 1.39.51.58.18 1.11.16 1.53.1.47-.07 1.46-.6 1.66-1.17.2-.58.2-1.07.14-1.17-.06-.1-.22-.16-.47-.28Z" />
        </svg>
      </a>
      <a href={siteConfig.contact.phoneUrl} aria-label="Llámanos por teléfono" className={`${buttonClass} bg-ink`}>
        <svg viewBox="0 0 24 24" fill="currentColor" aria-hidden="true" className="size-6 text-cream">
          <path d="M6.6 10.8a15.1 15.1 0 0 0 6.6 6.6l2.2-2.2a1 1 0 0 1 1-.25c1.1.37 2.3.57 3.6.57a1 1 0 0 1 1 1V20a1 1 0 0 1-1 1A17 17 0 0 1 3 4a1 1 0 0 1 1-1h3.5a1 1 0 0 1 1 1c0 1.25.2 2.45.57 3.57a1 1 0 0 1-.25 1.02L6.6 10.8Z" />
        </svg>
      </a>
    </div>
  );
}
