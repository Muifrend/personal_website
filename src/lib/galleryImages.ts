import { getImage } from "astro:assets";
import { galleryPhotos, type GlobePlace } from "../data/galleryPhotos";
import type { Photo } from "../features/gallery/types";

export async function getGalleryImages() {
  const photos: Photo[] = await Promise.all(galleryPhotos.map(async (photo) => {
    const [image, placeholder] = await Promise.all([
      getImage({
        src: photo.source,
        width: Math.min(1280, photo.width),
        widths: [400, 800, 1280].filter((width) => width <= photo.width),
        format: "webp",
        quality: 75,
      }),
      getImage({ src: photo.source, width: 80, format: "webp", quality: 45 }),
    ]);
    return {
      src: image.src,
      srcSet: image.srcSet.attribute,
      placeholderSrc: placeholder.src,
      alt: photo.alt,
      width: photo.width,
      height: photo.height,
    };
  }));

  const places: GlobePlace[] = galleryPhotos.flatMap((photo, index) => photo.globe
    ? [{
      ...photo.globe,
      caption: photo.alt,
      img: photos[index].src,
      imgWidth: photo.width,
      imgHeight: photo.height,
    }]
    : []);

  return { photos, places };
}
