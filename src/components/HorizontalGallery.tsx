import React, { useMemo } from "react";
import useEmblaCarousel from "embla-carousel-react";
import { useIsTouchDevice } from "../hooks/useIsTouchDevice";

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

const HorizontalGallery: React.FC<Props> = ({ photos }) => {
  const [emblaRef] = useEmblaCarousel({
    dragFree: true,
    containScroll: "trimSnaps",
  });
  const isTouch = useIsTouchDevice();

  // Shuffle recalculates whenever `photos` changes, and remains stable for identical input.
  const galleryItems = useMemo(() => {
    return shuffleArray(photos, createSeed(photos));
  }, [photos]);

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

            <figcaption
              className={`absolute inset-0 bg-gradient-to-t from-black/80 via-black/20 to-transparent flex items-end p-4 transition-opacity duration-300 ${
                isTouch
                  ? "opacity-100 justify-center"
                  : "opacity-0 justify-start group-hover:opacity-100"
              }`}
            >
              <p
                className={`text-white text-sm font-medium transition-transform duration-300 delay-75 ${
                  isTouch
                    ? "text-center translate-y-0"
                    : "text-left translate-y-4 group-hover:translate-y-0"
                }`}
              >
                {photo.alt}
              </p>
            </figcaption>
          </figure>
        ))}
      </div>
    </div>
  );
};

export default HorizontalGallery;
