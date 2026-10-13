import { useCallback, useEffect, useState } from "react";
import useEmblaCarousel from "embla-carousel-react";
import SwipeHint from "./SwipeHint";
import type { Photo } from "./types";

const HINT_STORAGE_KEY = "gallery-swipe-hint-seen";

function hasSeenHint(): boolean {
  if (typeof localStorage === "undefined") return false;
  return localStorage.getItem(HINT_STORAGE_KEY) === "1";
}

function markHintSeen(): void {
  if (typeof localStorage !== "undefined") {
    localStorage.setItem(HINT_STORAGE_KEY, "1");
  }
}

interface Props {
  photos: Photo[];
  showSwipeHint: boolean;
}

export default function MobileGallery({ photos, showSwipeHint }: Props) {
  const [emblaRef, emblaApi] = useEmblaCarousel({
    axis: "y",
    align: "start",
    loop: true,
    watchDrag: (_emblaApi, event) => {
      const root = event.currentTarget;
      if (!(root instanceof HTMLElement)) return true;

      const pointerX = "touches" in event ? event.touches[0]?.clientX : event.clientX;
      if (pointerX === undefined) return true;

      const { left, width } = root.getBoundingClientRect();
      const inset = width * 0.05;
      return pointerX >= left + inset && pointerX <= left + width - inset;
    },
  });
  const [showHint, setShowHint] = useState(false);

  const dismissHint = useCallback(() => {
    setShowHint(false);
    markHintSeen();
  }, []);

  useEffect(() => {
    if (!showSwipeHint || hasSeenHint()) return;

    setShowHint(true);
    const timer = setTimeout(dismissHint, 6000);
    return () => clearTimeout(timer);
  }, [showSwipeHint, dismissHint]);

  useEffect(() => {
    if (!emblaApi || !showSwipeHint) return;

    emblaApi.on("select", dismissHint);
    return () => {
      emblaApi.off("select", dismissHint);
    };
  }, [emblaApi, showSwipeHint, dismissHint]);

  return (
    <div
      className="mt-12 w-full h-[60svh] overflow-hidden rounded-xl relative"
      ref={emblaRef}
    >
      <div className="flex flex-col h-full touch-pan-y">
        {photos.map((photo) => (
          <figure
            key={photo.src}
            className="h-[60svh] w-full shrink-0 relative select-none overflow-hidden"
          >
            <img
              src={photo.src}
              alt=""
              aria-hidden="true"
              className="absolute inset-0 w-full h-full object-cover scale-110 blur-2xl opacity-80 pointer-events-none"
            />
            <img
              src={photo.src}
              alt={photo.alt}
              className="relative w-full h-full object-contain pointer-events-none block"
            />
            <figcaption className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/20 to-transparent flex items-end justify-center p-4">
              <p className="text-white text-base font-medium text-center">
                {photo.alt}
              </p>
            </figcaption>
          </figure>
        ))}
      </div>
      <SwipeHint visible={showHint} />
    </div>
  );
}
