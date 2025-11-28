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

  const [focusedIndex, setFocusedIndex] = useState<number | null>(null);

  const handleToggle = (index: number) => {
    // If clicking the one already open, close it (set to null)
    // Otherwise, set it to the new index
    const canHover = window.matchMedia("(hover: hover)").matches;

    // 2. If the device can hover (Desktop), ignore the click.
    //    We want the CSS group-hover to do the work, not the click.
    if (canHover) return;
    setFocusedIndex((prev) => (prev === index ? null : index));
  };

  return (
    <div
      className="overflow-hidden cursor-grab active:cursor-grabbing py-8"
      ref={emblaRef}
    >
      <div className="flex gap-4 touch-pan-y items-start">
        {galleryItems.map((photo, index) => {
          // 2. Helper boolean to check if THIS specific slide is active
          const isActive = focusedIndex === index;

          return (
            <figure
              key={index}
              // 3. Add onClick handler to toggle state
              onClick={() => handleToggle(index)}
              className="shrink-0 relative select-none group object-scale-down sm:h-80 h-120 w-auto rounded-xl shadow-md overflow-hidden"
            >
              <img
                src={photo.src}
                alt={photo.alt}
                // 4. Update Classes:
                // We use template literals `...` to conditionally add the 'scale-105' class
                // if 'isActive' is true. 'group-hover' handles the desktop mouse interaction.
                className={`h-full max-w-full object-cover pointer-events-none block transition-transform duration-500 
                group-hover:scale-105 ${isActive ? "scale-105" : ""}`}
              />

              <figcaption
                // 5. Update Overlay:
                // Show opacity-100 if hovered OR if isActive. Otherwise opacity-0.
                className={`absolute inset-0 bg-gradient-to-t from-black/80 via-black/20 to-transparent transition-opacity duration-300 flex items-end p-4 
                ${
                  isActive ? "opacity-100" : "opacity-0 group-hover:opacity-100"
                }`}
              >
                <p
                  // 6. Update Text Slide:
                  // Slide to Y-0 if hovered OR isActive. Otherwise Y-4.
                  className={`text-white text-sm font-medium transition-transform duration-300 delay-75 
                  ${
                    isActive
                      ? "translate-y-0"
                      : "translate-y-4 group-hover:translate-y-0"
                  }`}
                >
                  {photo.alt}
                </p>
              </figcaption>
            </figure>
          );
        })}
      </div>
    </div>
  );
};

export default HorizontalGallery;
