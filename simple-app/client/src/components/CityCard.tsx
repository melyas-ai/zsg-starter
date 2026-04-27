import { Link } from "react-router-dom";
import type { CityCard as CityCardType } from "../lib/types";

export default function CityCard({ city, countrySlug }: { city: CityCardType; countrySlug: string }) {
  return (
    <Link
      to={`/explore/${countrySlug}/${city.slug}`}
      className="block bg-card border border-border rounded-lg p-4 hover:border-primary/50 transition-colors"
    >
      <h3 className="font-medium text-foreground">{city.name}</h3>
    </Link>
  );
}
