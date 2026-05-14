import { useState } from "react";
import Globe from "./Globe";
import { PLACES } from "./globePlaces";

export default function GlobeSection() {
  const [selected, setSelected] = useState<string | null>(null);

  return <Globe places={PLACES} selected={selected} onSelect={setSelected} />;
}
