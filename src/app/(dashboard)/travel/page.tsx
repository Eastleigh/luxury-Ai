"use client";

import { GlassCard } from "@/components/ui/GlassCard";
import { Badge } from "@/components/ui/Badge";
import { Button } from "@/components/ui/Button";
import { StatCard } from "@/components/ui/StatCard";
import {
  Plane,
  Search,
  MapPin,
  Calendar,
  ArrowRightLeft,
  Sparkles,
  Globe,
  Star,
  Clock,
  Filter,
  ArrowUpRight,
  Send,
  Loader2,
  AlertCircle,
} from "lucide-react";
import { awardResults as mockAwardResults } from "@/data/mock";
import { formatCurrency, formatPoints, useMounted } from "@/lib/utils";
import { askAI } from "@/lib/ai";
import { AIResponsePanel } from "@/components/ui/AIResponsePanel";
import { motion } from "framer-motion";
import { useState } from "react";

interface AwardResult {
  id: string;
  airline: string;
  route: string;
  cabin: string;
  pointsRequired: number;
  taxesFees: number;
  valuePerPoint: number;
  availability: string;
  transferPartner: string;
  source?: string;
  date?: string;
}

function parseSeatsAeroResults(data: Record<string, unknown>): AwardResult[] {
  const results: AwardResult[] = [];
  const flights = (data.data as Array<Record<string, unknown>>) || (data as unknown as Array<Record<string, unknown>>);
  if (!Array.isArray(flights)) return results;

  for (const flight of flights.slice(0, 20)) {
    const pointsRequired = Number(flight.miles || flight.points || flight.mileage_cost || 0);
    const taxesFees = Number(flight.taxes || flight.fees || flight.tax || 0);
    const retailPrice = Number(flight.retail_price || flight.cash_price || 0);
    const valuePerPoint = pointsRequired > 0 && retailPrice > 0
      ? Number(((retailPrice - taxesFees) / pointsRequired * 100).toFixed(1))
      : pointsRequired > 0
      ? Number((taxesFees > 100 ? 2.0 : 1.5).toFixed(1))
      : 0;

    const origin = String(flight.origin_airport || flight.origin || flight.departure || "");
    const destination = String(flight.destination_airport || flight.destination || flight.arrival || "");
    const airline = String(flight.airline || flight.carrier || flight.source || "Unknown");
    const cabin = String(flight.cabin || flight.class || "Economy");
    const displayCabin = cabin.charAt(0).toUpperCase() + cabin.slice(1);

    const hasAvailability = flight.availability !== false && flight.available !== false;

    results.push({
      id: `seats-${results.length}`,
      airline,
      route: `${origin} → ${destination}`,
      cabin: displayCabin,
      pointsRequired,
      taxesFees,
      valuePerPoint,
      availability: hasAvailability ? "available" : "limited",
      transferPartner: String(flight.source || flight.program || airline),
      source: "seats.aero",
      date: String(flight.date || flight.departure_date || ""),
    });
  }

  return results;
}

