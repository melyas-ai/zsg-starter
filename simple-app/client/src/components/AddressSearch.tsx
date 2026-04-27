import { useState, useRef, useEffect, useCallback } from "react";
import { placesAutocomplete, placeDetails, type PlacePrediction } from "../lib/api";

interface AddressSearchProps {
  onConfirm: (location: { lat: number; lng: number; formatted_address: string }) => void;
  placeholder?: string;
  loading?: boolean;
  error?: string;
  biasLocation?: { lat: number; lng: number };
}

export default function AddressSearch({
  onConfirm,
  placeholder = 'Try "Hilton Istanbul" or "Shibuya, Tokyo"...',
  loading,
  error,
  biasLocation,
}: AddressSearchProps) {
  const [query, setQuery] = useState("");
  const [predictions, setPredictions] = useState<PlacePrediction[]>([]);
  const [showDropdown, setShowDropdown] = useState(false);
  const [selected, setSelected] = useState<{ lat: number; lng: number; formatted_address: string } | null>(null);
  const [resolving, setResolving] = useState(false);
  const debounceRef = useRef<ReturnType<typeof setTimeout>>();
  const containerRef = useRef<HTMLDivElement>(null);

  const fetchPredictions = useCallback(
    async (input: string) => {
      if (input.length < 2) {
        setPredictions([]);
        return;
      }
      try {
        const results = await placesAutocomplete(input, biasLocation);
        setPredictions(results);
        setShowDropdown(results.length > 0);
      } catch {
        setPredictions([]);
      }
    },
    [biasLocation]
  );

  function handleInputChange(value: string) {
    setQuery(value);
    setSelected(null);
    if (debounceRef.current) clearTimeout(debounceRef.current);
    debounceRef.current = setTimeout(() => fetchPredictions(value), 300);
  }

  async function handleSelect(prediction: PlacePrediction) {
    setQuery(prediction.description);
    setShowDropdown(false);
    setPredictions([]);
    setResolving(true);
    try {
      const details = await placeDetails(prediction.place_id);
      setSelected(details);
    } catch {
      setSelected(null);
    } finally {
      setResolving(false);
    }
  }

  function handleConfirm() {
    if (selected) onConfirm(selected);
  }

  useEffect(() => {
    function handleClickOutside(e: MouseEvent) {
      if (containerRef.current && !containerRef.current.contains(e.target as Node)) {
        setShowDropdown(false);
      }
    }
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  useEffect(() => {
    return () => {
      if (debounceRef.current) clearTimeout(debounceRef.current);
    };
  }, []);

  return (
    <div ref={containerRef} className="w-full space-y-3">
      <div className="relative">
        <input
          type="text"
          value={query}
          onChange={(e) => handleInputChange(e.target.value)}
          onFocus={() => predictions.length > 0 && setShowDropdown(true)}
          placeholder={placeholder}
          className="w-full bg-card border border-border rounded-lg px-4 py-3 text-foreground placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-primary/50 text-base"
          disabled={loading}
        />

        {showDropdown && predictions.length > 0 && (
          <ul className="absolute z-50 w-full mt-1 bg-card border border-border rounded-lg shadow-lg overflow-hidden">
            {predictions.map((p) => (
              <li key={p.place_id}>
                <button
                  type="button"
                  onClick={() => handleSelect(p)}
                  className="w-full text-left px-4 py-3 hover:bg-primary/10 transition-colors border-b border-border last:border-b-0"
                >
                  <span className="text-sm font-medium text-foreground">{p.main_text}</span>
                  {p.secondary_text && (
                    <span className="text-xs text-muted-foreground ml-2">{p.secondary_text}</span>
                  )}
                </button>
              </li>
            ))}
          </ul>
        )}
      </div>

      {resolving && (
        <p className="text-sm text-muted-foreground animate-pulse">Looking up location...</p>
      )}

      {selected && !loading && (
        <div className="bg-card border border-primary/30 rounded-lg p-4 space-y-3">
          <div className="flex items-start justify-between gap-3">
            <div>
              <p className="text-xs text-muted-foreground uppercase tracking-wider">Your location</p>
              <p className="text-sm text-foreground mt-1">{selected.formatted_address}</p>
              <p className="text-xs text-muted-foreground mt-1">
                {selected.lat.toFixed(4)}, {selected.lng.toFixed(4)}
              </p>
            </div>
            <button
              onClick={handleConfirm}
              disabled={loading}
              className="bg-primary text-primary-foreground px-5 py-2.5 rounded-lg font-medium text-sm disabled:opacity-50 transition-opacity shrink-0"
            >
              {loading ? "Generating..." : "Generate Brief"}
            </button>
          </div>
        </div>
      )}

      {loading && (
        <p className="text-sm text-muted-foreground animate-pulse">Generating your orientation brief...</p>
      )}

      {error && <p className="text-red-400 text-sm">{error}</p>}
    </div>
  );
}
