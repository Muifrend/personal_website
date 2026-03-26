import { useEffect, useState } from "react";

const TOUCH_MEDIA_QUERY = "(hover: none)";

export function useIsTouchDevice(): boolean {
  const [isTouch, setIsTouch] = useState(false);

  useEffect(() => {
    if (typeof window === "undefined") return;

    const mediaQueryList = window.matchMedia(TOUCH_MEDIA_QUERY);
    const updateIsTouch = () => {
      setIsTouch(mediaQueryList.matches);
    };

    updateIsTouch();
    mediaQueryList.addEventListener("change", updateIsTouch);

    return () => {
      mediaQueryList.removeEventListener("change", updateIsTouch);
    };
  }, []);

  return isTouch;
}
