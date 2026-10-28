import { useState, useEffect } from "react";
import {
  LayoutDashboard,
  BarChart3,
  Layers,
  ShieldCheck,
  Cpu,
  Menu,
  X,
  RefreshCw,
  Sparkles,
} from "lucide-react";

type NavItem = {
  label: string;
  href: string;
  icon: React.ElementType;
};

const NAV_ITEMS: NavItem[] = [
  { label: "Dashboard", href: "/", icon: LayoutDashboard },
  { label: "Predict Yield", href: "/predict", icon: BarChart3 },
  { label: "Farm Registry", href: "/farms", icon: Layers },
  { label: "Economics", href: "/economics", icon: ShieldCheck },
  { label: "MCP Architecture", href: "/mcp", icon: Cpu },
];

export function Navbar({ onNavigate }: { onNavigate: (path: string) => void }) {
  const [mobileOpen, setMobileOpen] = useState(false);
  const [currentPath, setCurrentPath] = useState("/");
  const [healthStatus, setHealthStatus] = useState<"ok" | "down" | "checking">("checking");

  const checkHealth = () => {
    setHealthStatus("checking");
    fetch("/api/health/")
      .then((r) => (r.ok ? setHealthStatus("ok") : setHealthStatus("down")))
      .catch(() => setHealthStatus("down"));
  };

  useEffect(() => {
    checkHealth();
    const interval = setInterval(checkHealth, 30000);
    return () => clearInterval(interval);
  }, []);

  const handleNav = (path: string) => {
    setCurrentPath(path);
    onNavigate(path);
    setMobileOpen(false);
  };

  return (
    <nav className="sticky top-0 z-50 border-b border-border/70 bg-surface/85 backdrop-blur-md transition-all">
      <div className="max-w-7xl mx-auto flex items-center justify-between px-6 py-3.5">
        {/* Brand / Logo */}
        <div
          className="flex items-center gap-3 cursor-pointer group select-none"
          onClick={() => handleNav("/")}
        >
          <div className="w-9 h-9 rounded-xl bg-gradient-to-br from-emerald-400 to-emerald-600 flex items-center justify-center text-bg font-display font-extrabold text-sm shadow-md shadow-emerald-500/20 group-hover:scale-105 transition-transform">
            YM
          </div>
          <div className="flex flex-col">
            <div className="flex items-center gap-2">
              <span className="font-display font-bold text-lg text-text-primary tracking-tight">
                YieldMax<span className="text-emerald-400">.ai</span>
              </span>
              <span className="hidden sm:inline-flex items-center gap-1 text-[10px] uppercase font-bold tracking-wider px-2 py-0.5 rounded-full bg-emerald-500/10 text-emerald-400 border border-emerald-500/20">
                <Sparkles size={10} /> SaaS
              </span>
            </div>
            <span className="text-[11px] text-text-secondary leading-none hidden sm:block">
              CloudCamp BD &bull; Krishi AI
            </span>
          </div>
        </div>

        {/* Desktop Nav Links */}
        <div className="hidden lg:flex items-center gap-1 bg-surface-card/60 p-1 rounded-xl border border-border/60">
          {NAV_ITEMS.map((item) => {
            const Icon = item.icon;
            const isActive = currentPath === item.href;
            return (
              <a
                key={item.label}
                href={item.href}
                onClick={(e) => {
                  e.preventDefault();
                  handleNav(item.href);
                }}
                className={`flex items-center gap-2 px-3.5 py-1.5 rounded-lg text-xs font-semibold transition-all duration-200 ${
                  isActive
                    ? "bg-emerald-500/15 text-emerald-400 border border-emerald-500/30 shadow-sm"
                    : "text-text-secondary hover:text-text-primary hover:bg-surface/60"
                }`}
              >
                <Icon size={14} className={isActive ? "text-emerald-400" : "text-text-secondary"} />
                {item.label}
              </a>
            );
          })}
        </div>

        {/* Live Health Badge & Actions */}
        <div className="flex items-center gap-3">
          {/* Live Health Dot Indicator */}
          <div
            onClick={checkHealth}
            title={`API Health: /api/health/ (${healthStatus === "ok" ? "Operational" : "Offline"}). Click to refresh.`}
            className="flex items-center gap-2 px-3 py-1.5 rounded-full border border-border/80 bg-surface/90 hover:border-emerald-500/40 hover:bg-surface-card transition-all duration-200 cursor-pointer shadow-sm select-none"
          >
            {healthStatus === "ok" ? (
              <>
                <span className="relative flex h-2.5 w-2.5">
                  <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-75"></span>
                  <span className="relative inline-flex rounded-full h-2.5 w-2.5 animate-pulse bg-emerald-500 shadow-[0_0_8px_rgba(16,185,129,0.6)]"></span>
                </span>
                <span className="text-xs font-mono font-medium text-emerald-400">
                  Live Health
                </span>
              </>
            ) : healthStatus === "down" ? (
              <>
                <span className="relative inline-flex rounded-full h-2.5 w-2.5 bg-rose-500 shadow-[0_0_8px_rgba(239,68,68,0.6)]"></span>
                <span className="text-xs font-mono font-medium text-rose-400">
                  Offline
                </span>
              </>
            ) : (
              <>
                <span className="relative inline-flex rounded-full h-2.5 w-2.5 animate-pulse bg-amber-400 shadow-[0_0_8px_rgba(245,158,11,0.6)]"></span>
                <span className="text-xs font-mono font-medium text-text-secondary">
                  Checking…
                </span>
              </>
            )}
            <RefreshCw
              size={12}
              className={`text-text-secondary/60 hover:text-text-secondary ${
                healthStatus === "checking" ? "animate-spin text-emerald-400" : ""
              }`}
            />
          </div>

          {/* Mobile Menu Button */}
          <button
            className="lg:hidden p-2 rounded-lg border border-border bg-surface text-text-secondary hover:text-text-primary hover:border-accent/40 transition-colors"
            onClick={() => setMobileOpen((o) => !o)}
            aria-label="Toggle Navigation Menu"
          >
            {mobileOpen ? <X size={20} /> : <Menu size={20} />}
          </button>
        </div>
      </div>

      {/* Mobile Drawer */}
      {mobileOpen && (
        <div className="lg:hidden border-t border-border/80 bg-surface/95 backdrop-blur-md px-6 py-4 space-y-2">
          {NAV_ITEMS.map((item) => {
            const Icon = item.icon;
            const isActive = currentPath === item.href;
            return (
              <a
                key={item.label}
                href={item.href}
                onClick={(e) => {
                  e.preventDefault();
                  handleNav(item.href);
                }}
                className={`flex items-center gap-3 px-3.5 py-2.5 rounded-lg text-sm font-medium transition-colors ${
                  isActive
                    ? "bg-emerald-500/15 text-emerald-400 border border-emerald-500/30"
                    : "text-text-secondary hover:bg-surface-card hover:text-text-primary"
                }`}
              >
                <Icon size={18} />
                {item.label}
              </a>
            );
          })}
        </div>
      )}
    </nav>
  );
}
