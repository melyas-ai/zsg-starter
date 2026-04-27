import { Router } from "express";

const router = Router();

router.get("/autocomplete", async (req, res) => {
  const { input, lat, lng } = req.query;
  if (!input || typeof input !== "string") {
    return res.status(400).json({ predictions: [] });
  }

  const apiKey = process.env.GOOGLE_MAPS_API_KEY;
  if (!apiKey) {
    return res.status(500).json({ error: "Google Maps not configured" });
  }

  const params = new URLSearchParams({
    input,
    key: apiKey,
    types: "geocode|establishment",
  });

  if (lat && lng) {
    params.set("location", `${lat},${lng}`);
    params.set("radius", "50000");
  }

  try {
    const response = await fetch(
      `https://maps.googleapis.com/maps/api/place/autocomplete/json?${params}`
    );
    const data = await response.json();

    const predictions = (data.predictions || []).map((p: any) => ({
      place_id: p.place_id,
      description: p.description,
      main_text: p.structured_formatting?.main_text || p.description,
      secondary_text: p.structured_formatting?.secondary_text || "",
    }));

    res.json({ predictions });
  } catch {
    res.status(500).json({ predictions: [] });
  }
});

router.get("/details", async (req, res) => {
  const { place_id } = req.query;
  if (!place_id || typeof place_id !== "string") {
    return res.status(400).json({ error: "place_id required" });
  }

  const apiKey = process.env.GOOGLE_MAPS_API_KEY;
  if (!apiKey) {
    return res.status(500).json({ error: "Google Maps not configured" });
  }

  try {
    const response = await fetch(
      `https://maps.googleapis.com/maps/api/place/details/json?place_id=${place_id}&fields=geometry,formatted_address&key=${apiKey}`
    );
    const data = await response.json();

    if (data.status !== "OK" || !data.result) {
      return res.status(404).json({ error: "Place not found" });
    }

    res.json({
      lat: data.result.geometry.location.lat,
      lng: data.result.geometry.location.lng,
      formatted_address: data.result.formatted_address,
    });
  } catch {
    res.status(500).json({ error: "Failed to get place details" });
  }
});

export default router;
