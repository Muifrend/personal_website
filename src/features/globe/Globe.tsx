import { useEffect, useMemo, useRef, useState } from "react";
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

  const onPointerDown = (event: PointerEvent<SVGSVGElement>) => {
    setAuto(false);
    setDragging(true);
    dragRef.current = {
      x: event.clientX,
      y: event.clientY,
      rot: [...rot] as Rotation,
    };

    try {
      event.currentTarget.setPointerCapture(event.pointerId);
    } catch {
      // Pointer capture can fail on some synthetic/event-replay paths.
    }
  };

  const onPointerMove = (event: PointerEvent<SVGSVGElement>) => {
    if (!dragRef.current) return;

    const dx = event.clientX - dragRef.current.x;
    const dy = event.clientY - dragRef.current.y;
    const [lambda, pitch] = dragRef.current.rot;
    const nextLambda = lambda + dx * 0.45;
    const nextPitch = Math.max(-85, Math.min(85, pitch - dy * 0.45));

    setRot([nextLambda, nextPitch, 0]);
  };

  const onPointerUp = () => {
    dragRef.current = null;
    setDragging(false);
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
    <div className="relative mx-auto aspect-square w-full max-w-full touch-none select-none overflow-visible">
      <svg
        className={`block h-full w-full ${dragging ? "cursor-grabbing" : "cursor-grab"}`}
        viewBox="0 0 500 500"
        role="img"
        aria-label="Interactive globe with travel photo markers"
        onPointerDown={onPointerDown}
        onPointerMove={onPointerMove}
        onPointerUp={onPointerUp}
        onPointerCancel={onPointerUp}
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
