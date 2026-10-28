import { useEffect, useState } from "react";

export function HealthBadge({ showLabel = true }: { showLabel?: boolean }) {
  const [status, setStatus] = useState<"ok" | "down" | "checking">("checking");
  const [latency, setLatency] = useState<number | null>(null);

  const checkHealth = () => {
    setStatus("checking");
    const start = performance.now();
    fetch("/api/health/")
      .then((r) => {
        if (r.ok) {
          setStatus("ok");
          setLatency(Math.round(performance.now() - start));
        } else {
          setStatus("down");
        }
      })
      .catch(() => setStatus("down"));
  };

  useEffect(() => {
    checkHealth();
    const interval = setInterval(checkHealth, 30000);
    return () => clearInterval(interval);
  }, []);

  return (
    <div
      onClick={checkHealth}
      title={`Backend Status: ${status === "ok" ? "Healthy" : status === "down" ? "Offline" : "Checking"} (Click to re-check)`}
      className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full border border-border/80 bg-surface/90 hover:border-accent/40 transition-all duration-200 cursor-pointer text-xs font-mono select-none"
    >
      {status === "ok" ? (
        <>
          <span className="relative flex h-2.5 w-2.5">
            <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-75"></span>
            <span className="relative inline-flex rounded-full h-2.5 w-2.5 animate-pulse bg-emerald-500 shadow-[0_0_8px_rgba(16,185,129,0.6)]"></span>
          </span>
          {showLabel && (
            <span className="text-emerald-400 font-semibold flex items-center gap-1.5">
              API Live {latency !== null && <span className="text-[10px] text-text-secondary/80">({latency}ms)</span>}
            </span>
          )}
        </>
      ) : status === "down" ? (
        <>
          <span className="relative inline-flex rounded-full h-2.5 w-2.5 bg-rose-500 shadow-[0_0_8px_rgba(239,68,68,0.6)]"></span>
          {showLabel && <span className="text-rose-400 font-semibold">API Offline</span>}
        </>
      ) : (
        <>
          <span className="relative inline-flex rounded-full h-2.5 w-2.5 animate-pulse bg-amber-400 shadow-[0_0_8px_rgba(245,158,11,0.6)]"></span>
          {showLabel && <span className="text-text-secondary">Checking…</span>}
        </>
      )}
    </div>
  );
}
