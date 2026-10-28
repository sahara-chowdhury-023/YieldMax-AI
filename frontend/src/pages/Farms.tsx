import { useCallback, useEffect, useState } from "react";
import {
  farmsApi,
  type Farm,
} from "../api";
import { Card, SectionHeader, Input, Button, StatCard } from "../components/ui";
import { Plus, MapPin, Building2 } from "lucide-react";

export default function Farms() {
  const [farms, setFarms] = useState<Farm[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [search, setSearch] = useState("");
  const [showForm, setShowForm] = useState(false);
  const [formLoading, setFormLoading] = useState(false);

  const [farmerId, setFarmerId] = useState("");
  const [areaHa, setAreaHa] = useState("");
  const [district, setDistrict] = useState("");
  const [upazila, setUpazila] = useState("");
  const [landType, setLandType] = useState("");
  const [cropCode, setCropCode] = useState("");
  const [plantingDate, setPlantingDate] = useState("");

  const loadFarms = useCallback(async () => {
    setLoading(true);
    try {
      const res = await farmsApi.listFarms();
      setFarms(res.data);
    } catch {
      setError("Failed to load farms");
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    loadFarms();
  }, [loadFarms]);

  const handleCreateFarm = async (e: React.FormEvent) => {
    e.preventDefault();
    setFormLoading(true);
    try {
      await farmsApi.createFarm({
        farmer: parseInt(farmerId, 10) || 1,
        area_ha: parseFloat(areaHa),
        district,
        upazila,
        land_type: landType,
        crop_code: cropCode,
        planting_date: plantingDate,
      });
      setShowForm(false);
      loadFarms();
      setFarmerId("");
      setAreaHa("");
      setDistrict("");
      setUpazila("");
      setLandType("");
      setCropCode("");
      setPlantingDate("");
    } catch {
      setError("Failed to create farm");
    } finally {
      setFormLoading(false);
    }
  };

  const filtered = farms.filter(
    (f) =>
      f.district.toLowerCase().includes(search.toLowerCase()) ||
      f.crop_code.toLowerCase().includes(search.toLowerCase()) ||
      f.farmer_name.toLowerCase().includes(search.toLowerCase())
  );

  return (
    <div className="max-w-5xl mx-auto px-6 py-8 space-y-6">
      <div className="flex items-center justify-between">
        <SectionHeader title="Farm Registry" subtitle="Manage farmers and farm records." icon={Building2} />
        <Button variant="primary" onClick={() => setShowForm(true)}>
          <Plus size={16} className="mr-1" />
          Add Farm
        </Button>
      </div>

      <div className="grid md:grid-cols-3 gap-4 mb-4">
        <StatCard value={farms.length} label="Total Farms" />
        <StatCard value={new Set(farms.map((f) => f.district)).size} label="Districts" />
        <StatCard value={new Set(farms.map((f) => f.farmer_name)).size} label="Farmers" />
      </div>

      {error && (
        <Card className="border-warning bg-warning/5">
          <p className="text-sm text-warning">{error}</p>
        </Card>
      )}

      <Card>
        <div className="mb-4">
          <Input
            id="search"
            label="Search farms"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
          />
        </div>

        {loading ? (
          <p className="text-xs text-text-secondary">Loading…</p>
        ) : filtered.length === 0 ? (
          <p className="text-xs text-text-secondary">No farms found.</p>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-left border-collapse">
              <thead>
                <tr className="border-b border-border">
                  <th className="py-3 px-4 text-xs font-medium text-text-secondary uppercase">Farmer</th>
                  <th className="py-3 px-4 text-xs font-medium text-text-secondary uppercase">Crop</th>
                  <th className="py-3 px-4 text-xs font-medium text-text-secondary uppercase">Area</th>
                  <th className="py-3 px-4 text-xs font-medium text-text-secondary uppercase">Location</th>
                  <th className="py-3 px-4 text-xs font-medium text-text-secondary uppercase">Land Type</th>
                  <th className="py-3 px-4 text-xs font-medium text-text-secondary uppercase">Planted</th>
                </tr>
              </thead>
              <tbody>
                {filtered.map((farm) => (
                  <tr key={farm.id} className="border-b border-border/50 hover:bg-surface-card/50 transition-colors">
                    <td className="py-3 px-4 text-sm text-text-primary font-medium">
                      {farm.farmer_name}
                    </td>
                    <td className="py-3 px-4 text-sm text-text-primary">
                      {farm.crop_code.replace("_", " ").toUpperCase()}
                    </td>
                    <td className="py-3 px-4 text-sm font-mono text-text-primary">
                      {farm.area_ha} ha
                    </td>
                    <td className="py-3 px-4 text-sm text-text-primary">
                      <div className="flex items-center gap-1">
                        <MapPin size={12} className="text-text-secondary" />
                        {farm.district}, {farm.upazila}
                      </div>
                    </td>
                    <td className="py-3 px-4 text-sm text-text-secondary capitalize">
                      {farm.land_type}
                    </td>
                    <td className="py-3 px-4 text-sm font-mono text-text-secondary">
                      {farm.planting_date}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </Card>

      {showForm && (
        <Card className="mt-4">
          <SectionHeader title="Register New Farm" icon={Plus} />
          <form onSubmit={handleCreateFarm} className="grid md:grid-cols-2 gap-4">
            <Input
              id="farmer_id"
              label="Farmer ID"
              type="number"
              value={farmerId}
              onChange={(e) => setFarmerId(e.target.value)}
              required
            />
            <Input
              id="area_ha"
              label="Area (ha)"
              type="number"
              step="0.01"
              value={areaHa}
              onChange={(e) => setAreaHa(e.target.value)}
              required
            />
            <Input
              id="district"
              label="District"
              value={district}
              onChange={(e) => setDistrict(e.target.value)}
              required
            />
            <Input
              id="upazila"
              label="Upazila"
              value={upazila}
              onChange={(e) => setUpazila(e.target.value)}
              required
            />
            <Input
              id="land_type"
              label="Land Type"
              value={landType}
              onChange={(e) => setLandType(e.target.value)}
              required
            />
            <Input
              id="crop_code"
              label="Crop Code"
              value={cropCode}
              onChange={(e) => setCropCode(e.target.value)}
              required
            />
            <Input
              id="planting_date"
              label="Planting Date"
              type="date"
              value={plantingDate}
              onChange={(e) => setPlantingDate(e.target.value)}
              required
            />
            <div className="md:col-span-2 flex gap-2">
              <Button type="submit" variant="primary" disabled={formLoading}>
                {formLoading ? "Saving…" : "Create Farm"}
              </Button>
              <Button variant="ghost" onClick={() => setShowForm(false)}>
                Cancel
              </Button>
            </div>
          </form>
        </Card>
      )}
    </div>
  );
}
