import cruiseMazuryPoland from "../assets/gallery/Cruise_Mazury_Poland.webp";
import greatWallOfChina from "../assets/gallery/Great_Wall_Of_China.webp";
import mumbaiIndia from "../assets/gallery/Mumbai_India.webp";
import newYorkCityUs from "../assets/gallery/New_York_City_US.webp";
import sanFranciscoUs from "../assets/gallery/San_Francisco_US.webp";
import taipeiTaiwan from "../assets/gallery/Taipei_Taiwan.webp";
import telAvivIsrael from "../assets/gallery/Tel_Aviv_Israel.webp";
import youtubeHqUs from "../assets/gallery/Youtube_HQ_US.webp";

type ImportedImage = {
  src: string;
  width: number;
  height: number;
};

export type GalleryPhoto = {
  src: string;
  alt: string;
  width: number;
  height: number;
  globe?: {
    id: string;
    lat: number;
    lon: number;
  };
};

export type GlobePlace = {
  id: string;
  lat: number;
  lon: number;
  caption: string;
  img: string;
  imgWidth: number;
  imgHeight: number;
};

function createGalleryPhoto(
  image: ImportedImage,
  alt: string,
  globe?: GalleryPhoto["globe"],
): GalleryPhoto {
  return {
    src: image.src,
    alt,
    width: image.width,
    height: image.height,
    globe,
  };
}

export const galleryPhotos: GalleryPhoto[] = [
  createGalleryPhoto(mumbaiIndia, "On the streets of Mumbai, India", {
    id: "mumbai",
    lat: 19.076,
    lon: 72.8777,
  }),
  createGalleryPhoto(newYorkCityUs, "NYSE, USA", {
    id: "nyc",
    lat: 40.7128,
    lon: -74.006,
  }),
  createGalleryPhoto(greatWallOfChina, "The Great Wall of China", {
    id: "wall",
    lat: 40.4319,
    lon: 116.5704,
  }),
  createGalleryPhoto(taipeiTaiwan, "Cityscape of Taipei, Taiwan", {
    id: "taipei",
    lat: 25.033,
    lon: 121.5654,
  }),
  createGalleryPhoto(telAvivIsrael, "On the streets of Tel Aviv, Israel", {
    id: "telaviv",
    lat: 32.0853,
    lon: 34.7818,
  }),
  createGalleryPhoto(sanFranciscoUs, "Oracle Park San Francisco, USA", {
    id: "sf",
    lat: 37.7749,
    lon: -122.4194,
  }),
  createGalleryPhoto(cruiseMazuryPoland, "Cruising the Mazury Lakes in Poland", {
    id: "mazury",
    lat: 53.8671,
    lon: 21.3097,
  }),
  createGalleryPhoto(youtubeHqUs, "YouTube Headquarters Visit, USA", {
    id: "youtube",
    lat: 37.6291,
    lon: -122.4282,
  }),
];

export const globePlaces: GlobePlace[] = galleryPhotos.flatMap((photo) =>
  photo.globe
    ? [
        {
          id: photo.globe.id,
          lat: photo.globe.lat,
          lon: photo.globe.lon,
          caption: photo.alt,
          img: photo.src,
          imgWidth: photo.width,
          imgHeight: photo.height,
        },
      ]
    : [],
);
