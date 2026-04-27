import type { Zone } from "../lib/types";

export default function ZoneLegend({ zones, anchorName }: { zones: Zone[]; anchorName?: string }) {
  return (
    <div className="flex flex-wrap gap-3 py-3">
      {anchorName && (
        <div className="flex items-center gap-2 text-sm">
          <span className="w-3 h-3 rounded-full shrink-0" style={{ backgroundColor: "#f5c842" }} />
          <span className="text-foreground">{anchorName}</span>
          <span className="text-muted-foreground">· Base</span>
        </div>
      )}
      {zones.map((zone) => (
        <div key={zone.name} className="flex items-center gap-2 text-sm">
          <span className="w-3 h-3 rounded-full shrink-0" style={{ backgroundColor: zone.color }} />
          <span className="text-foreground">{zone.name}</span>
          <span className="text-muted-foreground">· {zone.type.charAt(0).toUpperCase() + zone.type.slice(1)}</span>
        </div>
      ))}
    </div>
  );
}
