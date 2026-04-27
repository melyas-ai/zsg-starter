# Travel Orientation App — Design Spec

## Problem

Travelers arriving in a new place feel disoriented. The existing Atlas orientation system produces excellent phone-friendly briefs, but it's a manual process. This app makes it interactive, browseable, and scalable.

## Solution

A phone-first web app with three standalone experiences — country, city, and address — each valuable on its own, connected via natural drill-down navigation.

## Decisions

| Decision | Choice | Rationale |
|----------|--------|-----------|
| Frontend | React + Vite + Tailwind (simple-app) | Existing stack, interactive UI needed |
| Client router | React Router v6 | Standard, well-documented, supports nested routes |
| Backend | Express (Node.js, simple-app) | Existing stack, single runtime |
| Database | PocketBase (port 8090) | Simple, self-contained, real-time capable |
| Maps | Leaflet.js + Google Maps Geocoding API | Interactive overlays + geocoding |
| Map tiles | CartoDB Dark Matter (free, no key) | Dark aesthetic, no API key needed |
| Visual style | Dark Atlas | Dark bg (#0f0f0f / 0 0% 6%), golden accent (#f5c842 / 43 91% 61%) |
| Routing | Nested under /explore prefix, flat /brief | Best mobile UX + no route collisions |
| AI fallback | Claude API (Sonnet) | For generating briefs in un-seeded locations |
| Pre-seeded data | China (7 cities), Turkey (Istanbul) | User's travel priorities |

## Architecture

```
┌─────────────────────────────────────────────┐
│                   Client                     │
│  React + Vite + Tailwind + Leaflet.js        │
│  Dark Atlas theme, phone-first               │
│                                              │
│  Router: React Router v6                     │
│  Routes:                                     │
│    /                              Landing     │
│    /explore/:country              Country     │
│    /explore/:country/:city        City        │
│    /explore/:country/:city/brief/:id  Brief   │
│    /brief/:id              AI-generated brief │
└──────────────┬──────────────────────────────┘
               │ API calls
┌──────────────▼──────────────────────────────┐
│                   Server                     │
│  Express (Node.js)                           │
│                                              │
│  Endpoints:                                  │
│    GET  /api/countries                       │
│    GET  /api/countries/:slug                 │
│    GET  /api/countries/:slug/cities           │
│    GET  /api/cities/:slug                    │
│    POST /api/geocode        (proxies Google) │
│    POST /api/brief/generate (calls Claude)   │
│    GET  /api/brief/:id                       │
│                                              │
│  Proxies Google Maps API (key server-side)   │
│  Calls Claude API for AI-generated briefs    │
└──────────────┬──────────────────────────────┘
               │
┌──────────────▼──────────────────────────────┐
│              PocketBase                      │
│                                              │
│  Collections:                                │
│    countries  — name, slug, overview, map    │
│    cities     — name, slug, country, zones   │
│    zones      — name, type, color, coords    │
│    briefs     — anchor, zones, markdown, map │
└─────────────────────────────────────────────┘
```

## User Experiences

### Landing Page (`/`)

Three entry points presented clearly:
- "Explore a Country" — browse pre-seeded countries
- "Explore a City" — browse or search cities
- "Orient Me" — enter any address for an instant brief

Search bar at top for direct access. Pre-seeded countries/cities shown as browseable cards below.

### Country Experience (`/explore/:country`)

Standalone page with:
- Country map (Leaflet) highlighting key regions/cities
- Quick facts (visa, currency, language, best time to visit)
- Geographic overview (regions, distances, terrain)
- City cards linking to `/explore/:country/:city`
- Content depth: enough to orient a first-time visitor, less detail than city level

### City Experience (`/explore/:country/:city`)

Standalone page with:
- City map (Leaflet) with colored district/zone overlays
- District breakdown with zone types (tourist, local, food, coffee, explore)
- Clickable zones → Google Maps
- "Get Your Brief" section: address input → geocode → generate orientation brief
- Pre-seeded zone data for known cities

### Address Brief (`/explore/:country/:city/brief/:id` or `/brief/:id`)

The core orientation deliverable:
- Interactive Leaflet map with zone overlays (replacing static Google Maps image)
- Clickable zones → open in Google Maps with directions
- Color-coded legend with zone types
- Orientation brief (mental model, navigation tips, recommendations)
- Zone cards with details
- Share button (copy URL to clipboard)

For AI-generated briefs in un-seeded locations, the flat `/brief/:id` route is used.

### Navigation

- Breadcrumbs on every page: Home > China > Shanghai > Your Brief
- Back button maps naturally to breadcrumb hierarchy
- Cross-links between sibling cities within a country
- Consistent top bar with search + breadcrumbs
- All content routes under `/explore/` prefix to avoid collisions with future top-level routes

## Data Model

### countries
- `name`: string (e.g., "China")
- `slug`: string (e.g., "china")
- `overview`: markdown text
- `quick_facts`: JSON (visa, currency, language, timezone, best_time)
- `map_center`: {lat, lng}
- `map_zoom`: number

### cities
- `name`: string (e.g., "Shanghai")
- `slug`: string (e.g., "shanghai")
- `country_slug`: string (foreign key)
- `overview`: markdown text
- `map_center`: {lat, lng}
- `map_zoom`: number

### zones
- `city_slug`: string (foreign key)
- `name`: string
- `type`: enum (tourist, local, food, coffee, explore, anchor)
- `color`: hex string
- `center_lat`: number
- `center_lng`: number
- `radius_deg`: number
- `maps_link`: URL string
- `note`: string

### briefs

Zone data is copied into each brief's `zones` JSON field so briefs are self-contained and shareable. For pre-seeded cities, zones are copied from the `zones` collection at generation time. For AI-generated briefs, zones exist only in the brief's JSON and are never written to the `zones` collection.

- `id`: string (nanoid(12) — short for URL-friendly sharing)
- `anchor_name`: string
- `anchor_lat`: number
- `anchor_lng`: number
- `city_slug`: string (nullable — null for AI-generated in un-seeded cities)
- `country_slug`: string (nullable)
- `zones`: JSON array
- `brief_markdown`: text
- `generated_by`: enum (seeded, ai)
- `created_at`: datetime

## Zone Types

| Type | Color | Label |
|------|-------|-------|
| tourist | `#e04444` | Tourist-heavy |
| local | `#45c880` | Local / residential |
| food | `#e07c28` | Food-heavy |
| coffee | `#9b59b6` | Coffee / work |
| explore | `#4488e8` | Worth exploring |
| anchor | `#f5c842` | Your base |

## API Endpoints

### GET /api/countries
Returns: `{ countries: CountryCard[] }`
```ts
type CountryCard = { name: string; slug: string; map_center: {lat: number; lng: number}; map_zoom: number }
```

### GET /api/countries/:slug
Returns: `{ country: CountryDetail }`
```ts
type CountryDetail = CountryCard & { overview: string; quick_facts: QuickFacts; cities: CityCard[] }
```

### GET /api/countries/:slug/cities
Returns: `{ cities: CityCard[] }`
```ts
type CityCard = { name: string; slug: string; country_slug: string; map_center: {lat: number; lng: number}; map_zoom: number }
```

### GET /api/cities/:slug
Returns: `{ city: CityDetail }`
```ts
type CityDetail = CityCard & { overview: string; zones: Zone[] }
```

### POST /api/geocode
Body: `{ address: string }`
Returns: `{ lat: number; lng: number; formatted_address: string }`
Proxies to Google Geocoding API. On failure: `{ error: "Could not find that address" }` with 404.

### POST /api/brief/generate
Body: `{ lat: number; lng: number; anchor_name: string; city_slug?: string }`
For pre-seeded cities: copies zones from PocketBase, generates brief template.
For un-seeded locations: calls Claude API (Sonnet) to generate zones + brief.
Returns: `{ brief: BriefDetail }`
On Claude API timeout (30s): `{ error: "Generation timed out, please try again" }` with 504.

### GET /api/brief/:id
Returns: `{ brief: BriefDetail }`
```ts
type BriefDetail = {
  id: string; anchor_name: string; anchor_lat: number; anchor_lng: number;
  city_slug: string | null; country_slug: string | null;
  zones: Zone[]; brief_markdown: string; generated_by: "seeded" | "ai"; created_at: string
}
```
On not found: `{ error: "Brief not found" }` with 404.

## Tech Details

### Google Maps API
- Key stored in `.env` as `GOOGLE_MAPS_API_KEY`
- All calls proxied through Express — never exposed to frontend
- Used for: geocoding addresses only (Leaflet replaces static map images)

### Claude API
- Key stored in `.env` as `ANTHROPIC_API_KEY`
- Model: claude-sonnet-4-6 (fast, cheap, good enough for zone generation)
- Used for: generating zones + orientation briefs for un-seeded locations
- Prompt provides the zone schema, area research instructions, and brief-writing guidelines from the existing Atlas skill

### Leaflet.js
- Renders interactive maps on country, city, and brief pages
- GeoJSON overlays for zone polygons (circles/polygons)
- Click handlers: tap zone → open Google Maps link
- Tile layer: CartoDB Dark Matter (`https://{s}.basemaps.cartocdn.com/dark_all/{z}/{x}/{y}{r}.png`) — free, no key

### PocketBase
- Runs on port 8090 as a separate process
- Express connects via `POCKETBASE_URL` env var (default `http://127.0.0.1:8090`)
- Dev script: `"dev:db": "pocketbase serve --dir=./pb_data"` in package.json
- Pre-seeded via standalone Node script (`server/seed.ts`) that populates collections
- PocketBase admin UI available at `http://localhost:8090/_/` for content inspection

## Error & Loading States

- **Geocode failure**: inline error "Could not find that address" below the input
- **Brief generation loading**: skeleton UI with progress message ("Generating your orientation brief..."), estimated 5-10s for AI
- **Claude API timeout**: 30s limit, shows "Generation timed out, please try again" with retry button
- **Invalid country/city slug**: 404 page with "Place not found" and link back to landing
- **Rate limiting**: 10 requests/minute on `POST /api/brief/generate` per IP

## Pre-seeded Cities

### China
- Beijing
- Shanghai
- Guangzhou
- Hong Kong
- Shenzhen
- Zhangjiajie
- Chongqing

### Turkey
- Istanbul (existing Taksim data as starting point)

## Phase Plan

### Phase 1 (this build)
- Landing page with three entry points
- Country experience for China and Turkey
- City experience for all 8 cities (pre-seeded zones)
- Address brief generation (pre-seeded cities + AI fallback)
- Interactive Leaflet maps on all pages
- Breadcrumb navigation
- Phone-first responsive design
- PocketBase with seeded data
- Google Maps API proxy
- Claude API integration for AI fallback

### Phase 2 (future)
- Country content depth refinement
- Social sharing buttons, copy-to-clipboard, favorites list
- More pre-seeded countries/cities
- Offline caching

### Phase 3 (future)
- User accounts
- PDF export
- Smart zone detection (Places API)
- Interactive Google Maps overlays (KML/GeoJSON)
