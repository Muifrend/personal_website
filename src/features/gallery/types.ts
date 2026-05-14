import type { GalleryPhoto } from "../../data/galleryPhotos";

export type Photo = Pick<GalleryPhoto, "src" | "alt">;
