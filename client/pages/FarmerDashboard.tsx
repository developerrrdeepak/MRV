import { useState, useEffect } from "react";
import { useAuth } from "@/contexts/AuthContext";
import { Navigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
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
import { Separator } from "@/components/ui/separator";
import { toast } from "sonner";
import {
  User,
  MapPin,
  Phone,
  CreditCard,
  Sprout,
  Droplets,
  Calculator,
  TreePine,
  IndianRupee,
  Upload,
  CheckCircle,
  Clock,
  AlertCircle,
} from "lucide-react";

export default function FarmerDashboard() {
  const { user, isAuthenticated, updateProfile } = useAuth();
  const [profile, setProfile] = useState({
    name: "",
    phone: "",
    aadhaarId: "",
    farmerId: "",
    address: "",
    pincode: "",
    landSize: "",
  });
  const [farmData, setFarmData] = useState({
    soilPh: "",
    soilMoisture: "",
    cropType: "",
    irrigationType: "",
    waterUsage: "",
    areaPlanted: "",
  });
  const [loading, setLoading] = useState(false);
  const [profileComplete, setProfileComplete] = useState(false);

  useEffect(() => {
    if (user?.farmer) {
      setProfile({
        name: user.farmer.name || "",
        phone: user.farmer.phone || "",
        aadhaarId: user.farmer.aadhaarId || "",
        farmerId: user.farmer.farmerId || "",
        address: user.farmer.location?.address || "",
        pincode: user.farmer.location?.pincode || "",
        landSize: user.farmer.landSize?.toString() || "",
      });

      // Check if profile is complete
      const isComplete =
        user.farmer.name &&
        user.farmer.phone &&
        user.farmer.aadhaarId &&
        user.farmer.location?.address;
      setProfileComplete(!!isComplete);
    }
  }, [user]);

  if (!isAuthenticated || user?.type !== "farmer") {
    return <Navigate to="/" replace />;
  }

  const handleProfileUpdate = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);

    try {
      await updateProfile({
        name: profile.name,
        phone: profile.phone,
        aadhaarId: profile.aadhaarId,
        farmerId: profile.farmerId,
        location: {
          address: profile.address,
          pincode: profile.pincode,
        },
        landSize: parseFloat(profile.landSize) || 0,
      });

      toast.success("Profile updated successfully!");
      setProfileComplete(true);
    } catch (error) {
      toast.error("Failed to update profile");
    }

    setLoading(false);
  };

  const handleFarmDataSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);

    try {
      // Here you would typically save farm data to your backend
      toast.success("Farm data submitted successfully!");
    } catch (error) {
      toast.error("Failed to submit farm data");
    }

    setLoading(false);
  };

  const [estimator, setEstimator] = useState<{ totalCredits: number; estimatedIncome: number; loading: boolean; }>({ totalCredits: 0, estimatedIncome: 0, loading: false });

  const runEstimator = async () => {
    const landSize = parseFloat(profile.landSize) || 0;
    setEstimator((s) => ({ ...s, loading: true }));
    try {
      const res = await fetch("/api/estimator/calculate", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          areaHectares: landSize,
          projectType: "agroforestry",
          ndvi: farmData.soilMoisture ? Math.min(1, Math.max(0, Number(farmData.soilMoisture) / 100)) : 0.75,
          biomass: farmData.areaPlanted ? Math.max(8, Number(farmData.areaPlanted) * 2) : 12,
          irrigation: (farmData.irrigationType as any) || "rainfed",
          soilPh: farmData.soilPh ? Number(farmData.soilPh) : 6.8,
          durationYears: 1,
        }),
      });
      if (res.ok) {
        const data = await res.json();
        const total = data.data?.totalCredits ?? 0;
        const income = data.data?.estimatedIncomeINR ?? 0;
        setEstimator({ totalCredits: total, estimatedIncome: income, loading: false });
      } else {
        throw new Error("estimator failed");
      }
    } catch {
      const creditsPerHectare = 2.5;
      const totalCredits = landSize * creditsPerHectare;
      const estimatedIncome = totalCredits * 500;
      setEstimator({ totalCredits, estimatedIncome, loading: false });
    }
  };

  const projects = [
    {
      id: 1,
      name: "Agroforestry Initiative",
      type: "agroforestry",
      status: "active",
      creditRate: 2.5,
      description: "Tree plantation in agricultural lands",
    },
    {
      id: 2,
      name: "Rice Carbon Project",
      type: "rice_based",
      status: "active",
      creditRate: 1.8,
      description: "Sustainable rice cultivation practices",
    },
  ];

  return (
    <div className="min-h-screen bg-gradient-to-br from-emerald-50 via-white to-teal-50 p-4">
      <div className="max-w-7xl mx-auto">
        <div className="mb-8">
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 items-center">
            <div className="lg:col-span-2">
              <h1 className="text-3xl font-bold text-gray-900">
                Farmer Dashboard
              </h1>
              <p className="text-gray-600 mt-2">
                Welcome, {user?.farmer?.name || user?.farmer?.email}
              </p>
            </div>
            <div className="lg:col-span-1">
              <div className="relative overflow-hidden rounded-2xl shadow-lg h-32">
                <img
                  src="https://images.pexels.com/photos/20841296/pexels-photo-20841296.jpeg"
                  alt="Farmer working in green paddy fields"
                  className="w-full h-full object-cover"
                />
                <div className="absolute inset-0 bg-gradient-to-r from-green-600/20 to-emerald-600/20"></div>
                <div className="absolute bottom-2 left-3 text-white">
                  <p className="font-semibold text-sm">Your Farm Data</p>
                </div>
              </div>
            </div>
          </div>
        </div>

        {!profileComplete && (
          <Card className="mb-6 bg-amber-50 border border-amber-200 shadow-sm">
            <CardContent className="p-4">
              <div className="flex items-center space-x-2">
                <AlertCircle className="h-5 w-5 text-amber-600" />
                <p className="text-amber-800 font-medium">
                  Please complete your profile to access all features
                </p>
              </div>
            </CardContent>
          </Card>
        )}

        <Tabs defaultValue="profile" className="space-y-6">
          <TabsList className="grid w-full grid-cols-4">
            <TabsTrigger value="profile">Profile</TabsTrigger>
            <TabsTrigger value="farm-data">Farm Data</TabsTrigger>
            <TabsTrigger value="carbon">Carbon Credits</TabsTrigger>
            <TabsTrigger value="projects">Projects</TabsTrigger>
          </TabsList>

          <TabsContent value="profile">
            <Card className="bg-white/90 border border-emerald-100 shadow-sm">
              <CardHeader>
                <CardTitle className="flex items-center space-x-2">
                  <User className="h-5 w-5" />
                  <span>Profile Setup</span>
                </CardTitle>
                <CardDescription>
                  Complete your profile to start participating in carbon
                  projects
                </CardDescription>
              </CardHeader>
              <CardContent>
                <form onSubmit={handleProfileUpdate} className="space-y-4">
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div>
                      <Label htmlFor="name">Full Name *</Label>
                      <Input
                        id="name"
                        value={profile.name}
                        onChange={(e) =>
                          setProfile({ ...profile, name: e.target.value })
                        }
                        placeholder="Enter your full name"
                        required
                      />
                    </div>
                    <div>
                      <Label htmlFor="phone">Phone Number *</Label>
                      <Input
                        id="phone"
                        value={profile.phone}
                        onChange={(e) =>
                          setProfile({ ...profile, phone: e.target.value })
                        }
                        placeholder="Enter your phone number"
                        required
                      />
                    </div>
                    <div>
                      <Label htmlFor="aadhaar">Aadhaar Number *</Label>
                      <Input
                        id="aadhaar"
                        value={profile.aadhaarId}
                        onChange={(e) =>
                          setProfile({ ...profile, aadhaarId: e.target.value })
                        }
                        placeholder="Enter Aadhaar number"
                        maxLength={12}
                        required
                      />
                    </div>
                    <div>
                      <Label htmlFor="farmerId">Farmer ID (Optional)</Label>
                      <Input
                        id="farmerId"
                        value={profile.farmerId}
                        onChange={(e) =>
                          setProfile({ ...profile, farmerId: e.target.value })
                        }
                        placeholder="Enter farmer ID if available"
                      />
                    </div>
                    <div>
                      <Label htmlFor="address">Address *</Label>
                      <Textarea
                        id="address"
                        value={profile.address}
                        onChange={(e) =>
                          setProfile({ ...profile, address: e.target.value })
                        }
                        placeholder="Enter your complete address"
                        required
                      />
                    </div>
                    <div>
                      <Label htmlFor="pincode">Pincode *</Label>
                      <Input
                        id="pincode"
                        value={profile.pincode}
                        onChange={(e) =>
                          setProfile({ ...profile, pincode: e.target.value })
                        }
                        placeholder="Enter pincode"
                        maxLength={6}
                        required
                      />
                    </div>
                    <div>
                      <Label htmlFor="landSize">Land Size (Hectares) *</Label>
                      <Input
                        id="landSize"
                        type="number"
                        step="0.1"
                        value={profile.landSize}
                        onChange={(e) =>
                          setProfile({ ...profile, landSize: e.target.value })
                        }
                        placeholder="Enter land size in hectares"
                        required
                      />
                    </div>
                  </div>

                  <Button
                    type="submit"
                    disabled={loading}
                    className="bg-green-600 hover:bg-green-700"
                  >
                    {loading ? "Updating..." : "Update Profile"}
                  </Button>
                </form>
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="farm-data">
            <Card className="bg-white/90 border border-emerald-100 shadow-sm">
              <CardHeader>
                <CardTitle className="flex items-center space-x-2">
                  <Sprout className="h-5 w-5" />
                  <span>Farm & Crop Data</span>
                </CardTitle>
                <CardDescription>
                  Upload your farm and crop data for carbon credit calculation
                </CardDescription>
              </CardHeader>
              <CardContent>
                <form onSubmit={handleFarmDataSubmit} className="space-y-4">
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div>
                      <Label htmlFor="soilPh">Soil pH</Label>
                      <Input
                        id="soilPh"
                        type="number"
                        step="0.1"
                        value={farmData.soilPh}
                        onChange={(e) =>
                          setFarmData({ ...farmData, soilPh: e.target.value })
                        }
                        placeholder="Enter soil pH (6.0-8.0)"
                      />
                    </div>
                    <div>
                      <Label htmlFor="soilMoisture">Soil Moisture (%)</Label>
                      <Input
                        id="soilMoisture"
                        type="number"
                        value={farmData.soilMoisture}
                        onChange={(e) =>
                          setFarmData({
                            ...farmData,
                            soilMoisture: e.target.value,
                          })
                        }
                        placeholder="Enter soil moisture percentage"
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
                          <SelectValue placeholder="Select crop type" />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="rice">Rice</SelectItem>
                          <SelectItem value="wheat">Wheat</SelectItem>
                          <SelectItem value="sugarcane">Sugarcane</SelectItem>
                          <SelectItem value="cotton">Cotton</SelectItem>
                          <SelectItem value="maize">Maize</SelectItem>
                          <SelectItem value="vegetables">Vegetables</SelectItem>
                        </SelectContent>
                      </Select>
                    </div>
                    <div>
                      <Label htmlFor="irrigation">Irrigation Type</Label>
                      <Select
                        onValueChange={(value) =>
                          setFarmData({ ...farmData, irrigationType: value })
                        }
                      >
                        <SelectTrigger>
                          <SelectValue placeholder="Select irrigation type" />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="drip">Drip Irrigation</SelectItem>
                          <SelectItem value="sprinkler">Sprinkler</SelectItem>
                          <SelectItem value="flood">
                            Flood Irrigation
                          </SelectItem>
                          <SelectItem value="rainfed">Rain-fed</SelectItem>
                        </SelectContent>
                      </Select>
                    </div>
                    <div>
                      <Label htmlFor="waterUsage">
                        Water Usage (Liters/day)
                      </Label>
                      <Input
                        id="waterUsage"
                        type="number"
                        value={farmData.waterUsage}
                        onChange={(e) =>
                          setFarmData({
                            ...farmData,
                            waterUsage: e.target.value,
                          })
                        }
                        placeholder="Enter daily water usage"
                      />
                    </div>
                    <div>
                      <Label htmlFor="areaPlanted">
                        Area Planted (Hectares)
                      </Label>
                      <Input
                        id="areaPlanted"
                        type="number"
                        step="0.1"
                        value={farmData.areaPlanted}
                        onChange={(e) =>
                          setFarmData({
                            ...farmData,
                            areaPlanted: e.target.value,
                          })
                        }
                        placeholder="Enter planted area"
                      />
                    </div>
                  </div>

                  <Button
                    type="submit"
                    disabled={loading}
                    className="bg-green-600 hover:bg-green-700"
                  >
                    {loading ? "Submitting..." : "Submit Farm Data"}
                  </Button>
                </form>
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="carbon">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <Card className="bg-white/90 border border-emerald-100 shadow-sm">
                <CardHeader>
                  <CardTitle className="flex items-center space-x-2">
                    <Calculator className="h-5 w-5" />
                    <span>Carbon Credit Calculator</span>
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="space-y-4">
                    <div className="flex justify-between items-center">
                      <span className="text-sm text-gray-600">Land Size:</span>
                      <span className="font-medium">
                        {profile.landSize || 0} hectares
                      </span>
                    </div>
                    <div className="flex justify-between items-center">
                      <span className="text-sm text-gray-600">
                        Credits per hectare:
                      </span>
                      <span className="font-medium">2.5 credits</span>
                    </div>
                    <Separator />
                    <div className="flex justify-between items-center">
                      <span className="font-medium">Total Credits:</span>
                      <span className="font-bold text-green-600">
                        {estimator.totalCredits.toFixed(1)}
                      </span>
                    </div>
                    <div className="flex justify-between items-center">
                      <span className="font-medium">Estimated Income:</span>
                      <span className="font-bold text-green-600 flex items-center">
                        <IndianRupee className="h-4 w-4 mr-1" />
                        {estimator.estimatedIncome.toLocaleString("en-IN")}
                      </span>
                    </div>
                  </div>
                </CardContent>
              </Card>

              <Card className="bg-white/90 border border-emerald-100 shadow-sm">
                <CardHeader>
                  <CardTitle>Carbon Credit Status</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="space-y-4">
                    <div className="flex items-center justify-between">
                      <span className="text-sm">Verification Progress</span>
                      <span className="text-sm text-gray-600">60%</span>
                    </div>
                    <Progress value={60} className="h-2" />

                    <div className="space-y-2">
                      <div className="flex items-center space-x-2">
                        <CheckCircle className="h-4 w-4 text-green-600" />
                        <span className="text-sm">Profile Verified</span>
                      </div>
                      <div className="flex items-center space-x-2">
                        <CheckCircle className="h-4 w-4 text-green-600" />
                        <span className="text-sm">Farm Data Submitted</span>
                      </div>
                      <div className="flex items-center space-x-2">
                        <Clock className="h-4 w-4 text-yellow-600" />
                        <span className="text-sm">Awaiting Verification</span>
                      </div>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </div>
          </TabsContent>

          <TabsContent value="projects">
            <div className="space-y-6">
              <Card className="bg-white/90 border border-emerald-100 shadow-sm">
                <CardHeader>
                  <CardTitle className="flex items-center space-x-2">
                    <TreePine className="h-5 w-5" />
                    <span>Available Projects</span>
                  </CardTitle>
                  <CardDescription>
                    Join carbon projects to start earning credits
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    {projects.map((project) => (
                      <Card
                        key={project.id}
                        className="bg-white border-l-4 border-l-green-500 shadow-sm"
                      >
                        <CardContent className="p-4">
                          <div className="space-y-3">
                            <div className="flex items-center justify-between">
                              <h3 className="font-semibold">{project.name}</h3>
                              <Badge
                                variant="outline"
                                className="bg-green-50 text-green-700"
                              >
                                {project.status}
                              </Badge>
                            </div>
                            <p className="text-sm text-gray-600">
                              {project.description}
                            </p>
                            <div className="flex items-center justify-between">
                              <span className="text-sm">
                                <IndianRupee className="h-4 w-4 inline mr-1" />
                                {(project.creditRate * 500).toLocaleString(
                                  "en-IN",
                                )}
                                /hectare
                              </span>
                              <Button
                                size="sm"
                                className="bg-green-600 hover:bg-green-700"
                              >
                                Apply
                              </Button>
                            </div>
                          </div>
                        </CardContent>
                      </Card>
                    ))}
                  </div>
                </CardContent>
              </Card>
            </div>
          </TabsContent>
        </Tabs>
      </div>
    </div>
  );
}
