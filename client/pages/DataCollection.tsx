import React, { useState, useEffect } from "react";
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
import { Alert, AlertDescription } from "@/components/ui/alert";
import { Badge } from "@/components/ui/badge";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import {
  TreePine,
  Wheat,
  Camera,
  MapPin,
  Thermometer,
  Droplets,
  Leaf,
  Ruler,
  Upload,
  Save,
  Navigation,
  AlertCircle,
  CheckCircle,
  Loader2,
} from "lucide-react";
import { useNavigate } from "react-router-dom";

interface Field {
  _id: string;
  fieldId: string;
  fieldName: string;
  cropType: string;
  area: number;
}

interface MeasurementData {
  fieldId: string;
  measurementType: string;
  gpsLocation: {
    latitude: string;
    longitude: string;
    accuracy: string;
  };
  photos: Array<{
    url: string;
    caption: string;
  }>;
  biomassData?: {
    treeCount: string;
    averageTreeHeight: string;
    averageDbh: string;
    canopyCover: string;
    understoryBiomass: string;
  };
  soilData?: {
    soilDepth: string;
    organicCarbonContent: string;
    bulkDensity: string;
    ph: string;
    moisture: string;
    temperature: string;
    sampleMethod: string;
  };
  riceData?: {
    plantHeight: string;
    tillerCount: string;
    panicleLength: string;
    grainYield: string;
    biomassYield: string;
    waterLevel: string;
    floodingDuration: string;
    variety: string;
    cultivationMethod: string;
    waterManagement: string;
  };
  environmentalData?: {
    temperature: string;
    humidity: string;
    rainfall: string;
    windSpeed: string;
  };
  notes: string;
}

