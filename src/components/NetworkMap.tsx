"use client";

import { useEffect } from "react";
import {
  Map,
  MapMarker,
  MarkerContent,
  MapRoute,
  useMap,
} from "@/components/ui/map";
import { useIsMobile } from "@/hooks/use-mobile";

const LOCATIONS = [
  { name: "East Lansing", longitude: -84.482988, latitude: 42.72656, isHome: true },
  { name: "Detroit", longitude: -83.0458, latitude: 42.3314, isHome: false },
  { name: "Chicago", longitude: -87.6298, latitude: 41.8781, isHome: false },
  { name: "Boston", longitude: -71.0589, latitude: 42.3601, isHome: false },
  { name: "New York City", longitude: -74.006, latitude: 40.7128, isHome: false },
  { name: "Atlanta", longitude: -84.388, latitude: 33.749, isHome: false },
  { name: "Houston", longitude: -95.3698, latitude: 29.7604, isHome: false },
  { name: "Austin", longitude: -97.7431, latitude: 30.2672, isHome: false },
  { name: "Seattle", longitude: -122.3321, latitude: 47.6062, isHome: false },
  { name: "San Francisco", longitude: -122.4194, latitude: 37.7749, isHome: false },
  { name: "Palo Alto", longitude: -122.143, latitude: 37.4419, isHome: false },
  { name: "Mountain View", longitude: -122.0838, latitude: 37.3861, isHome: false },
  { name: "Los Angeles", longitude: -118.2437, latitude: 34.0522, isHome: false },
  { name: "San Diego", longitude: -117.1611, latitude: 32.7157, isHome: false },
] as const;

const ROUTES: [number, number][][] = LOCATIONS.filter((l) => !l.isHome).map(
  (loc) => [
    [LOCATIONS[0].longitude, LOCATIONS[0].latitude],
    [loc.longitude, loc.latitude],
  ]
);

const ROUTE_COLOR = "#cbd5e1"; // very faint gray (slate-300)

const DESKTOP_ZOOM = 3;
const MOBILE_ZOOM = 1.8;
const CENTER: [number, number] = [-98, 39];

/** Zooms to desktop view once map is loaded (so mobile keeps zoomed-out initial view). */
function DesktopZoomToBounds() {
  const { map, isLoaded } = useMap();
  const isMobile = useIsMobile();
  useEffect(() => {
    if (!isLoaded || !map || isMobile) return;
    map.flyTo({ center: CENTER, zoom: DESKTOP_ZOOM, duration: 0 });
  }, [isLoaded, map, isMobile]);
  return null;
}

export default function NetworkMap() {
  return (
    <div className="relative w-full rounded-3xl overflow-hidden border border-border/80 bg-background shadow-xl shadow-black/5 ring-1 ring-black/[0.04]">
      <Map
          theme="light"
          styles={{
            light: "https://basemaps.cartocdn.com/gl/positron-gl-style/style.json",
          }}
          viewport={{
            center: CENTER,
            zoom: MOBILE_ZOOM,
            bearing: 0,
            pitch: 0,
          }}
          attributionControl={false}
          className="h-[400px] md:h-[480px] w-full"
        >
          <DesktopZoomToBounds />
          {ROUTES.map((coords, i) => (
            <MapRoute
              key={i}
              coordinates={coords}
              color={ROUTE_COLOR}
              width={3.5}
              opacity={0.5}
              dashArray={[3, 3]}
            />
          ))}
          {LOCATIONS.map((loc) => (
            <MapMarker
              key={loc.name}
              longitude={loc.longitude}
              latitude={loc.latitude}
            >
              <MarkerContent
                className={`pointer-events-none ${
                  loc.isHome
                    ? "h-5 w-5 rounded-full bg-gray-600 border-2 border-gray-400 shadow-md"
                    : "h-2.5 w-2.5 rounded-full bg-primary shadow-[0_0_0_2px_rgba(224,124,74,0.45),0_0_6px_4px_rgba(224,124,74,0.3),0_0_12px_8px_rgba(224,124,74,0.15)]"
                }`}
              >
                {/* Explicit child prevents default blue dot from rendering */}
                <span className="sr-only">{loc.name}</span>
              </MarkerContent>
            </MapMarker>
          ))}
        </Map>
    </div>
  );
}
