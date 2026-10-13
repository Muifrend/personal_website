import { useCallback, useEffect, useMemo, useRef, useState } from "react";
import type { KeyboardEvent, PointerEvent } from "react";
import * as d3 from "d3";
import type { GeoSphere } from "d3-geo";
import { feature } from "topojson-client";
import countries110m from "world-atlas/countries-110m.json";
import type { FeatureCollection, GeoJsonProperties, Geometry } from "geojson";
import type { GeometryCollection, Topology } from "topojson-specification";
import type { GlobePlace } from "../../data/galleryPhotos";
import { getPhotoSize } from "./globeMath";

type Props = {
  places: GlobePlace[];
  selected: string | null;
  onSelect: (id: string | null) => void;
};

type Rotation = [number, number, number];

type DragState = {
  x: number;
  y: number;
  rot: Rotation;
};

type Marker = GlobePlace & {
  x: number | null;
  y: number | null;
  visible: boolean;
};

type VisibleMarker = GlobePlace & {
  x: number;
  y: number;
  visible: true;
};

type CountriesTopology = Topology<{ countries: GeometryCollection }>;

const CX = 250;
const CY = 250;
const RADIUS = 200;
const SPHERE: GeoSphere = { type: "Sphere" };
const countriesTopology = countries110m as unknown as CountriesTopology;

const countries = feature(
  countriesTopology,
  countriesTopology.objects.countries,
) as unknown as FeatureCollection<Geometry, GeoJsonProperties>;