export default function DataCollection() {
  const navigate = useNavigate();
  const [loading, setLoading] = useState(false);
  const [fieldsLoading, setFieldsLoading] = useState(true);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");
  const [fields, setFields] = useState<Field[]>([]);
  const [selectedField, setSelectedField] = useState<Field | null>(null);
  const [gpsLoading, setGpsLoading] = useState(false);

  const [formData, setFormData] = useState<MeasurementData>({
    fieldId: "",
    measurementType: "",
    gpsLocation: {
      latitude: "",
      longitude: "",
      accuracy: "10",
    },
    photos: [],
    notes: "",
  });

  useEffect(() => {
    fetchFields();
  }, []);

  const fetchFields = async () => {
    try {
      const token = localStorage.getItem("token");
      if (!token) {
        navigate("/farmer/auth");
        return;
      }

      const response = await fetch("/api/fields", {
        headers: {
          Authorization: `Bearer ${token}`,
          "Content-Type": "application/json",
        },
      });

      const data = await response.json();

      if (data.success) {
        setFields(data.data.fields);
      } else {
        setError(data.message || "Failed to fetch fields");
      }
    } catch (error) {
      setError("Failed to load fields. Please check your connection.");
    } finally {
      setFieldsLoading(false);
    }
  };

  const getCurrentLocation = () => {
    setGpsLoading(true);
    if (navigator.geolocation) {
      navigator.geolocation.getCurrentPosition(
        (position) => {
          setFormData((prev) => ({
            ...prev,
            gpsLocation: {
              latitude: position.coords.latitude.toString(),
              longitude: position.coords.longitude.toString(),
              accuracy: position.coords.accuracy?.toString() || "10",
            },
          }));
          setGpsLoading(false);
        },
        (error) => {
          setError(
            "Failed to get GPS location. Please enter coordinates manually.",
          );
          setGpsLoading(false);
        },
      );
    } else {
      setError("GPS not supported on this device");
      setGpsLoading(false);
    }
  };

  const handleFieldSelect = (fieldId: string) => {
    const field = fields.find((f) => f._id === fieldId);
    setSelectedField(field || null);
    setFormData((prev) => ({ ...prev, fieldId }));
  };

  const handleInputChange = (field: string, value: string) => {
    if (field.includes(".")) {
      const [parent, child] = field.split(".");
      setFormData((prev) => ({
        ...prev,
        [parent]: {
          ...prev[parent as keyof MeasurementData],
          [child]: value,
        },
      }));
    } else {
      setFormData((prev) => ({
        ...prev,
        [field]: value,
      }));
    }
  };

  const addPhoto = () => {
    const photoUrl = prompt("Enter photo URL or upload link:");
    const caption = prompt("Enter photo caption:");

    if (photoUrl) {
      setFormData((prev) => ({
        ...prev,
        photos: [...prev.photos, { url: photoUrl, caption: caption || "" }],
      }));
    }
  };

  const removePhoto = (index: number) => {
    setFormData((prev) => ({
      ...prev,
      photos: prev.photos.filter((_, i) => i !== index),
    }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError("");

    try {
      const token = localStorage.getItem("token");
      if (!token) {
        navigate("/farmer/auth");
        return;
      }

      // Validate required fields
      if (
        !formData.fieldId ||
        !formData.measurementType ||
        !formData.gpsLocation.latitude ||
        !formData.gpsLocation.longitude
      ) {
        setError("Please fill in all required fields");
        setLoading(false);
        return;
      }

      // Prepare submission data
      const submissionData = {
        ...formData,
        gpsLocation: {
          latitude: parseFloat(formData.gpsLocation.latitude),
          longitude: parseFloat(formData.gpsLocation.longitude),
          accuracy: parseFloat(formData.gpsLocation.accuracy),
        },
      };

      // Convert string numbers to actual numbers for measurement data
      if (formData.biomassData) {
        submissionData.biomassData = {
          treeCount: parseInt(formData.biomassData.treeCount),
          averageTreeHeight: parseFloat(formData.biomassData.averageTreeHeight),
          averageDbh: parseFloat(formData.biomassData.averageDbh),
          canopyCover: parseFloat(formData.biomassData.canopyCover),
          understoryBiomass: parseFloat(formData.biomassData.understoryBiomass),
        };
      }

      if (formData.soilData) {
        submissionData.soilData = {
          ...formData.soilData,
          soilDepth: parseFloat(formData.soilData.soilDepth),
          organicCarbonContent: parseFloat(
            formData.soilData.organicCarbonContent,
          ),
          bulkDensity: parseFloat(formData.soilData.bulkDensity),
          ph: parseFloat(formData.soilData.ph),
          moisture: parseFloat(formData.soilData.moisture),
          temperature: parseFloat(formData.soilData.temperature),
        };
      }

      if (formData.riceData) {
        submissionData.riceData = {
          ...formData.riceData,
          plantHeight: parseFloat(formData.riceData.plantHeight),
          tillerCount: parseInt(formData.riceData.tillerCount),
          panicleLength: parseFloat(formData.riceData.panicleLength),
          grainYield: parseFloat(formData.riceData.grainYield),
          biomassYield: parseFloat(formData.riceData.biomassYield),
          waterLevel: parseFloat(formData.riceData.waterLevel),
          floodingDuration: parseInt(formData.riceData.floodingDuration),
        };
      }

      if (formData.environmentalData) {
        submissionData.environmentalData = {
          temperature: parseFloat(formData.environmentalData.temperature),
          humidity: parseFloat(formData.environmentalData.humidity),
          rainfall: parseFloat(formData.environmentalData.rainfall),
          windSpeed: parseFloat(formData.environmentalData.windSpeed),
        };
      }

      const response = await fetch("/api/measurements", {
        method: "POST",
        headers: {
          Authorization: `Bearer ${token}`,
          "Content-Type": "application/json",
        },
        body: JSON.stringify(submissionData),
      });

      const data = await response.json();

      if (data.success) {
        setSuccess(
          "Measurement recorded successfully! Redirecting to dashboard...",
        );
        setTimeout(() => {
          navigate("/farmer/dashboard");
        }, 2000);
      } else {
        setError(data.message || "Failed to record measurement");
      }
    } catch (error) {
      setError("Failed to record measurement. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  const getMeasurementTypesByField = (cropType: string) => {
    const types = ["soil-carbon"];

    if (cropType === "agroforestry") {
      types.push("biomass", "tree-growth");
    } else if (cropType === "rice") {
      types.push("methane-emission", "yield");
    }

    return types;
  };

  if (fieldsLoading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-emerald-50 via-white to-teal-50 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-16 w-16 border-b-2 border-emerald-600 mx-auto mb-4"></div>
          <p className="text-gray-600 font-medium">Loading your fields...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-emerald-50 via-white to-teal-50">
      {/* Header */}
      <div className="bg-white/80 backdrop-blur-md border-b border-emerald-100 sticky top-0 z-50">
        <div className="max-w-4xl mx-auto px-4 py-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-3">
              <div className="bg-gradient-to-r from-green-600 via-emerald-600 to-amber-500 p-2 rounded-xl shadow-lg">
                <Camera className="h-6 w-6 text-white" />
              </div>
              <div>
                <h1 className="text-xl font-display font-black text-gray-900">
                  Data Collection
                </h1>
                <p className="text-emerald-600 font-semibold text-sm">
                  Record field measurements
                </p>
              </div>
            </div>

            <Button
              variant="outline"
              onClick={() => navigate("/farmer/dashboard")}
            >
              Back to Dashboard
            </Button>
          </div>
        </div>
      </div>

      <div className="max-w-4xl mx-auto p-4 sm:p-6 lg:p-8">
        {error && (
          <Alert className="mb-6 border-red-200 bg-red-50">
            <AlertCircle className="h-4 w-4" />
            <AlertDescription className="text-red-700 font-medium">
              {error}
            </AlertDescription>
          </Alert>
        )}

        {success && (
          <Alert className="mb-6 border-green-200 bg-green-50">
            <CheckCircle className="h-4 w-4" />
            <AlertDescription className="text-green-700 font-medium">
              {success}
            </AlertDescription>
          </Alert>
        )}

        <form onSubmit={handleSubmit} className="space-y-6">
          {/* Field Selection */}
          <Card className="shadow-lg">
            <CardHeader>
              <CardTitle className="flex items-center">
                <MapPin className="h-5 w-5 mr-2 text-emerald-600" />
                Select Field
              </CardTitle>
              <CardDescription>
                Choose the field where you're taking measurements
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="field">Field *</Label>
                <Select
                  value={formData.fieldId}
                  onValueChange={handleFieldSelect}
                >
                  <SelectTrigger>
                    <SelectValue placeholder="Select a field" />
                  </SelectTrigger>
                  <SelectContent>
                    {fields.map((field) => (
                      <SelectItem key={field._id} value={field._id}>
                        {field.fieldName} - {field.cropType} ({field.area}{" "}
                        acres)
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>

              {selectedField && (
                <div className="p-4 bg-emerald-50 rounded-lg">
                  <div className="flex items-center space-x-2 mb-2">
                    {selectedField.cropType === "agroforestry" ? (
                      <TreePine className="h-5 w-5 text-green-600" />
                    ) : (
                      <Wheat className="h-5 w-5 text-amber-600" />
                    )}
                    <Badge variant="outline">{selectedField.cropType}</Badge>
                  </div>
                  <p className="text-sm text-gray-600">
                    <strong>{selectedField.fieldName}</strong> -{" "}
                    {selectedField.area} acres
                  </p>
                </div>
              )}

              {selectedField && (
                <div className="space-y-2">
                  <Label htmlFor="measurementType">Measurement Type *</Label>
                  <Select
                    value={formData.measurementType}
                    onValueChange={(value) =>
                      handleInputChange("measurementType", value)
                    }
                  >
                    <SelectTrigger>
                      <SelectValue placeholder="Select measurement type" />
                    </SelectTrigger>
                    <SelectContent>
                      {getMeasurementTypesByField(selectedField.cropType).map(
                        (type) => (
                          <SelectItem key={type} value={type}>
                            {type
                              .replace("-", " ")
                              .replace(/\b\w/g, (l) => l.toUpperCase())}
                          </SelectItem>
                        ),
                      )}
                    </SelectContent>
                  </Select>
                </div>
              )}
            </CardContent>
          </Card>

          {/* GPS Location */}
          <Card className="shadow-lg">
            <CardHeader>
              <CardTitle className="flex items-center">
                <Navigation className="h-5 w-5 mr-2 text-blue-600" />
                GPS Location
              </CardTitle>
              <CardDescription>
                Record the exact location of your measurement
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="flex items-center space-x-4 mb-4">
                <Button
                  type="button"
                  variant="outline"
                  onClick={getCurrentLocation}
                  disabled={gpsLoading}
                  className="flex items-center space-x-2"
                >
                  {gpsLoading ? (
                    <Loader2 className="h-4 w-4 animate-spin" />
                  ) : (
                    <Navigation className="h-4 w-4" />
                  )}
                  <span>Get Current Location</span>
                </Button>
              </div>

              <div className="grid md:grid-cols-3 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="latitude">Latitude *</Label>
                  <Input
                    id="latitude"
                    type="number"
                    step="0.000001"
                    placeholder="e.g., 28.7041"
                    value={formData.gpsLocation.latitude}
                    onChange={(e) =>
                      handleInputChange("gpsLocation.latitude", e.target.value)
                    }
                    required
                  />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="longitude">Longitude *</Label>
                  <Input
                    id="longitude"
                    type="number"
                    step="0.000001"
                    placeholder="e.g., 77.1025"
                    value={formData.gpsLocation.longitude}
                    onChange={(e) =>
                      handleInputChange("gpsLocation.longitude", e.target.value)
                    }
                    required
                  />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="accuracy">Accuracy (meters)</Label>
                  <Input
                    id="accuracy"
                    type="number"
                    placeholder="10"
                    value={formData.gpsLocation.accuracy}
                    onChange={(e) =>
                      handleInputChange("gpsLocation.accuracy", e.target.value)
                    }
                  />
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Photos */}
          <Card className="shadow-lg">
            <CardHeader>
              <CardTitle className="flex items-center">
                <Camera className="h-5 w-5 mr-2 text-purple-600" />
                Photos
              </CardTitle>
              <CardDescription>
                Add photos to document your measurements
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <Button
                type="button"
                variant="outline"
                onClick={addPhoto}
                className="w-full"
              >
                <Upload className="h-4 w-4 mr-2" />
                Add Photo
              </Button>

              {formData.photos.length > 0 && (
                <div className="space-y-2">
                  {formData.photos.map((photo, index) => (
                    <div
                      key={index}
                      className="flex items-center justify-between p-3 bg-gray-50 rounded-lg"
                    >
                      <div>
                        <p className="font-medium text-sm">
                          {photo.caption || "No caption"}
                        </p>
                        <p className="text-xs text-gray-500 truncate">
                          {photo.url}
                        </p>
                      </div>
                      <Button
                        type="button"
                        variant="outline"
                        size="sm"
                        onClick={() => removePhoto(index)}
                      >
                        Remove
                      </Button>
                    </div>
                  ))}
                </div>
              )}
            </CardContent>
          </Card>

          {/* Measurement Data Tabs */}
          {selectedField && formData.measurementType && (
            <Card className="shadow-lg">
              <CardHeader>
                <CardTitle className="flex items-center">
                  <Ruler className="h-5 w-5 mr-2 text-orange-600" />
                  Measurement Data
                </CardTitle>
                <CardDescription>
                  Enter specific measurements for {formData.measurementType}
                </CardDescription>
              </CardHeader>
              <CardContent>
                <Tabs defaultValue="measurement" className="space-y-4">
                  <TabsList className="grid w-full grid-cols-2">
                    <TabsTrigger value="measurement">Core Data</TabsTrigger>
                    <TabsTrigger value="environmental">
                      Environmental
                    </TabsTrigger>
                  </TabsList>

                  <TabsContent value="measurement" className="space-y-4">
                    {/* Biomass Data for Agroforestry */}
                    {selectedField.cropType === "agroforestry" &&
                      ["biomass", "tree-growth"].includes(
                        formData.measurementType,
                      ) && (
                        <div className="space-y-4">
                          <h4 className="font-semibold text-green-600 flex items-center">
                            <TreePine className="h-4 w-4 mr-2" />
                            Agroforestry Biomass Data
                          </h4>

                          <div className="grid md:grid-cols-2 gap-4">
                            <div className="space-y-2">
                              <Label htmlFor="treeCount">Tree Count</Label>
                              <Input
                                id="treeCount"
                                type="number"
                                placeholder="Number of trees"
                                value={formData.biomassData?.treeCount || ""}
                                onChange={(e) =>
                                  handleInputChange(
                                    "biomassData.treeCount",
                                    e.target.value,
                                  )
                                }
                              />
                            </div>

                            <div className="space-y-2">
                              <Label htmlFor="treeHeight">
                                Average Tree Height (m)
                              </Label>
                              <Input
                                id="treeHeight"
                                type="number"
                                step="0.1"
                                placeholder="e.g., 15.5"
                                value={
                                  formData.biomassData?.averageTreeHeight || ""
                                }
                                onChange={(e) =>
                                  handleInputChange(
                                    "biomassData.averageTreeHeight",
                                    e.target.value,
                                  )
                                }
                              />
                            </div>

                            <div className="space-y-2">
                              <Label htmlFor="dbh">Average DBH (cm)</Label>
                              <Input
                                id="dbh"
                                type="number"
                                step="0.1"
                                placeholder="Diameter at breast height"
                                value={formData.biomassData?.averageDbh || ""}
                                onChange={(e) =>
                                  handleInputChange(
                                    "biomassData.averageDbh",
                                    e.target.value,
                                  )
                                }
                              />
                            </div>

                            <div className="space-y-2">
                              <Label htmlFor="canopyCover">
                                Canopy Cover (%)
                              </Label>
                              <Input
                                id="canopyCover"
                                type="number"
                                min="0"
                                max="100"
                                placeholder="0-100"
                                value={formData.biomassData?.canopyCover || ""}
                                onChange={(e) =>
                                  handleInputChange(
                                    "biomassData.canopyCover",
                                    e.target.value,
                                  )
                                }
                              />
                            </div>

                            <div className="space-y-2 md:col-span-2">
                              <Label htmlFor="understoryBiomass">
                                Understory Biomass (kg/acre)
                              </Label>
                              <Input
                                id="understoryBiomass"
                                type="number"
                                step="0.1"
                                placeholder="Estimated understory biomass"
                                value={
                                  formData.biomassData?.understoryBiomass || ""
                                }
                                onChange={(e) =>
                                  handleInputChange(
                                    "biomassData.understoryBiomass",
                                    e.target.value,
                                  )
                                }
                              />
                            </div>
                          </div>
                        </div>
                      )}

                    {/* Rice Data */}
                    {selectedField.cropType === "rice" &&
                      ["methane-emission", "yield"].includes(
                        formData.measurementType,
                      ) && (
                        <div className="space-y-4">
                          <h4 className="font-semibold text-amber-600 flex items-center">
                            <Wheat className="h-4 w-4 mr-2" />
                            Rice Cultivation Data
                          </h4>

                          <div className="grid md:grid-cols-2 gap-4">
                            <div className="space-y-2">
                              <Label htmlFor="plantHeight">
                                Plant Height (cm)
                              </Label>
                              <Input
                                id="plantHeight"
                                type="number"
                                step="0.1"
                                placeholder="Average plant height"
                                value={formData.riceData?.plantHeight || ""}
                                onChange={(e) =>
                                  handleInputChange(
                                    "riceData.plantHeight",
                                    e.target.value,
                                  )
                                }
                              />
                            </div>

                            <div className="space-y-2">
                              <Label htmlFor="tillerCount">Tiller Count</Label>
                              <Input
                                id="tillerCount"
                                type="number"
                                placeholder="Number of tillers per plant"
                                value={formData.riceData?.tillerCount || ""}
                                onChange={(e) =>
                                  handleInputChange(
                                    "riceData.tillerCount",
                                    e.target.value,
                                  )
                                }
                              />
                            </div>

                            <div className="space-y-2">
                              <Label htmlFor="waterLevel">
                                Water Level (cm)
                              </Label>
                              <Input
                                id="waterLevel"
                                type="number"
                                step="0.1"
                                placeholder="Water depth above soil"
                                value={formData.riceData?.waterLevel || ""}
                                onChange={(e) =>
                                  handleInputChange(
                                    "riceData.waterLevel",
                                    e.target.value,
                                  )
                                }
                              />
                            </div>

                            <div className="space-y-2">
                              <Label htmlFor="floodingDuration">
                                Flooding Duration (days)
                              </Label>
                              <Input
                                id="floodingDuration"
                                type="number"
                                placeholder="Total flooding days"
                                value={
                                  formData.riceData?.floodingDuration || ""
                                }
                                onChange={(e) =>
                                  handleInputChange(
                                    "riceData.floodingDuration",
                                    e.target.value,
                                  )
                                }
                              />
                            </div>

                            <div className="space-y-2">
                              <Label htmlFor="variety">Rice Variety</Label>
                              <Input
                                id="variety"
                                placeholder="e.g., Basmati, IR64"
                                value={formData.riceData?.variety || ""}
                                onChange={(e) =>
                                  handleInputChange(
                                    "riceData.variety",
                                    e.target.value,
                                  )
                                }
                              />
                            </div>

                            <div className="space-y-2">
                              <Label htmlFor="cultivationMethod">
                                Cultivation Method
                              </Label>
                              <Select
                                value={
                                  formData.riceData?.cultivationMethod || ""
                                }
                                onValueChange={(value) =>
                                  handleInputChange(
                                    "riceData.cultivationMethod",
                                    value,
                                  )
                                }
                              >
                                <SelectTrigger>
                                  <SelectValue placeholder="Select method" />
                                </SelectTrigger>
                                <SelectContent>
                                  <SelectItem value="conventional">
                                    Conventional
                                  </SelectItem>
                                  <SelectItem value="sri">
                                    SRI (System of Rice Intensification)
                                  </SelectItem>
                                  <SelectItem value="organic">
                                    Organic
                                  </SelectItem>
                                </SelectContent>
                              </Select>
                            </div>
                          </div>
                        </div>
                      )}

                    {/* Soil Data (for all types) */}
                    {formData.measurementType === "soil-carbon" && (
                      <div className="space-y-4">
                        <h4 className="font-semibold text-brown-600 flex items-center">
                          <Leaf className="h-4 w-4 mr-2" />
                          Soil Carbon Data
                        </h4>

                        <div className="grid md:grid-cols-2 gap-4">
                          <div className="space-y-2">
                            <Label htmlFor="soilDepth">Soil Depth (cm)</Label>
                            <Input
                              id="soilDepth"
                              type="number"
                              step="0.1"
                              placeholder="Sampling depth"
                              value={formData.soilData?.soilDepth || ""}
                              onChange={(e) =>
                                handleInputChange(
                                  "soilData.soilDepth",
                                  e.target.value,
                                )
                              }
                            />
                          </div>

                          <div className="space-y-2">
                            <Label htmlFor="organicCarbon">
                              Organic Carbon Content (%)
                            </Label>
                            <Input
                              id="organicCarbon"
                              type="number"
                              step="0.01"
                              placeholder="Percentage of organic carbon"
                              value={
                                formData.soilData?.organicCarbonContent || ""
                              }
                              onChange={(e) =>
                                handleInputChange(
                                  "soilData.organicCarbonContent",
                                  e.target.value,
                                )
                              }
                            />
                          </div>

                          <div className="space-y-2">
                            <Label htmlFor="bulkDensity">
                              Bulk Density (g/cm³)
                            </Label>
                            <Input
                              id="bulkDensity"
                              type="number"
                              step="0.01"
                              placeholder="Soil bulk density"
                              value={formData.soilData?.bulkDensity || ""}
                              onChange={(e) =>
                                handleInputChange(
                                  "soilData.bulkDensity",
                                  e.target.value,
                                )
                              }
                            />
                          </div>

                          <div className="space-y-2">
                            <Label htmlFor="ph">Soil pH</Label>
                            <Input
                              id="ph"
                              type="number"
                              step="0.1"
                              min="0"
                              max="14"
                              placeholder="pH value (0-14)"
                              value={formData.soilData?.ph || ""}
                              onChange={(e) =>
                                handleInputChange("soilData.ph", e.target.value)
                              }
                            />
                          </div>

                          <div className="space-y-2">
                            <Label htmlFor="moisture">Soil Moisture (%)</Label>
                            <Input
                              id="moisture"
                              type="number"
                              step="0.1"
                              min="0"
                              max="100"
                              placeholder="Moisture percentage"
                              value={formData.soilData?.moisture || ""}
                              onChange={(e) =>
                                handleInputChange(
                                  "soilData.moisture",
                                  e.target.value,
                                )
                              }
                            />
                          </div>

                          <div className="space-y-2">
                            <Label htmlFor="soilTemp">
                              Soil Temperature (°C)
                            </Label>
                            <Input
                              id="soilTemp"
                              type="number"
                              step="0.1"
                              placeholder="Temperature in Celsius"
                              value={formData.soilData?.temperature || ""}
                              onChange={(e) =>
                                handleInputChange(
                                  "soilData.temperature",
                                  e.target.value,
                                )
                              }
                            />
                          </div>
                        </div>
                      </div>
                    )}
                  </TabsContent>

                  <TabsContent value="environmental" className="space-y-4">
                    <h4 className="font-semibold text-blue-600 flex items-center">
                      <Thermometer className="h-4 w-4 mr-2" />
                      Environmental Conditions
                    </h4>

                    <div className="grid md:grid-cols-2 gap-4">
                      <div className="space-y-2">
                        <Label htmlFor="temperature">
                          Air Temperature (°C)
                        </Label>
                        <Input
                          id="temperature"
                          type="number"
                          step="0.1"
                          placeholder="Ambient temperature"
                          value={formData.environmentalData?.temperature || ""}
                          onChange={(e) =>
                            handleInputChange(
                              "environmentalData.temperature",
                              e.target.value,
                            )
                          }
                        />
                      </div>

                      <div className="space-y-2">
                        <Label htmlFor="humidity">Humidity (%)</Label>
                        <Input
                          id="humidity"
                          type="number"
                          min="0"
                          max="100"
                          placeholder="Relative humidity"
                          value={formData.environmentalData?.humidity || ""}
                          onChange={(e) =>
                            handleInputChange(
                              "environmentalData.humidity",
                              e.target.value,
                            )
                          }
                        />
                      </div>

                      <div className="space-y-2">
                        <Label htmlFor="rainfall">Recent Rainfall (mm)</Label>
                        <Input
                          id="rainfall"
                          type="number"
                          step="0.1"
                          placeholder="Last 24 hours"
                          value={formData.environmentalData?.rainfall || ""}
                          onChange={(e) =>
                            handleInputChange(
                              "environmentalData.rainfall",
                              e.target.value,
                            )
                          }
                        />
                      </div>

                      <div className="space-y-2">
                        <Label htmlFor="windSpeed">Wind Speed (km/h)</Label>
                        <Input
                          id="windSpeed"
                          type="number"
                          step="0.1"
                          placeholder="Wind speed"
                          value={formData.environmentalData?.windSpeed || ""}
                          onChange={(e) =>
                            handleInputChange(
                              "environmentalData.windSpeed",
                              e.target.value,
                            )
                          }
                        />
                      </div>
                    </div>
                  </TabsContent>
                </Tabs>
              </CardContent>
            </Card>
          )}

          {/* Notes */}
          <Card className="shadow-lg">
            <CardHeader>
              <CardTitle>Additional Notes</CardTitle>
              <CardDescription>
                Add any additional observations or comments
              </CardDescription>
            </CardHeader>
            <CardContent>
              <Textarea
                placeholder="Enter any additional observations, weather conditions, or notes about the measurement..."
                value={formData.notes}
                onChange={(e) => handleInputChange("notes", e.target.value)}
                rows={4}
              />
            </CardContent>
          </Card>

          {/* Submit Button */}
          <div className="flex justify-end space-x-4">
            <Button
              type="button"
              variant="outline"
              onClick={() => navigate("/farmer/dashboard")}
            >
              Cancel
            </Button>

            <Button
              type="submit"
              className="bg-gradient-to-r from-green-600 to-emerald-600 hover:from-green-700 hover:to-emerald-700"
              disabled={
                loading || !formData.fieldId || !formData.measurementType
              }
            >
              {loading ? (
                <>
                  <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                  Recording...
                </>
              ) : (
                <>
                  <Save className="mr-2 h-4 w-4" />
                  Record Measurement
                </>
              )}
            </Button>
          </div>
        </form>
      </div>
    </div>
  );
}
