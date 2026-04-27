# Travel Orientation App — Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Build a phone-first travel orientation web app with three standalone experiences (country, city, address brief) on top of the existing simple-app stack.

**Architecture:** React + Vite + Tailwind frontend with React Router v6, Express backend proxying Google Maps geocoding and Claude API, PocketBase database with pre-seeded data for China (7 cities) and Turkey (Istanbul). Leaflet.js renders interactive maps with CartoDB Dark Matter tiles.

**Tech Stack:** React 18, React Router v6, Tailwind CSS, Leaflet.js, Express, PocketBase, Claude API (Sonnet), Google Geocoding API, nanoid.

**Spec:** `docs/superpowers/specs/2026-04-27-travel-orientation-app-design.md`

---

## File Structure

### Server files (simple-app/server/)

| File | Responsibility |
|------|---------------|
| `server/index.ts` | Modify — add PocketBase connection |
| `server/env.ts` | Existing — loads .env |
| `server/vite.ts` | Existing — no changes |
| `server/routes.ts` | Modify — register all API route modules |
| `server/db.ts` | Create — PocketBase client singleton |
| `server/seed.ts` | Create — standalone script to populate PocketBase collections |
| `server/routes/countries.ts` | Create — GET /api/countries, GET /api/countries/:slug, GET /api/countries/:slug/cities |
| `server/routes/cities.ts` | Create — GET /api/cities/:slug |
| `server/routes/geocode.ts` | Create — POST /api/geocode (proxy to Google) |
| `server/routes/briefs.ts` | Create — POST /api/brief/generate, GET /api/brief/:id |
| `server/lib/claude.ts` | Create — Claude API client for brief generation |
| `server/lib/brief-prompt.ts` | Create — prompt template for AI brief generation |
| `server/types.ts` | Create — shared TypeScript types (CountryCard, CityCard, Zone, BriefDetail, etc.) |

### Client files (simple-app/client/src/)

| File | Responsibility |
|------|---------------|
| `client/src/main.tsx` | Modify — wrap App in BrowserRouter |
| `client/src/App.tsx` | Rewrite — route definitions, layout shell |
| `client/src/index.css` | Modify — replace theme with Dark Atlas colors |
| `client/src/lib/api.ts` | Create — fetch wrappers for all API endpoints |
| `client/src/lib/types.ts` | Create — shared frontend types (mirrors server/types.ts) |
| `client/src/lib/markdown.ts` | Create — lightweight markdown-to-HTML renderer |
| `client/src/components/Breadcrumbs.tsx` | Create — breadcrumb navigation component |
| `client/src/components/ZoneMap.tsx` | Create — Leaflet map with zone overlays |
| `client/src/components/ZoneLegend.tsx` | Create — color-coded zone type legend |
| `client/src/components/ZoneCard.tsx` | Create — individual zone detail card |
| `client/src/components/SearchBar.tsx` | Create — address/city search input |
| `client/src/components/CountryCard.tsx` | Create — country card for landing/browse |
| `client/src/components/CityCard.tsx` | Create — city card for country page/browse |
| `client/src/components/LoadingSkeleton.tsx` | Create — skeleton loading states |
| `client/src/components/NotFound.tsx` | Create — 404 page |
| `client/src/components/Header.tsx` | Create — persistent top bar with app name, search, breadcrumbs |
| `client/src/pages/Landing.tsx` | Create — landing page with 3 entry points |
| `client/src/pages/Country.tsx` | Create — country experience page |
| `client/src/pages/City.tsx` | Create — city experience page |
| `client/src/pages/Brief.tsx` | Create — address orientation brief page |

### Config files

| File | Responsibility |
|------|---------------|
| `simple-app/.env` | Create — API keys and PocketBase URL |
| `simple-app/.env.example` | Create — template without secrets |
| `simple-app/.gitignore` | Modify — add pb_data/, .env |

### Data files

| File | Responsibility |
|------|---------------|
| `server/data/countries.ts` | Create — pre-seeded country data (China, Turkey) |
| `server/data/cities.ts` | Create — pre-seeded city data (8 cities) |
| `server/data/zones.ts` | Create — pre-seeded zone data for all 8 cities |

---

## Task 1: Install dependencies and configure environment

**Files:**
- Modify: `simple-app/package.json`
- Create: `simple-app/.env`
- Create: `simple-app/.env.example`
- Modify: `simple-app/.gitignore`

- [ ] **Step 1: Install new npm dependencies**

```bash
cd /Users/mohamed-oc/Documents/GitHub/zsg-starter/simple-app
npm install react-router-dom leaflet pocketbase @anthropic-ai/sdk express-rate-limit marked
npm install -D @types/leaflet @types/marked
```

