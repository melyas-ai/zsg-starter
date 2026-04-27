import { useState, useEffect, useCallback } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { getCountry } from "../lib/api";
import { renderMarkdown } from "../lib/markdown";
import type { CountryDetail } from "../lib/types";
import Breadcrumbs from "../components/Breadcrumbs";
import ZoneMap from "../components/ZoneMap";
import CityCard from "../components/CityCard";
import LoadingSkeleton from "../components/LoadingSkeleton";
import NotFound from "../components/NotFound";

export default function Country() {
  const { country: slug } = useParams<{ country: string }>();
  const navigate = useNavigate();
  const [country, setCountry] = useState<CountryDetail | null>(null);
  const [loading, setLoading] = useState(true);
  const [notFound, setNotFound] = useState(false);

  useEffect(() => {
    if (!slug) return;
    setLoading(true);
    getCountry(slug)
      .then(setCountry)
      .catch(() => setNotFound(true))
      .finally(() => setLoading(false));
  }, [slug]);

  const handleCityClick = useCallback((citySlug: string) => {
    navigate(`/explore/${slug}/${citySlug}`);
  }, [navigate, slug]);

  if (loading) return <LoadingSkeleton />;
  if (notFound || !country) return <NotFound />;

  const facts = country.quick_facts;
  const cityMarkers = country.cities.map((c) => ({
    lat: c.map_center.lat,
    lng: c.map_center.lng,
    name: c.name,
    slug: c.slug,
  }));

  return (
    <div className="space-y-6 pt-2">
      <Breadcrumbs items={[{ label: "Home", to: "/" }, { label: country.name }]} />

      <h1 className="text-3xl font-bold text-foreground">{country.name}</h1>

      <div className="grid grid-cols-2 sm:grid-cols-3 gap-3">
        {[
          { label: "Visa", value: facts.visa },
          { label: "Currency", value: facts.currency },
          { label: "Language", value: facts.language },
          { label: "Timezone", value: facts.timezone },
          { label: "Best Time", value: facts.best_time },
        ].map((f) => (
          <div key={f.label} className="bg-card border border-border rounded-lg p-3">
            <p className="text-xs text-muted-foreground uppercase tracking-wider">{f.label}</p>
            <p className="text-sm text-foreground mt-1">{f.value}</p>
          </div>
        ))}
      </div>

      {country.highlights && country.highlights.length > 0 && (
        <div className="bg-card border border-border rounded-lg p-5 space-y-3">
          <h2 className="text-sm font-semibold text-foreground uppercase tracking-wider">Key Takeaways</h2>
          <ul className="space-y-2">
            {country.highlights.map((h, i) => (
              <li key={i} className="flex items-start gap-3 text-sm text-foreground">
                <span className="mt-1.5 h-1.5 w-1.5 rounded-full bg-primary shrink-0" />
                {h}
              </li>
            ))}
          </ul>
        </div>
      )}

      <ZoneMap
        center={country.map_center}
        zoom={country.map_zoom}
        zones={[]}
        cityMarkers={cityMarkers}
        onCityClick={handleCityClick}
      />

      <details className="group">
        <summary className="cursor-pointer text-sm font-medium text-muted-foreground hover:text-foreground transition-colors">
          More details
        </summary>
        <div
          className="prose prose-invert prose-sm max-w-none text-muted-foreground/80 [&_strong]:text-foreground mt-3"
          dangerouslySetInnerHTML={{ __html: renderMarkdown(country.overview) }}
        />
      </details>

      {country.cities.length > 0 && (
        <div className="space-y-3">
          <h2 className="text-xl font-semibold text-foreground">Cities</h2>
          <div className="grid gap-3 grid-cols-2 sm:grid-cols-3">
            {country.cities.map((city) => (
              <CityCard key={city.slug} city={city} countrySlug={country.slug} />
            ))}
          </div>
        </div>
      )}
    </div>
  );
}
