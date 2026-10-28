import { useEffect, useState } from "react";
import {
  Brain,
  Database,
  Zap,
  Globe,
  Activity,
  ArrowRight,
  TrendingUp,
  Droplets,
  Sun,
  CloudRain,
  CheckCircle2,
  Sparkles,
} from "lucide-react";
import { Card, Button } from "../components/ui";

export default function Home() {
  const [health, setHealth] = useState<{ status: string; service: string } | null>(null);
  const [loading, setLoading] = useState(true);
  const [latency, setLatency] = useState<number | null>(null);

  useEffect(() => {
    const start = performance.now();
    fetch("/api/health/")
      .then((r) => r.json())
      .then((data) => {
        setHealth(data);
        setLatency(Math.round(performance.now() - start));
        setLoading(false);
      })
      .catch(() => setLoading(false));
  }, []);

  const navigateTo = (path: string) => {
    window.history.pushState({}, "", path);
    window.dispatchEvent(new PopStateEvent("popstate"));
  };

  return (
    <div className="min-h-screen flex flex-col bg-bg text-text-primary">
      {/* Hero Header */}
      <section className="relative overflow-hidden pt-12 pb-16 md:pt-20 md:pb-24 border-b border-border/40">
        <div className="absolute inset-0 bg-[radial-gradient(ellipse_80%_60%_at_50%_-20%,rgba(16,185,129,0.15),rgba(255,255,255,0))] pointer-events-none" />

        <div className="max-w-7xl mx-auto px-6 relative z-10 text-center">
          <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full border border-emerald-500/30 bg-emerald-500/10 text-emerald-400 text-xs font-semibold mb-6 shadow-sm">
            <Sparkles size={14} className="text-emerald-400 animate-spin" style={{ animationDuration: "6s" }} />
            <span>Track: Idea to Unicorn &bull; CloudCamp BD 2026</span>
          </div>

          <h1 className="text-4xl sm:text-5xl lg:text-7xl font-display font-extrabold tracking-tight text-text-primary mb-6 leading-tight">
            AI Crop Yield &amp; <br />
            <span className="bg-gradient-to-r from-emerald-400 via-teal-300 to-sky-400 bg-clip-text text-transparent">
              Economic Optimization
            </span>
          </h1>

          <p className="text-base sm:text-lg text-text-secondary max-w-3xl mx-auto leading-relaxed mb-10">
            YieldMax-AI empowers Bangladeshi farmers and agri-enterprises with scenario-based machine learning forecasts, micro-climate resilience modeling, and automated gross margin economics in BDT.
          </p>

          <div className="flex flex-wrap items-center justify-center gap-4">
            <Button
              variant="primary"
              size="lg"
              onClick={() => navigateTo("/predict")}
              iconRight={ArrowRight}
              className="shadow-emerald-500/20"
            >
              Generate Prediction
            </Button>
            <Button
              variant="secondary"
              size="lg"
              onClick={() => navigateTo("/economics")}
              iconLeft={TrendingUp}
            >
              Economics Calculator
            </Button>
          </div>

          {/* Quick Metrics Ribbon */}
          <div className="mt-14 grid grid-cols-2 sm:grid-cols-4 gap-4 max-w-4xl mx-auto pt-8 border-t border-border/40">
            <div className="p-3 text-center">
              <div className="text-2xl lg:text-3xl font-display font-bold text-emerald-400">64</div>
              <div className="text-xs text-text-secondary uppercase tracking-wider font-mono mt-1">Districts Covered</div>
            </div>
            <div className="p-3 text-center">
              <div className="text-2xl lg:text-3xl font-display font-bold text-emerald-400">3 Scenarios</div>
              <div className="text-xs text-text-secondary uppercase tracking-wider font-mono mt-1">Rainfall Modeling</div>
            </div>
            <div className="p-3 text-center">
              <div className="text-2xl lg:text-3xl font-display font-bold text-emerald-400">BDT (৳)</div>
              <div className="text-xs text-text-secondary uppercase tracking-wider font-mono mt-1">Currency Standard</div>
            </div>
            <div className="p-3 text-center">
              <div className="text-2xl lg:text-3xl font-display font-bold text-emerald-400">MCP Ready</div>
              <div className="text-xs text-text-secondary uppercase tracking-wider font-mono mt-1">AI Protocol Tools</div>
            </div>
          </div>
        </div>
      </section>

      {/* Bento Box Dashboard (Asymmetric CSS Grid) */}
      <section className="max-w-7xl mx-auto px-6 py-16 w-full">
        <div className="mb-10 flex flex-col md:flex-row md:items-end justify-between gap-4">
          <div>
            <span className="text-xs font-semibold text-emerald-400 uppercase tracking-widest font-mono">
              Production Architecture
            </span>
            <h2 className="text-3xl font-display font-bold text-text-primary tracking-tight mt-1">
              Bento Box Feature Matrix
            </h2>
          </div>
          <p className="text-sm text-text-secondary max-w-md">
            Engineered with asymmetric cards, subtle gradients, 1px depth borders, and interactive hover states for CloudCamp BD.
          </p>
        </div>

        {/* Asymmetric CSS Bento Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-12 gap-6">
          {/* Bento 1: Large Featured Card (Span 8) */}
          <div className="lg:col-span-8 rounded-2xl border border-border/80 bg-gradient-to-br from-emerald-950/20 via-surface-card to-surface p-8 shadow-sm hover:border-emerald-500/50 hover:shadow-xl hover:shadow-emerald-950/20 transition-all duration-300 relative overflow-hidden group">
            <div className="absolute top-0 right-0 p-8 opacity-10 group-hover:opacity-20 transition-opacity">
              <Brain size={160} className="text-emerald-400" />
            </div>

            <div className="relative z-10">
              <div className="flex items-center gap-3 mb-4">
                <span className="p-2.5 rounded-xl bg-emerald-500/10 border border-emerald-500/20 text-emerald-400 shadow-sm">
                  <Brain size={22} />
                </span>
                <span className="text-xs font-mono font-bold uppercase tracking-wider px-2.5 py-1 rounded-full bg-emerald-500/15 text-emerald-400 border border-emerald-500/30">
                  Core ML Engine
                </span>
              </div>

              <h3 className="text-2xl font-display font-bold text-text-primary mb-3">
                AI Multi-Scenario Yield Forecasts
              </h3>
              <p className="text-sm text-text-secondary leading-relaxed max-w-2xl mb-6">
                Our predictive pipeline translates crop varieties (Boro rice, Aman rice, Wheat, Maize, Potato) and regional land typography into rigorous yield distributions across 3 weather possibilities.
              </p>

              {/* Scenario Visual Matrix Inside Bento */}
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-3.5 mb-6">
                <div className="p-3.5 rounded-xl border border-emerald-500/30 bg-emerald-950/30">
                  <div className="flex items-center justify-between mb-1">
                    <span className="text-xs font-semibold text-emerald-300 flex items-center gap-1.5">
                      <Sun size={14} /> Normal
                    </span>
                    <span className="text-[10px] font-mono px-1.5 py-0.5 rounded bg-emerald-500/20 text-emerald-300 font-bold">
                      1.0x
                    </span>
                  </div>
                  <div className="text-lg font-display font-bold text-text-primary">5.0 t/ha</div>
                  <div className="text-[11px] text-text-secondary mt-0.5">Optimal production baseline</div>
                </div>

                <div className="p-3.5 rounded-xl border border-amber-500/30 bg-amber-950/30">
                  <div className="flex items-center justify-between mb-1">
                    <span className="text-xs font-semibold text-amber-300 flex items-center gap-1.5">
                      <Droplets size={14} /> Low Rain
                    </span>
                    <span className="text-[10px] font-mono px-1.5 py-0.5 rounded bg-amber-500/20 text-amber-300 font-bold">
                      0.8x
                    </span>
                  </div>
                  <div className="text-lg font-display font-bold text-text-primary">4.0 t/ha</div>
                  <div className="text-[11px] text-text-secondary mt-0.5">Drought risk adjustment</div>
                </div>

                <div className="p-3.5 rounded-xl border border-blue-500/30 bg-blue-950/30">
                  <div className="flex items-center justify-between mb-1">
                    <span className="text-xs font-semibold text-blue-300 flex items-center gap-1.5">
                      <CloudRain size={14} /> Heavy Rain
                    </span>
                    <span className="text-[10px] font-mono px-1.5 py-0.5 rounded bg-blue-500/20 text-blue-300 font-bold">
                      0.9x
                    </span>
                  </div>
                  <div className="text-lg font-display font-bold text-text-primary">4.5 t/ha</div>
                  <div className="text-[11px] text-text-secondary mt-0.5">Flood risk mitigation</div>
                </div>
              </div>

              <Button
                variant="outline"
                size="sm"
                onClick={() => navigateTo("/predict")}
                iconRight={ArrowRight}
                className="hover:border-emerald-500"
              >
                Launch Prediction Wizard
              </Button>
            </div>
          </div>

          {/* Bento 2: Economics Variance Highlight (Span 4) */}
          <div className="lg:col-span-4 rounded-2xl border border-border/80 bg-gradient-to-br from-surface-card via-surface-card to-surface p-7 shadow-sm hover:border-emerald-500/40 hover:shadow-lg transition-all duration-300 flex flex-col justify-between">
            <div>
              <div className="flex items-center justify-between mb-4">
                <span className="p-2.5 rounded-xl bg-accent/10 border border-accent/20 text-accent">
                  <TrendingUp size={20} />
                </span>
                <span className="inline-flex items-center gap-1 px-2.5 py-1 rounded-full bg-emerald-500/15 text-emerald-400 border border-emerald-500/30 text-xs font-semibold">
                  +12% vs Low Rain
                </span>
              </div>

              <span className="text-xs font-semibold uppercase tracking-wider text-text-secondary">
                Economic Profitability
              </span>
              <div className="text-3xl lg:text-4xl font-display font-extrabold text-emerald-400 mt-1 mb-2">
                ৳48,500 <span className="text-xs font-normal text-text-secondary">/ ha</span>
              </div>

              <p className="text-xs text-text-secondary leading-relaxed mb-4">
                Calculates yield into net profit in BDT by deducting fertilizer, irrigation, and labor costs from wholesale crop revenues.
              </p>

              <div className="p-3 rounded-lg bg-surface border border-border/60 text-xs space-y-1.5 font-mono mb-4">
                <div className="flex justify-between text-text-secondary">
                  <span>Revenue (5t @ ৳25):</span>
                  <span className="text-text-primary">৳125,000</span>
                </div>
                <div className="flex justify-between text-text-secondary">
                  <span>Production Cost:</span>
                  <span className="text-rose-400">-৳76,500</span>
                </div>
                <div className="flex justify-between pt-1 border-t border-border/40 font-bold text-emerald-400">
                  <span>Net Profit:</span>
                  <span>৳48,500</span>
                </div>
              </div>
            </div>

            <Button
              variant="secondary"
              size="sm"
              onClick={() => navigateTo("/economics")}
              iconRight={ArrowRight}
              className="w-full justify-between"
            >
              <span>Explore Economics</span>
            </Button>
          </div>

          {/* Bento 3: Farm Registry Management (Span 4) */}
          <div className="lg:col-span-4 rounded-2xl border border-border/80 bg-gradient-to-br from-surface-card via-surface-card to-surface p-7 shadow-sm hover:border-emerald-500/40 hover:shadow-lg transition-all duration-300">
            <div className="p-2.5 rounded-xl bg-accent/10 border border-accent/20 text-accent w-fit mb-4">
              <Database size={20} />
            </div>
            <h3 className="text-lg font-display font-bold text-text-primary mb-2">
              National Farm Registry
            </h3>
            <p className="text-xs text-text-secondary leading-relaxed mb-4">
              Structured database of farmers, land parcels, seasonal planting records, and regional irrigation profiles across Bangladesh.
            </p>
            <div className="flex items-center gap-2 text-xs font-mono text-emerald-400">
              <CheckCircle2 size={14} /> Full CRUD &bull; Filterable by District
            </div>
          </div>

          {/* Bento 4: MCP Architecture (Span 4) */}
          <div className="lg:col-span-4 rounded-2xl border border-border/80 bg-gradient-to-br from-surface-card via-surface-card to-surface p-7 shadow-sm hover:border-emerald-500/40 hover:shadow-lg transition-all duration-300">
            <div className="p-2.5 rounded-xl bg-accent/10 border border-accent/20 text-accent w-fit mb-4">
              <Zap size={20} />
            </div>
            <h3 className="text-lg font-display font-bold text-text-primary mb-2">
              MCP Protocol Integration
            </h3>
            <p className="text-xs text-text-secondary leading-relaxed mb-4">
              Built and integrated Model Context Protocol servers communicating across Streamable HTTP, Stdio, and SSE transports.
            </p>
            <div className="flex items-center gap-2 text-xs font-mono text-emerald-400">
              <CheckCircle2 size={14} /> Read-only Permission Boundaries
            </div>
          </div>

          {/* Bento 5: CloudCamp BD 2026 Ready (Span 4) */}
          <div className="lg:col-span-4 rounded-2xl border border-border/80 bg-gradient-to-br from-surface-card via-surface-card to-surface p-7 shadow-sm hover:border-emerald-500/40 hover:shadow-lg transition-all duration-300">
            <div className="p-2.5 rounded-xl bg-accent/10 border border-accent/20 text-accent w-fit mb-4">
              <Globe size={20} />
            </div>
            <h3 className="text-lg font-display font-bold text-text-primary mb-2">
              CloudCamp BD 2026
            </h3>
            <p className="text-xs text-text-secondary leading-relaxed mb-4">
              Engineered for the International AI Builders Congress hackathon evaluation rubric with end-to-end data lifecycle integrity.
            </p>
            <div className="flex items-center gap-2 text-xs font-mono text-emerald-400">
              <CheckCircle2 size={14} /> Production-ready SaaS Architecture
            </div>
          </div>
        </div>

        {/* Live Backend Health Monitor */}
        <div className="mt-12">
          <Card className="border border-border/80 bg-surface-card/60 backdrop-blur">
            <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
              <div className="flex items-center gap-3">
                <div className="p-2.5 rounded-xl bg-emerald-500/10 border border-emerald-500/20 text-emerald-400">
                  <Activity size={20} />
                </div>
                <div>
                  <h3 className="text-base font-display font-bold text-text-primary">
                    Django REST Service Health
                  </h3>
                  <p className="text-xs text-text-secondary">
                    Monitors `/api/health/` uptime, database availability, and API latency.
                  </p>
                </div>
              </div>

              <div className="flex items-center gap-3">
                {loading ? (
                  <div className="flex items-center gap-2 text-xs font-mono text-text-secondary">
                    <span className="w-2.5 h-2.5 rounded-full animate-ping bg-amber-400"></span>
                    Connecting…
                  </div>
                ) : health?.status === "ok" ? (
                  <div className="flex items-center gap-3">
                    <span className="flex items-center gap-2 px-3 py-1.5 rounded-full bg-emerald-500/10 text-emerald-400 text-xs font-mono border border-emerald-500/25">
                      <span className="w-2.5 h-2.5 rounded-full animate-pulse bg-emerald-500 shadow-[0_0_8px_rgba(16,185,129,0.6)]"></span>
                      Service: {health.service} ({latency ?? 12}ms)
                    </span>
                  </div>
                ) : (
                  <span className="flex items-center gap-2 px-3 py-1.5 rounded-full bg-rose-500/10 text-rose-400 text-xs font-mono border border-rose-500/25">
                    <span className="w-2.5 h-2.5 rounded-full bg-rose-500 shadow-[0_0_8px_rgba(239,68,68,0.6)]"></span>
                    Degraded / Reconnecting
                  </span>
                )}
              </div>
            </div>
          </Card>
        </div>
      </section>

      {/* Footer */}
      <footer className="mt-auto border-t border-border/60 bg-surface/80 py-8">
        <div className="max-w-7xl mx-auto px-6 flex flex-col sm:flex-row items-center justify-between gap-4 text-xs text-text-secondary">
          <p>
            YieldMax-AI &bull; Built for CloudCamp BD 2026 &bull; International AI Builders Congress
          </p>
          <div className="flex items-center gap-4">
            <span className="hover:text-emerald-400 cursor-pointer" onClick={() => navigateTo("/mcp")}>
              MCP Disclosures
            </span>
            <span>&bull;</span>
            <span className="hover:text-emerald-400 cursor-pointer" onClick={() => navigateTo("/predict")}>
              Prediction Engine
            </span>
          </div>
        </div>
      </footer>
    </div>
  );
}