- [ ] **Step 2: Create .env file**

Create `simple-app/.env`:
```
GOOGLE_MAPS_API_KEY=your_google_maps_api_key_here
ANTHROPIC_API_KEY=your_anthropic_api_key_here
POCKETBASE_URL=http://127.0.0.1:8090
```

- [ ] **Step 3: Create .env.example**

Create `simple-app/.env.example`:
```
GOOGLE_MAPS_API_KEY=
ANTHROPIC_API_KEY=
POCKETBASE_URL=http://127.0.0.1:8090
PB_ADMIN_EMAIL=admin@example.com
PB_ADMIN_PASSWORD=
```

- [ ] **Step 4: Update .gitignore**

Add to `simple-app/.gitignore`:
```
pb_data/
pocketbase
```

- [ ] **Step 5: Add dev:db script to package.json**

Add to scripts in `package.json`:
```json
"dev:db": "./pocketbase serve --dir=./pb_data"
```

- [ ] **Step 6: Commit**

```bash
git add package.json package-lock.json .env.example .gitignore
git commit -m "feat: install dependencies and configure environment for orientation app"
```

---

## Task 2: Shared types and PocketBase client

**Files:**
- Create: `simple-app/server/types.ts`
- Create: `simple-app/client/src/lib/types.ts`
- Create: `simple-app/server/db.ts`

- [ ] **Step 1: Create server types**

Create `simple-app/server/types.ts`:
```ts
export type ZoneType = "tourist" | "local" | "food" | "coffee" | "explore" | "anchor";

export interface Zone {
  name: string;
  type: ZoneType;
  color: string;
  center_lat: number;
  center_lng: number;
  radius_deg: number;
  maps_link: string;
  note: string;
}

export interface CountryCard {
  name: string;
  slug: string;
  map_center: { lat: number; lng: number };
  map_zoom: number;
}

export interface QuickFacts {
  visa: string;
  currency: string;
  language: string;
  timezone: string;
  best_time: string;
}

export interface CountryDetail extends CountryCard {
  overview: string;
  quick_facts: QuickFacts;
  cities: CityCard[];
}

export interface CityCard {
  name: string;
  slug: string;
  country_slug: string;
  map_center: { lat: number; lng: number };
  map_zoom: number;
}

export interface CityDetail extends CityCard {
  overview: string;
  zones: Zone[];
}

export interface BriefDetail {
  id: string;
  anchor_name: string;
  anchor_lat: number;
  anchor_lng: number;
  city_slug: string | null;
  country_slug: string | null;
  zones: Zone[];
  brief_markdown: string;
  generated_by: "seeded" | "ai";
  created_at: string;
}
```

- [ ] **Step 2: Create client types (mirror of server types)**

Create `simple-app/client/src/lib/types.ts`:
```ts
export type ZoneType = "tourist" | "local" | "food" | "coffee" | "explore" | "anchor";

export interface Zone {
  name: string;
  type: ZoneType;
  color: string;
  center_lat: number;
  center_lng: number;
  radius_deg: number;
  maps_link: string;
  note: string;
}

export interface CountryCard {
  name: string;
  slug: string;
  map_center: { lat: number; lng: number };
  map_zoom: number;
}

export interface QuickFacts {
  visa: string;
  currency: string;
  language: string;
  timezone: string;
  best_time: string;
}

export interface CountryDetail extends CountryCard {
  overview: string;
  quick_facts: QuickFacts;
  cities: CityCard[];
}

export interface CityCard {
  name: string;
  slug: string;
  country_slug: string;
  map_center: { lat: number; lng: number };
  map_zoom: number;
}

export interface CityDetail extends CityCard {
  overview: string;
  zones: Zone[];
}

export interface BriefDetail {
  id: string;
  anchor_name: string;
  anchor_lat: number;
  anchor_lng: number;
  city_slug: string | null;
  country_slug: string | null;
  zones: Zone[];
  brief_markdown: string;
  generated_by: "seeded" | "ai";
  created_at: string;
}
```

- [ ] **Step 3: Create PocketBase client**

Create `simple-app/server/db.ts`:
```ts
import PocketBase from "pocketbase";

const POCKETBASE_URL = process.env.POCKETBASE_URL || "http://127.0.0.1:8090";

export const pb = new PocketBase(POCKETBASE_URL);

pb.autoCancellation(false);
```

- [ ] **Step 4: Commit**

```bash
git add server/types.ts client/src/lib/types.ts server/db.ts
git commit -m "feat: add shared types and PocketBase client"
```

---

## Task 3: Pre-seeded data files

