import React, { useState, useEffect } from 'react';

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

  // 3. Use useEffect to trigger the shuffle ONLY in the browser
  useEffect(() => {
    setGalleryItems(prev => shuffleArray(prev));
  }, []); // Empty dependency array [] means "run once on mount"

  return (
    // 1. The Scroll Container
    <div className="w-full overflow-x-auto pb-4">
      {/* 2. The Flex Wrapper */}
      <div className="flex gap-4 px-4 snap-x snap-mandatory">
        {galleryItems.map((photo, index) => (
          <div
            key={index}
            // 3. CRITICAL: 'shrink-0' stops the image from squishing
            // 'snap-center' makes it lock into place when scrolling stops
            className="shrink-0 snap-center relative"
          >
            <img
              src={photo.src}
              alt={photo.alt}
              // Adjust 'h-80' (320px) to whatever height you want the row to be
              className="h-80 w-auto rounded-xl shadow-md object-cover"
              loading="lazy"
            />
          </div>
        ))}
      </div>
    </div>
  );
};

export default HorizontalGallery;
