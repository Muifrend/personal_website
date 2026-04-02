import React, { useCallback, useEffect, useMemo, useState } from "react";
import useEmblaCarousel from "embla-carousel-react";
import { useIsTouchDevice } from "../hooks/useIsTouchDevice";
import { useEmblaProgress } from "../hooks/useEmblaProgress";

interface Photo {
  src: string;
  alt: string;
}

interface Props {
  photos: Photo[];
}

function createSeed(photos: Photo[]): number {
  const seedSource = photos.map(({ src }) => src).join("|");
  let seed = 0;

  for (let i = 0; i < seedSource.length; i += 1) {
    seed = (seed * 31 + seedSource.charCodeAt(i)) >>> 0;
  }

  return seed || 1;
}

function seededRandom(seed: number): () => number {
  let nextSeed = seed;

  return () => {
    nextSeed = (nextSeed * 1664525 + 1013904223) >>> 0;
    return nextSeed / 0x100000000;
  };
}

function shuffleArray<T>(array: T[], seed: number): T[] {
  const newArr = [...array];
  const random = seededRandom(seed);

  for (let currentIndex = newArr.length - 1; currentIndex > 0; currentIndex -= 1) {
    const randomIndex = Math.floor(random() * (currentIndex + 1));
    [newArr[currentIndex], newArr[randomIndex]] = [
      newArr[randomIndex],
      newArr[currentIndex],
    ];
  }

  return newArr;
}

const DotIndicator: React.FC<{ selectedIndex: number; total: number }> = ({
  selectedIndex,
  total,
}) => (
  <div className="absolute right-3 top-1/2 -translate-y-1/2 flex flex-col gap-1.5 z-10">
    {Array.from({ length: total }, (_, i) => (
      <button
        key={i}
        type="button"
        aria-label={`Go to slide ${i + 1}`}
        className={`w-2 h-2 rounded-full transition-all duration-300 ${
          i === selectedIndex
            ? "bg-white scale-125"
            : "bg-white/40"
        }`}
      />
    ))}
  </div>
);

const SwipeHint: React.FC<{ visible: boolean }> = ({ visible }) => {
  if (!visible) return null;

  return (
    <div className="absolute bottom-6 left-1/2 -translate-x-1/2 z-10 animate-bounce text-white/70 transition-opacity duration-500">
      <svg
        xmlns="http://www.w3.org/2000/svg"
        width="28"
        height="28"
        viewBox="0 0 24 24"
        fill="none"
        stroke="currentColor"
        strokeWidth="2"
        strokeLinecap="round"
        strokeLinejoin="round"
      >
        <path d="m18 15-6-6-6 6" />
      </svg>
    </div>
  );
};

const Gallery: React.FC<Props> = ({ photos }) => {
  const isTouch = useIsTouchDevice();

  const emblaOptions = useMemo(
    () =>
      isTouch
        ? { axis: "y" as const, align: "start" as const }
        : { dragFree: true, containScroll: "trimSnaps" as const },
    [isTouch],
  );

  const [emblaRef, emblaApi] = useEmblaCarousel(emblaOptions);
  const { selectedIndex, total } = useEmblaProgress(emblaApi);
  const [showHint, setShowHint] = useState(true);

  const dismissHint = useCallback(() => setShowHint(false), []);

  useEffect(() => {
    if (!isTouch) return;

    const timer = setTimeout(() => setShowHint(false), 3000);
    return () => clearTimeout(timer);
  }, [isTouch]);

  useEffect(() => {
    if (!emblaApi || !isTouch) return;

    emblaApi.on("select", dismissHint);
    return () => {
      emblaApi.off("select", dismissHint);
    };
  }, [emblaApi, isTouch, dismissHint]);

  const galleryItems = useMemo(() => {
    return shuffleArray(photos, createSeed(photos));
  }, [photos]);

  if (isTouch) {
    return (
      <div
        className="-mx-6 w-[calc(100%+3rem)] h-[80svh] overflow-hidden rounded-xl relative"
        ref={emblaRef}
      >
        <div className="flex flex-col h-full touch-pan-x">
          {galleryItems.map((photo) => (
            <figure
              key={photo.src}
              className="h-[80svh] w-full shrink-0 relative select-none"
            >
              <img
                src={photo.src}
                alt={photo.alt}
                className="w-full h-full object-cover pointer-events-none block"
              />
              <figcaption className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/20 to-transparent flex items-end justify-center p-4">
                <p className="text-white text-base font-medium text-center">
                  {photo.alt}
                </p>
              </figcaption>
            </figure>
          ))}
        </div>
        <DotIndicator selectedIndex={selectedIndex} total={total} />
        <SwipeHint visible={showHint} />
      </div>
    );
  }

  return (
    <div
      className="overflow-hidden cursor-grab active:cursor-grabbing py-8"
      ref={emblaRef}
    >
      <div className="flex gap-4 touch-pan-y items-start">
        {galleryItems.map((photo) => (
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
};

export default Gallery;
