import cruiseMazuryPoland from "../assets/gallery/Cruise_Mazury_Poland.jpg";
import greatWallOfChina from "../assets/gallery/Great_Wall_Of_China.jpg";
import mumbaiIndia from "../assets/gallery/Mumbai_India.jpg";
import newYorkCityUs from "../assets/gallery/New_York_City_US.jpg";
import sanFranciscoUs from "../assets/gallery/San_Francisco_US.jpg";
import taipeiTaiwan from "../assets/gallery/Taipei_Taiwan.jpg";
import telAvivIsrael from "../assets/gallery/Tel_Aviv_Israel.jpg";
import youtubeHqUs from "../assets/gallery/Youtube_HQ_US.jpg";
import type { Place } from "./Globe";

export const PLACES: Place[] = [
  {
    id: "mumbai",
    lat: 19.076,
    lon: 72.8777,
    caption: "On the streets of Mumbai, India",
    img: mumbaiIndia.src,
    imgWidth: mumbaiIndia.width,
    imgHeight: mumbaiIndia.height,
  },
  {
    id: "nyc",
    lat: 40.7128,
    lon: -74.006,
    caption: "NYSE, USA",
    img: newYorkCityUs.src,
    imgWidth: newYorkCityUs.width,
    imgHeight: newYorkCityUs.height,
  },
  {
    id: "wall",
    lat: 40.4319,
    lon: 116.5704,
    caption: "The Great Wall of China",
    img: greatWallOfChina.src,
    imgWidth: greatWallOfChina.width,
    imgHeight: greatWallOfChina.height,
  },
  {
    id: "taipei",
    lat: 25.033,
    lon: 121.5654,
    caption: "Cityscape of Taipei, Taiwan",
    img: taipeiTaiwan.src,
    imgWidth: taipeiTaiwan.width,
    imgHeight: taipeiTaiwan.height,
  },
  {
    id: "telaviv",
    lat: 32.0853,
    lon: 34.7818,
    caption: "On the streets of Tel Aviv, Israel",
    img: telAvivIsrael.src,
    imgWidth: telAvivIsrael.width,
    imgHeight: telAvivIsrael.height,
  },
  {
    id: "sf",
    lat: 37.7749,
    lon: -122.4194,
    caption: "Oracle Park San Francisco, USA",
    img: sanFranciscoUs.src,
    imgWidth: sanFranciscoUs.width,
    imgHeight: sanFranciscoUs.height,
  },
  {
    id: "mazury",
    lat: 53.8671,
    lon: 21.3097,
    caption: "Cruising the Mazury Lakes in Poland",
    img: cruiseMazuryPoland.src,
    imgWidth: cruiseMazuryPoland.width,
    imgHeight: cruiseMazuryPoland.height,
  },
  {
    id: "youtube",
    lat: 37.6291,
    lon: -122.4282,
    caption: "YouTube Headquarters Visit, USA",
    img: youtubeHqUs.src,
    imgWidth: youtubeHqUs.width,
    imgHeight: youtubeHqUs.height,
  },
];
