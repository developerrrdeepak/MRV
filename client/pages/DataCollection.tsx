import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Textarea } from "@/components/ui/textarea";
import { Badge } from "@/components/ui/badge";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import {
  Camera,
  Upload,
  MapPin,
  TreePine,
  Wheat,
  Droplets,
  Thermometer,
  Calendar,
  Save,
  Plus,
  X,
  CheckCircle
} from "lucide-react";

interface DataCollectionProps {
  farmerId: string;
  projects: any[];
}

export default function DataCollection({ farmerId, projects }: DataCollectionProps) {
  const [activeTab, setActiveTab] = useState("new-measurement");
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [photos, setPhotos] = useState<string[]>([]);
  
  const [measurementForm, setMeasurementForm] = useState({
    projectId: "",
    plotId: "",
    measurementType: "",
    location: {
      latitude: "",
      longitude: "",
      area: ""
    },
    data: {
      // Biomass measurements
      aboveGroundBiomass: "",
      belowGroundBiomass: "",
      treeDensity: "",
      averageTreeHeight: "",
      averageTreeDiameter: "",
      
      // Soil measurements
      soilCarbonContent: "",
      soilOrganicMatter: "",
      soilPH: "",
      soilMoisture: "",
      soilDepth: "",
      
      // Crop measurements
      cropType: "",
      cropYield: "",
      cropStage: "",
      
      // Environmental data
      temperature: "",
      humidity: "",
      rainfall: "",
      windSpeed: "",
      
      // Water usage
      irrigationAmount: "",
      waterSource: ""
    },
    methodology: {
      measuredBy: "",
      measurementMethod: "",
      equipment: "",
      weatherConditions: "",
      samplingMethod: "",
      sampleSize: ""
    },
    notes: ""
  });

  const measurementTypes = [
    "biomass",
    "soil_carbon", 
    "tree_count",
    "crop_yield",
    "water_usage",
    "satellite_data",
    "other"
  ];

  const measurementMethods = [
    "manual",
    "gps", 
    "drone",
    "satellite",
    "sensor",
    "app"
  ];

  const cropStages = [
    "sowing",
    "germination",
    "vegetative",
    "flowering", 
    "fruiting",
    "harvest"
  ];

  const waterSources = [
    "groundwater",
    "surface_water",
    "rainwater",
    "recycled"
  ];

  const handleGetLocation = () => {
    if (navigator.geolocation) {
      navigator.geolocation.getCurrentPosition(
        (position) => {
          setMeasurementForm(prev => ({
            ...prev,
            location: {
              ...prev.location,
              latitude: position.coords.latitude.toString(),
              longitude: position.coords.longitude.toString()
            }
          }));
        },
        (error) => {
          console.error("Error getting location:", error);
          alert("Could not get your location. Please enter manually.");
        }
      );
    }
  };

  const handlePhotoUpload = (event: React.ChangeEvent<HTMLInputElement>) => {
    const files = event.target.files;
    if (files) {
      // In a real app, you'd upload to cloud storage and get URLs
      // For now, we'll create object URLs for preview
      const newPhotos = Array.from(files).map(file => URL.createObjectURL(file));
      setPhotos(prev => [...prev, ...newPhotos]);
    }
  };

  const removePhoto = (index: number) => {
    setPhotos(prev => prev.filter((_, i) => i !== index));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);

    try {
      // Generate measurement ID
      const measurementId = `MSR${Date.now().toString().slice(-6)}`;
      
      // Prepare measurement data
      const measurementData = {
        measurementId,
        farmer: farmerId,
        project: measurementForm.projectId,
        location: {
          plotId: measurementForm.plotId,
          coordinates: {
            latitude: parseFloat(measurementForm.location.latitude),
            longitude: parseFloat(measurementForm.location.longitude)
          },
          area: parseFloat(measurementForm.location.area)
        },
        measurementType: measurementForm.measurementType,
        data: Object.fromEntries(
          Object.entries(measurementForm.data).filter(([_, value]) => value !== "")
        ),
        methodology: {
          ...measurementForm.methodology,
          sampleSize: measurementForm.methodology.sampleSize ? 
            parseInt(measurementForm.methodology.sampleSize) : undefined
        },
        photos,
        measurementDate: new Date().toISOString()
      };

      // In a real implementation, you'd call your API
      console.log('Submitting measurement:', measurementData);
      
      // Simulate API call
      await new Promise(resolve => setTimeout(resolve, 2000));
      
      alert('Measurement submitted successfully!');
      
      // Reset form
      setMeasurementForm({
        projectId: "",
        plotId: "",
        measurementType: "",
        location: { latitude: "", longitude: "", area: "" },
        data: {
          aboveGroundBiomass: "", belowGroundBiomass: "", treeDensity: "",
          averageTreeHeight: "", averageTreeDiameter: "", soilCarbonContent: "",
          soilOrganicMatter: "", soilPH: "", soilMoisture: "", soilDepth: "",
          cropType: "", cropYield: "", cropStage: "", temperature: "",
          humidity: "", rainfall: "", windSpeed: "", irrigationAmount: "",
          waterSource: ""
        },
        methodology: {
          measuredBy: "", measurementMethod: "", equipment: "",
          weatherConditions: "", samplingMethod: "", sampleSize: ""
        },
        notes: ""
      });
      setPhotos([]);
      
    } catch (error) {
      console.error('Error submitting measurement:', error);
      alert('Failed to submit measurement. Please try again.');
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="space-y-6">
      <Tabs value={activeTab} onValueChange={setActiveTab}>
        <TabsList className="grid w-full grid-cols-2">
          <TabsTrigger value="new-measurement">New Measurement</TabsTrigger>
          <TabsTrigger value="upload-photos">Upload Photos</TabsTrigger>
        </TabsList>

        {/* New Measurement Tab */}
        <TabsContent value="new-measurement">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <TreePine className="h-5 w-5" />
                Record Field Measurement
              </CardTitle>
              <CardDescription>
                Collect and submit data for carbon sequestration tracking
              </CardDescription>
            </CardHeader>
            <CardContent>
              <form onSubmit={handleSubmit} className="space-y-6">
                {/* Basic Information */}
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                  <div className="space-y-2">
                    <Label htmlFor="project">Carbon Project *</Label>
                    <Select value={measurementForm.projectId} onValueChange={(value) => 
                      setMeasurementForm(prev => ({ ...prev, projectId: value }))
                    }>
                      <SelectTrigger>
                        <SelectValue placeholder="Select project" />
                      </SelectTrigger>
                      <SelectContent>
                        {projects.map(project => (
                          <SelectItem key={project._id} value={project._id}>
                            {project.name}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="plotId">Plot/Field ID *</Label>
                    <Input
                      id="plotId"
                      placeholder="e.g., Field-A1"
                      value={measurementForm.plotId}
                      onChange={(e) => setMeasurementForm(prev => ({ 
                        ...prev, plotId: e.target.value 
                      }))}
                      required
                    />
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="measurementType">Measurement Type *</Label>
                    <Select value={measurementForm.measurementType} onValueChange={(value) => 
                      setMeasurementForm(prev => ({ ...prev, measurementType: value }))
                    }>
                      <SelectTrigger>
                        <SelectValue placeholder="Select type" />
                      </SelectTrigger>
                      <SelectContent>
                        {measurementTypes.map(type => (
                          <SelectItem key={type} value={type}>
                            {type.replace('_', ' ').toUpperCase()}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </div>
                </div>

                {/* Location Information */}
                <div className="space-y-4">
                  <h4 className="font-semibold flex items-center gap-2">
                    <MapPin className="h-4 w-4" />
                    Location Details
                  </h4>
                  
                  <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
                    <div className="space-y-2">
                      <Label htmlFor="latitude">Latitude *</Label>
                      <Input
                        id="latitude"
                        type="number"
                        step="0.000001"
                        placeholder="28.7041"
                        value={measurementForm.location.latitude}
                        onChange={(e) => setMeasurementForm(prev => ({
                          ...prev,
                          location: { ...prev.location, latitude: e.target.value }
                        }))}
                        required
                      />
                    </div>

                    <div className="space-y-2">
                      <Label htmlFor="longitude">Longitude *</Label>
                      <Input
                        id="longitude"
                        type="number"
                        step="0.000001"
                        placeholder="77.1025"
                        value={measurementForm.location.longitude}
                        onChange={(e) => setMeasurementForm(prev => ({
                          ...prev,
                          location: { ...prev.location, longitude: e.target.value }
                        }))}
                        required
                      />
                    </div>

                    <div className="space-y-2">
                      <Label htmlFor="area">Area (ha) *</Label>
                      <Input
                        id="area"
                        type="number"
                        step="0.01"
                        placeholder="0.5"
                        value={measurementForm.location.area}
                        onChange={(e) => setMeasurementForm(prev => ({
                          ...prev,
                          location: { ...prev.location, area: e.target.value }
                        }))}
                        required
                      />
                    </div>

                    <div className="space-y-2">
                      <Label>&nbsp;</Label>
                      <Button type="button" variant="outline" onClick={handleGetLocation}>
                        <MapPin className="h-4 w-4 mr-2" />
                        Get GPS
                      </Button>
                    </div>
                  </div>
                </div>

                {/* Measurement Data - Dynamic based on type */}
                {measurementForm.measurementType === "biomass" && (
                  <div className="space-y-4">
                    <h4 className="font-semibold flex items-center gap-2">
                      <TreePine className="h-4 w-4" />
                      Biomass Measurements
                    </h4>
                    
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                      <div className="space-y-2">
                        <Label>Above Ground Biomass (kg/ha)</Label>
                        <Input
                          type="number"
                          step="0.1"
                          value={measurementForm.data.aboveGroundBiomass}
                          onChange={(e) => setMeasurementForm(prev => ({
                            ...prev,
                            data: { ...prev.data, aboveGroundBiomass: e.target.value }
                          }))}
                        />
                      </div>

                      <div className="space-y-2">
                        <Label>Tree Density (trees/ha)</Label>
                        <Input
                          type="number"
                          value={measurementForm.data.treeDensity}
                          onChange={(e) => setMeasurementForm(prev => ({
                            ...prev,
                            data: { ...prev.data, treeDensity: e.target.value }
                          }))}
                        />
                      </div>

                      <div className="space-y-2">
                        <Label>Average Tree Height (m)</Label>
                        <Input
                          type="number"
                          step="0.1"
                          value={measurementForm.data.averageTreeHeight}
                          onChange={(e) => setMeasurementForm(prev => ({
                            ...prev,
                            data: { ...prev.data, averageTreeHeight: e.target.value }
                          }))}
                        />
                      </div>
                    </div>
                  </div>
                )}

                {measurementForm.measurementType === "soil_carbon" && (
                  <div className="space-y-4">
                    <h4 className="font-semibold">Soil Carbon Measurements</h4>
                    
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                      <div className="space-y-2">
                        <Label>Soil Carbon Content (%)</Label>
                        <Input
                          type="number"
                          step="0.01"
                          max="100"
                          value={measurementForm.data.soilCarbonContent}
                          onChange={(e) => setMeasurementForm(prev => ({
                            ...prev,
                            data: { ...prev.data, soilCarbonContent: e.target.value }
                          }))}
                        />
                      </div>

                      <div className="space-y-2">
                        <Label>Soil pH</Label>
                        <Input
                          type="number"
                          step="0.1"
                          min="0"
                          max="14"
                          value={measurementForm.data.soilPH}
                          onChange={(e) => setMeasurementForm(prev => ({
                            ...prev,
                            data: { ...prev.data, soilPH: e.target.value }
                          }))}
                        />
                      </div>

                      <div className="space-y-2">
                        <Label>Soil Moisture (%)</Label>
                        <Input
                          type="number"
                          step="0.1"
                          max="100"
                          value={measurementForm.data.soilMoisture}
                          onChange={(e) => setMeasurementForm(prev => ({
                            ...prev,
                            data: { ...prev.data, soilMoisture: e.target.value }
                          }))}
                        />
                      </div>
                    </div>
                  </div>
                )}

                {measurementForm.measurementType === "crop_yield" && (
                  <div className="space-y-4">
                    <h4 className="font-semibold flex items-center gap-2">
                      <Wheat className="h-4 w-4" />
                      Crop Measurements
                    </h4>
                    
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                      <div className="space-y-2">
                        <Label>Crop Type</Label>
                        <Input
                          value={measurementForm.data.cropType}
                          onChange={(e) => setMeasurementForm(prev => ({
                            ...prev,
                            data: { ...prev.data, cropType: e.target.value }
                          }))}
                          placeholder="e.g., Rice, Wheat"
                        />
                      </div>

                      <div className="space-y-2">
                        <Label>Crop Yield (kg/ha)</Label>
                        <Input
                          type="number"
                          step="0.1"
                          value={measurementForm.data.cropYield}
                          onChange={(e) => setMeasurementForm(prev => ({
                            ...prev,
                            data: { ...prev.data, cropYield: e.target.value }
                          }))}
                        />
                      </div>

                      <div className="space-y-2">
                        <Label>Crop Stage</Label>
                        <Select value={measurementForm.data.cropStage} onValueChange={(value) => 
                          setMeasurementForm(prev => ({
                            ...prev,
                            data: { ...prev.data, cropStage: value }
                          }))
                        }>
                          <SelectTrigger>
                            <SelectValue placeholder="Select stage" />
                          </SelectTrigger>
                          <SelectContent>
                            {cropStages.map(stage => (
                              <SelectItem key={stage} value={stage}>
                                {stage.charAt(0).toUpperCase() + stage.slice(1)}
                              </SelectItem>
                            ))}
                          </SelectContent>
                        </Select>
                      </div>
                    </div>
                  </div>
                )}

                {/* Environmental Data */}
                <div className="space-y-4">
                  <h4 className="font-semibold flex items-center gap-2">
                    <Thermometer className="h-4 w-4" />
                    Environmental Conditions
                  </h4>
                  
                  <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
                    <div className="space-y-2">
                      <Label>Temperature (°C)</Label>
                      <Input
                        type="number"
                        step="0.1"
                        value={measurementForm.data.temperature}
                        onChange={(e) => setMeasurementForm(prev => ({
                          ...prev,
                          data: { ...prev.data, temperature: e.target.value }
                        }))}
                      />
                    </div>

                    <div className="space-y-2">
                      <Label>Humidity (%)</Label>
                      <Input
                        type="number"
                        max="100"
                        value={measurementForm.data.humidity}
                        onChange={(e) => setMeasurementForm(prev => ({
                          ...prev,
                          data: { ...prev.data, humidity: e.target.value }
                        }))}
                      />
                    </div>

                    <div className="space-y-2">
                      <Label>Rainfall (mm)</Label>
                      <Input
                        type="number"
                        step="0.1"
                        value={measurementForm.data.rainfall}
                        onChange={(e) => setMeasurementForm(prev => ({
                          ...prev,
                          data: { ...prev.data, rainfall: e.target.value }
                        }))}
                      />
                    </div>

                    <div className="space-y-2">
                      <Label>Wind Speed (km/h)</Label>
                      <Input
                        type="number"
                        step="0.1"
                        value={measurementForm.data.windSpeed}
                        onChange={(e) => setMeasurementForm(prev => ({
                          ...prev,
                          data: { ...prev.data, windSpeed: e.target.value }
                        }))}
                      />
                    </div>
                  </div>
                </div>

                {/* Methodology */}
                <div className="space-y-4">
                  <h4 className="font-semibold">Measurement Methodology</h4>
                  
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div className="space-y-2">
                      <Label>Measured By *</Label>
                      <Input
                        value={measurementForm.methodology.measuredBy}
                        onChange={(e) => setMeasurementForm(prev => ({
                          ...prev,
                          methodology: { ...prev.methodology, measuredBy: e.target.value }
                        }))}
                        placeholder="Name of person taking measurement"
                        required
                      />
                    </div>

                    <div className="space-y-2">
                      <Label>Measurement Method *</Label>
                      <Select value={measurementForm.methodology.measurementMethod} onValueChange={(value) => 
                        setMeasurementForm(prev => ({
                          ...prev,
                          methodology: { ...prev.methodology, measurementMethod: value }
                        }))
                      }>
                        <SelectTrigger>
                          <SelectValue placeholder="Select method" />
                        </SelectTrigger>
                        <SelectContent>
                          {measurementMethods.map(method => (
                            <SelectItem key={method} value={method}>
                              {method.charAt(0).toUpperCase() + method.slice(1)}
                            </SelectItem>
                          ))}
                        </SelectContent>
                      </Select>
                    </div>

                    <div className="space-y-2">
                      <Label>Equipment Used</Label>
                      <Input
                        value={measurementForm.methodology.equipment}
                        onChange={(e) => setMeasurementForm(prev => ({
                          ...prev,
                          methodology: { ...prev.methodology, equipment: e.target.value }
                        }))}
                        placeholder="e.g., GPS device, measuring tape"
                      />
                    </div>

                    <div className="space-y-2">
                      <Label>Sample Size</Label>
                      <Input
                        type="number"
                        value={measurementForm.methodology.sampleSize}
                        onChange={(e) => setMeasurementForm(prev => ({
                          ...prev,
                          methodology: { ...prev.methodology, sampleSize: e.target.value }
                        }))}
                        placeholder="Number of samples taken"
                      />
                    </div>
                  </div>

                  <div className="space-y-2">
                    <Label>Weather Conditions</Label>
                    <Textarea
                      value={measurementForm.methodology.weatherConditions}
                      onChange={(e) => setMeasurementForm(prev => ({
                        ...prev,
                        methodology: { ...prev.methodology, weatherConditions: e.target.value }
                      }))}
                      placeholder="Describe weather conditions during measurement"
                      rows={2}
                    />
                  </div>
                </div>

                {/* Photos */}
                <div className="space-y-4">
                  <h4 className="font-semibold flex items-center gap-2">
                    <Camera className="h-4 w-4" />
                    Photos (Optional)
                  </h4>
                  
                  <div className="space-y-4">
                    <div>
                      <Label htmlFor="photos">Upload Field Photos</Label>
                      <Input
                        id="photos"
                        type="file"
                        multiple
                        accept="image/*"
                        onChange={handlePhotoUpload}
                        className="mt-2"
                      />
                    </div>

                    {photos.length > 0 && (
                      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                        {photos.map((photo, index) => (
                          <div key={index} className="relative">
                            <img
                              src={photo}
                              alt={`Field photo ${index + 1}`}
                              className="w-full h-24 object-cover rounded-lg"
                            />
                            <Button
                              type="button"
                              variant="destructive"
                              size="sm"
                              className="absolute -top-2 -right-2 h-6 w-6 rounded-full p-0"
                              onClick={() => removePhoto(index)}
                            >
                              <X className="h-4 w-4" />
                            </Button>
                          </div>
                        ))}
                      </div>
                    )}
                  </div>
                </div>

                {/* Additional Notes */}
                <div className="space-y-2">
                  <Label>Additional Notes</Label>
                  <Textarea
                    value={measurementForm.notes}
                    onChange={(e) => setMeasurementForm(prev => ({ ...prev, notes: e.target.value }))}
                    placeholder="Any additional observations or notes about this measurement"
                    rows={3}
                  />
                </div>

                {/* Submit Button */}
                <div className="flex justify-end space-x-4">
                  <Button type="button" variant="outline" onClick={() => {
                    if (confirm('Are you sure you want to reset the form?')) {
                      setMeasurementForm({
                        projectId: "", plotId: "", measurementType: "",
                        location: { latitude: "", longitude: "", area: "" },
                        data: {
                          aboveGroundBiomass: "", belowGroundBiomass: "", treeDensity: "",
                          averageTreeHeight: "", averageTreeDiameter: "", soilCarbonContent: "",
                          soilOrganicMatter: "", soilPH: "", soilMoisture: "", soilDepth: "",
                          cropType: "", cropYield: "", cropStage: "", temperature: "",
                          humidity: "", rainfall: "", windSpeed: "", irrigationAmount: "",
                          waterSource: ""
                        },
                        methodology: {
                          measuredBy: "", measurementMethod: "", equipment: "",
                          weatherConditions: "", samplingMethod: "", sampleSize: ""
                        },
                        notes: ""
                      });
                      setPhotos([]);
                    }
                  }}>
                    Reset Form
                  </Button>
                  
                  <Button 
                    type="submit" 
                    disabled={isSubmitting}
                    className="bg-gradient-to-r from-green-600 to-emerald-600 hover:from-green-700 hover:to-emerald-700"
                  >
                    {isSubmitting ? (
                      <>
                        <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white mr-2"></div>
                        Submitting...
                      </>
                    ) : (
                      <>
                        <Save className="h-4 w-4 mr-2" />
                        Submit Measurement
                      </>
                    )}
                  </Button>
                </div>
              </form>
            </CardContent>
          </Card>
        </TabsContent>

        {/* Quick Photo Upload Tab */}
        <TabsContent value="upload-photos">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Camera className="h-5 w-5" />
                Quick Photo Upload
              </CardTitle>
              <CardDescription>
                Upload photos of your farm progress and activities
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-6">
                <div className="border-2 border-dashed border-gray-300 rounded-lg p-8 text-center">
                  <Camera className="h-12 w-12 text-gray-400 mx-auto mb-4" />
                  <p className="text-lg font-medium text-gray-700 mb-2">
                    Take or Upload Photos
                  </p>
                  <p className="text-sm text-gray-500 mb-4">
                    Document your farming activities, tree growth, and field conditions
                  </p>
                  
                  <div className="space-y-2">
                    <Input
                      type="file"
                      multiple
                      accept="image/*"
                      capture="camera"
                      onChange={handlePhotoUpload}
                      className="hidden"
                      id="camera-upload"
                    />
                    <div className="flex flex-col sm:flex-row gap-2 justify-center">
                      <Label 
                        htmlFor="camera-upload"
                        className="cursor-pointer inline-flex items-center justify-center rounded-md text-sm font-medium transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:opacity-50 disabled:pointer-events-none ring-offset-background bg-primary text-primary-foreground hover:bg-primary/90 h-10 py-2 px-4"
                      >
                        <Camera className="h-4 w-4 mr-2" />
                        Take Photo
                      </Label>
                      
                      <Label 
                        htmlFor="camera-upload"
                        className="cursor-pointer inline-flex items-center justify-center rounded-md text-sm font-medium transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:opacity-50 disabled:pointer-events-none ring-offset-background border border-input hover:bg-accent hover:text-accent-foreground h-10 py-2 px-4"
                      >
                        <Upload className="h-4 w-4 mr-2" />
                        Upload from Gallery
                      </Label>
                    </div>
                  </div>
                </div>

                {photos.length > 0 && (
                  <div className="space-y-4">
                    <h4 className="font-medium">Selected Photos ({photos.length})</h4>
                    <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
                      {photos.map((photo, index) => (
                        <div key={index} className="relative group">
                          <img
                            src={photo}
                            alt={`Photo ${index + 1}`}
                            className="w-full h-32 object-cover rounded-lg border"
                          />
                          <Button
                            type="button"
                            variant="destructive"
                            size="sm"
                            className="absolute -top-2 -right-2 h-6 w-6 rounded-full p-0 opacity-0 group-hover:opacity-100 transition-opacity"
                            onClick={() => removePhoto(index)}
                          >
                            <X className="h-3 w-3" />
                          </Button>
                        </div>
                      ))}
                    </div>
                    
                    <Button className="w-full bg-gradient-to-r from-green-600 to-emerald-600 hover:from-green-700 hover:to-emerald-700">
                      <Upload className="h-4 w-4 mr-2" />
                      Submit {photos.length} Photo{photos.length !== 1 ? 's' : ''}
                    </Button>
                  </div>
                )}
              </div>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
}
