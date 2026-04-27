import { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { getCity, getCities, generateBrief } from "../lib/api";
import { renderMarkdown } from "../lib/markdown";
import type { CityDetail, CityCard as CityCardType } from "../lib/types";
import Breadcrumbs from "../components/Breadcrumbs";
import ZoneMap from "../components/ZoneMap";
import ZoneLegend from "../components/ZoneLegend";
import ZoneCard from "../components/ZoneCard";
import CityCard from "../components/CityCard";
import AddressSearch from "../components/AddressSearch";
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

  async function handleConfirm(location: { lat: number; lng: number; formatted_address: string }) {
    setBriefLoading(true);
    setBriefError("");
    try {
      const brief = await generateBrief({
        lat: location.lat,
        lng: location.lng,
        anchor_name: location.formatted_address,
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

      {city.highlights && city.highlights.length > 0 && (
        <div className="bg-card border border-border rounded-lg p-5 space-y-3">
          <h2 className="text-sm font-semibold text-foreground uppercase tracking-wider">Key Takeaways</h2>
          <ul className="space-y-2">
            {city.highlights.map((h, i) => (
              <li key={i} className="flex items-start gap-3 text-sm text-foreground">
                <span className="mt-1.5 h-1.5 w-1.5 rounded-full bg-primary shrink-0" />
                {h}
              </li>
            ))}
          </ul>
        </div>
      )}

      <ZoneMap center={city.map_center} zoom={city.map_zoom} zones={city.zones} />

      <ZoneLegend zones={city.zones} />

      <details className="group">
        <summary className="cursor-pointer text-sm font-medium text-muted-foreground hover:text-foreground transition-colors">
          More details
        </summary>
        <div
          className="prose prose-invert prose-sm max-w-none text-muted-foreground/80 [&_strong]:text-foreground mt-3"
          dangerouslySetInnerHTML={{ __html: renderMarkdown(city.overview) }}
        />
      </details>

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
        <AddressSearch
          onConfirm={handleConfirm}
          placeholder={'Try "hotel name" or "landmark, neighborhood"...'}
          loading={briefLoading}
          error={briefError}
          biasLocation={city.map_center}
        />
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
