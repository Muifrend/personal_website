import type { GlobePlace } from "../../data/galleryPhotos";

const PHOTO_TARGET_AREA = 54000;
const PHOTO_MAX_EDGE = 270;

export function getPhotoSize({
  imgWidth,
  imgHeight,
}: Pick<GlobePlace, "imgWidth" | "imgHeight">) {
  const aspectRatio = imgWidth / imgHeight;
  const rawWidth = Math.sqrt(PHOTO_TARGET_AREA * aspectRatio);
  const rawHeight = Math.sqrt(PHOTO_TARGET_AREA / aspectRatio);
  const scale = Math.min(1, PHOTO_MAX_EDGE / Math.max(rawWidth, rawHeight));

  return {
    width: Math.round(rawWidth * scale),
    height: Math.round(rawHeight * scale),
  };
}
