import { Router } from "express";
import rateLimit from "express-rate-limit";
import { nanoid } from "nanoid";
import { pb } from "../db";
import { chatCompletion } from "../lib/llm";
import { buildBriefPrompt } from "../lib/brief-prompt";
import type { BriefDetail, Zone } from "../types";

const router = Router();

const generateLimiter = rateLimit({
  windowMs: 60 * 1000,
  max: 10,
  message: { error: "Too many requests, please try again later" },
});

router.post("/generate", generateLimiter, async (req, res) => {
  const { lat, lng, anchor_name, city_slug } = req.body;

  if (typeof lat !== "number" || typeof lng !== "number") {
    return res.status(400).json({ error: "lat and lng are required numbers" });
  }

  const briefId = nanoid(12);
  let zones: Zone[];
  let briefMarkdown: string;
  let generatedBy: "seeded" | "ai";
  let countrySlug: string | null = null;

  try {
    if (city_slug) {
      const cityRecord = await pb.collection("cities").getFirstListItem(`slug="${city_slug}"`);
      countrySlug = cityRecord.country_slug;
      const zoneRecords = await pb.collection("zones").getFullList({ filter: `city_slug="${city_slug}"` });
      zones = zoneRecords.map((r) => ({
        name: r.name, type: r.type, color: r.color,
        center_lat: r.center_lat, center_lng: r.center_lng,
        radius_deg: r.radius_deg, maps_link: r.maps_link, note: r.note,
      }));
      const { systemPrompt, userPrompt } = buildBriefPrompt(lat, lng, anchor_name || "Your Location", zones);
      const result = await chatCompletion(systemPrompt, userPrompt, 2000);
      const jsonMatch = result.text.match(/\{[\s\S]*\}/);
      briefMarkdown = jsonMatch ? JSON.parse(jsonMatch[0]).brief_markdown : result.text;
      generatedBy = "seeded";
    } else {
      const { systemPrompt, userPrompt } = buildBriefPrompt(lat, lng, anchor_name || "Your Location");
      const result = await chatCompletion(systemPrompt, userPrompt, 4000);
      const text = result.text;
      const jsonMatch = text.match(/\{[\s\S]*\}/);
      if (!jsonMatch) throw new Error("Failed to parse AI response");
      const parsed = JSON.parse(jsonMatch[0]);
      zones = parsed.zones;
      briefMarkdown = parsed.brief_markdown;
      generatedBy = "ai";
    }

    await pb.collection("briefs").create({
      brief_id: briefId,
      anchor_name: anchor_name || "Your Location",
      anchor_lat: lat,
      anchor_lng: lng,
      city_slug: city_slug || null,
      country_slug: countrySlug,
      zones,
      brief_markdown: briefMarkdown,
      generated_by: generatedBy,
    });

    const brief: BriefDetail = {
      id: briefId,
      anchor_name: anchor_name || "Your Location",
      anchor_lat: lat, anchor_lng: lng,
      city_slug: city_slug || null,
      country_slug: countrySlug,
      zones, brief_markdown: briefMarkdown,
      generated_by: generatedBy,
      created_at: new Date().toISOString(),
    };

    res.json({ brief });
  } catch (e) {
    const message = e instanceof Error ? e.message : "Unknown error";
    console.error("Brief generation error:", message);
    if (message.includes("timeout") || message.includes("ETIMEDOUT") || message.includes("abort")) {
      return res.status(504).json({ error: "Generation timed out, please try again" });
    }
    if (message.includes("not configured")) {
      return res.status(500).json({ error: "AI service not configured — set OPENROUTER_API_KEY in .env" });
    }
    res.status(500).json({ error: "Failed to generate brief" });
  }
});

router.get("/:id", async (req, res) => {
  try {
    const record = await pb.collection("briefs").getFirstListItem(`brief_id="${req.params.id}"`);
    const brief: BriefDetail = {
      id: record.brief_id,
      anchor_name: record.anchor_name,
      anchor_lat: record.anchor_lat,
      anchor_lng: record.anchor_lng,
      city_slug: record.city_slug || null,
      country_slug: record.country_slug || null,
      zones: record.zones,
      brief_markdown: record.brief_markdown,
      generated_by: record.generated_by,
      created_at: record.created,
    };
    res.json({ brief });
  } catch {
    res.status(404).json({ error: "Brief not found" });
  }
});

export default router;