export default function Globe({ places, selected, onSelect }: Props) {
  const [rot, setRot] = useState<Rotation>([40, -15, 0]);
  const [auto, setAuto] = useState(true);
  const [dragging, setDragging] = useState(false);
  const dragRef = useRef<DragState | null>(null);
  const surfaceRef = useRef<HTMLDivElement>(null);
  const rotationRef = useRef(rot);
  rotationRef.current = rot;

  useEffect(() => {
    if (!auto) return;

    let raf = 0;
    let last = performance.now();

    const tick = (time: number) => {
      const dt = time - last;
      last = time;
      setRot(([lambda, pitch, gamma]) => [lambda + dt * 0.008, pitch, gamma]);
      raf = requestAnimationFrame(tick);
    };

    raf = requestAnimationFrame(tick);
    return () => cancelAnimationFrame(raf);
  }, [auto]);

  const startDrag = useCallback((x: number, y: number) => {
    setAuto(false);
    setDragging(true);
    dragRef.current = {
      x,
      y,
      rot: [...rotationRef.current] as Rotation,
    };
  }, []);

  const moveDrag = useCallback((x: number, y: number) => {
    if (!dragRef.current) return;

    const dx = x - dragRef.current.x;
    const dy = y - dragRef.current.y;
    const [lambda, pitch] = dragRef.current.rot;
    const nextLambda = lambda + dx * 0.45;
    const nextPitch = Math.max(-85, Math.min(85, pitch - dy * 0.45));

    setRot([nextLambda, nextPitch, 0]);
  }, []);

  const endDrag = useCallback(() => {
    dragRef.current = null;
    setDragging(false);
  }, []);

  useEffect(() => {
    const surface = surfaceRef.current;
    if (!surface) return;

    let touchId: number | null = null;
    let tappedMarker: string | null = null;
    let moved = false;

    const cancelTouch = () => {
      touchId = null;
      tappedMarker = null;
      endDrag();
    };
    const onTouchStart = (event: TouchEvent) => {
      if (event.touches.length !== 1) {
        cancelTouch();
        return;
      }
      if (!(event.target instanceof Element) || !event.target.closest("svg")) return;

      const touch = event.touches[0];
      touchId = touch.identifier;
      tappedMarker = event.target.closest("[data-place-id]")?.getAttribute("data-place-id") ?? null;
      moved = false;
      if (event.cancelable) event.preventDefault();
      startDrag(touch.clientX, touch.clientY);
    };
    const onTouchMove = (event: TouchEvent) => {
      if (touchId === null) return;
      const touch = Array.from(event.touches).find((touch) => touch.identifier === touchId);
      if (!touch || !dragRef.current) return;
      if (event.cancelable) event.preventDefault();
      moved ||= Math.hypot(touch.clientX - dragRef.current.x, touch.clientY - dragRef.current.y) > 6;
      moveDrag(touch.clientX, touch.clientY);
    };
    const onTouchEnd = (event: TouchEvent) => {
      if (touchId === null || !Array.from(event.changedTouches).some((touch) => touch.identifier === touchId)) return;
      if (!moved && tappedMarker) onSelect(tappedMarker);
      cancelTouch();
    };

    // Native non-passive listeners let Safari deliver the drag without scrolling the page.
    surface.addEventListener("touchstart", onTouchStart, { passive: false });
    surface.addEventListener("touchmove", onTouchMove, { passive: false });
    surface.addEventListener("touchend", onTouchEnd);
    surface.addEventListener("touchcancel", cancelTouch);
    return () => {
      surface.removeEventListener("touchstart", onTouchStart);
      surface.removeEventListener("touchmove", onTouchMove);
      surface.removeEventListener("touchend", onTouchEnd);
      surface.removeEventListener("touchcancel", cancelTouch);
    };
  }, [startDrag, moveDrag, endDrag, onSelect]);

  const onPointerDown = (event: PointerEvent<HTMLDivElement>) => {
    if (event.pointerType === "touch" || !event.isPrimary || event.button !== 0) return;
    if (!(event.target instanceof Element) || !event.target.closest("svg")) return;
    startDrag(event.clientX, event.clientY);
    try {
      event.currentTarget.setPointerCapture(event.pointerId);
    } catch {
      // A pointer may have ended before capture was requested.
      endDrag();
    }
  };

  const onPointerMove = (event: PointerEvent<HTMLDivElement>) => {
    if (event.pointerType !== "touch" && event.isPrimary) moveDrag(event.clientX, event.clientY);
  };

  const onPointerUp = (event: PointerEvent<HTMLDivElement>) => {
    if (event.pointerType !== "touch" && event.isPrimary) endDrag();
  };

  const projection = useMemo(
    () =>
      d3
        .geoOrthographic()
        .scale(RADIUS)
        .translate([CX, CY])
        .rotate(rot)
        .clipAngle(90)
        .precision(0.3),
    [rot],
  );

  const pathFn = useMemo(() => d3.geoPath(projection), [projection]);

  const graticule = useMemo(
    () => pathFn(d3.geoGraticule().step([30, 30])()),
    [pathFn],
  );

  const sphereOutline = useMemo(() => pathFn(SPHERE), [pathFn]);

  const markers: Marker[] = places.map((place) => {
    const center: [number, number] = [-rot[0], -rot[1]];
    const angularDistance = d3.geoDistance([place.lon, place.lat], center);
    const onNearSide = angularDistance < Math.PI / 2 - 0.01;
    const xy = onNearSide ? projection([place.lon, place.lat]) : null;

    return {
      ...place,
      x: xy ? xy[0] : null,
      y: xy ? xy[1] : null,
      visible: onNearSide && !!xy,
    };
  });

  const selectedMarker = markers.find((marker) => marker.id === selected);
  const selectedPhotoMarker: VisibleMarker | null =
    selectedMarker?.visible &&
    selectedMarker.x !== null &&
    selectedMarker.y !== null
      ? { ...selectedMarker, x: selectedMarker.x, y: selectedMarker.y, visible: true }
      : null;
  const photoBelow = selectedPhotoMarker ? selectedPhotoMarker.y < 200 : false;
  const selectedPhotoSize = selectedPhotoMarker
    ? getPhotoSize(selectedPhotoMarker)
    : null;

  return (
    <div
      ref={surfaceRef}
      className="relative mx-auto aspect-square w-full max-w-full touch-none select-none overflow-visible"
      onPointerDown={onPointerDown}
      onPointerMove={onPointerMove}
      onPointerUp={onPointerUp}
      onPointerCancel={onPointerUp}
      onLostPointerCapture={onPointerUp}
    >
      <svg
        className={`block h-full w-full touch-none ${dragging ? "cursor-grabbing" : "cursor-grab"}`}
        viewBox="0 0 500 500"
        role="img"
        aria-label="Interactive globe with travel photo markers"
      >
        {sphereOutline ? (
          <path d={sphereOutline} fill="oklch(0.985 0.002 247.839)" />
        ) : (
          <circle cx={CX} cy={CY} r={RADIUS} fill="oklch(0.985 0.002 247.839)" />
        )}

        {graticule && (
          <path
            d={graticule}
            fill="none"
            stroke="oklch(0.928 0.006 264.531)"
            strokeWidth="0.75"
          />
        )}

        <path
          d={pathFn(countries) ?? undefined}
          fill="oklch(0.967 0.003 264.542)"
          stroke="oklch(0.707 0.022 261.325)"
          strokeLinejoin="round"
          strokeWidth="0.5"
        />

        {sphereOutline ? (
          <path
            d={sphereOutline}
            fill="none"
            stroke="oklch(0.21 0.034 264.665)"
            strokeWidth="1.25"
          />
        ) : (
          <circle
            cx={CX}
            cy={CY}
            r={RADIUS}
            fill="none"
            stroke="oklch(0.21 0.034 264.665)"
            strokeWidth="1.25"
          />
        )}

        {markers.map((marker) => {
          if (!marker.visible || marker.x === null || marker.y === null) {
            return null;
          }

          const isSelected = selected === marker.id;
          const markerRadius = isSelected ? 7 : 4;

          const activate = (event: PointerEvent<SVGCircleElement>) => {
            if (event.pointerType === "touch") return;
            event.stopPropagation();
            event.preventDefault();
            onSelect(marker.id);
          };
          const activateFromKeyboard = (event: KeyboardEvent<SVGCircleElement>) => {
            if (event.key !== "Enter" && event.key !== " ") return;

            event.stopPropagation();
            event.preventDefault();
            onSelect(marker.id);
          };

          return (
            <g key={marker.id}>
              {isSelected && (
                <circle
                  cx={marker.x}
                  cy={marker.y}
                  r={14}
                  fill="none"
                  stroke="oklch(0.546 0.245 262.881)"
                  strokeWidth="1.25"
                  opacity="0.55"
                  className="pointer-events-none"
                />
              )}
              {isSelected && (
                <circle
                  cx={marker.x}
                  cy={marker.y}
                  r={22}
                  fill="none"
                  stroke="oklch(0.546 0.245 262.881)"
                  strokeWidth="0.75"
                  opacity="0.25"
                  className="pointer-events-none"
                />
              )}
              <circle
                cx={marker.x}
                cy={marker.y}
                r={markerRadius}
                fill={isSelected ? "oklch(0.546 0.245 262.881)" : "#000"}
                stroke="#fff"
                strokeWidth="2"
                className="pointer-events-none transition-[r,fill] duration-200"
              />
              <circle
                cx={marker.x}
                cy={marker.y}
                r={14}
                fill="transparent"
                className="cursor-pointer"
                role="button"
                tabIndex={0}
                aria-label={`Show ${marker.caption}`}
                data-place-id={marker.id}
                onPointerDown={activate}
                onKeyDown={activateFromKeyboard}
              />
            </g>
          );
        })}
      </svg>

      {selectedPhotoMarker && selectedPhotoSize && (
        <div
          className={`pointer-events-none absolute z-10 w-max max-w-none -translate-x-1/2 ${
            photoBelow ? "translate-y-[14px]" : "translate-y-[calc(-100%_-_14px)]"
          }`}
          style={{
            left: `${(selectedPhotoMarker.x / 500) * 100}%`,
            top: `${(selectedPhotoMarker.y / 500) * 100}%`,
          }}
        >
          <div
            className={`absolute left-1/2 h-3 w-px -translate-x-1/2 bg-blue-600/60 ${
              photoBelow ? "bottom-full" : "top-full"
            }`}
            aria-hidden="true"
          />
          <div
            className="pointer-events-auto relative w-max max-w-none overflow-hidden rounded-[10px] bg-white shadow-xl ring-1 ring-black/10"
            key={selectedPhotoMarker.id}
          >
            <img
              className="block max-w-none transition-opacity duration-150"
              src={selectedPhotoMarker.img}
              alt={selectedPhotoMarker.caption}
              width={selectedPhotoSize.width}
              height={selectedPhotoSize.height}
              style={{
                width: `${selectedPhotoSize.width}px`,
                height: `${selectedPhotoSize.height}px`,
              }}
            />
            <div className="pointer-events-none absolute inset-x-0 bottom-0 bg-gradient-to-t from-black/75 to-transparent px-2.5 pb-1.5 pt-[18px] font-mono text-[11px] leading-tight text-white">
              {selectedPhotoMarker.caption}
            </div>
            <button
              className="absolute right-1.5 top-1.5 flex h-[22px] w-[22px] cursor-pointer items-center justify-center rounded-full border-0 bg-black/60 text-sm leading-none text-white transition-colors hover:bg-black/85"
              aria-label="Close photo"
              onPointerDown={(event) => event.stopPropagation()}
              onClick={(event) => {
                event.stopPropagation();
                onSelect(null);
              }}
            >
              &times;
            </button>
          </div>
        </div>
      )}
    </div>
  );
}
