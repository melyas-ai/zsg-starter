# Travel Orientation App — Design Spec

## Problem

Travelers arriving in a new place feel disoriented. The existing Atlas orientation system produces excellent phone-friendly briefs, but it's a manual process. This app makes it interactive, browseable, and scalable.

## Solution

A phone-first web app with three standalone experiences — country, city, and address — each valuable on its own, connected via natural drill-down navigation.

## Decisions

| Decision | Choice | Rationale |
|----------|--------|-----------|
| Frontend | React + Vite + Tailwind (simple-app) | Existing stack, interactive UI needed |
| Backend | Express (Node.js, simple-app) | Existing stack, single runtime |
| Database | PocketBase | Simple, self-contained, real-time capable |
| Maps | Leaflet.js + Google Maps API | Interactive overlays + geocoding/static maps |
| Visual style | Dark Atlas | Dark theme (#0f0f0f), golden accent (#f5c842), matches existing briefs |
| Routing | Nested with flat fallback | Best mobile UX (validated by 4 independent evaluations) |
| AI fallback | Claude API (Sonnet) | For generating briefs in un-seeded locations |
| Pre-seeded data | China (7 cities), Turkey (Istanbul) | User's travel priorities |

## Architecture

```
┌─────────────────────────────────────────────┐
│                   Client                     │
│  React + Vite + Tailwind + Leaflet.js        │
│  Dark Atlas theme, phone-first               │
│                                              │
│  Routes:                                     │
│    /                    Landing               │
│    /:country            Country experience    │
│    /:country/:city      City experience       │
│    /:country/:city/brief/:id  Address brief   │
│    /brief/:id           AI-generated brief    │
└──────────────┬──────────────────────────────┘
               │ API calls
┌──────────────▼──────────────────────────────┐
│                   Server                     │
│  Express (Node.js)                           │
│                                              │
│  Endpoints:                                  │
│    GET  /api/countries                       │
│    GET  /api/countries/:slug                 │
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

### Country Experience (`/:country`)

Standalone page with:
- Country map (Leaflet) highlighting key regions/cities
- Quick facts (visa, currency, language, best time to visit)
- Geographic overview (regions, distances, terrain)
- City cards linking to `/:country/:city`
- Content depth: enough to orient a first-time visitor, less detail than city level

### City Experience (`/:country/:city`)

Standalone page with:
- City map (Leaflet) with colored district/zone overlays
- District breakdown with zone types (tourist, local, food, coffee, explore)
- Clickable zones → Google Maps
- "Get Your Brief" section: address input → geocode → generate orientation brief
- Pre-seeded zone data for known cities

### Address Brief (`/:country/:city/brief/:id` or `/brief/:id`)

The core orientation deliverable:
- Interactive Leaflet map with zone overlays (replacing static Google Maps image)
- Clickable zones → open in Google Maps with directions
- Color-coded legend with zone types
- Orientation brief (mental model, navigation tips, recommendations)
- Zone cards with details
- Share button (URL is the share mechanism)
- Download option

### Navigation

- Breadcrumbs on every page: Home > China > Shanghai > Your Brief
- Back button maps naturally to breadcrumb hierarchy
- Cross-links between sibling cities within a country
- Consistent top bar with search + breadcrumbs

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
- `id`: string (nanoid)
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
| anchor | `#1a1a1a` | Your base |

## API Endpoints

### GET /api/countries
Returns all pre-seeded countries with basic info for cards.

### GET /api/countries/:slug
Returns full country data including overview, quick facts, and list of cities.

### GET /api/cities/:slug
Returns full city data including overview, zones, and map config.

### POST /api/geocode
Body: `{ address: string }`
Proxies to Google Geocoding API. Returns `{ lat, lng, formatted_address }`.

### POST /api/brief/generate
Body: `{ lat, lng, anchor_name, city_slug? }`
For pre-seeded cities: looks up zones from PocketBase, generates brief template.
For un-seeded locations: calls Claude API (Sonnet) to research the area and generate zones + brief.
Returns the created brief with ID.

### GET /api/brief/:id
Returns a saved brief by ID (for sharing).

## Tech Details

### Google Maps API
- Key stored in `.env` as `GOOGLE_MAPS_API_KEY`
- All calls proxied through Express — never exposed to frontend
- Used for: geocoding addresses, static map thumbnails

### Claude API
- Key stored in `.env` as `ANTHROPIC_API_KEY`
- Model: claude-sonnet-4-6 (fast, cheap, good enough for zone generation)
- Used for: generating zones + orientation briefs for un-seeded locations
- Prompt provides the zone schema, area research instructions, and brief-writing guidelines from the existing Atlas skill

### Leaflet.js
- Renders interactive maps on country, city, and brief pages
- GeoJSON overlays for zone polygons (circles/polygons)
- Click handlers: tap zone → open Google Maps link
- Tile layer: dark-themed map tiles to match Dark Atlas visual style

### PocketBase
- Runs as a separate process alongside Express
- SDK used from Express to query/write data
- Pre-seeded via migration script with China + Turkey data

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
- Save/share briefs
- More pre-seeded countries/cities
- Offline caching

### Phase 3 (future)
- User accounts
- PDF export
- Smart zone detection (Places API)
- Interactive Google Maps overlays (KML/GeoJSON)
