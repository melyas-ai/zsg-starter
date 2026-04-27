import { useRef, useEffect } from "react";
import L from "leaflet";
import type { Zone } from "../lib/types";

interface CityMarker {
  lat: number;
  lng: number;
  name: string;
  slug: string;
}

interface ZoneMapProps {
  center: { lat: number; lng: number };
  zoom: number;
  zones: Zone[];
  anchor?: { lat: number; lng: number; name: string };
  cityMarkers?: CityMarker[];
  onCityClick?: (slug: string) => void;
}

export default function ZoneMap({ center, zoom, zones, anchor, cityMarkers, onCityClick }: ZoneMapProps) {
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

    const zonesPane = map.createPane("zones");
    zonesPane.style.zIndex = "350";

    L.tileLayer("https://{s}.basemaps.cartocdn.com/dark_nolabels/{z}/{x}/{y}{r}.png", {
      maxZoom: 19,
    }).addTo(map);

    if (!cityMarkers || cityMarkers.length === 0) {
      L.tileLayer("https://{s}.basemaps.cartocdn.com/dark_only_labels/{z}/{x}/{y}{r}.png", {
        maxZoom: 19,
        pane: "overlayPane",
      }).addTo(map);
    }

    L.control.attribution({ position: "bottomright", prefix: false }).addTo(map);

    zones.forEach((zone) => {
      const radiusMeters = zone.radius_deg * 111000;
      const circle = L.circle([zone.center_lat, zone.center_lng], {
        pane: "zones",
        radius: radiusMeters,
        color: zone.color,
        fillColor: zone.color,
        fillOpacity: 0.3,
        weight: 2.5,
      }).addTo(map);

      circle.bindTooltip(zone.name, {
        permanent: zones.length <= 8,
        className: "zone-label",
        direction: "center",
      });

      circle.on("click", () => {
        window.open(zone.maps_link, "_blank");
      });
    });

    if (cityMarkers) {
      const pixelsPerDeg = 256 * Math.pow(2, zoom) / 360;
      const degThreshold = 80 / pixelsPerDeg;
      const dirOffsets: Record<string, [number, number]> = {
        right: [12, 0],
        left: [-12, 0],
        top: [0, -12],
        bottom: [0, 12],
      };

      const labelDirs: Array<"right" | "left" | "top" | "bottom"> = cityMarkers.map((city, i) => {
        const neighbors: CityMarker[] = [];
        for (let j = 0; j < cityMarkers.length; j++) {
          if (j === i) continue;
          const dist = Math.sqrt(
            Math.pow(city.lat - cityMarkers[j].lat, 2) +
            Math.pow(city.lng - cityMarkers[j].lng, 2)
          );
          if (dist < degThreshold) neighbors.push(cityMarkers[j]);
        }
        if (neighbors.length === 0) return "right";
        let avgDLat = 0, avgDLng = 0;
        for (const n of neighbors) {
          avgDLat += n.lat - city.lat;
          avgDLng += n.lng - city.lng;
        }
        if (Math.abs(avgDLng) > Math.abs(avgDLat)) {
          return avgDLng > 0 ? "left" : "right";
        }
        return avgDLat > 0 ? "bottom" : "top";
      });

      cityMarkers.forEach((city, i) => {
        const dir = labelDirs[i];
        const marker = L.circleMarker([city.lat, city.lng], {
          radius: 7,
          color: "#f5c842",
          fillColor: "#f5c842",
          fillOpacity: 0.9,
          weight: 2,
        }).addTo(map);

        marker.bindTooltip(city.name, {
          permanent: true,
          className: "city-label",
          direction: dir,
          offset: dirOffsets[dir] as [number, number],
        });

        if (onCityClick) {
          marker.on("click", () => onCityClick(city.slug));
          const el = marker.getElement();
          if (el) (el as HTMLElement).style.cursor = "pointer";
        }
      });
    }

    if (anchor) {
      L.circleMarker([anchor.lat, anchor.lng], {
        radius: 9,
        color: "#f5c842",
        fillColor: "#f5c842",
        fillOpacity: 1,
        weight: 3,
      })
        .addTo(map)
        .bindTooltip(anchor.name, { permanent: true, className: "anchor-label", direction: "right", offset: [10, 0] });
    }

    mapRef.current = map;

    return () => {
      map.remove();
      mapRef.current = null;
    };
  }, [center, zoom, zones, anchor, cityMarkers, onCityClick]);

  return <div ref={containerRef} className="w-full min-h-[400px] rounded-lg overflow-hidden border border-border" />;
}
