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

const ROUTE_COLOR = "#6b7280"; // gray-500

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
    <div className="relative w-full rounded-2xl overflow-hidden border border-gray-700 bg-gray-900 ring-2 ring-primary/20 shadow-[0_0_0_1px_rgba(0,0,0,0.2),0_4px_6px_-1px_rgba(0,0,0,0.2),0_12px_24px_-4px_rgba(0,0,0,0.3),0_24px_48px_-8px_rgba(0,0,0,0.4),0_48px_96px_-32px_rgba(0,0,0,0.5),0_96px_192px_-32px_rgba(0,0,0,0.5)]">
      <Map
          theme="dark"
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
              width={2}
              opacity={0.7}
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
                    ? "h-5 w-5 rounded-full border-2 border-gray-400 bg-gray-500 shadow-md"
                    : "h-3 w-3 rounded-full border border-gray-200 bg-white shadow-[0_0_12px_rgba(255,255,255,0.9),0_0_24px_rgba(255,255,255,0.5)]"
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