export default function TravelPage() {
  const mounted = useMounted();
  const [conciergeQuery, setConciergeQuery] = useState("");
  const [aiResponse, setAiResponse] = useState<string | null>(null);
  const [aiLoading, setAiLoading] = useState(false);
  const [aiError, setAiError] = useState<string | null>(null);

  const [origin, setOrigin] = useState("JFK");
  const [destination, setDestination] = useState("");
  const [departureDate, setDepartureDate] = useState("");
  const [cabin, setCabin] = useState("business");
  const [searchResults, setSearchResults] = useState<AwardResult[]>([]);
  const [searching, setSearching] = useState(false);
  const [searchError, setSearchError] = useState<string | null>(null);
  const [hasSearched, setHasSearched] = useState(false);
  const [showFilters, setShowFilters] = useState(false);
  const [alertSet, setAlertSet] = useState(false);

  const displayResults = hasSearched ? searchResults : mockAwardResults;

  const handlePlanTrip = async () => {
    if (!conciergeQuery.trim()) return;
    setAiLoading(true);
    setAiError(null);
    setAiResponse(null);
    const { result, error } = await askAI({
      type: "travel",
      prompt: conciergeQuery,
      context: "User has 487,250 Amex MR points, 342,800 Chase UR points, 215,600 Capital One miles, 892,400 Hilton points, 445,000 Marriott points. Current transfer bonuses: Amex MR to Virgin Atlantic 30%, Chase UR to British Airways 25%, Amex MR to Hilton 40%.",
    });
    setAiLoading(false);
    if (error) setAiError(error);
    else setAiResponse(result ?? null);
  };

  const handleSearch = async () => {
    if (!origin.trim()) return;
    setSearching(true);
    setSearchError(null);
    setHasSearched(true);
    try {
      const res = await fetch("/api/awards", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          origin: origin.toUpperCase().trim(),
          destination: destination.toUpperCase().trim() || undefined,
          departureDate: departureDate || undefined,
          cabin: cabin || undefined,
        }),
      });

      const data = await res.json();

      if (!res.ok) {
        if (res.status === 503) {
          setSearchError("Seats.aero API key not configured. Add SEATS_AERO_API_KEY to your environment variables.");
        } else {
          setSearchError(data.error || `Search failed (${res.status})`);
        }
        setSearchResults([]);
        return;
      }

      const parsed = parseSeatsAeroResults(data);
      setSearchResults(parsed);

      if (parsed.length === 0) {
        setSearchError("No award availability found for this search. Try different dates or routes.");
      }
    } catch (err) {
      setSearchError(err instanceof Error ? err.message : "Search failed");
      setSearchResults([]);
    } finally {
      setSearching(false);
    }
  };

  const cabinColors: Record<string, string> = {
    Business: "text-blue-400",
    First: "text-luxury-gold",
    Economy: "text-platinum-400",
  };

  const bestValue = displayResults.length > 0
    ? displayResults.reduce((best, r) => (r.valuePerPoint > best.valuePerPoint ? r : best))
    : null;

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-white">
            AI Travel Concierge & Award Search
          </h1>
          <p className="mt-1 text-sm text-platinum-400">
            Natural language trip planning and real-time award flight search powered by AI & Seats.aero.
          </p>
        </div>
      </div>

      {/* AI Concierge */}
      <GlassCard delay={0.1} glow>
        <div className="flex items-center gap-2">
          <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-luxury-gold/10">
            <Sparkles className="h-4 w-4 text-luxury-gold" />
          </div>
          <div>
            <h2 className="text-base font-semibold text-white">
              AI Travel Concierge
            </h2>
            <p className="text-[10px] text-platinum-500">
              Tell me where you want to go in natural language
            </p>
          </div>
        </div>
        <div className="mt-4 flex gap-3">
          <div className="relative flex-1">
            <input
              type="text"
              value={conciergeQuery}
              onChange={(e) => setConciergeQuery(e.target.value)}
              onKeyDown={(e) => e.key === "Enter" && handlePlanTrip()}
              placeholder="I want to take my family to Italy in business class in September..."
              className="h-12 w-full rounded-xl border border-white/[0.06] bg-white/[0.03] px-4 pr-12 text-sm text-white placeholder-platinum-500 outline-none transition-all focus:border-luxury-gold/30 focus:ring-1 focus:ring-luxury-gold/20"
            />
            <Send className="absolute right-4 top-1/2 h-4 w-4 -translate-y-1/2 text-platinum-500" />
          </div>
          <Button variant="gold" onClick={handlePlanTrip} disabled={aiLoading || !conciergeQuery.trim()}>
            <Sparkles className="h-4 w-4" />
            {aiLoading ? "Planning..." : "Plan Trip"}
          </Button>
        </div>
        <div className="mt-3 flex flex-wrap gap-2">
          {[
            "Family trip to Maldives in December",
            "Business class to Tokyo, flexible dates",
            "Europe tour under 200K points",
            "First class anywhere in Asia",
          ].map((suggestion) => (
            <button
              key={suggestion}
              onClick={() => setConciergeQuery(suggestion)}
              className="rounded-lg border border-white/[0.06] bg-white/[0.02] px-3 py-1.5 text-[11px] text-platinum-400 transition-colors hover:border-luxury-gold/20 hover:text-white"
            >
              {suggestion}
            </button>
          ))}
        </div>

        <AIResponsePanel
          response={aiResponse}
          loading={aiLoading}
          error={aiError}
          onClose={() => { setAiResponse(null); setAiError(null); }}
        />
      </GlassCard>

      {/* Search Stats */}
      <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-4">
        <StatCard
          label="Results Found"
          value={hasSearched ? searchResults.length.toString() : mockAwardResults.length.toLocaleString()}
          change={hasSearched ? "Live from Seats.aero" : "Sample data"}
          trend="up"
          icon={Globe}
          delay={0.2}
        />
        <StatCard
          label="Best Value Found"
          value={bestValue ? `${bestValue.valuePerPoint} cpp` : "—"}
          change={bestValue ? bestValue.airline : "Search to find"}
          trend="up"
          icon={Star}
          iconColor="text-luxury-gold"
          delay={0.25}
        />
        <StatCard
          label="Transfer Partners"
          value="24"
          change="4 with bonuses"
          trend="up"
          icon={ArrowRightLeft}
          iconColor="text-emerald-400"
          delay={0.3}
        />
        <StatCard
          label="Search Status"
          value={searching ? "Searching..." : hasSearched ? "Complete" : "Ready"}
          change={hasSearched ? `${searchResults.length} awards found` : "Enter route to search"}
          trend="up"
          icon={Search}
          iconColor="text-blue-400"
          delay={0.35}
        />
      </div>

      {/* Award Search */}
      <GlassCard delay={0.4}>
        <div className="flex items-center justify-between">
          <h2 className="text-base font-semibold text-white">
            Award Search Engine
          </h2>
          <div className="flex gap-2">
            <Button variant="ghost" size="sm" onClick={() => setShowFilters(!showFilters)}>
              <Filter className="h-3 w-3" />
              Filters
            </Button>
            <Button
              variant={alertSet ? "gold" : "secondary"}
              size="sm"
              onClick={() => setAlertSet(!alertSet)}
            >
              <Clock className="h-3 w-3" />
              {alertSet ? "Alert On" : "Set Alert"}
            </Button>
          </div>
        </div>

        <div className="mt-4 grid grid-cols-1 gap-3 sm:grid-cols-5">
          <div className="sm:col-span-1">
            <label className="text-[10px] font-medium uppercase tracking-wider text-platinum-500">
              From
            </label>
            <div className="relative mt-1">
              <MapPin className="absolute left-3 top-1/2 h-3.5 w-3.5 -translate-y-1/2 text-platinum-500" />
              <input
                type="text"
                value={origin}
                onChange={(e) => setOrigin(e.target.value)}
                placeholder="JFK"
                className="h-9 w-full rounded-lg border border-white/[0.06] bg-white/[0.03] pl-9 pr-3 text-sm text-white outline-none focus:border-luxury-gold/30"
              />
            </div>
          </div>
          <div className="sm:col-span-1">
            <label className="text-[10px] font-medium uppercase tracking-wider text-platinum-500">
              To
            </label>
            <div className="relative mt-1">
              <MapPin className="absolute left-3 top-1/2 h-3.5 w-3.5 -translate-y-1/2 text-platinum-500" />
              <input
                type="text"
                value={destination}
                onChange={(e) => setDestination(e.target.value)}
                placeholder="NRT, LHR..."
                className="h-9 w-full rounded-lg border border-white/[0.06] bg-white/[0.03] pl-9 pr-3 text-sm text-white outline-none focus:border-luxury-gold/30"
              />
            </div>
          </div>
          <div className="sm:col-span-1">
            <label className="text-[10px] font-medium uppercase tracking-wider text-platinum-500">
              Date
            </label>
            <div className="relative mt-1">
              <Calendar className="absolute left-3 top-1/2 h-3.5 w-3.5 -translate-y-1/2 text-platinum-500" />
              <input
                type="date"
                value={departureDate}
                onChange={(e) => setDepartureDate(e.target.value)}
                className="h-9 w-full rounded-lg border border-white/[0.06] bg-white/[0.03] pl-9 pr-3 text-sm text-white outline-none focus:border-luxury-gold/30"
              />
            </div>
          </div>
          <div className="sm:col-span-1">
            <label className="text-[10px] font-medium uppercase tracking-wider text-platinum-500">
              Cabin
            </label>
            <select
              value={cabin}
              onChange={(e) => setCabin(e.target.value)}
              className="mt-1 h-9 w-full rounded-lg border border-white/[0.06] bg-white/[0.03] px-3 text-sm text-white outline-none focus:border-luxury-gold/30"
            >
              <option value="business">Business</option>
              <option value="first">First</option>
              <option value="economy">Economy</option>
            </select>
          </div>
          <div className="flex items-end sm:col-span-1">
            <Button
              variant="gold"
              className="h-9 w-full"
              onClick={handleSearch}
              disabled={searching || !origin.trim()}
            >
              {searching ? (
                <Loader2 className="h-3.5 w-3.5 animate-spin" />
              ) : (
                <Search className="h-3.5 w-3.5" />
              )}
              {searching ? "Searching..." : "Search"}
            </Button>
          </div>
        </div>

        {searchError && (
          <div className="mt-3 flex items-center gap-2 rounded-lg border border-red-500/20 bg-red-500/5 px-3 py-2">
            <AlertCircle className="h-4 w-4 flex-shrink-0 text-red-400" />
            <p className="text-xs text-red-400">{searchError}</p>
          </div>
        )}
      </GlassCard>

      {/* Results */}
      <div>
        <div className="mb-4 flex items-center justify-between">
          <h2 className="text-base font-semibold text-white">
            Award Availability
          </h2>
          <div className="flex items-center gap-2">
            {hasSearched && (
              <Badge variant="success" size="sm">Live Results</Badge>
            )}
            {!hasSearched && (
              <Badge variant="default" size="sm">Sample Data</Badge>
            )}
            <Badge variant="info">{displayResults.length} results</Badge>
          </div>
        </div>
        <div className="space-y-3">
          {displayResults.map((result, i) => (
            <motion.div
              key={result.id}
              initial={mounted ? { opacity: 0, y: 10 } : false}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.5 + i * 0.05 }}
              className="group rounded-2xl border border-white/[0.06] bg-white/[0.02] p-4 transition-all hover:border-luxury-gold/20 hover:bg-white/[0.04]"
            >
              <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
                <div className="flex items-center gap-4">
                  <div className="flex h-11 w-11 items-center justify-center rounded-xl bg-white/[0.04] flex-shrink-0">
                    <Plane className="h-5 w-5 text-luxury-gold" />
                  </div>
                  <div>
                    <div className="flex items-center gap-2">
                      <p className="text-sm font-semibold text-white">
                        {result.airline}
                      </p>
                      <Badge
                        variant={
                          result.availability === "available"
                            ? "success"
                            : result.availability === "limited"
                            ? "warning"
                            : "default"
                        }
                        size="sm"
                      >
                        {result.availability}
                      </Badge>
                      {"source" in result && result.source === "seats.aero" && (
                        <Badge variant="info" size="sm">Seats.aero</Badge>
                      )}
                    </div>
                    <p className="text-xs text-platinum-400">
                      {result.route}
                      {"date" in result && result.date ? ` · ${result.date}` : ""}
                    </p>
                  </div>
                </div>

                <div className="grid grid-cols-3 gap-3 sm:flex sm:items-center sm:gap-6">
                  <div className="text-center">
                    <p className="text-[10px] text-platinum-500">Cabin</p>
                    <p
                      className={`text-sm font-medium ${
                        cabinColors[result.cabin] || "text-white"
                      }`}
                    >
                      {result.cabin}
                    </p>
                  </div>
                  <div className="text-center">
                    <p className="text-[10px] text-platinum-500">Points</p>
                    <p className="stat-value text-sm font-semibold text-white">
                      {formatPoints(result.pointsRequired)}
                    </p>
                  </div>
                  <div className="text-center">
                    <p className="text-[10px] text-platinum-500">Taxes</p>
                    <p className="text-sm text-platinum-300">
                      {formatCurrency(result.taxesFees)}
                    </p>
                  </div>
                  <div className="text-center">
                    <p className="text-[10px] text-platinum-500">Value</p>
                    <p className="text-sm font-semibold text-emerald-400">
                      {result.valuePerPoint} cpp
                    </p>
                  </div>
                  <div className="text-center">
                    <p className="text-[10px] text-platinum-500">Via</p>
                    <p className="text-xs text-luxury-gold">
                      {result.transferPartner}
                    </p>
                  </div>
                  <Button
                    variant="secondary"
                    size="sm"
                    className="sm:opacity-0 transition-opacity group-hover:opacity-100"
                    onClick={() => {
                      const query = encodeURIComponent(`${result.airline} ${result.route} ${result.cabin} class award booking`);
                      window.open(`https://www.google.com/search?q=${query}`, "_blank");
                    }}
                  >
                    Book
                    <ArrowUpRight className="h-3 w-3" />
                  </Button>
                </div>
              </div>
            </motion.div>
          ))}
        </div>
      </div>
    </div>
  );
}
