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
