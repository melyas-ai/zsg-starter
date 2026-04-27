import { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { getCity, getCities, geocode, generateBrief } from "../lib/api";
import { renderMarkdown } from "../lib/markdown";
import type { CityDetail, CityCard as CityCardType } from "../lib/types";
import Breadcrumbs from "../components/Breadcrumbs";
import ZoneMap from "../components/ZoneMap";
import ZoneLegend from "../components/ZoneLegend";
import ZoneCard from "../components/ZoneCard";
import CityCard from "../components/CityCard";
import SearchBar from "../components/SearchBar";
import LoadingSkeleton from "../components/LoadingSkeleton";
import NotFound from "../components/NotFound";

export default function City() {
  const { country: countrySlug, city: citySlug } = useParams<{ country: string; city: string }>();
  const navigate = useNavigate();
  const [city, setCity] = useState<CityDetail | null>(null);
  const [siblings, setSiblings] = useState<CityCardType[]>([]);
  const [loading, setLoading] = useState(true);
  const [notFound, setNotFound] = useState(false);
  const [briefLoading, setBriefLoading] = useState(false);
  const [briefError, setBriefError] = useState("");

  useEffect(() => {
    if (!citySlug || !countrySlug) return;
    setLoading(true);
    Promise.all([
      getCity(citySlug),
      getCities(countrySlug),
    ])
      .then(([cityData, citiesData]) => {
        setCity(cityData);
        setSiblings(citiesData.filter((c) => c.slug !== citySlug));
      })
      .catch(() => setNotFound(true))
      .finally(() => setLoading(false));
  }, [citySlug, countrySlug]);

  async function handleBriefSearch(address: string) {
    setBriefLoading(true);
    setBriefError("");
    try {
      const geo = await geocode(address);
      const brief = await generateBrief({
        lat: geo.lat,
        lng: geo.lng,
        anchor_name: geo.formatted_address,
        city_slug: citySlug,
      });
      navigate(`/explore/${countrySlug}/${citySlug}/brief/${brief.id}`);
    } catch (e) {
      setBriefError(e instanceof Error ? e.message : "Something went wrong");
    } finally {
      setBriefLoading(false);
    }
  }

  if (loading) return <LoadingSkeleton />;
  if (notFound || !city) return <NotFound />;

  return (
    <div className="space-y-6 pt-2">
      <Breadcrumbs
        items={[
          { label: "Home", to: "/" },
          { label: city.country_slug.charAt(0).toUpperCase() + city.country_slug.slice(1), to: `/explore/${countrySlug}` },
          { label: city.name },
        ]}
      />

      <h1 className="text-3xl font-bold text-foreground">{city.name}</h1>

      <ZoneMap center={city.map_center} zoom={city.map_zoom} zones={city.zones} />

      <ZoneLegend zones={city.zones} />

      <div
        className="prose prose-invert prose-sm max-w-none text-muted-foreground [&_strong]:text-foreground"
        dangerouslySetInnerHTML={{ __html: renderMarkdown(city.overview) }}
      />

      <div className="space-y-3">
        <h2 className="text-xl font-semibold text-foreground">Districts</h2>
        <div className="space-y-3">
          {city.zones.map((zone) => (
            <ZoneCard key={zone.name} zone={zone} />
          ))}
        </div>
      </div>

      <div className="bg-card border border-border rounded-lg p-6 space-y-3">
        <h2 className="text-lg font-semibold text-foreground">Get Your Brief</h2>
        <p className="text-sm text-muted-foreground">
          Search any place, hotel, or neighborhood in {city.name}
        </p>
        <SearchBar
          onSearch={handleBriefSearch}
          placeholder={`Try "my hotel name" or "Taksim Square"...`}
          loading={briefLoading}
          error={briefError}
        />
        {briefLoading && (
          <p className="text-sm text-muted-foreground animate-pulse">Generating your orientation brief...</p>
        )}
      </div>

      {siblings.length > 0 && (
        <div className="space-y-3">
          <h2 className="text-xl font-semibold text-foreground">
            Other cities in {countrySlug && countrySlug.charAt(0).toUpperCase() + countrySlug.slice(1)}
          </h2>
          <div className="grid gap-3 grid-cols-2 sm:grid-cols-3">
            {siblings.map((c) => (
              <CityCard key={c.slug} city={c} countrySlug={countrySlug!} />
            ))}
          </div>
        </div>
      )}
    </div>
  );
}
