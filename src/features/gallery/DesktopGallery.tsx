import useEmblaCarousel from "embla-carousel-react";
import type { Photo } from "./types";

interface Props {
  photos: Photo[];
}

export default function DesktopGallery({ photos }: Props) {
  const [emblaRef] = useEmblaCarousel({
    dragFree: true,
    containScroll: "trimSnaps",
  });

  return (
    <div
      className="overflow-hidden cursor-grab active:cursor-grabbing py-8"
      ref={emblaRef}
    >
      <div className="flex gap-4 touch-pan-y items-start">
        {photos.map((photo) => (
          <figure
            key={photo.src}
            className="shrink-0 relative select-none group object-scale-down sm:h-80 h-120 w-auto rounded-xl shadow-md overflow-hidden"
          >
            <img
              src={photo.src}
              alt={photo.alt}
              className="h-full max-w-full object-cover pointer-events-none block transition-transform duration-500 group-hover:scale-105"
            />

            <figcaption className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/20 to-transparent flex items-end p-4 transition-opacity duration-300 opacity-0 justify-start group-hover:opacity-100">
              <p className="text-white text-sm font-medium transition-transform duration-300 delay-75 text-left translate-y-4 group-hover:translate-y-0">
                {photo.alt}
              </p>
            </figcaption>
          </figure>
        ))}
      </div>
    </div>
  );
}