**Files:**
- Create: `simple-app/server/data/countries.ts`
- Create: `simple-app/server/data/cities.ts`
- Create: `simple-app/server/data/zones.ts`

- [ ] **Step 1: Create country seed data**

Create `simple-app/server/data/countries.ts` with data for China and Turkey. Include: name, slug, overview (markdown), quick_facts (visa, currency, language, timezone, best_time), map_center, map_zoom.

Use real geographic coordinates:
- China: center {lat: 35.86, lng: 104.20}, zoom 4
- Turkey: center {lat: 39.92, lng: 32.85}, zoom 6

Write meaningful overview markdown (3-5 paragraphs) for each country covering geography, regions, travel basics.

- [ ] **Step 2: Create city seed data**

Create `simple-app/server/data/cities.ts` with data for all 8 cities. Include: name, slug, country_slug, overview (markdown), map_center (real coords), map_zoom.

Cities and approximate centers:
- Beijing: {lat: 39.9042, lng: 116.4074}, zoom 12
- Shanghai: {lat: 31.2304, lng: 121.4737}, zoom 12
- Guangzhou: {lat: 23.1291, lng: 113.2644}, zoom 12
- Hong Kong: {lat: 22.3193, lng: 114.1694}, zoom 13
- Shenzhen: {lat: 22.5431, lng: 114.0579}, zoom 12
- Zhangjiajie: {lat: 29.1170, lng: 110.4790}, zoom 13
- Chongqing: {lat: 29.5630, lng: 106.5516}, zoom 12
- Istanbul: {lat: 41.0082, lng: 28.9784}, zoom 12

Write a brief overview (2-3 paragraphs) for each city.

- [ ] **Step 3: Create zone seed data**

Create `simple-app/server/data/zones.ts` with 4-7 zones per city. Each zone needs: city_slug, name, type, color, center_lat, center_lng, radius_deg, maps_link, note.

Use the zone type color defaults from the spec:
- tourist: #e04444
- local: #45c880
- food: #e07c28
- coffee: #9b59b6
- explore: #4488e8
- anchor: #f5c842

For Istanbul, reference the existing Taksim data (Cihangir, Taksim Square, Karaköy, Galata Tower, Çukurcuma, Asmalımescit).

For other cities, research real neighborhoods and assign appropriate zone types. Use Google Maps search URLs for maps_link.

- [ ] **Step 4: Commit**

```bash
git add server/data/
git commit -m "feat: add pre-seeded country, city, and zone data"
```

---

## Task 4: PocketBase seed script

**Files:**
- Create: `simple-app/server/seed.ts`
- Modify: `simple-app/package.json` (add seed script)

- [ ] **Step 1: Create seed script**

Create `simple-app/server/seed.ts`:
```ts
import PocketBase from "pocketbase";
import { countries } from "./data/countries";
import { cities } from "./data/cities";
import { zones } from "./data/zones";

const pb = new PocketBase(process.env.POCKETBASE_URL || "http://127.0.0.1:8090");

async function createCollectionIfNotExists(name: string, fields: any[]) {
  try {
    await pb.collections.getOne(name);
    console.log(`Collection '${name}' already exists, skipping creation`);
  } catch {
    await pb.collections.create({
      name,
      type: "base",
      fields,
    });
    console.log(`Created collection '${name}'`);
  }
}

async function seed() {
  // Authenticate as admin — PocketBase must be running
  // First run: create admin via PocketBase UI at http://localhost:8090/_/
  await pb.admins.authWithPassword(
    process.env.PB_ADMIN_EMAIL || "admin@example.com",
    process.env.PB_ADMIN_PASSWORD || "adminpassword",
  );

  // Create collections
  await createCollectionIfNotExists("countries", [
    { name: "name", type: "text", required: true },
    { name: "slug", type: "text", required: true },
    { name: "overview", type: "text", required: true },
    { name: "quick_facts", type: "json", required: true },
    { name: "map_center", type: "json", required: true },
    { name: "map_zoom", type: "number", required: true },
  ]);

  await createCollectionIfNotExists("cities", [
    { name: "name", type: "text", required: true },
    { name: "slug", type: "text", required: true },
    { name: "country_slug", type: "text", required: true },
    { name: "overview", type: "text", required: true },
    { name: "map_center", type: "json", required: true },
    { name: "map_zoom", type: "number", required: true },
  ]);

  await createCollectionIfNotExists("zones", [
    { name: "city_slug", type: "text", required: true },
    { name: "name", type: "text", required: true },
    { name: "type", type: "text", required: true },
    { name: "color", type: "text", required: true },
    { name: "center_lat", type: "number", required: true },
    { name: "center_lng", type: "number", required: true },
    { name: "radius_deg", type: "number", required: true },
    { name: "maps_link", type: "url", required: true },
    { name: "note", type: "text", required: true },
  ]);

  await createCollectionIfNotExists("briefs", [
    { name: "brief_id", type: "text", required: true },
    { name: "anchor_name", type: "text", required: true },
    { name: "anchor_lat", type: "number", required: true },
    { name: "anchor_lng", type: "number", required: true },
    { name: "city_slug", type: "text" },
    { name: "country_slug", type: "text" },
    { name: "zones", type: "json", required: true },
    { name: "brief_markdown", type: "text", required: true },
    { name: "generated_by", type: "text", required: true },
  ]);

  // Seed data
  console.log("Seeding countries...");
  for (const country of countries) {
    try {
      const existing = await pb.collection("countries").getFirstListItem(`slug="${country.slug}"`);
      console.log(`  ${country.name} already exists, skipping`);
    } catch {
      await pb.collection("countries").create(country);
      console.log(`  Seeded ${country.name}`);
    }
  }

  console.log("Seeding cities...");
  for (const city of cities) {
    try {
      await pb.collection("cities").getFirstListItem(`slug="${city.slug}"`);
      console.log(`  ${city.name} already exists, skipping`);
    } catch {
      await pb.collection("cities").create(city);
      console.log(`  Seeded ${city.name}`);
    }
  }

  console.log("Seeding zones...");
  for (const zone of zones) {
    try {
      await pb.collection("zones").getFirstListItem(`name="${zone.name}" && city_slug="${zone.city_slug}"`);
      console.log(`  ${zone.name} (${zone.city_slug}) already exists, skipping`);
    } catch {
      await pb.collection("zones").create(zone);
      console.log(`  Seeded ${zone.name} (${zone.city_slug})`);
    }
  }

  console.log("Seed complete!");
}

seed().catch(console.error);
```

