import type { Zone } from "../types";

const ZONE_COLORS: Record<string, string> = {
  tourist: "#e04444",
  local: "#45c880",
  food: "#e07c28",
  coffee: "#9b59b6",
  explore: "#4488e8",
  anchor: "#f5c842",
};

const ZONE_SCHEMA = `{
  "name": "string — short descriptive name",
  "type": "tourist | local | food | coffee | explore | anchor",
  "color": "hex color matching the type (tourist=#e04444, local=#45c880, food=#e07c28, coffee=#9b59b6, explore=#4488e8, anchor=#f5c842)",
  "center_lat": "number — latitude of zone center",
  "center_lng": "number — longitude of zone center",
  "radius_deg": "number — approximate radius in degrees (0.002–0.01 typical)",
  "maps_link": "string — Google Maps URL for the zone center",
  "note": "string — 1-2 sentence description of why this zone matters"
}`;

export function buildBriefPrompt(
  lat: number,
  lng: number,
  anchorName: string,
  existingZones?: Zone[]
): { systemPrompt: string; userPrompt: string } {
  const systemPrompt = `You are a travel orientation expert. You help travelers quickly understand the lay of the land in a new area.

You work with a zone-based system where areas of interest are represented as circular zones on a map. Each zone has this schema:
${ZONE_SCHEMA}

Zone types and their colors:
- tourist (${ZONE_COLORS.tourist}): Major tourist attractions and landmarks
- local (${ZONE_COLORS.local}): Neighborhoods popular with locals, authentic experiences
- food (${ZONE_COLORS.food}): Notable food streets, markets, restaurant clusters
- coffee (${ZONE_COLORS.coffee}): Cafe districts, coffee culture hotspots
- explore (${ZONE_COLORS.explore}): Interesting areas worth wandering through
- anchor (${ZONE_COLORS.anchor}): The traveler's base/hotel location

Always respond with valid JSON only — no markdown fences, no extra text outside the JSON object.`;

  let userPrompt: string;

  if (existingZones && existingZones.length > 0) {
    userPrompt = `The traveler is at "${anchorName}" (${lat}, ${lng}).

Here are the pre-defined zones for this city:
${JSON.stringify(existingZones, null, 2)}

Using ONLY these existing zones (do NOT generate new zones), write a travel orientation brief in markdown. The brief should help the traveler understand the area and navigate between zones.

Structure your brief_markdown as:
1. **Mental model** — a paragraph on how to think about this area's layout and vibe
2. **Navigation tips** — how to get around (walking, transit, taxi expectations)
3. **Zone-by-zone recommendations** — reference each zone by name with specific tips
4. **Practical tips** — transit cards, food timing, safety, weather considerations

Respond with JSON: { "brief_markdown": "..." }`;
  } else {
    userPrompt = `The traveler is at "${anchorName}" (${lat}, ${lng}).

Research this area and generate:
1. 4-7 zones of interest around this location (within reasonable walking/transit distance)
2. A travel orientation brief in markdown

Always include an "anchor" zone for the traveler's current location.

Structure the brief_markdown as:
1. **Mental model** — a paragraph on how to think about this area's layout and vibe
2. **Navigation tips** — how to get around (walking, transit, taxi expectations)
3. **Zone-by-zone recommendations** — reference each zone by name with specific tips
4. **Practical tips** — transit cards, food timing, safety, weather considerations

Respond with JSON: { "zones": [...], "brief_markdown": "..." }`;
  }

  return { systemPrompt, userPrompt };
}
