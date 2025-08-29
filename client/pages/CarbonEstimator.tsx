import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";

interface Result {
  success: boolean;
  type: "soil" | "agb";
  carbon_t_ha: number;
  co2e_t_ha: number;
  details?: Record<string, number>;
  timestamp: string;
  id?: string;
}

export default function CarbonEstimator() {
  const [soilForm, setSoilForm] = useState({
    soc_percent: "",
    bd: "",
    depth_cm: "",
    rock: "",
  });
  const [allomForm, setAllomForm] = useState({
    dbh_cm: "",
    wd: "",
    height_m: "",
  });
  const [result, setResult] = useState<Result | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  async function callApi(payload: any) {
    setLoading(true);
    setError(null);
    setResult(null);
    try {
      const res = await fetch("/api/carbon/estimate", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload),
      });
      if (!res.ok) {
        const t = await res.text();
        throw new Error(t || `HTTP ${res.status}`);
      }
      const data: Result = await res.json();
      setResult(data);
    } catch (e: any) {
      setError(e.message);
    } finally {
      setLoading(false);
    }
  }

  return (
    <div className="container py-8 space-y-8">
      <h1 className="text-3xl font-bold">Carbon Estimator</h1>
      <div className="grid gap-6 md:grid-cols-2">
        <Card>
          <CardHeader>
            <CardTitle>Soil Organic Carbon (SOC) Stock</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="grid grid-cols-2 gap-4">
              <div>
                <Label htmlFor="soc_percent">SOC (%)</Label>
                <Input
                  id="soc_percent"
                  type="number"
                  step="0.01"
                  value={soilForm.soc_percent}
                  onChange={(e) =>
                    setSoilForm((s) => ({ ...s, soc_percent: e.target.value }))
                  }
                />
              </div>
              <div>
                <Label htmlFor="bd">Bulk density (g/cm³)</Label>
                <Input
                  id="bd"
                  type="number"
                  step="0.01"
                  value={soilForm.bd}
                  onChange={(e) =>
                    setSoilForm((s) => ({ ...s, bd: e.target.value }))
                  }
                />
              </div>
              <div>
                <Label htmlFor="depth_cm">Depth (cm)</Label>
                <Input
                  id="depth_cm"
                  type="number"
                  step="1"
                  value={soilForm.depth_cm}
                  onChange={(e) =>
                    setSoilForm((s) => ({ ...s, depth_cm: e.target.value }))
                  }
                />
              </div>
              <div>
                <Label htmlFor="rock">Rock fragments (%)</Label>
                <Input
                  id="rock"
                  type="number"
                  step="0.1"
                  value={soilForm.rock}
                  onChange={(e) =>
                    setSoilForm((s) => ({ ...s, rock: e.target.value }))
                  }
                />
              </div>
            </div>
            <Button
              disabled={loading}
              onClick={() => {
                const payload = {
                  mode: "soil",
                  payload: {
                    soc_percent: Number(soilForm.soc_percent),
                    bulk_density_g_cm3: Number(soilForm.bd),
                    depth_cm: Number(soilForm.depth_cm),
                    rock_fragment_pct: soilForm.rock
                      ? Number(soilForm.rock)
                      : undefined,
                  },
                };
                callApi(payload);
              }}
            >
              Estimate SOC
            </Button>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Above-Ground Biomass (Allometry)</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="grid grid-cols-3 gap-4">
              <div>
                <Label htmlFor="dbh_cm">DBH (cm)</Label>
                <Input
                  id="dbh_cm"
                  type="number"
                  step="0.1"
                  value={allomForm.dbh_cm}
                  onChange={(e) =>
                    setAllomForm((s) => ({ ...s, dbh_cm: e.target.value }))
                  }
                />
              </div>
              <div>
                <Label htmlFor="wd">Wood density (g/cm³)</Label>
                <Input
                  id="wd"
                  type="number"
                  step="0.01"
                  value={allomForm.wd}
                  onChange={(e) =>
                    setAllomForm((s) => ({ ...s, wd: e.target.value }))
                  }
                />
              </div>
              <div>
                <Label htmlFor="height_m">Height (m)</Label>
                <Input
                  id="height_m"
                  type="number"
                  step="0.1"
                  value={allomForm.height_m}
                  onChange={(e) =>
                    setAllomForm((s) => ({ ...s, height_m: e.target.value }))
                  }
                />
              </div>
            </div>
            <Button
              disabled={loading}
              onClick={() => {
                const payload = {
                  mode: "allometric",
                  payload: {
                    dbh_cm: Number(allomForm.dbh_cm),
                    wood_density_g_cm3: Number(allomForm.wd),
                    height_m: allomForm.height_m
                      ? Number(allomForm.height_m)
                      : undefined,
                  },
                };
                callApi(payload);
              }}
            >
              Estimate AGB Carbon
            </Button>
          </CardContent>
        </Card>
      </div>

      {error && <div className="text-red-600">{error}</div>}
      {result && (
        <Card>
          <CardHeader>
            <CardTitle>Result</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-2">
              <div>Type: {result.type}</div>
              <div>
                Carbon:{" "}
                <span className="font-semibold">{result.carbon_t_ha}</span>{" "}
                tC/ha
              </div>
              <div>
                CO₂e: <span className="font-semibold">{result.co2e_t_ha}</span>{" "}
                tCO₂e/ha
              </div>
              {result.id && <div>Saved id: {result.id}</div>}
            </div>
          </CardContent>
        </Card>
      )}
    </div>
  );
}
