import type { Photo } from "./types";

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

  for (
    let currentIndex = newArr.length - 1;
    currentIndex > 0;
    currentIndex -= 1
  ) {
    const randomIndex = Math.floor(random() * (currentIndex + 1));
    [newArr[currentIndex], newArr[randomIndex]] = [
      newArr[randomIndex],
      newArr[currentIndex],
    ];
  }

  return newArr;
}

export function shufflePhotos(photos: Photo[]): Photo[] {
  return shuffleArray(photos, createSeed(photos));
}
