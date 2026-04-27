import { Router } from "express";
import { pb } from "../db";
import type { CityDetail, Zone } from "../types";

const router = Router();

router.get("/:slug", async (req, res) => {
  try {
    const record = await pb.collection("cities").getFirstListItem(`slug="${req.params.slug}"`);
    const zoneRecords = await pb.collection("zones").getFullList({ filter: `city_slug="${req.params.slug}"` });
    const zones: Zone[] = zoneRecords.map((r) => ({
      name: r.name,
      type: r.type,
      color: r.color,
      center_lat: r.center_lat,
      center_lng: r.center_lng,
      radius_deg: r.radius_deg,
      maps_link: r.maps_link,
      note: r.note,
    }));
    const city: CityDetail = {
      name: record.name,
      slug: record.slug,
      country_slug: record.country_slug,
      map_center: record.map_center,
      map_zoom: record.map_zoom,
      overview: record.overview,
      highlights: record.highlights || [],
      zones,
    };
    res.json({ city });
  } catch {
    res.status(404).json({ error: "City not found" });
  }
});

export default router;
