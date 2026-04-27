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

export interface PlacePrediction {
  place_id: string;
  description: string;
  main_text: string;
  secondary_text: string;
}

export async function placesAutocomplete(
  input: string,
  location?: { lat: number; lng: number }
): Promise<PlacePrediction[]> {
  const params = new URLSearchParams({ input });
  if (location) {
    params.set("lat", String(location.lat));
    params.set("lng", String(location.lng));
  }
  const data = await fetchJson<{ predictions: PlacePrediction[] }>(`/places/autocomplete?${params}`);
  return data.predictions;
}

export async function placeDetails(placeId: string): Promise<{ lat: number; lng: number; formatted_address: string }> {
  return fetchJson(`/places/details?place_id=${placeId}`);
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
