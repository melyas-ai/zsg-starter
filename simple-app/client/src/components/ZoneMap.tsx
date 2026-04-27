import { useRef, useEffect } from "react";
import L from "leaflet";
import type { Zone } from "../lib/types";

interface ZoneMapProps {
  center: { lat: number; lng: number };
  zoom: number;
  zones: Zone[];
  anchor?: { lat: number; lng: number; name: string };
}

export default function ZoneMap({ center, zoom, zones, anchor }: ZoneMapProps) {
  const containerRef = useRef<HTMLDivElement>(null);
  const mapRef = useRef<L.Map | null>(null);

  useEffect(() => {
    if (!containerRef.current || mapRef.current) return;

    const map = L.map(containerRef.current, {
      center: [center.lat, center.lng],
      zoom,
      scrollWheelZoom: false,
      attributionControl: false,
    });

    L.tileLayer("https://{s}.basemaps.cartocdn.com/dark_all/{z}/{x}/{y}{r}.png", {
      maxZoom: 19,
    }).addTo(map);

    L.control.attribution({ position: "bottomright", prefix: false }).addTo(map);

    zones.forEach((zone) => {
      const radiusMeters = zone.radius_deg * 111000;
      const circle = L.circle([zone.center_lat, zone.center_lng], {
        radius: radiusMeters,
        color: zone.color,
        fillColor: zone.color,
        fillOpacity: 0.2,
        weight: 2,
      }).addTo(map);

      circle.bindTooltip(zone.name, {
        className: "zone-tooltip",
        direction: "top",
      });

      circle.on("click", () => {
        window.open(zone.maps_link, "_blank");
      });
    });

    if (anchor) {
      L.circleMarker([anchor.lat, anchor.lng], {
        radius: 8,
        color: "#f5c842",
        fillColor: "#f5c842",
        fillOpacity: 1,
        weight: 2,
      })
        .addTo(map)
        .bindTooltip(anchor.name, { direction: "top" });
    }

    mapRef.current = map;

    return () => {
      map.remove();
      mapRef.current = null;
    };
  }, [center, zoom, zones, anchor]);

  return <div ref={containerRef} className="w-full min-h-[300px] rounded-lg overflow-hidden border border-border" />;
}
