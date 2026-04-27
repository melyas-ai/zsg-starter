import type { Zone } from "../lib/types";

const TYPE_EMOJI: Record<string, string> = {
  tourist: "🔴",
  local: "🟢",
  food: "🟠",
  coffee: "🟣",
  explore: "🔵",
  anchor: "🟡",
};

export default function ZoneCard({ zone }: { zone: Zone }) {
  return (
    <div className="bg-card rounded-lg p-4 border-l-4" style={{ borderLeftColor: zone.color }}>
      <div className="flex items-center justify-between mb-2">
        <a
          href={zone.maps_link}
          target="_blank"
          rel="noopener noreferrer"
          className="text-foreground font-medium hover:text-primary transition-colors"
        >
          {zone.name} ↗
        </a>
        <span className="text-sm text-muted-foreground">
          {TYPE_EMOJI[zone.type] || "⚪"} {zone.type.charAt(0).toUpperCase() + zone.type.slice(1)}
        </span>
      </div>
      <p className="text-sm text-muted-foreground">{zone.note}</p>
    </div>
  );
}
