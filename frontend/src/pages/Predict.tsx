import { useState } from "react";
import {
  ArrowRight,
  CheckCircle,
  AlertTriangle,
  Clock,
  Droplets,
  Sun,
  CloudRain,
  Coins,
  Sparkles,
  RotateCcw,
  TrendingUp,
  MapPin,
  Layers,
  Check,
} from "lucide-react";
import {
  predictionsApi,
  type CreatePredictionInput,
} from "../api";
import { Card, SectionHeader, Input, Select, Button } from "../components/ui";

const CROP_OPTIONS = [
  { value: "boro_rice", label: "Boro Rice (High Yielding)" },
  { value: "aman_rice", label: "Aman Rice (Rainfed Baseline)" },
  { value: "wheat", label: "Wheat (Winter Crop)" },
  { value: "maize", label: "Maize (Hybrid Grain)" },
  { value: "potato", label: "Potato (Tuber)" },
];

const LAND_TYPE_OPTIONS = [
  { value: "irrigated", label: "Irrigated (Deep Tube Well / Canal)" },
  { value: "rainfed", label: "Rainfed (Monsoon Dependent)" },
  { value: "mixed", label: "Mixed / Supplemental Irrigation" },
];

const SCENARIO_METADATA: Record<
  string,
  {
    title: string;
    subtitle: string;
    multiplier: string;
    badge: string;
    cardStyle: string;
    badgeStyle: string;
    textStyle: string;
    profitStyle: string;
    icon: React.ElementType;
  }
> = {
  normal: {
    title: "Normal Rainfall",
    subtitle: "Optimal seasonal precipitation",
    multiplier: "1.0x Baseline",
    badge: "Optimal Scenario",
    cardStyle:
      "border-emerald-500/50 bg-gradient-to-br from-emerald-950/30 via-surface-card to-surface shadow-emerald-950/20",
    badgeStyle: "bg-emerald-500/15 text-emerald-400 border-emerald-500/30",
    textStyle: "text-emerald-400",
    profitStyle: "text-emerald-400",
    icon: Sun,
  },
  low_rain: {
    title: "Low Rainfall",
    subtitle: "Drought & moisture deficiency",
    multiplier: "0.8x Baseline",
    badge: "Drought Risk",
    cardStyle:
      "border-amber-500/50 bg-gradient-to-br from-amber-950/30 via-surface-card to-surface shadow-amber-950/20",
    badgeStyle: "bg-amber-500/15 text-amber-400 border-amber-500/30",
    textStyle: "text-amber-400",
    profitStyle: "text-amber-400",
    icon: Droplets,
  },
  heavy_rain: {
    title: "Heavy Rainfall",
    subtitle: "Excess waterlogging & flood risk",
    multiplier: "0.9x Baseline",
    badge: "Flood Risk",
    cardStyle:
      "border-blue-500/50 bg-gradient-to-br from-blue-950/30 via-surface-card to-surface shadow-blue-950/20",
    badgeStyle: "bg-blue-500/15 text-blue-400 border-blue-500/30",
    textStyle: "text-blue-400",
    profitStyle: "text-blue-400",
    icon: CloudRain,
  },
};

type Step = "farmer" | "farm" | "results";

