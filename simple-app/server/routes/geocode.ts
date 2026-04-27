import { Router } from "express";

const router = Router();

router.post("/", async (req, res) => {
  const { address } = req.body;
  if (!address || typeof address !== "string") {
    return res.status(400).json({ error: "Address is required" });
  }

  const apiKey = process.env.GOOGLE_MAPS_API_KEY;
  if (!apiKey) {
    return res.status(500).json({ error: "Geocoding service not configured" });
  }

  try {
    const url = `https://maps.googleapis.com/maps/api/geocode/json?address=${encodeURIComponent(address)}&key=${apiKey}`;
    const response = await fetch(url);
    const data = await response.json();

    if (data.status !== "OK" || !data.results?.length) {
      return res.status(404).json({ error: "Could not find that address" });
    }

    const result = data.results[0];
    res.json({
      lat: result.geometry.location.lat,
      lng: result.geometry.location.lng,
      formatted_address: result.formatted_address,
    });
  } catch {
    res.status(500).json({ error: "Geocoding request failed" });
  }
});

export default router;
