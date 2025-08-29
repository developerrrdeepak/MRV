import { useState, useEffect } from "react";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Badge } from "@/components/ui/badge";
import { Progress } from "@/components/ui/progress";
import { Textarea } from "@/components/ui/textarea";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { toast } from "sonner";
import {
  Satellite,
  Camera,
  BarChart3,
  MapPin,
  Thermometer,
  Droplets,
  Leaf,
  TreePine,
  Calculator,
  Upload,
  Download,
  Eye,
  CheckCircle,
  Clock,
  AlertTriangle,
  Wifi,
  Smartphone,
  Globe,
  IndianRupee,
} from "lucide-react";

interface SensorData {
  temperature: number;
  humidity: number;
  soilMoisture: number;
  ph: number;
  timestamp: Date;
}

interface SatelliteData {
  ndvi: number;
  canopyCover: number;
  biomass: number;
  location: { lat: number; lng: number };
  captureDate: Date;
}

export default function Tools() {
  const [selectedTool, setSelectedTool] = useState("monitoring");
  const estimatorUrl = "https://carbonstockestimation.mgx.world/";
  const [farmData, setFarmData] = useState({
    farmerId: "",
    location: "",
    cropType: "",
    area: "",
    plantingDate: "",
  });

  const [sensorData, setSensorData] = useState<SensorData[]>([
    {
      temperature: 28.5,
      humidity: 65,
      soilMoisture: 42,
      ph: 6.8,
      timestamp: new Date(),
    },
  ]);

  const [satelliteData, setSatelliteData] = useState<SatelliteData>({
    ndvi: 0.75,
    canopyCover: 85,
    biomass: 12.5,
    location: { lat: 28.6139, lng: 77.209 },
    captureDate: new Date(),
  });

  const [carbonCredits, setCarbonCredits] = useState({
    total: 0,
    verified: 0,
    pending: 0,
    income: 0,
  });

  const [verification, setVerification] = useState({
    satelliteCheck: "completed",
    fieldVerification: "in_progress",
    documentReview: "pending",
    finalApproval: "pending",
  });

  // Mobile features state
  const [openPhoto, setOpenPhoto] = useState(false);
  const [openGPS, setOpenGPS] = useState(false);
  const [openData, setOpenData] = useState(false);
  const [openWeather, setOpenWeather] = useState(false);

  const [photoPreview, setPhotoPreview] = useState<string | null>(null);
  const [geo, setGeo] = useState<{ lat?: number; lon?: number }>({});
  const [path, setPath] = useState<{ lat: number; lon: number }[]>([]);
  const [entries, setEntries] = useState<{ date: string; activity: string; notes: string }[]>(() => {
    try {
      const s = localStorage.getItem("farm_entries");
      return s ? JSON.parse(s) : [];
    } catch {
      return [];
    }
  });
  const [weather, setWeather] = useState<{ temp?: number; precip?: number; summary?: string } | null>(null);

  function onPhotoChange(e: React.ChangeEvent<HTMLInputElement>) {
    const f = e.target.files?.[0];
    if (!f) return;
    const url = URL.createObjectURL(f);
    setPhotoPreview(url);
    const reader = new FileReader();
    reader.onload = () => {
      try {
        const stored = JSON.parse(localStorage.getItem("farm_photos") || "[]");
        stored.unshift({ name: f.name, dataUrl: reader.result, ts: Date.now() });
        localStorage.setItem("farm_photos", JSON.stringify(stored.slice(0, 20)));
        toast.success("Photo saved locally");
      } catch {
        // ignore
      }
    };
    reader.readAsDataURL(f);
  }

  function getLocation() {
    if (!navigator?.geolocation) {
      toast.error("Geolocation not supported");
      return;
    }
    navigator.geolocation.getCurrentPosition(
      (pos) => setGeo({ lat: pos.coords.latitude, lon: pos.coords.longitude }),
      () => toast.error("Unable to get location"),
      { enableHighAccuracy: true, timeout: 5000 },
    );
  }

  function addPoint() {
    if (geo.lat && geo.lon) setPath((p) => [...p, { lat: geo.lat!, lon: geo.lon! }]);
  }

  function saveEntry(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    const fd = new FormData(e.currentTarget);
    const item = { date: String(fd.get("date")), activity: String(fd.get("activity")), notes: String(fd.get("notes")) };
    const next = [item, ...entries].slice(0, 50);
    setEntries(next);
    localStorage.setItem("farm_entries", JSON.stringify(next));
    toast.success("Saved offline");
    e.currentTarget.reset();
  }

  async function fetchWeather() {
    const lat = geo.lat ?? 28.6139;
    const lon = geo.lon ?? 77.209;
    try {
      const url = `https://api.open-meteo.com/v1/forecast?latitude=${lat}&longitude=${lon}&current=temperature_2m,precipitation&forecast_days=1`;
      const res = await fetch(url);
      const json = await res.json();
      const t = json?.current?.temperature_2m;
      const p = json?.current?.precipitation;
      setWeather({ temp: t, precip: p, summary: `Temp ${t}°C, Precip ${p}mm` });
    } catch {
      toast.error("Weather fetch failed");
    }
  }

  // Mock IoT sensor simulation
  useEffect(() => {
    const interval = setInterval(() => {
      const newData: SensorData = {
        temperature: 25 + Math.random() * 10,
        humidity: 50 + Math.random() * 30,
        soilMoisture: 30 + Math.random() * 40,
        ph: 6.0 + Math.random() * 2,
        timestamp: new Date(),
      };
      setSensorData((prev) => [newData, ...prev.slice(0, 9)]);
    }, 5000);

    return () => clearInterval(interval);
  }, []);

  const calculateCarbonCredits = () => {
    const area = parseFloat(farmData.area) || 0;
    const ndvi = satelliteData.ndvi;
    const biomass = satelliteData.biomass;

    // Mock calculation based on NDVI, biomass, and area
    const credits = area * ndvi * (biomass / 10) * 2.5;
    const income = credits * 500; // ₹500 per credit

    setCarbonCredits({
      total: credits,
      verified: credits * 0.7,
      pending: credits * 0.3,
      income: income,
    });
  };

  const simulateSatelliteUpdate = () => {
    setSatelliteData({
      ndvi: 0.6 + Math.random() * 0.3,
      canopyCover: 70 + Math.random() * 25,
      biomass: 10 + Math.random() * 8,
      location: {
        lat: 28.6139 + (Math.random() - 0.5) * 0.1,
        lng: 77.209 + (Math.random() - 0.5) * 0.1,
      },
      captureDate: new Date(),
    });
    toast.success("Satellite data updated!");
  };

  const exportReport = (type: string) => {
    toast.success(`${type} report exported successfully!`);
  };

  const verificationProgress = () => {
    const statuses = Object.values(verification);
    const completed = statuses.filter((s) => s === "completed").length;
    return (completed / statuses.length) * 100;
  };

  return (
    <div className="min-h-screen bg-gray-50 p-4">
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <div className="mb-8">
          <h1 className="text-4xl font-bold text-gray-900 mb-4">
            MRV Prototype Dashboard
          </h1>
          <p className="text-gray-600 text-lg">
            Monitoring, Reporting & Verification tools for carbon credit
            projects
          </p>
        </div>

        {/* Status Cards */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
          <Card>
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-gray-600">
                    Active Sensors
                  </p>
                  <p className="text-3xl font-bold text-green-600">24</p>
                </div>
                <Wifi className="h-8 w-8 text-green-600" />
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-gray-600">
                    Satellite Updates
                  </p>
                  <p className="text-3xl font-bold text-blue-600">Daily</p>
                </div>
                <Satellite className="h-8 w-8 text-blue-600" />
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-gray-600">
                    Carbon Credits
                  </p>
                  <p className="text-3xl font-bold text-emerald-600">
                    {carbonCredits.total.toFixed(1)}
                  </p>
                </div>
                <TreePine className="h-8 w-8 text-emerald-600" />
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-gray-600">
                    Verified Farms
                  </p>
                  <p className="text-3xl font-bold text-purple-600">156</p>
                </div>
                <CheckCircle className="h-8 w-8 text-purple-600" />
              </div>
            </CardContent>
          </Card>
        </div>

        <Tabs
          value={selectedTool}
          onValueChange={setSelectedTool}
          className="space-y-6"
        >
          <TabsList className="grid w-full grid-cols-6">
            <TabsTrigger value="monitoring">Monitoring</TabsTrigger>
            <TabsTrigger value="reporting">Reporting</TabsTrigger>
            <TabsTrigger value="verification">Verification</TabsTrigger>
            <TabsTrigger value="calculator">Calculator</TabsTrigger>
            <TabsTrigger value="mobile">Mobile Tools</TabsTrigger>
            <TabsTrigger value="estimator">Estimator</TabsTrigger>
          </TabsList>

          {/* Monitoring Tab */}
          <TabsContent value="monitoring">
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              {/* IoT Sensor Data */}
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center space-x-2">
                    <Thermometer className="h-5 w-5" />
                    <span>Real-time IoT Sensors</span>
                  </CardTitle>
                  <CardDescription>
                    Live environmental data from field sensors
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="space-y-4">
                    {sensorData.slice(0, 1).map((data, index) => (
                      <div key={index} className="grid grid-cols-2 gap-4">
                        <div className="text-center p-3 bg-blue-50 rounded-lg">
                          <p className="text-sm text-gray-600">Temperature</p>
                          <p className="text-2xl font-bold text-blue-600">
                            {data.temperature.toFixed(1)}°C
                          </p>
                        </div>
                        <div className="text-center p-3 bg-green-50 rounded-lg">
                          <p className="text-sm text-gray-600">Humidity</p>
                          <p className="text-2xl font-bold text-green-600">
                            {data.humidity.toFixed(0)}%
                          </p>
                        </div>
                        <div className="text-center p-3 bg-amber-50 rounded-lg">
                          <p className="text-sm text-gray-600">Soil Moisture</p>
                          <p className="text-2xl font-bold text-amber-600">
                            {data.soilMoisture.toFixed(0)}%
                          </p>
                        </div>
                        <div className="text-center p-3 bg-purple-50 rounded-lg">
                          <p className="text-sm text-gray-600">Soil pH</p>
                          <p className="text-2xl font-bold text-purple-600">
                            {data.ph.toFixed(1)}
                          </p>
                        </div>
                      </div>
                    ))}
                    <div className="text-center">
                      <Badge
                        variant="outline"
                        className="bg-green-50 text-green-700"
                      >
                        <Wifi className="h-3 w-3 mr-1" />
                        Live Data Stream
                      </Badge>
                    </div>
                  </div>
                </CardContent>
              </Card>

              {/* Satellite Monitoring */}
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center space-x-2">
                    <Satellite className="h-5 w-5" />
                    <span>Satellite Monitoring</span>
                  </CardTitle>
                  <CardDescription>
                    Remote sensing data analysis
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="space-y-4">
                    <div className="grid grid-cols-3 gap-4">
                      <div className="text-center p-3 bg-green-50 rounded-lg">
                        <p className="text-sm text-gray-600">NDVI</p>
                        <p className="text-2xl font-bold text-green-600">
                          {satelliteData.ndvi.toFixed(2)}
                        </p>
                      </div>
                      <div className="text-center p-3 bg-blue-50 rounded-lg">
                        <p className="text-sm text-gray-600">Canopy Cover</p>
                        <p className="text-2xl font-bold text-blue-600">
                          {satelliteData.canopyCover.toFixed(0)}%
                        </p>
                      </div>
                      <div className="text-center p-3 bg-emerald-50 rounded-lg">
                        <p className="text-sm text-gray-600">Biomass</p>
                        <p className="text-2xl font-bold text-emerald-600">
                          {satelliteData.biomass.toFixed(1)} t/ha
                        </p>
                      </div>
                    </div>
                    <div className="flex justify-between items-center pt-2">
                      <span className="text-xs text-gray-500">
                        Last updated:{" "}
                        {satelliteData.captureDate.toLocaleString()}
                      </span>
                      <Button size="sm" onClick={simulateSatelliteUpdate}>
                        <Eye className="h-4 w-4 mr-2" />
                        Update Data
                      </Button>
                    </div>
                  </div>
                </CardContent>
              </Card>

              {/* Farm Registration */}
              <Card className="lg:col-span-2">
                <CardHeader>
                  <CardTitle className="flex items-center space-x-2">
                    <MapPin className="h-5 w-5" />
                    <span>Farm Registration</span>
                  </CardTitle>
                  <CardDescription>
                    Register new farm for monitoring
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div>
                      <Label htmlFor="farmerId">Farmer ID</Label>
                      <Input
                        id="farmerId"
                        value={farmData.farmerId}
                        onChange={(e) =>
                          setFarmData({ ...farmData, farmerId: e.target.value })
                        }
                        placeholder="Enter farmer ID"
                      />
                    </div>
                    <div>
                      <Label htmlFor="location">Location</Label>
                      <Input
                        id="location"
                        value={farmData.location}
                        onChange={(e) =>
                          setFarmData({ ...farmData, location: e.target.value })
                        }
                        placeholder="Village, District, State"
                      />
                    </div>
                    <div>
                      <Label htmlFor="cropType">Crop Type</Label>
                      <Select
                        onValueChange={(value) =>
                          setFarmData({ ...farmData, cropType: value })
                        }
                      >
                        <SelectTrigger>
                          <SelectValue placeholder="Select crop" />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="rice">Rice</SelectItem>
                          <SelectItem value="wheat">Wheat</SelectItem>
                          <SelectItem value="agroforestry">
                            Agroforestry
                          </SelectItem>
                          <SelectItem value="sugarcane">Sugarcane</SelectItem>
                        </SelectContent>
                      </Select>
                    </div>
                    <div>
                      <Label htmlFor="area">Area (Hectares)</Label>
                      <Input
                        id="area"
                        type="number"
                        step="0.1"
                        value={farmData.area}
                        onChange={(e) =>
                          setFarmData({ ...farmData, area: e.target.value })
                        }
                        placeholder="Enter area"
                      />
                    </div>
                  </div>
                  <div className="flex justify-end mt-4 space-x-2">
                    <Button
                      onClick={calculateCarbonCredits}
                      className="bg-green-600 hover:bg-green-700"
                    >
                      Calculate Credits
                    </Button>
                    <Button variant="outline">Register Farm</Button>
                  </div>
                </CardContent>
              </Card>
            </div>
          </TabsContent>

          {/* Reporting Tab */}
          <TabsContent value="reporting">
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center space-x-2">
                    <BarChart3 className="h-5 w-5" />
                    <span>Carbon Credit Summary</span>
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="space-y-4">
                    <div className="flex justify-between items-center">
                      <span className="text-gray-600">
                        Total Credits Generated
                      </span>
                      <span className="font-bold text-green-600">
                        {carbonCredits.total.toFixed(1)}
                      </span>
                    </div>
                    <div className="flex justify-between items-center">
                      <span className="text-gray-600">Verified Credits</span>
                      <span className="font-bold text-blue-600">
                        {carbonCredits.verified.toFixed(1)}
                      </span>
                    </div>
                    <div className="flex justify-between items-center">
                      <span className="text-gray-600">
                        Pending Verification
                      </span>
                      <span className="font-bold text-amber-600">
                        {carbonCredits.pending.toFixed(1)}
                      </span>
                    </div>
                    <div className="flex justify-between items-center pt-2 border-t">
                      <span className="font-medium">Estimated Income</span>
                      <span className="font-bold text-emerald-600 flex items-center">
                        <IndianRupee className="h-4 w-4 mr-1" />
                        {carbonCredits.income.toLocaleString("en-IN")}
                      </span>
                    </div>
                  </div>
                </CardContent>
              </Card>

              <Card>
                <CardHeader>
                  <CardTitle>Export Reports</CardTitle>
                  <CardDescription>
                    Download MRV reports in various formats
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="space-y-3">
                    <Button
                      variant="outline"
                      className="w-full justify-start"
                      onClick={() => exportReport("Carbon Credit")}
                    >
                      <Download className="h-4 w-4 mr-2" />
                      Carbon Credit Report (PDF)
                    </Button>
                    <Button
                      variant="outline"
                      className="w-full justify-start"
                      onClick={() => exportReport("Monitoring")}
                    >
                      <Download className="h-4 w-4 mr-2" />
                      Monitoring Data (Excel)
                    </Button>
                    <Button
                      variant="outline"
                      className="w-full justify-start"
                      onClick={() => exportReport("Verification")}
                    >
                      <Download className="h-4 w-4 mr-2" />
                      Verification Report (PDF)
                    </Button>
                    <Button
                      variant="outline"
                      className="w-full justify-start"
                      onClick={() => exportReport("Financial")}
                    >
                      <Download className="h-4 w-4 mr-2" />
                      Financial Summary (Excel)
                    </Button>
                  </div>
                </CardContent>
              </Card>

              <Card className="lg:col-span-2">
                <CardHeader>
                  <CardTitle>Recent Activity</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="space-y-3">
                    <div className="flex items-center space-x-3 p-3 bg-green-50 rounded-lg">
                      <CheckCircle className="h-5 w-5 text-green-600" />
                      <div>
                        <p className="font-medium">
                          Farm ID-1234 verification completed
                        </p>
                        <p className="text-sm text-gray-600">2 hours ago</p>
                      </div>
                    </div>
                    <div className="flex items-center space-x-3 p-3 bg-blue-50 rounded-lg">
                      <Satellite className="h-5 w-5 text-blue-600" />
                      <div>
                        <p className="font-medium">
                          Satellite data updated for 45 farms
                        </p>
                        <p className="text-sm text-gray-600">4 hours ago</p>
                      </div>
                    </div>
                    <div className="flex items-center space-x-3 p-3 bg-amber-50 rounded-lg">
                      <Clock className="h-5 w-5 text-amber-600" />
                      <div>
                        <p className="font-medium">
                          Pending verification for Farm ID-5678
                        </p>
                        <p className="text-sm text-gray-600">1 day ago</p>
                      </div>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </div>
          </TabsContent>

          {/* Verification Tab */}
          <TabsContent value="verification">
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              <Card>
                <CardHeader>
                  <CardTitle>Verification Pipeline</CardTitle>
                  <CardDescription>Track verification progress</CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="space-y-4">
                    <div className="flex justify-between items-center mb-4">
                      <span className="font-medium">Overall Progress</span>
                      <span className="text-sm text-gray-600">
                        {verificationProgress().toFixed(0)}%
                      </span>
                    </div>
                    <Progress value={verificationProgress()} className="mb-6" />

                    <div className="space-y-3">
                      <div className="flex items-center justify-between p-3 border rounded-lg">
                        <div className="flex items-center space-x-2">
                          <CheckCircle className="h-4 w-4 text-green-600" />
                          <span>Satellite Verification</span>
                        </div>
                        <Badge className="bg-green-100 text-green-800">
                          Completed
                        </Badge>
                      </div>

                      <div className="flex items-center justify-between p-3 border rounded-lg">
                        <div className="flex items-center space-x-2">
                          <Clock className="h-4 w-4 text-amber-600" />
                          <span>Field Verification</span>
                        </div>
                        <Badge className="bg-amber-100 text-amber-800">
                          In Progress
                        </Badge>
                      </div>

                      <div className="flex items-center justify-between p-3 border rounded-lg">
                        <div className="flex items-center space-x-2">
                          <AlertTriangle className="h-4 w-4 text-gray-400" />
                          <span>Document Review</span>
                        </div>
                        <Badge variant="secondary">Pending</Badge>
                      </div>

                      <div className="flex items-center justify-between p-3 border rounded-lg">
                        <div className="flex items-center space-x-2">
                          <AlertTriangle className="h-4 w-4 text-gray-400" />
                          <span>Final Approval</span>
                        </div>
                        <Badge variant="secondary">Pending</Badge>
                      </div>
                    </div>
                  </div>
                </CardContent>
              </Card>

              <Card>
                <CardHeader>
                  <CardTitle>Verification Tools</CardTitle>
                  <CardDescription>
                    Automated verification systems
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="space-y-3">
                    <Button variant="outline" className="w-full justify-start">
                      <Eye className="h-4 w-4 mr-2" />
                      Satellite Image Analysis
                    </Button>
                    <Button variant="outline" className="w-full justify-start">
                      <Camera className="h-4 w-4 mr-2" />
                      Field Photo Verification
                    </Button>
                    <Button variant="outline" className="w-full justify-start">
                      <BarChart3 className="h-4 w-4 mr-2" />
                      Data Anomaly Detection
                    </Button>
                    <Button variant="outline" className="w-full justify-start">
                      <Upload className="h-4 w-4 mr-2" />
                      Document Upload
                    </Button>
                  </div>
                </CardContent>
              </Card>
            </div>
          </TabsContent>

          {/* Calculator Tab */}
          <TabsContent value="calculator">
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center space-x-2">
                  <Calculator className="h-5 w-5" />
                  <span>Carbon Credit Calculator</span>
                </CardTitle>
                <CardDescription>
                  Calculate potential carbon credits and income
                </CardDescription>
              </CardHeader>
              <CardContent>
                <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
                  <div className="space-y-4">
                    <h3 className="font-semibold">Input Parameters</h3>
                    <div className="grid grid-cols-2 gap-4">
                      <div>
                        <Label>Land Area (hectares)</Label>
                        <Input type="number" placeholder="Enter area" />
                      </div>
                      <div>
                        <Label>Project Type</Label>
                        <Select>
                          <SelectTrigger>
                            <SelectValue placeholder="Select type" />
                          </SelectTrigger>
                          <SelectContent>
                            <SelectItem value="agroforestry">
                              Agroforestry
                            </SelectItem>
                            <SelectItem value="rice">
                              Rice Cultivation
                            </SelectItem>
                            <SelectItem value="soil">Soil Carbon</SelectItem>
                          </SelectContent>
                        </Select>
                      </div>
                      <div>
                        <Label>Baseline Carbon (tCO2/ha)</Label>
                        <Input type="number" placeholder="Enter baseline" />
                      </div>
                      <div>
                        <Label>Project Duration (years)</Label>
                        <Input type="number" placeholder="Enter duration" />
                      </div>
                    </div>
                    <Button className="w-full">Calculate Credits</Button>
                  </div>

                  <div className="space-y-4">
                    <h3 className="font-semibold">Estimated Results</h3>
                    <div className="space-y-3">
                      <div className="p-4 bg-green-50 rounded-lg">
                        <p className="text-sm text-gray-600">
                          Annual Carbon Credits
                        </p>
                        <p className="text-2xl font-bold text-green-600">
                          25.5 tCO2
                        </p>
                      </div>
                      <div className="p-4 bg-blue-50 rounded-lg">
                        <p className="text-sm text-gray-600">
                          Total Project Credits
                        </p>
                        <p className="text-2xl font-bold text-blue-600">
                          255 tCO2
                        </p>
                      </div>
                      <div className="p-4 bg-emerald-50 rounded-lg">
                        <p className="text-sm text-gray-600">
                          Estimated Annual Income
                        </p>
                        <p className="text-2xl font-bold text-emerald-600 flex items-center">
                          <IndianRupee className="h-5 w-5 mr-1" />
                          12,750
                        </p>
                      </div>
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          {/* Mobile Tools Tab */}
          <TabsContent value="mobile">
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center space-x-2">
                    <Smartphone className="h-5 w-5" />
                    <span>Mobile App Features</span>
                  </CardTitle>
                  <CardDescription>
                    Farmer-friendly mobile tools
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="space-y-4">
                    <button onClick={() => setOpenPhoto(true)} className="w-full text-left">
                      <div className="flex items-center space-x-3 p-3 border rounded-lg hover:bg-gray-50">
                        <Camera className="h-6 w-6 text-blue-600" />
                        <div>
                          <p className="font-medium">Photo Upload</p>
                          <p className="text-sm text-gray-600">Capture field photos for verification</p>
                        </div>
                      </div>
                    </button>
                    <button onClick={() => setOpenGPS(true)} className="w-full text-left">
                      <div className="flex items-center space-x-3 p-3 border rounded-lg hover:bg-gray-50">
                        <MapPin className="h-6 w-6 text-green-600" />
                        <div>
                          <p className="font-medium">GPS Mapping</p>
                          <p className="text-sm text-gray-600">Mark field boundaries accurately</p>
                        </div>
                      </div>
                    </button>
                    <button onClick={() => setOpenData(true)} className="w-full text-left">
                      <div className="flex items-center space-x-3 p-3 border rounded-lg hover:bg-gray-50">
                        <BarChart3 className="h-6 w-6 text-purple-600" />
                        <div>
                          <p className="font-medium">Data Entry</p>
                          <p className="text-sm text-gray-600">Record farming activities offline</p>
                        </div>
                      </div>
                    </button>
                    <button onClick={() => setOpenWeather(true)} className="w-full text-left">
                      <div className="flex items-center space-x-3 p-3 border rounded-lg hover:bg-gray-50">
                        <Globe className="h-6 w-6 text-amber-600" />
                        <div>
                          <p className="font-medium">Weather Integration</p>
                          <p className="text-sm text-gray-600">Local weather and predictions</p>
                        </div>
                      </div>
                    </button>
                  </div>
                </CardContent>

                {/* Photo Upload Dialog */}
                <Dialog open={openPhoto} onOpenChange={setOpenPhoto}>
                  <DialogContent>
                    <DialogHeader>
                      <DialogTitle>Photo Upload</DialogTitle>
                    </DialogHeader>
                    <div className="space-y-3">
                      <Input type="file" accept="image/*" capture="environment" onChange={onPhotoChange} />
                      {photoPreview && (
                        <img src={photoPreview} alt="preview" className="w-full h-56 object-cover rounded" />
                      )}
                      <p className="text-xs text-gray-500">Saved locally. Upload service can be wired to backend later.</p>
                    </div>
                  </DialogContent>
                </Dialog>

                {/* GPS Dialog */}
                <Dialog open={openGPS} onOpenChange={setOpenGPS}>
                  <DialogContent>
                    <DialogHeader>
                      <DialogTitle>GPS Mapping</DialogTitle>
                    </DialogHeader>
                    <div className="space-y-3">
                      <div className="flex items-center gap-2">
                        <Button onClick={getLocation} variant="outline">Get Location</Button>
                        <Button onClick={addPoint} variant="secondary">Add Point</Button>
                      </div>
                      <div className="text-sm text-gray-700">Current: {geo.lat?.toFixed(5) ?? "-"}, {geo.lon?.toFixed(5) ?? "-"}</div>
                      <div className="max-h-40 overflow-auto border rounded p-2 text-sm">
                        {path.length === 0 ? <div>No points yet</div> : path.map((p, i) => (
                          <div key={i}>#{i + 1} → {p.lat.toFixed(5)}, {p.lon.toFixed(5)}</div>
                        ))}
                      </div>
                      {geo.lat && geo.lon && (
                        <a className="text-blue-600 underline text-sm" target="_blank" rel="noreferrer" href={`https://www.openstreetmap.org/?mlat=${geo.lat}&mlon=${geo.lon}#map=16/${geo.lat}/${geo.lon}`}>Open in Map</a>
                      )}
                    </div>
                  </DialogContent>
                </Dialog>

                {/* Data Entry Dialog */}
                <Dialog open={openData} onOpenChange={setOpenData}>
                  <DialogContent>
                    <DialogHeader>
                      <DialogTitle>Offline Data Entry</DialogTitle>
                    </DialogHeader>
                    <form onSubmit={saveEntry} className="space-y-3">
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                        <div>
                          <Label htmlFor="date">Date</Label>
                          <Input id="date" name="date" type="date" required />
                        </div>
                        <div>
                          <Label htmlFor="activity">Activity</Label>
                          <Input id="activity" name="activity" placeholder="Sowing / Irrigation / Harvest" required />
                        </div>
                      </div>
                      <div>
                        <Label htmlFor="notes">Notes</Label>
                        <Textarea id="notes" name="notes" placeholder="Details" />
                      </div>
                      <Button type="submit" className="w-full">Save</Button>
                      <div className="max-h-32 overflow-auto text-sm border rounded p-2">
                        {entries.length === 0 ? <div>No entries yet</div> : entries.map((e, i) => (
                          <div key={i} className="py-1 border-b last:border-0">
                            <div className="font-medium">{e.date} • {e.activity}</div>
                            <div className="text-gray-600">{e.notes}</div>
                          </div>
                        ))}
                      </div>
                    </form>
                  </DialogContent>
                </Dialog>

                {/* Weather Dialog */}
                <Dialog open={openWeather} onOpenChange={setOpenWeather}>
                  <DialogContent>
                    <DialogHeader>
                      <DialogTitle>Weather Integration</DialogTitle>
                    </DialogHeader>
                    <div className="space-y-3">
                      <div className="flex items-center gap-2">
                        <Button onClick={getLocation} variant="outline">Use GPS</Button>
                        <Button onClick={fetchWeather}>Get Weather</Button>
                      </div>
                      <div className="text-sm text-gray-700">Coords: {geo.lat?.toFixed(4) ?? "-"}, {geo.lon?.toFixed(4) ?? "-"}</div>
                      {weather && (
                        <div className="p-3 bg-amber-50 border rounded">
                          <div className="font-medium">Current</div>
                          <div>{weather.summary}</div>
                        </div>
                      )}
                    </div>
                  </DialogContent>
                </Dialog>
              </Card>

              <Card>
                <CardHeader>
                  <CardTitle>API Documentation</CardTitle>
                  <CardDescription>
                    Developer resources and endpoints
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="space-y-3">
                    <div className="p-3 bg-gray-50 rounded-lg">
                      <code className="text-sm">GET /api/sensors/:farmId</code>
                      <p className="text-xs text-gray-600 mt-1">
                        Retrieve sensor data
                      </p>
                    </div>
                    <div className="p-3 bg-gray-50 rounded-lg">
                      <code className="text-sm">
                        POST /api/satellite/analyze
                      </code>
                      <p className="text-xs text-gray-600 mt-1">
                        Request satellite analysis
                      </p>
                    </div>
                    <div className="p-3 bg-gray-50 rounded-lg">
                      <code className="text-sm">GET /api/credits/:farmId</code>
                      <p className="text-xs text-gray-600 mt-1">
                        Calculate carbon credits
                      </p>
                    </div>
                    <Button variant="outline" className="w-full mt-4">
                      <Download className="h-4 w-4 mr-2" />
                      Download SDK
                    </Button>
                  </div>
                </CardContent>
              </Card>
            </div>
          </TabsContent>
          {/* Estimator Tab */}
          <TabsContent value="estimator">
            <Card>
              <CardHeader className="flex items-center justify-between space-y-0">
                <div>
                  <CardTitle>Carbon Stock Estimator</CardTitle>
                  <CardDescription>Embedded external estimator</CardDescription>
                </div>
                <Button asChild variant="outline">
                  <a
                    href={estimatorUrl}
                    target="_blank"
                    rel="noopener noreferrer"
                  >
                    Open in new tab
                  </a>
                </Button>
              </CardHeader>
              <CardContent>
                <div className="w-full h-[75vh] rounded-lg overflow-hidden border">
                  <iframe
                    title="Carbon Stock Estimator"
                    src={estimatorUrl}
                    className="w-full h-full"
                    loading="lazy"
                    allow="fullscreen; clipboard-read; clipboard-write"
                  />
                </div>
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>
      </div>
    </div>
  );
}
