import React, { useState, useEffect } from "react";
import useEmblaCarousel from "embla-carousel-react";

// Keep shuffle logic...
interface Photo {
  src: string;
  alt: string;
}

interface Props {
  photos: Photo[];
}

function shuffleArray<T>(array: T[]): T[] {
  const newArr = [...array]; // Create a copy so we don't mutate props
  let currentIndex = newArr.length;
  let randomIndex: number;

  while (currentIndex !== 0) {
    randomIndex = Math.floor(Math.random() * currentIndex);
    currentIndex--;
    [newArr[currentIndex], newArr[randomIndex]] = [
      newArr[randomIndex],
      newArr[currentIndex],
    ];
  }
  return newArr;
}

const HorizontalGallery: React.FC<Props> = ({ photos }) => {
  const [galleryItems, setGalleryItems] = useState(photos);

  // 1. Initialize Embla.
  // dragFree: true = allows you to "throw" it like a scrollbar (momentum)
  const [emblaRef] = useEmblaCarousel({
    dragFree: true,
    containScroll: "trimSnaps",
  });

  useEffect(() => {
    setGalleryItems((prev) => shuffleArray(prev));
  }, []);

  return (
    <div
      className="overflow-hidden cursor-grab active:cursor-grabbing py-8"
      ref={emblaRef}
    >
      <div className="flex gap-4 touch-pan-y items-start">
        {galleryItems.map((photo, index) => (
          // --- 1. THE SLIDE CONTAINER ---
          // We moved the sizing (h-80), rounding, and shadow here.
          // Added 'group' so children can react to hover.
          // Added 'overflow-hidden' so the zoomed image doesn't spill out.
          <figure
            key={index}
            className="shrink-0 relative select-none group h-80 w-auto rounded-xl shadow-md overflow-hidden"
          >
            {/* --- 2. THE IMAGE --- */}
            <img
              src={photo.src}
              alt={photo.alt}
              // changed h-80/w-auto to h-full/w-full to fill the parent container
              // added transition and group-hover:scale
              className="h-full w-full object-cover pointer-events-none transition-transform duration-500 group-hover:scale-105"
            />

            {/* --- 3. THE TEXT OVERLAY Container --- */}
            {/* - absolute inset-0: Covers the whole image area
                - bg-gradient...: Adds a dark fade at the bottom so white text is readable
                - opacity-0: Hidden by default
                - group-hover:opacity-100: Shows on hover
            */}
            <figcaption className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/20 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300 flex items-end p-4">
              {/* The actual text */}
              {/* Added a small translate effect so it slides up slightly */}
              <p className="text-white text-sm font-medium translate-y-4 group-hover:translate-y-0 transition-transform duration-300 delay-75">
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
