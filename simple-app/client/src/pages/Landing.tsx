import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { getCountries, geocode, generateBrief } from "../lib/api";
import type { CountryCard as CountryCardType } from "../lib/types";
import CountryCard from "../components/CountryCard";
import SearchBar from "../components/SearchBar";

export default function Landing() {
  const navigate = useNavigate();
  const [countries, setCountries] = useState<CountryCardType[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  useEffect(() => {
    getCountries().then(setCountries).catch(() => {});
  }, []);

  async function handleSearch(address: string) {
    setLoading(true);
    setError("");
    try {
      const geo = await geocode(address);
      const brief = await generateBrief({
        lat: geo.lat,
        lng: geo.lng,
        anchor_name: geo.formatted_address,
      });
      navigate(`/brief/${brief.id}`);
    } catch (e) {
      setError(e instanceof Error ? e.message : "Something went wrong");
    } finally {
      setLoading(false);
    }
  }

  return (
    <div className="space-y-8 pt-6">
      <div className="text-center space-y-3">
        <h1 className="text-4xl font-bold text-primary">Atlas</h1>
        <p className="text-muted-foreground text-lg">Know where you are. Understand what's around you.</p>
      </div>

      <div className="bg-card border border-border rounded-lg p-6 space-y-3">
        <h2 className="text-lg font-semibold text-foreground">Orient Me</h2>
        <p className="text-sm text-muted-foreground">Enter any address for an instant orientation brief</p>
        <SearchBar onSearch={handleSearch} placeholder="Enter an address or place..." loading={loading} error={error} />
        {loading && (
          <p className="text-sm text-muted-foreground animate-pulse">Generating your orientation brief...</p>
        )}
      </div>

      {countries.length > 0 && (
        <div className="space-y-4">
          <h2 className="text-lg font-semibold text-foreground">Explore Countries</h2>
          <div className="grid gap-3 grid-cols-1 sm:grid-cols-2">
            {countries.map((c) => (
              <CountryCard key={c.slug} country={c} />
            ))}
          </div>
        </div>
      )}
    </div>
  );
}
