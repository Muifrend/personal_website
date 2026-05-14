import { useState } from "react";
import Globe from "./Globe";
import { globePlaces } from "../../data/galleryPhotos";

export default function GlobeSection() {
  const [selected, setSelected] = useState<string | null>(null);

  return (
    <Globe
      places={globePlaces}
      selected={selected}
      onSelect={setSelected}
    />
  );
}
