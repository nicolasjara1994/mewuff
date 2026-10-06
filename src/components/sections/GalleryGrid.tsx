import Image from "next/image";

import { PlaceholderBadge } from "@/components/ui/PlaceholderBadge";
import { Reveal } from "@/components/ui/Reveal";
import type { GalleryItem } from "@/types/gallery";

export function GalleryGrid({ items }: { items: GalleryItem[] }) {
  return (
    <ul className="grid grid-cols-1 gap-x-6 gap-y-12 min-[480px]:grid-cols-2 lg:grid-cols-3">
      {items.map((item, index) => (
        <Reveal
          as="li"
          key={item.id}
          delay={(index % 3) * 0.08}
          className={index % 3 === 1 ? "lg:translate-y-12" : undefined}
        >
          <figure className="group">
            <div className="relative aspect-[4/5] overflow-hidden rounded-[1.5rem] bg-sand">
              <Image
                src={item.image}
                alt={item.alt}
                placeholder={item.image.blurDataURL ? "blur" : "empty"}
                sizes="(min-width: 1024px) 30vw, (min-width: 480px) 46vw, 92vw"
                className="h-full w-full object-cover transition-transform duration-700 ease-(--ease-soft) group-hover:scale-[1.03]"
              />
              {item.isPlaceholder && <PlaceholderBadge className="absolute top-3 left-3" />}
            </div>
            <figcaption className="mt-4 flex items-baseline justify-between gap-4">
              <span className="font-serif text-xl text-ink">{item.title}</span>
              <span className="shrink-0 text-sm text-muted">{item.species}</span>
            </figcaption>
            <p className="mt-1 text-sm text-muted">{item.finish}</p>
          </figure>
        </Reveal>
      ))}
    </ul>
  );
}
