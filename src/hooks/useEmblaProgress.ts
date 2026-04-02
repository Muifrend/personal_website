import { useCallback, useEffect, useState } from "react";
import type { EmblaCarouselType } from "embla-carousel";

interface EmblaProgress {
  selectedIndex: number;
  total: number;
}

export function useEmblaProgress(
  emblaApi: EmblaCarouselType | undefined,
): EmblaProgress {
  const [selectedIndex, setSelectedIndex] = useState(0);
  const [total, setTotal] = useState(0);

  const onSelect = useCallback((api: EmblaCarouselType) => {
    setSelectedIndex(api.selectedScrollSnap());
  }, []);

  const onInit = useCallback((api: EmblaCarouselType) => {
    setTotal(api.scrollSnapList().length);
    setSelectedIndex(api.selectedScrollSnap());
  }, []);

  useEffect(() => {
    if (!emblaApi) return;

    onInit(emblaApi);
    emblaApi.on("select", onSelect);
    emblaApi.on("reInit", onInit);

    return () => {
      emblaApi.off("select", onSelect);
      emblaApi.off("reInit", onInit);
    };
  }, [emblaApi, onInit, onSelect]);

  return { selectedIndex, total };
}
