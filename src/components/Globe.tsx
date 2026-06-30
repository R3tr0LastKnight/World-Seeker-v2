"use client";

import createGlobe from "cobe";
import { useEffect, useRef } from "react";
import { RiMapPin3Fill } from "react-icons/ri";
import { Listing } from "@/types/listing";

type GlobeMarker = {
  location: [number, number];
  size: number;
  id: string;
  label: string;
};

type Props = {
  listings: Listing[];
  onMarkerClick: (idx: string) => void;
};

function listingsToMarkers(listings: Listing[]): GlobeMarker[] {
  return listings
    .filter((l) => l.location && l.idx && l.label)
    .map((l) => ({
      location: l.location as [number, number],
      size: l.size ?? 0.001,
      id: l.idx,
      label: l.label,
    }));
}

export default function Globe({ listings, onMarkerClick }: Props) {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const markersRef = useRef<GlobeMarker[]>(listingsToMarkers(listings));
  markersRef.current = listingsToMarkers(listings);

  const basePhiRef = useRef(0);
  const baseThetaRef = useRef(0.25);
  const phiRef = useRef(0);
  const thetaRef = useRef(0.25);

  const pointerStartRef = useRef<{ x: number; y: number } | null>(null);
  const dragPhiRef = useRef(0);
  const dragThetaRef = useRef(0);
  const dragPhiTargetRef = useRef(0);
  const dragThetaTargetRef = useRef(0);

  const isDraggingRef = useRef(false);
  const isHoveringRef = useRef(false);

  const VISIBLE_COUNT = 12;

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    const toCobeMarkers = (ms: GlobeMarker[]) =>
      ms.map(({ location, size, id }) => ({ location, size, id }));

    const globe = createGlobe(canvas, {
      devicePixelRatio: 2,
      width: 1200,
      height: 1200,
      phi: 0,
      theta: 0.25,
      dark: 1,
      diffuse: 1.2,
      mapSamples: 20000,
      mapBrightness: 16,
      mapBaseBrightness: 0.1,
      baseColor: [0.3, 0.3, 0.3],
      glowColor: [1, 1, 1],
      markerColor: [0.3, 0.3, 0.3],
      markers: toCobeMarkers(markersRef.current),
      markerElevation: 0.002,
    });

    let animationFrame: number;

    function animate() {
      dragPhiRef.current +=
        (dragPhiTargetRef.current - dragPhiRef.current) * 0.1;
      dragThetaRef.current +=
        (dragThetaTargetRef.current - dragThetaRef.current) * 0.1;

      if (!isDraggingRef.current && !isHoveringRef.current) {
        basePhiRef.current += 0.002;
      }

      phiRef.current = basePhiRef.current + dragPhiRef.current;
      const rawTheta = baseThetaRef.current + dragThetaRef.current;
      thetaRef.current = Math.max(
        -Math.PI / 2,
        Math.min(Math.PI / 2, rawTheta),
      );

      globe.update({
        phi: phiRef.current,
        theta: thetaRef.current,
        markers: toCobeMarkers(markersRef.current),
      });

      animationFrame = requestAnimationFrame(animate);
    }

    animate();

    return () => {
      cancelAnimationFrame(animationFrame);
      globe.destroy();
    };
  }, []);

  const handlePointerDown = (e: React.PointerEvent<HTMLCanvasElement>) => {
    isDraggingRef.current = true;
    pointerStartRef.current = { x: e.clientX, y: e.clientY };
    canvasRef.current?.setPointerCapture(e.pointerId);
  };

  const handlePointerMove = (e: React.PointerEvent<HTMLCanvasElement>) => {
    if (!pointerStartRef.current) return;
    const dx = e.clientX - pointerStartRef.current.x;
    const dy = e.clientY - pointerStartRef.current.y;
    dragPhiTargetRef.current = dx / 200;
    dragThetaTargetRef.current = dy / 300;
  };

  const handlePointerUp = () => {
    basePhiRef.current += dragPhiRef.current;
    baseThetaRef.current = Math.max(
      -Math.PI / 2,
      Math.min(Math.PI / 2, baseThetaRef.current + dragThetaRef.current),
    );
    dragPhiRef.current = 0;
    dragThetaRef.current = 0;
    dragPhiTargetRef.current = 0;
    dragThetaTargetRef.current = 0;
    pointerStartRef.current = null;
    isDraggingRef.current = false;
  };

  const markers = markersRef.current;

  return (
    <div
      className="relative w-[600px] max-w-full aspect-square"
      onMouseEnter={() => (isHoveringRef.current = true)}
      onMouseLeave={() => (isHoveringRef.current = false)}
    >
      <canvas
        ref={canvasRef}
        onPointerDown={handlePointerDown}
        onPointerMove={handlePointerMove}
        onPointerUp={handlePointerUp}
        className="w-full h-full cursor-grab active:cursor-grabbing [contain:layout_paint_size]"
      />

      {markers.map((m) => (
        <div key={m.id} className="group">
          <div
            className="absolute z-10 -translate-x-1/2 -translate-y-1/2 cursor-pointer pointer-events-auto"
            style={
              {
                positionAnchor: `--cobe-${m.id}`,
                top: "anchor(center)",
                left: "anchor(center)",
                opacity: `var(--cobe-visible-${m.id}, 0)`,
              } as React.CSSProperties
            }
            onClick={() => onMarkerClick(m.id)}
          >
            <RiMapPin3Fill className="h-5 w-5 text-white drop-shadow-md transition-transform duration-150 group-hover:scale-125 group-hover:text-sky-300" />
          </div>

          <div
            className="absolute z-20 -translate-x-1/2 mb-3 pointer-events-none rounded-md bg-black/75 px-2 py-1 text-xs font-medium text-white whitespace-nowrap shadow-md transition-opacity duration-150"
            style={
              {
                positionAnchor: `--cobe-${m.id}`,
                bottom: "anchor(top)",
                left: "anchor(center)",
                opacity: `var(--cobe-visible-${m.id}, 0)`,
              } as React.CSSProperties
            }
          >
            {m.label}
          </div>
        </div>
      ))}
    </div>
  );
}
