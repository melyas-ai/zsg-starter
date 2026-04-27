import { Link } from "react-router-dom";
import type { CountryCard as CountryCardType } from "../lib/types";

export default function CountryCard({ country }: { country: CountryCardType }) {
  return (
    <Link
      to={`/explore/${country.slug}`}
      className="block bg-card border border-border rounded-lg p-5 hover:border-primary/50 transition-colors"
    >
      <h3 className="text-lg font-semibold text-foreground">{country.name}</h3>
      <p className="text-sm text-muted-foreground mt-1">Explore cities and regions →</p>
    </Link>
  );
}