- [ ] **Step 2: Add seed script to package.json**

Add to scripts:
```json
"seed": "tsx server/seed.ts"
```

- [ ] **Step 3: Commit**

```bash
git add server/seed.ts package.json
git commit -m "feat: add PocketBase seed script"
```

---

## Task 5: API routes — countries and cities

**Files:**
- Create: `simple-app/server/routes/countries.ts`
- Create: `simple-app/server/routes/cities.ts`
- Modify: `simple-app/server/routes.ts`

- [ ] **Step 1: Create countries route handler**

Create `simple-app/server/routes/countries.ts`:
```ts
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
```

- [ ] **Step 2: Create cities route handler**

Create `simple-app/server/routes/cities.ts`:
```ts
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
      zones,
    };
    res.json({ city });
  } catch {
    res.status(404).json({ error: "City not found" });
  }
});

export default router;
```

- [ ] **Step 3: Update routes.ts to register all route modules**

Modify `simple-app/server/routes.ts`:
```ts
import type { Express } from "express";
import { createServer, type Server } from "http";
import countriesRouter from "./routes/countries";
import citiesRouter from "./routes/cities";

export async function registerRoutes(app: Express): Promise<Server> {
  app.get("/api/health", async (_req, res) => {
    res.json({ status: "ok" });
  });

  app.use("/api/countries", countriesRouter);
  app.use("/api/cities", citiesRouter);

  return createServer(app);
}
```

- [ ] **Step 4: Test manually**

```bash
# Terminal 1: start PocketBase
cd /Users/mohamed-oc/Documents/GitHub/zsg-starter/simple-app && npx pocketbase serve --dir=./pb_data

# Terminal 2: seed data
cd /Users/mohamed-oc/Documents/GitHub/zsg-starter/simple-app && npm run seed

# Terminal 3: start dev server
cd /Users/mohamed-oc/Documents/GitHub/zsg-starter/simple-app && npm run dev

# Terminal 4: test endpoints
curl http://localhost:3000/api/countries
curl http://localhost:3000/api/countries/china
curl http://localhost:3000/api/countries/china/cities
curl http://localhost:3000/api/cities/shanghai
```

- [ ] **Step 5: Commit**

```bash
git add server/routes/ server/routes.ts
git commit -m "feat: add countries and cities API routes"
```

---

## Task 6: API routes — geocode proxy and brief generation

**Files:**
- Create: `simple-app/server/routes/geocode.ts`
- Create: `simple-app/server/routes/briefs.ts`
- Create: `simple-app/server/lib/claude.ts`
- Create: `simple-app/server/lib/brief-prompt.ts`
- Modify: `simple-app/server/routes.ts`

- [ ] **Step 1: Create geocode proxy**

