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

  const [isTouch, setIsTouch] = useState(false);

useEffect(() => {
  // Check if the device lacks hover capability (phones/tablets)
  setIsTouch(window.matchMedia('(hover: none)').matches);
}, []);

  return (
  <div
    className="overflow-hidden cursor-grab active:cursor-grabbing py-8"
    ref={emblaRef}
  >
    <div className="flex gap-4 touch-pan-y items-start">
      {galleryItems.map((photo, index) => (
        <figure
          key={index}
          className="shrink-0 relative select-none group object-scale-down sm:h-80 h-120 w-auto rounded-xl shadow-md overflow-hidden"
        >
          <img
            src={photo.src}
            alt={photo.alt}
            className="h-full max-w-full object-cover pointer-events-none block transition-transform duration-500 group-hover:scale-105"
          />

          <figcaption
            // --- LOGIC CHANGE 1: CONTAINER ALIGNMENT & VISIBILITY ---
            // We use a template literal to switch classes based on 'isTouch'.
            // Mobile: opacity-100 (always visible), justify-center (center content horizontally)
            // Desktop: opacity-0 (hidden until hover), justify-start (left align)
            className={`absolute inset-0 bg-gradient-to-t from-black/80 via-black/20 to-transparent flex items-end p-4 transition-opacity duration-300
              ${isTouch 
                ? "opacity-100 justify-center" 
                : "opacity-0 justify-start group-hover:opacity-100"
              }`}
          >
            <p
              // --- LOGIC CHANGE 2: TEXT ALIGNMENT & ANIMATION ---
              // Mobile: text-center, translate-y-0 (no slide animation needed, it's static)
              // Desktop: text-left, translate-y-4 (slide up on hover)
              className={`text-white text-sm font-medium transition-transform duration-300 delay-75
                ${isTouch 
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
