import { Router } from "express";
import { pb } from "../db";
import type { CountryCard, CountryDetail, CityCard } from "../types";

const router = Router();

router.get("/", async (_req, res) => {
  try {
    const records = await pb.collection("countries").getFullList();
    const countries: CountryCard[] = records.map((r) => ({
      name: r.name,
      slug: r.slug,
      map_center: r.map_center,
      map_zoom: r.map_zoom,
    }));
    res.json({ countries });
  } catch (e) {
    res.status(500).json({ error: "Failed to fetch countries" });
  }
});

router.get("/:slug", async (req, res) => {
  try {
    const record = await pb.collection("countries").getFirstListItem(`slug="${req.params.slug}"`);
    const cityRecords = await pb.collection("cities").getFullList({ filter: `country_slug="${req.params.slug}"` });
    const cities: CityCard[] = cityRecords.map((r) => ({
      name: r.name,
      slug: r.slug,
      country_slug: r.country_slug,
      map_center: r.map_center,
      map_zoom: r.map_zoom,
    }));
    const country: CountryDetail = {
      name: record.name,
      slug: record.slug,
      map_center: record.map_center,
      map_zoom: record.map_zoom,
      overview: record.overview,
      quick_facts: record.quick_facts,
      cities,
    };
    res.json({ country });
  } catch {
    res.status(404).json({ error: "Country not found" });
  }
});

router.get("/:slug/cities", async (req, res) => {
  try {
    const records = await pb.collection("cities").getFullList({ filter: `country_slug="${req.params.slug}"` });
    const cities: CityCard[] = records.map((r) => ({
      name: r.name,
      slug: r.slug,
      country_slug: r.country_slug,
      map_center: r.map_center,
      map_zoom: r.map_zoom,
    }));
    res.json({ cities });
  } catch {
    res.status(500).json({ error: "Failed to fetch cities" });
  }
});

export default router;
