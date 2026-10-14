import { useState } from "react";
import Globe from "./Globe";
import type { GlobePlace } from "../../data/galleryPhotos";

export default function GlobeSection({ places }: { places: GlobePlace[] }) {
  const [selected, setSelected] = useState<string | null>(null);

  return (
    <Globe
      places={places}
      selected={selected}
      onSelect={setSelected}
    />
  );
}