export default function Predict() {
  const [step, setStep] = useState<Step>("farmer");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [result, setResult] = useState<any>(null);
  const [selectedScenario, setSelectedScenario] = useState<string>("normal");

  // Form states retained exactly
  const [farmerName, setFarmerName] = useState("");
  const [areaHa, setAreaHa] = useState("");
  const [district, setDistrict] = useState("");
  const [upazila, setUpazila] = useState("");
  const [landType, setLandType] = useState("irrigated");
  const [cropCode, setCropCode] = useState("boro_rice");
  const [plantingDate, setPlantingDate] = useState("");
  const [marketPrice, setMarketPrice] = useState("");
  const [totalCost, setTotalCost] = useState("");

  const handleCreatePrediction = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError(null);

    const input: CreatePredictionInput = {
      farmer_name: farmerName,
      area_ha: parseFloat(areaHa),
      district,
      upazila,
      land_type: landType,
      crop_code: cropCode,
      planting_date: plantingDate,
      market_price_bdt_per_kg: parseFloat(marketPrice),
      total_cost_bdt: parseFloat(totalCost),
    };

    try {
      const res = await predictionsApi.createPrediction(input);
      setResult(res.data);
      setStep("results");
    } catch (err: any) {
      setError(
        err.response?.data?.error ||
          "Failed to create prediction. Please verify all inputs."
      );
    } finally {
      setLoading(false);
    }
  };

  const loadDemoData = () => {
    setFarmerName("Anisur Rahman");
    setAreaHa("1.5");
    setDistrict("Mymensingh");
    setUpazila("Trishal");
    setLandType("irrigated");
    setCropCode("boro_rice");
    setPlantingDate("2026-11-15");
    setMarketPrice("28.5");
    setTotalCost("85000");
  };

  const reset = () => {
    setStep("farmer");
    setResult(null);
    setError(null);
    setSelectedScenario("normal");
    setFarmerName("");
    setAreaHa("");
    setDistrict("");
    setUpazila("");
    setLandType("irrigated");
    setCropCode("boro_rice");
    setPlantingDate("");
    setMarketPrice("");
    setTotalCost("");
  };

  // ----------------------------------------------------
  // RESULTS VIEW: Scenario Comparison Cards
  // ----------------------------------------------------
  if (step === "results" && result) {
    const activeScenarioData =
      result.scenarios?.find((s: any) => s.scenario_code === selectedScenario) ||
      result.scenarios?.[0];

    const normalScenario = result.scenarios?.find(
      (s: any) => s.scenario_code === "normal"
    );
    const lowRainScenario = result.scenarios?.find(
      (s: any) => s.scenario_code === "low_rain"
    );

    const variancePercent =
      normalScenario && lowRainScenario && lowRainScenario.net_profit_bdt !== 0
        ? Math.round(
            ((normalScenario.net_profit_bdt - lowRainScenario.net_profit_bdt) /
              Math.abs(lowRainScenario.net_profit_bdt)) *
              100
          )
        : 12;

    return (
      <div className="max-w-6xl mx-auto px-6 py-10 space-y-8">
        {/* Navigation & Status Ribbon */}
        <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 border-b border-border/60 pb-6">
          <Button variant="ghost" onClick={reset} iconLeft={RotateCcw}>
            New Prediction
          </Button>

          <div className="flex items-center gap-3">
            <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-emerald-500/10 border border-emerald-500/20 text-emerald-400 text-xs font-semibold">
              <CheckCircle size={14} />
              Prediction ID: #{result.prediction_id}
            </span>
            <div className="text-xs font-mono text-text-secondary">
              Prototype estimate &bull; Not a real forecast
            </div>
          </div>
        </div>

        {/* Prediction Summary Header Card */}
        <Card className="border border-border/80 bg-surface-card">
          <div className="flex flex-col md:flex-row md:items-center justify-between gap-6">
            <div>
              <span className="text-xs font-semibold text-emerald-400 uppercase tracking-widest font-mono">
                Forecast Summary
              </span>
              <h2 className="text-2xl md:text-3xl font-display font-bold text-text-primary tracking-tight mt-1">
                {result.farmer_name}
              </h2>
              <div className="flex flex-wrap items-center gap-4 mt-2 text-xs text-text-secondary">
                <span className="flex items-center gap-1.5">
                  <MapPin size={14} className="text-accent" />
                  {result.farm?.district}, {result.farm?.upazila}
                </span>
                <span>&bull;</span>
                <span className="flex items-center gap-1.5">
                  <Layers size={14} className="text-accent" />
                  {result.crop_code?.replace("_", " ").toUpperCase()} ({result.farm?.area_ha} ha)
                </span>
                <span>&bull;</span>
                <span className="font-mono text-text-primary">
                  Currency: {result.currency} (৳)
                </span>
              </div>
            </div>

            <div className="flex items-center gap-3 bg-surface p-4 rounded-xl border border-border/80">
              <div className="text-right">
                <div className="text-xs text-text-secondary font-mono uppercase">
                  Optimal Net Margin
                </div>
                <div className="text-2xl font-display font-extrabold text-emerald-400">
                  ৳{normalScenario?.net_profit_bdt?.toLocaleString()}
                </div>
              </div>
              <div className="p-2.5 rounded-xl bg-emerald-500/10 border border-emerald-500/20 text-emerald-400">
                <TrendingUp size={22} />
              </div>
            </div>
          </div>
        </Card>

        {/* ---------------------------------------------------- */}
        {/* Scenario Comparison Cards (Distinct Color-Coded Cards) */}
        {/* ---------------------------------------------------- */}
        <div>
          <div className="mb-4 flex items-center justify-between">
            <div>
              <h3 className="text-lg font-display font-bold text-text-primary">
                Scenario Comparison Cards
              </h3>
              <p className="text-xs text-text-secondary">
                Click a weather scenario card below to view active operational breakdown.
              </p>
            </div>
            <span className="text-xs font-mono text-emerald-400 hidden sm:inline-block">
              +{variancePercent}% vs Low Rain
            </span>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {result.scenarios.map((s: any) => {
              const meta = SCENARIO_METADATA[s.scenario_code] || SCENARIO_METADATA.normal;
              const Icon = meta.icon;
              const isSelected = selectedScenario === s.scenario_code;

              return (
                <div
                  key={s.scenario_code}
                  onClick={() => setSelectedScenario(s.scenario_code)}
                  className={`rounded-2xl border p-6 transition-all duration-200 cursor-pointer relative overflow-hidden select-none ${
                    meta.cardStyle
                  } ${
                    isSelected
                      ? "ring-2 ring-accent scale-[1.02] shadow-xl"
                      : "opacity-90 hover:opacity-100 hover:border-accent/60 hover:scale-[1.01]"
                  }`}
                >
                  {/* Active Indicator Pin */}
                  {isSelected && (
                    <div className="absolute top-3 right-3 p-1 rounded-full bg-accent text-bg shadow-md">
                      <Check size={14} className="stroke-[3]" />
                    </div>
                  )}

                  {/* Header Badge */}
                  <div className="flex items-center gap-2 mb-3">
                    <span className="p-2 rounded-xl bg-surface/60 border border-border/60 text-text-primary">
                      <Icon size={18} className={meta.textStyle} />
                    </span>
                    <span
                      className={`text-[10px] uppercase font-bold tracking-wider px-2 py-0.5 rounded-full border ${meta.badgeStyle}`}
                    >
                      {meta.badge}
                    </span>
                  </div>

                  <h4 className="text-lg font-display font-bold text-text-primary mb-1">
                    {meta.title}
                  </h4>
                  <p className="text-xs text-text-secondary mb-4">
                    {meta.subtitle} &bull; <span className="font-mono">{meta.multiplier}</span>
                  </p>

                  <div className="space-y-3 pt-3 border-t border-border/40 font-mono text-xs">
                    <div className="flex justify-between">
                      <span className="text-text-secondary">Yield (t/ha):</span>
                      <span className="text-text-primary font-bold text-sm">
                        {s.yield_t_per_ha} t/ha
                      </span>
                    </div>

                    <div className="flex justify-between">
                      <span className="text-text-secondary">Production:</span>
                      <span className="text-text-primary">
                        {s.total_production_kg.toLocaleString()} kg
                      </span>
                    </div>

                    <div className="flex justify-between">
                      <span className="text-text-secondary">Revenue (BDT):</span>
                      <span className="text-text-primary">
                        ৳{s.revenue_bdt.toLocaleString()}
                      </span>
                    </div>

                    <div className="flex justify-between">
                      <span className="text-text-secondary">Cost (BDT):</span>
                      <span className="text-rose-400">
                        ৳{s.total_cost_bdt.toLocaleString()}
                      </span>
                    </div>

                    <div className="flex justify-between pt-2 border-t border-border/40 items-baseline">
                      <span className="font-sans font-bold text-text-primary">
                        Net Profit:
                      </span>
                      <span className={`text-base font-extrabold ${meta.profitStyle}`}>
                        ৳{s.net_profit_bdt.toLocaleString()}
                      </span>
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        </div>

        {/* Deep Dive on Selected Scenario */}
        {activeScenarioData && (
          <Card className="border border-border/80 bg-surface-card p-6">
            <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 mb-4">
              <div>
                <span className="text-xs font-mono text-accent uppercase tracking-wider">
                  Active Scenario Breakdown
                </span>
                <h3 className="text-xl font-display font-bold text-text-primary">
                  {SCENARIO_METADATA[activeScenarioData.scenario_code]?.title} Detail
                </h3>
              </div>
              <span className="px-3 py-1 rounded-full bg-surface border border-border text-xs font-mono text-text-secondary">
                Model Multiplier: {SCENARIO_METADATA[activeScenarioData.scenario_code]?.multiplier}
              </span>
            </div>

            <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
              <div className="p-4 rounded-xl border border-border/70 bg-surface">
                <span className="text-xs font-mono text-text-secondary uppercase">
                  Yield per Hectare
                </span>
                <div className="text-2xl font-display font-bold text-text-primary mt-1">
                  {activeScenarioData.yield_t_per_ha} <span className="text-xs text-text-secondary">t/ha</span>
                </div>
              </div>

              <div className="p-4 rounded-xl border border-border/70 bg-surface">
                <span className="text-xs font-mono text-text-secondary uppercase">
                  Gross Production
                </span>
                <div className="text-2xl font-display font-bold text-text-primary mt-1">
                  {activeScenarioData.total_production_kg.toLocaleString()} <span className="text-xs text-text-secondary">kg</span>
                </div>
              </div>

              <div className="p-4 rounded-xl border border-border/70 bg-surface">
                <span className="text-xs font-mono text-text-secondary uppercase">
                  Gross Revenue
                </span>
                <div className="text-2xl font-display font-bold text-text-primary mt-1">
                  ৳{activeScenarioData.revenue_bdt.toLocaleString()}
                </div>
              </div>

              <div className="p-4 rounded-xl border border-emerald-500/30 bg-emerald-950/20">
                <span className="text-xs font-mono text-emerald-400 uppercase font-semibold">
                  Net Profit (BDT)
                </span>
                <div className="text-2xl font-display font-extrabold text-emerald-400 mt-1">
                  ৳{activeScenarioData.net_profit_bdt.toLocaleString()}
                </div>
              </div>
            </div>
          </Card>
        )}

        {/* Complete Scenarios Table (Preserving All Data) */}
        <Card className="border border-border/80 bg-surface-card">
          <SectionHeader
            title="Complete Scenario Data Table"
            subtitle="Full comparison across baseline models with automated currency conversions."
            icon={Clock}
          />

          <div className="overflow-x-auto">
            <table className="w-full text-left border-collapse text-sm">
              <thead>
                <tr className="border-b border-border text-text-secondary">
                  <th className="py-3 px-4 uppercase text-xs font-semibold">Scenario</th>
                  <th className="py-3 px-4 uppercase text-xs font-semibold text-right">Yield (t/ha)</th>
                  <th className="py-3 px-4 uppercase text-xs font-semibold text-right">Production (kg)</th>
                  <th className="py-3 px-4 uppercase text-xs font-semibold text-right">Revenue (BDT)</th>
                  <th className="py-3 px-4 uppercase text-xs font-semibold text-right">Cost (BDT)</th>
                  <th className="py-3 px-4 uppercase text-xs font-semibold text-right">Net Profit (BDT)</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-border/50">
                {result.scenarios.map((s: any) => {
                  const meta = SCENARIO_METADATA[s.scenario_code] || SCENARIO_METADATA.normal;
                  const Icon = meta.icon;
                  return (
                    <tr
                      key={s.scenario_code}
                      className="hover:bg-surface/50 transition-colors"
                    >
                      <td className="py-4 px-4 flex items-center gap-2">
                        <Icon size={16} className={meta.textStyle} />
                        <span className="font-semibold text-text-primary">
                          {meta.title}
                        </span>
                      </td>
                      <td className="py-4 px-4 text-right font-mono text-text-primary">
                        {s.yield_t_per_ha}
                      </td>
                      <td className="py-4 px-4 text-right font-mono text-text-primary">
                        {s.total_production_kg.toLocaleString()}
                      </td>
                      <td className="py-4 px-4 text-right font-mono text-text-primary">
                        ৳{s.revenue_bdt.toLocaleString()}
                      </td>
                      <td className="py-4 px-4 text-right font-mono text-rose-400">
                        ৳{s.total_cost_bdt.toLocaleString()}
                      </td>
                      <td className={`py-4 px-4 text-right font-bold text-base ${meta.profitStyle}`}>
                        ৳{s.net_profit_bdt.toLocaleString()}
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        </Card>
      </div>
    );
  }

  // ----------------------------------------------------
  // PREDICT FORM VIEW (Figma Rebuild with Auto Layout converted to Flex/Grid)
  // ----------------------------------------------------
  return (
    <div className="max-w-5xl mx-auto px-6 py-10 space-y-8">
      {/* Header with Title and Auto-Fill Preset */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-border/60 pb-6">
        <div>
          <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-emerald-500/10 border border-emerald-500/20 text-emerald-400 text-xs font-semibold mb-2">
            <Sparkles size={12} />
            <span>AI Predictive Modeling &bull; CloudCamp BD</span>
          </div>
          <h1 className="text-3xl font-display font-extrabold text-text-primary tracking-tight">
            Create Yield Prediction
          </h1>
          <p className="text-sm text-text-secondary mt-1">
            Register farm parameters and generate multi-scenario harvest forecasts powered by YieldMax baseline ML models.
          </p>
        </div>

        <button
          type="button"
          onClick={loadDemoData}
          className="inline-flex items-center gap-2 px-3.5 py-2 rounded-lg border border-border bg-surface text-xs font-medium text-text-secondary hover:text-emerald-400 hover:border-emerald-500/40 hover:bg-surface-card transition-all"
        >
          <Sparkles size={14} className="text-emerald-400" />
          <span>Fill Demo Sample Data</span>
        </button>
      </div>

      {error && (
        <Card className="border-warning bg-warning/5 text-warning p-4">
          <div className="flex items-start gap-3">
            <AlertTriangle size={18} className="text-warning mt-0.5 shrink-0" />
            <p className="text-sm font-medium">{error}</p>
          </div>
        </Card>
      )}

      {/* Auto Layout Form converted to Tailwind Flex/Grid */}
      <form onSubmit={handleCreatePrediction} className="space-y-8">
        {/* Section 1: Farmer & Farm Identification */}
        <Card className="border border-border/80 bg-surface-card p-6 shadow-sm">
          <SectionHeader
            title="1. Farmer &amp; Parcel Registry"
            subtitle="Farmer name and geographic administrative boundaries in Bangladesh."
            icon={MapPin}
          />

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div className="sm:col-span-2">
              <Input
                id="farmer_name"
                label="Farmer Full Name"
                placeholder="e.g. Anisur Rahman"
                value={farmerName}
                onChange={(e) => setFarmerName(e.target.value)}
                required
                helperText="Primary registered owner or agricultural operator."
              />
            </div>

            <Input
              id="district"
              label="District (Zila)"
              placeholder="e.g. Mymensingh, Bogura, Rangpur"
              value={district}
              onChange={(e) => setDistrict(e.target.value)}
              required
            />

            <Input
              id="upazila"
              label="Upazila"
              placeholder="e.g. Trishal, Shibganj, Mithapukur"
              value={upazila}
              onChange={(e) => setUpazila(e.target.value)}
              required
            />
          </div>
        </Card>

        {/* Section 2: Agronomic Parameters */}
        <Card className="border border-border/80 bg-surface-card p-6 shadow-sm">
          <SectionHeader
            title="2. Agronomic &amp; Crop Configuration"
            subtitle="Land parcel sizing, crop variety selection, and seasonal calendar."
            icon={Layers}
          />

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <Input
              id="area_ha"
              label="Land Area (Hectares)"
              type="number"
              step="0.01"
              placeholder="e.g. 1.5"
              suffix="ha"
              value={areaHa}
              onChange={(e) => setAreaHa(e.target.value)}
              required
              helperText="1 Hectare ≈ 2.47 Acres ≈ 7.47 Bighas"
            />

            <Select
              id="crop_code"
              label="Crop Code &amp; Variety"
              value={cropCode}
              onChange={(e) => setCropCode(e.target.value)}
              options={CROP_OPTIONS}
              required
            />

            <Select
              id="land_type"
              label="Hydrology / Land Type"
              value={landType}
              onChange={(e) => setLandType(e.target.value)}
              options={LAND_TYPE_OPTIONS}
              required
            />

            <Input
              id="planting_date"
              label="Seasonal Planting Date"
              type="date"
              value={plantingDate}
              onChange={(e) => setPlantingDate(e.target.value)}
              required
            />
          </div>
        </Card>

        {/* Section 3: Financial & Market Parameters */}
        <Card className="border border-border/80 bg-surface-card p-6 shadow-sm">
          <SectionHeader
            title="3. Economics &amp; Expenditure (BDT)"
            subtitle="Expected farmgate pricing and total input costs for net profit calculations."
            icon={Coins}
          />

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <Input
              id="market_price_bdt_per_kg"
              label="Farmgate Market Price"
              type="number"
              step="0.01"
              placeholder="e.g. 28.5"
              prefix="৳"
              suffix="/ kg"
              value={marketPrice}
              onChange={(e) => setMarketPrice(e.target.value)}
              required
              helperText="Wholesale price per kg received by the farmer."
            />

            <Input
              id="total_cost_bdt"
              label="Total Cost of Cultivation"
              type="number"
              step="1"
              placeholder="e.g. 85000"
              prefix="৳"
              suffix="BDT"
              value={totalCost}
              onChange={(e) => setTotalCost(e.target.value)}
              required
              helperText="Total expenditure for seeds, fertilizer, irrigation &amp; labor."
            />
          </div>
        </Card>

        {/* Action Button */}
        <div className="pt-2">
          <Button
            type="submit"
            variant="primary"
            size="lg"
            disabled={loading}
            iconRight={ArrowRight}
            className="w-full shadow-emerald-500/25"
          >
            {loading ? "Generating 3-Scenario Prediction…" : "Generate AI Yield Prediction"}
          </Button>
        </div>
      </form>
    </div>
  );
}
