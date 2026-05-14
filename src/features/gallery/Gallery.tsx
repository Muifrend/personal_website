import { useMemo } from "react";
import DesktopGallery from "./DesktopGallery";
import MobileGallery from "./MobileGallery";
import { shufflePhotos } from "./galleryUtils";
import type { Photo } from "./types";
import { useMediaQuery } from "../../hooks/useMediaQuery";

const DESKTOP_GALLERY_QUERY = "(min-width: 48rem)";
const COARSE_POINTER_QUERY = "(pointer: coarse)";

interface Props {
  photos: Photo[];
}

export default function Gallery({ photos }: Props) {
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
}
