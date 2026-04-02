import React, { useMemo } from "react";
import DesktopGallery from "./gallery/DesktopGallery";
import MobileGallery from "./gallery/MobileGallery";
import { shufflePhotos } from "./gallery/galleryUtils";
import type { Photo } from "./gallery/types";
import { useMediaQuery } from "../hooks/useMediaQuery";

const DESKTOP_GALLERY_QUERY = "(min-width: 48rem)";
const COARSE_POINTER_QUERY = "(pointer: coarse)";

interface Props {
  photos: Photo[];
}

const Gallery: React.FC<Props> = ({ photos }) => {
  const isDesktopLayout = useMediaQuery(DESKTOP_GALLERY_QUERY);
  const hasCoarsePointer = useMediaQuery(COARSE_POINTER_QUERY);

  const galleryItems = useMemo(() => shufflePhotos(photos), [photos]);

  if (isDesktopLayout) {
    return <DesktopGallery photos={galleryItems} />;
  }

  return (
    <MobileGallery
      photos={galleryItems}
      showSwipeHint={hasCoarsePointer}
    />
  );
};

export default Gallery;
