import { useState, useEffect } from "react";
import { useParams } from "react-router-dom";
import { getBrief } from "../lib/api";
import { renderMarkdown } from "../lib/markdown";
import type { BriefDetail } from "../lib/types";
import Breadcrumbs from "../components/Breadcrumbs";
import ZoneMap from "../components/ZoneMap";
import ZoneLegend from "../components/ZoneLegend";
import ZoneCard from "../components/ZoneCard";
import LoadingSkeleton from "../components/LoadingSkeleton";
import NotFound from "../components/NotFound";

export default function Brief() {
  const { id, country, city } = useParams<{ id: string; country?: string; city?: string }>();
  const [brief, setBrief] = useState<BriefDetail | null>(null);
  const [loading, setLoading] = useState(true);
  const [notFound, setNotFound] = useState(false);
  const [copied, setCopied] = useState(false);

  useEffect(() => {
    if (!id) return;
    setLoading(true);
    getBrief(id)
      .then(setBrief)
      .catch(() => setNotFound(true))
      .finally(() => setLoading(false));
  }, [id]);

  function handleShare() {
    navigator.clipboard.writeText(window.location.href);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  }

  if (loading) return <LoadingSkeleton />;
  if (notFound || !brief) return <NotFound />;

  const breadcrumbs: Array<{ label: string; to?: string }> = [{ label: "Home", to: "/" }];
  if (country && city) {
    breadcrumbs.push({
      label: country.charAt(0).toUpperCase() + country.slice(1),
      to: `/explore/${country}`,
    });
    breadcrumbs.push({
      label: city.charAt(0).toUpperCase() + city.slice(1),
      to: `/explore/${country}/${city}`,
    });
  }
  breadcrumbs.push({ label: "Your Brief" });

  const nonAnchorZones = brief.zones.filter((z) => z.type !== "anchor");

  return (
    <div className="space-y-6 pt-2">
      <Breadcrumbs items={breadcrumbs} />

      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-foreground">{brief.anchor_name}</h1>
          <p className="text-sm text-muted-foreground">
            {brief.generated_by === "ai" ? "AI-generated" : "Curated"} orientation brief
          </p>
        </div>
        <button
          onClick={handleShare}
          className="text-sm bg-card border border-border px-4 py-2 rounded-lg hover:border-primary/50 transition-colors"
        >
          {copied ? "Copied!" : "Share ↗"}
        </button>
      </div>

      <ZoneMap
        center={{ lat: brief.anchor_lat, lng: brief.anchor_lng }}
        zoom={14}
        zones={brief.zones}
        anchor={{ lat: brief.anchor_lat, lng: brief.anchor_lng, name: brief.anchor_name }}
      />

      <ZoneLegend zones={nonAnchorZones} anchorName={brief.anchor_name} />

      <div
        className="prose prose-invert prose-sm max-w-none text-muted-foreground [&_strong]:text-foreground [&_h2]:text-foreground [&_h3]:text-foreground"
        dangerouslySetInnerHTML={{ __html: renderMarkdown(brief.brief_markdown) }}
      />

      <div className="space-y-3">
        <h2 className="text-xl font-semibold text-foreground">Zones</h2>
        {brief.zones.map((zone) => (
          <ZoneCard key={zone.name} zone={zone} />
        ))}
      </div>
    </div>
  );
}
