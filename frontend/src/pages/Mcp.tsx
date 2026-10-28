import { Link, Globe, Database, ShieldCheck, Cpu } from "lucide-react";
import { Card, SectionHeader, Textarea, StatCard } from "../components/ui";

const builtServers = [
  {
    name: "YieldMax Farm Data MCP",
    transport: "Streamable HTTP",
    description: "Exposes farm registry queries and yield calculation tools to AI clients.",
    tools: ["get_farm", "list_farms", "calculate_yield"],
  },
  {
    name: "Bangladesh Weather MCP",
    transport: "Stdio",
    description: "Provides rainfall scenario data for low_rain, normal, heavy_rain models.",
    tools: ["get_rainfall_scenario", "get_district_weather"],
  },
];

const usedServers = [
  {
    name: "PostgreSQL MCP",
    transport: "SSE",
    description: "Official PostgreSQL MCP server for read-only farm data access.",
  },
  {
    name: "Fetch MCP",
    transport: "Streamable HTTP",
    description: "Fetches external market price data for economics calculations.",
  },
];

export default function Mcp() {
  return (
    <div className="max-w-5xl mx-auto px-6 py-8 space-y-8">
      <SectionHeader
        title="MCP Integration"
        subtitle="Model Context Protocol servers connecting AI to farm data, weather, and market tools."
        icon={Link}
      />

      <div className="grid md:grid-cols-3 gap-4 mb-4">
        <StatCard value={builtServers.length} label="MCP Servers Built" />
        <StatCard value={usedServers.length} label="MCP Servers Integrated" />
        <StatCard value="2" label="Transports (SSE, Streamable HTTP)" />
      </div>

      <Card>
        <SectionHeader title="Architecture" subtitle="Host → Client → MCP Server → Data Source" icon={Cpu} />
        <div className="bg-[#030712] rounded-lg p-4 font-mono text-xs text-accent mb-4 overflow-x-auto">
          {`
[Frontend React App]
        │  MCP Client (fetch/SSE)
        ▼
[Django REST API] ◄── Streamable HTTP ─── [Custom MCP Server: Farm Data]
        │                              ▲
        │  Stdio                       │  tools: get_farm, list_farms
        ▼                              │  calculate_yield
[PostgreSQL DB] ◄──── SSE ───────── [Public MCP Server: PostgreSQL]

MCP Transport Disclosure:
  • Streamable HTTP (custom farm-data server)
  • Stdio (local weather server)
  • SSE (external PostgreSQL MCP)
        `}
        </div>
        <p className="text-sm text-text-secondary">
          Permission boundaries: read-only farm data access; no write operations
          exposed via MCP. All state-changing actions go through the REST API.
        </p>
      </Card>

      <div className="grid md:grid-cols-2 gap-6">
        <Card>
          <SectionHeader title="Servers Built by Team" icon={Database} />
          {builtServers.map((s) => (
            <div key={s.name} className="mb-4 p-4 rounded-lg border border-border bg-surface">
              <h4 className="font-display font-bold text-text-primary mb-1">{s.name}</h4>
              <p className="text-xs text-text-secondary mb-2">{s.description}</p>
              <div className="flex items-center gap-2 mb-2">
                <span className="text-[10px] font-bold uppercase text-accent">
                  {s.transport}
                </span>
                <span className="text-[10px] font-bold uppercase text-text-secondary">
                  {s.tools.length} tools
                </span>
              </div>
              <div className="flex gap-1">
                {s.tools.map((t) => (
                  <span key={t} className="text-[10px] px-2 py-1 rounded border border-border/50 text-text-secondary">
                    {t}
                  </span>
                ))}
              </div>
            </div>
          ))}
        </Card>

        <Card>
          <SectionHeader title="External Servers Integrated" icon={Globe} />
          {usedServers.map((s) => (
            <div key={s.name} className="mb-4 p-4 rounded-lg border border-border bg-surface">
              <h4 className="font-display font-bold text-text-primary mb-1">{s.name}</h4>
              <p className="text-xs text-text-secondary mb-2">{s.description}</p>
              <div className="flex items-center gap-2">
                <span className="text-[10px] font-bold uppercase text-accent">
                  {s.transport}
                </span>
              </div>
            </div>
          ))}
        </Card>
      </div>

      <Card>
        <SectionHeader title="Submission Notes (CloudCamp BD)" icon={ShieldCheck} />
        <Textarea
          id="mcp_notes"
          label="MCP Architecture Notes"
          minChars={80}
          value={`Built 2 custom MCP servers (YieldMax Farm Data MCP on Streamable HTTP, Bangladesh Weather MCP on Stdio). Integrated 2 external MCP servers (PostgreSQL MCP on SSE, Fetch MCP on Streamable HTTP). Transports: SSE, Stdio, Streamable HTTP. Read-only permission boundaries enforced. MCP client hosted in React frontend connecting to Django REST API.`}
          onChange={() => {}}
        />
      </Card>
    </div>
  );
}
