export interface lscImage {
  name: string;
  distance: number;
  url: string;
  hdurl: string;
  semanticTime: string;
  utcTime: string;
  location: string;
  caption: string;
}

import { uImage } from "@/schema/simple";

export function convertLscImageToUImage(image: lscImage): uImage {
  return {
    name: image.name,
    distance: image.distance,
    url: image.url,
    hdurl: image.hdurl,
    titles: [
      "id: " + image.location,
      "segment: " + image.utcTime,
      "tags: " + image.caption,
    ].filter(Boolean),
  };
}