Create `simple-app/server/routes/geocode.ts`:
```ts
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
```

- [ ] **Step 2: Create Claude API client**

Create `simple-app/server/lib/claude.ts`:
```ts
import Anthropic from "@anthropic-ai/sdk";

let client: Anthropic | null = null;

export function getClaudeClient(): Anthropic {
  if (!client) {
    client = new Anthropic({ apiKey: process.env.ANTHROPIC_API_KEY });
  }
  return client;
}
```

- [ ] **Step 3: Create brief generation prompt**

Create `simple-app/server/lib/brief-prompt.ts` with a function `buildBriefPrompt(lat, lng, anchorName, existingZones?)` that returns a system prompt and user prompt for Claude. The prompt should:

- Instruct Claude to act as a travel orientation expert
- Provide the zone schema (name, type, color, center_lat, center_lng, radius_deg, maps_link, note)
- List the zone types and their default colors
- When `existingZones` is provided (seeded city): instruct Claude to write a brief using those zones, do NOT generate new zones. Return only `{ "brief_markdown": "..." }`
- When `existingZones` is NOT provided (un-seeded): ask for 4-7 zones around the given coordinates AND a markdown orientation brief. Return `{ "zones": [...], "brief_markdown": "..." }`
- Ask for a markdown orientation brief (mental model first, then details)
- Request JSON output
- Include the anchor coordinates and name

- [ ] **Step 4: Create briefs route handler**

Create `simple-app/server/routes/briefs.ts`:
```ts
import { Router } from "express";
import rateLimit from "express-rate-limit";
import { nanoid } from "nanoid";
import { pb } from "../db";
import { getClaudeClient } from "../lib/claude";
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
      // Pre-seeded city — copy zones from database
      const cityRecord = await pb.collection("cities").getFirstListItem(`slug="${city_slug}"`);
      countrySlug = cityRecord.country_slug;
      const zoneRecords = await pb.collection("zones").getFullList({ filter: `city_slug="${city_slug}"` });
      zones = zoneRecords.map((r) => ({
        name: r.name, type: r.type, color: r.color,
        center_lat: r.center_lat, center_lng: r.center_lng,
        radius_deg: r.radius_deg, maps_link: r.maps_link, note: r.note,
      }));
      // Generate brief text using Claude even for seeded cities
      const claude = getClaudeClient();
      const { systemPrompt, userPrompt } = buildBriefPrompt(lat, lng, anchor_name || "Your Location", zones);
      const message = await claude.messages.create({
        model: "claude-sonnet-4-6",
        max_tokens: 2000,
        system: systemPrompt,
        messages: [{ role: "user", content: userPrompt }],
      }, { timeout: 30000 });
      const content = message.content[0];
      briefMarkdown = content.type === "text" ? content.text : "";
      generatedBy = "seeded";
    } else {
      // Un-seeded location — AI generates everything
      const claude = getClaudeClient();
      const { systemPrompt, userPrompt } = buildBriefPrompt(lat, lng, anchor_name || "Your Location");
      const message = await claude.messages.create({
        model: "claude-sonnet-4-6",
        max_tokens: 4000,
        system: systemPrompt,
        messages: [{ role: "user", content: userPrompt }],
      }, { timeout: 30000 });
      const content = message.content[0];
      const text = content.type === "text" ? content.text : "";
      // Parse JSON from Claude's response
      const jsonMatch = text.match(/\{[\s\S]*\}/);
      if (!jsonMatch) throw new Error("Failed to parse AI response");
      const parsed = JSON.parse(jsonMatch[0]);
      zones = parsed.zones;
      briefMarkdown = parsed.brief_markdown;
      generatedBy = "ai";
    }

    // Save to PocketBase
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
    if (message.includes("timeout") || message.includes("ETIMEDOUT")) {
      return res.status(504).json({ error: "Generation timed out, please try again" });
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
```

- [ ] **Step 5: Update routes.ts to register geocode and briefs**

Add to `simple-app/server/routes.ts`:
```ts
import geocodeRouter from "./routes/geocode";
import briefsRouter from "./routes/briefs";

// Inside registerRoutes:
app.use("/api/geocode", geocodeRouter);
app.use("/api/brief", briefsRouter);
```

- [ ] **Step 6: Commit**

```bash
git add server/routes/ server/lib/ server/routes.ts
git commit -m "feat: add geocode proxy and brief generation API routes"
```

---

## Task 7: Dark Atlas theme and Leaflet CSS

**Files:**
- Modify: `simple-app/client/src/index.css`
- Modify: `simple-app/client/index.html`
- Modify: `simple-app/tailwind.config.ts`

- [ ] **Step 1: Add Leaflet CSS to index.html**

Add to `<head>` in `simple-app/client/index.html`:
```html
<link rel="stylesheet" href="https://unpkg.com/leaflet@1.9.4/dist/leaflet.css" />
```

- [ ] **Step 2: Update CSS variables in index.css to Dark Atlas theme**

Replace the `:root` light mode variables with Dark Atlas values:
- `--background: 0 0% 6%` (#0f0f0f)
- `--foreground: 0 0% 96%`
- `--primary: 43 91% 61%` (#f5c842 golden accent)
- `--muted: 0 0% 15%`
- `--muted-foreground: 0 0% 55%`
- `--card: 0 0% 9%`
- `--border: 0 0% 18%`

Remove the `.dark` class block — the app is always dark.

- [ ] **Step 3: Update tailwind.config.ts**

Remove the `darkMode` setting (always dark). Keep existing animation keyframes. Ensure the font-family includes system-ui fallback.

- [ ] **Step 4: Commit**

```bash
git add client/src/index.css client/index.html tailwind.config.ts
git commit -m "feat: apply Dark Atlas theme and add Leaflet CSS"
```

---

## Task 8: Client API layer

**Files:**
- Create: `simple-app/client/src/lib/api.ts`

- [ ] **Step 1: Create API fetch wrapper**

Create `simple-app/client/src/lib/api.ts`:
```ts
import type { CountryCard, CountryDetail, CityCard, CityDetail, BriefDetail } from "./types";

const API_BASE = "/api";

async function fetchJson<T>(url: string, options?: RequestInit): Promise<T> {
  const res = await fetch(`${API_BASE}${url}`, {
    headers: { "Content-Type": "application/json" },
    ...options,
  });
  if (!res.ok) {
    const body = await res.json().catch(() => ({ error: "Request failed" }));
    throw new Error(body.error || `HTTP ${res.status}`);
  }
  return res.json();
}

export async function getCountries(): Promise<CountryCard[]> {
  const data = await fetchJson<{ countries: CountryCard[] }>("/countries");
  return data.countries;
}

export async function getCountry(slug: string): Promise<CountryDetail> {
  const data = await fetchJson<{ country: CountryDetail }>(`/countries/${slug}`);
  return data.country;
}

export async function getCities(countrySlug: string): Promise<CityCard[]> {
  const data = await fetchJson<{ cities: CityCard[] }>(`/countries/${countrySlug}/cities`);
  return data.cities;
}

export async function getCity(slug: string): Promise<CityDetail> {
  const data = await fetchJson<{ city: CityDetail }>(`/cities/${slug}`);
  return data.city;
}

export async function geocode(address: string): Promise<{ lat: number; lng: number; formatted_address: string }> {
  return fetchJson("/geocode", {
    method: "POST",
    body: JSON.stringify({ address }),
  });
}

export async function generateBrief(params: {
  lat: number; lng: number; anchor_name: string; city_slug?: string;
}): Promise<BriefDetail> {
  const data = await fetchJson<{ brief: BriefDetail }>("/brief/generate", {
    method: "POST",
    body: JSON.stringify(params),
  });
  return data.brief;
}

export async function getBrief(id: string): Promise<BriefDetail> {
  const data = await fetchJson<{ brief: BriefDetail }>(`/brief/${id}`);
  return data.brief;
}
```

- [ ] **Step 2: Commit**

```bash
git add client/src/lib/api.ts
git commit -m "feat: add client API fetch layer"
```

---

## Task 9: Reusable UI components

**Files:**
- Create: `simple-app/client/src/components/Breadcrumbs.tsx`
- Create: `simple-app/client/src/components/ZoneMap.tsx`
- Create: `simple-app/client/src/components/ZoneLegend.tsx`
- Create: `simple-app/client/src/components/ZoneCard.tsx`
- Create: `simple-app/client/src/components/SearchBar.tsx`
- Create: `simple-app/client/src/components/CountryCard.tsx`
- Create: `simple-app/client/src/components/CityCard.tsx`
- Create: `simple-app/client/src/components/LoadingSkeleton.tsx`
- Create: `simple-app/client/src/components/NotFound.tsx`

- [ ] **Step 1: Create Breadcrumbs component**

Create `simple-app/client/src/components/Breadcrumbs.tsx`. Props: `items: Array<{label: string, to?: string}>`. Uses React Router `<Link>` for navigation. Last item is plain text (current page). Separator: `>`. Styled with muted-foreground, golden accent for links.

- [ ] **Step 2: Create ZoneMap component**

Create `simple-app/client/src/components/ZoneMap.tsx`. Props: `center: {lat, lng}, zoom: number, zones: Zone[], anchor?: {lat, lng, name}`. Uses Leaflet with CartoDB Dark Matter tiles. Renders circle overlays for each zone (fill color from zone.color with alpha, stroke from zone.color). Renders anchor marker if provided. On zone click: open zone.maps_link in new tab. Mobile-friendly: touch zoom, scroll zoom disabled by default, attribution collapsed.

Important: use `react-leaflet` is NOT a dependency — use Leaflet directly with `useRef` and `useEffect` to create the map instance.

- [ ] **Step 3: Create ZoneLegend component**

Create `simple-app/client/src/components/ZoneLegend.tsx`. Props: `zones: Zone[], anchor?: {name: string}`. Renders a list of zone names with colored dots and type labels. Anchor shown first with golden dot.

- [ ] **Step 4: Create ZoneCard component**

Create `simple-app/client/src/components/ZoneCard.tsx`. Props: `zone: Zone`. Renders a card with: colored left border, zone name (links to maps_link), type badge with emoji, note text. Zone type emojis: tourist 🔴, local 🟢, food 🟠, coffee 🟣, explore 🔵, anchor ⚫.

- [ ] **Step 5: Create SearchBar component**

Create `simple-app/client/src/components/SearchBar.tsx`. Props: `onSearch: (query: string) => void, placeholder: string, loading?: boolean`. Text input with submit button. Shows inline error state. Mobile-friendly: large touch target, auto-focus on mount optional.

- [ ] **Step 6: Create CountryCard and CityCard components**

Create `simple-app/client/src/components/CountryCard.tsx`. Props: `country: CountryCard`. Renders a card linking to `/explore/:slug` with country name and a small map preview (optional — can just be styled text card).

Create `simple-app/client/src/components/CityCard.tsx`. Props: `city: CityCard, countrySlug: string`. Renders a card linking to `/explore/:country/:city` with city name.

- [ ] **Step 7: Create Header component**

Create `simple-app/client/src/components/Header.tsx`. Persistent top bar rendered on all pages. Contains: app name "Atlas" (golden accent, links to `/`), a compact SearchBar for direct address lookup, and Breadcrumbs below. Sticky on scroll. Phone-first: collapses search behind a search icon on small screens.

- [ ] **Step 8: Create LoadingSkeleton and NotFound components**

Create `simple-app/client/src/components/LoadingSkeleton.tsx`. Renders animated placeholder blocks for loading states.

Create `simple-app/client/src/components/NotFound.tsx`. Renders "Place not found" message with link back to landing.

- [ ] **Step 9: Create markdown renderer utility**

Create `simple-app/client/src/lib/markdown.ts`. Uses the `marked` library to convert markdown strings to HTML. Exports a `renderMarkdown(md: string): string` function. Configure marked with `{ breaks: true }` for line break support. Used by Country, City, and Brief pages to render overview/brief text.

- [ ] **Step 10: Commit**

```bash
git add client/src/components/ client/src/lib/markdown.ts
git commit -m "feat: add reusable UI components (map, zones, cards, nav, header)"
```

---

## Task 10: Page components

**Files:**
- Create: `simple-app/client/src/pages/Landing.tsx`
- Create: `simple-app/client/src/pages/Country.tsx`
- Create: `simple-app/client/src/pages/City.tsx`
- Create: `simple-app/client/src/pages/Brief.tsx`

- [ ] **Step 1: Create Landing page**

Create `simple-app/client/src/pages/Landing.tsx`. Layout:
1. Header: app name "Atlas" with golden accent
2. Three entry point cards: "Explore a Country", "Explore a City", "Orient Me"
3. "Orient Me" card has a SearchBar for direct address input — on submit, geocodes the address and navigates to brief generation
4. Below: pre-seeded country cards (fetched from API on mount)
5. Below countries: pre-seeded city cards grouped by country

Uses `useEffect` to fetch countries on mount. Phone-first: single column, large touch targets.

- [ ] **Step 2: Create Country page**

Create `simple-app/client/src/pages/Country.tsx`. Uses `useParams` to get `:country` slug. Fetches country detail from API. Layout:
1. Breadcrumbs: Home > China
2. Country name + overview (rendered markdown)
3. Quick facts grid (visa, currency, language, timezone, best time)
4. Leaflet map showing city locations as markers
5. City cards linking to `/explore/:country/:city`
6. Loading skeleton while fetching. NotFound on 404.

- [ ] **Step 3: Create City page**

Create `simple-app/client/src/pages/City.tsx`. Uses `useParams` to get `:country` and `:city` slugs. Fetches city detail from API. Also fetches sibling cities via `getCities(countrySlug)` for cross-links. Layout:
1. Breadcrumbs: Home > China > Shanghai
2. City name + overview (rendered via `renderMarkdown`)
3. ZoneMap showing all zones as circle overlays
4. ZoneLegend
5. ZoneCards for each zone
6. "Get Your Brief" section with SearchBar for address input
7. On address submit: geocode → generateBrief → navigate to brief page
8. "Other cities in [Country]" section with CityCard components for sibling cities (excluding current city)
9. Loading states for fetch and brief generation

- [ ] **Step 4: Create Brief page**

Create `simple-app/client/src/pages/Brief.tsx`. Uses `useParams` to get `:id`. Fetches brief from API (or receives it from navigation state). Layout:
1. Breadcrumbs: Home > China > Shanghai > Your Brief (or Home > Brief for AI-generated)
2. Anchor name + address
3. ZoneMap centered on anchor, showing all zones
4. ZoneLegend
5. Orientation brief rendered from markdown (use simple markdown-to-HTML or a lightweight lib)
6. ZoneCards for each zone
7. Share button (copies current URL to clipboard)
8. Loading skeleton while fetching

For markdown rendering: use a simple regex-based converter or install `marked` (lightweight).

- [ ] **Step 5: Commit**

```bash
git add client/src/pages/
git commit -m "feat: add page components (landing, country, city, brief)"
```

---

## Task 11: Router setup and App shell

**Files:**
- Modify: `simple-app/client/src/main.tsx`
- Rewrite: `simple-app/client/src/App.tsx`

- [ ] **Step 1: Update main.tsx with BrowserRouter**

Modify `simple-app/client/src/main.tsx`:
```tsx
import { createRoot } from "react-dom/client";
import { BrowserRouter } from "react-router-dom";
import App from "./App";
import "./index.css";

createRoot(document.getElementById("root")!).render(
  <BrowserRouter>
    <App />
  </BrowserRouter>
);
```

- [ ] **Step 2: Rewrite App.tsx with routes**

Rewrite `simple-app/client/src/App.tsx`:
```tsx
import { Routes, Route } from "react-router-dom";
import Header from "./components/Header";
import Landing from "./pages/Landing";
import Country from "./pages/Country";
import City from "./pages/City";
import Brief from "./pages/Brief";
import NotFound from "./components/NotFound";

export default function App() {
  return (
    <div className="min-h-screen bg-background text-foreground">
      <Header />
      <main className="px-4 pb-8 max-w-3xl mx-auto">
        <Routes>
          <Route path="/" element={<Landing />} />
          <Route path="/explore/:country" element={<Country />} />
          <Route path="/explore/:country/:city" element={<City />} />
          <Route path="/explore/:country/:city/brief/:id" element={<Brief />} />
          <Route path="/brief/:id" element={<Brief />} />
          <Route path="*" element={<NotFound />} />
        </Routes>
      </main>
    </div>
  );
}
```

- [ ] **Step 3: Commit**

```bash
git add client/src/main.tsx client/src/App.tsx
git commit -m "feat: set up React Router and app shell"
```

---

## Task 12: End-to-end integration test

**Files:** No new files — manual testing

- [ ] **Step 1: Download PocketBase binary if not already present**

```bash
# macOS ARM
cd /Users/mohamed-oc/Documents/GitHub/zsg-starter/simple-app
curl -L https://github.com/pocketbase/pocketbase/releases/download/v0.25.9/pocketbase_0.25.9_darwin_arm64.zip -o pb.zip
unzip pb.zip pocketbase
rm pb.zip
chmod +x pocketbase
```

Add `pocketbase` binary to `.gitignore`.

- [ ] **Step 2: Start PocketBase and create admin**

```bash
./pocketbase serve --dir=./pb_data
```
Open http://localhost:8090/_/ and create an admin account.

- [ ] **Step 3: Run seed script**

```bash
npm run seed
```
Verify all countries, cities, and zones are created.

- [ ] **Step 4: Start dev server and test**

```bash
npm run dev
```

Test flow:
1. Open http://localhost:3000 — landing page loads with country cards
2. Click China card → navigates to `/explore/china` with map and city cards
3. Click Shanghai → navigates to `/explore/china/shanghai` with zone map
4. Enter an address in "Get Your Brief" → generates and shows brief
5. Copy the brief URL → open in new tab → brief loads (sharing works)
6. Navigate back with breadcrumbs — all navigation works
7. Test on mobile viewport (Chrome DevTools device mode)

- [ ] **Step 5: Fix any issues found during testing**

- [ ] **Step 6: Final commit**

```bash
git add -A
git commit -m "feat: complete Phase 1 travel orientation app"
```
