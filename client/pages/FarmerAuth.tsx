import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Textarea } from "@/components/ui/textarea";
import { Checkbox } from "@/components/ui/checkbox";
import { Phone, User, MapPin, Wheat, FileText, Camera, CreditCard } from "lucide-react";
import { useNavigate } from "react-router-dom";
import { useFarmerAuth } from "@/hooks/use-farmer-auth";

export default function FarmerAuth() {
  const navigate = useNavigate();
  const { signInFarmer, registerFarmer, isLoading, isAuthenticated } = useFarmerAuth();
  const [activeTab, setActiveTab] = useState("signin");

  // Redirect if already authenticated
  useEffect(() => {
    if (isAuthenticated) {
      navigate('/farmer-dashboard');
    }
  }, [isAuthenticated, navigate]);

  // Sign In Form State
  const [signInForm, setSignInForm] = useState({
    phone: "",
    farmerId: ""
  });

  // Registration Form State
  const [registrationForm, setRegistrationForm] = useState({
    // Personal Info
    name: "",
    phone: "",
    email: "",
    age: "",
    gender: "",
    education: "",
    experience: "",
    
    // Location
    state: "",
    district: "",
    village: "",
    latitude: "",
    longitude: "",
    
    // Farm Details
    totalArea: "",
    croppingPattern: "",
    soilType: "",
    irrigationType: "",
    
    // Documents
    aadharNumber: "",
    
    // Bank Details
    accountNumber: "",
    ifscCode: "",
    bankName: ""
  });

  const indianStates = [
    "Andhra Pradesh", "Arunachal Pradesh", "Assam", "Bihar", "Chhattisgarh",
    "Goa", "Gujarat", "Haryana", "Himachal Pradesh", "Jharkhand", "Karnataka",
    "Kerala", "Madhya Pradesh", "Maharashtra", "Manipur", "Meghalaya", "Mizoram",
    "Nagaland", "Odisha", "Punjab", "Rajasthan", "Sikkim", "Tamil Nadu",
    "Telangana", "Tripura", "Uttar Pradesh", "Uttarakhand", "West Bengal"
  ];

  const soilTypes = ["Alluvial", "Black", "Red", "Laterite", "Mountain", "Desert", "Sandy", "Clay", "Loamy"];
  const irrigationTypes = ["Rainfed", "Irrigated", "Drip", "Sprinkler", "Flood", "Mixed"];

  const handleSignIn = async (e: React.FormEvent) => {
    e.preventDefault();

    const result = await signInFarmer(signInForm.farmerId, signInForm.phone);

    if (result.success) {
      navigate('/farmer-dashboard');
    } else {
      alert(result.error || 'Sign in failed. Please check your details and try again.');
    }
  };

  const handleRegistration = async (e: React.FormEvent) => {
    e.preventDefault();

    // Prepare farmer data
    const farmerData = {
      name: registrationForm.name,
      phone: registrationForm.phone,
      email: registrationForm.email || undefined,
      location: {
        state: registrationForm.state,
        district: registrationForm.district,
        village: registrationForm.village,
        coordinates: registrationForm.latitude && registrationForm.longitude ? {
          latitude: parseFloat(registrationForm.latitude),
          longitude: parseFloat(registrationForm.longitude)
        } : undefined
      },
      farmDetails: {
        totalArea: parseFloat(registrationForm.totalArea),
        croppingPattern: registrationForm.croppingPattern.split(',').map(crop => crop.trim()),
        soilType: registrationForm.soilType,
        irrigationType: registrationForm.irrigationType
      },
      profile: {
        age: registrationForm.age ? parseInt(registrationForm.age) : undefined,
        gender: registrationForm.gender || undefined,
        education: registrationForm.education || undefined,
        experience: registrationForm.experience ? parseInt(registrationForm.experience) : undefined
      },
      bankDetails: registrationForm.accountNumber ? {
        accountNumber: registrationForm.accountNumber,
        ifscCode: registrationForm.ifscCode,
        bankName: registrationForm.bankName
      } : undefined,
      documents: registrationForm.aadharNumber ? {
        aadharNumber: registrationForm.aadharNumber
      } : undefined
    };

    const result = await registerFarmer(farmerData);

    if (result.success) {
      alert(`Registration successful! Your Farmer ID is: ${result.farmer?.farmerId}`);
      navigate('/farmer-dashboard');
    } else {
      alert(`Registration failed: ${result.error}`);
    }
  };

  const handleGetLocation = () => {
    if (navigator.geolocation) {
      navigator.geolocation.getCurrentPosition(
        (position) => {
          setRegistrationForm(prev => ({
            ...prev,
            latitude: position.coords.latitude.toString(),
            longitude: position.coords.longitude.toString()
          }));
        },
        (error) => {
          console.error("Error getting location:", error);
          alert("Could not get your location. Please enter manually.");
        }
      );
    } else {
      alert("Geolocation is not supported by this browser.");
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-emerald-50 via-white to-teal-50 flex items-center justify-center p-4">
      <Card className="w-full max-w-4xl shadow-xl">
        <CardHeader className="text-center">
          <div className="flex items-center justify-center space-x-2 mb-4">
            <div className="bg-gradient-to-r from-green-600 via-emerald-600 to-amber-500 p-2 rounded-xl">
              <Wheat className="h-8 w-8 text-white" />
            </div>
            <div>
              <CardTitle className="text-3xl font-display bg-gradient-to-r from-green-600 via-emerald-600 to-amber-500 bg-clip-text text-transparent">
                Farmer Portal
              </CardTitle>
              <CardDescription className="text-lg">
                Carbon MRV System for Indian Farmers
              </CardDescription>
            </div>
          </div>
        </CardHeader>
        
        <CardContent>
          <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
            <TabsList className="grid w-full grid-cols-2">
              <TabsTrigger value="signin">Sign In</TabsTrigger>
              <TabsTrigger value="register">Register</TabsTrigger>
            </TabsList>
            
            {/* Sign In Tab */}
            <TabsContent value="signin" className="space-y-6">
              <div className="text-center space-y-2">
                <h3 className="text-xl font-semibold">Welcome Back!</h3>
                <p className="text-gray-600">Sign in with your Farmer ID or phone number</p>
              </div>
              
              <form onSubmit={handleSignIn} className="space-y-4">
                <div className="space-y-2">
                  <Label htmlFor="farmerId">Farmer ID</Label>
                  <div className="relative">
                    <User className="absolute left-3 top-3 h-4 w-4 text-gray-400" />
                    <Input
                      id="farmerId"
                      placeholder="Enter your Farmer ID (e.g., FMR000001)"
                      value={signInForm.farmerId}
                      onChange={(e) => setSignInForm(prev => ({ ...prev, farmerId: e.target.value.toUpperCase() }))}
                      className="pl-10"
                      required
                    />
                  </div>
                </div>
                
                <div className="space-y-2">
                  <Label htmlFor="phone">Phone Number</Label>
                  <div className="relative">
                    <Phone className="absolute left-3 top-3 h-4 w-4 text-gray-400" />
                    <Input
                      id="phone"
                      type="tel"
                      placeholder="Enter your registered phone number"
                      value={signInForm.phone}
                      onChange={(e) => setSignInForm(prev => ({ ...prev, phone: e.target.value }))}
                      className="pl-10"
                      pattern="[6-9][0-9]{9}"
                    />
                  </div>
                </div>
                
                <Button 
                  type="submit" 
                  className="w-full bg-gradient-to-r from-green-600 via-emerald-600 to-amber-500 hover:from-green-700 hover:via-emerald-700 hover:to-amber-600 font-semibold"
                  disabled={isLoading}
                >
                  {isLoading ? "Signing In..." : "Sign In"}
                </Button>
              </form>
            </TabsContent>
            
            {/* Registration Tab */}
            <TabsContent value="register" className="space-y-6">
              <div className="text-center space-y-2">
                <h3 className="text-xl font-semibold">Join Carbon MRV Program</h3>
                <p className="text-gray-600">Register to start earning carbon credits</p>
              </div>
              
              <form onSubmit={handleRegistration} className="space-y-6">
                {/* Personal Information */}
                <div className="space-y-4">
                  <h4 className="font-semibold text-lg flex items-center gap-2">
                    <User className="h-5 w-5" />
                    Personal Information
                  </h4>
                  
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div className="space-y-2">
                      <Label htmlFor="name">Full Name *</Label>
                      <Input
                        id="name"
                        placeholder="Enter your full name"
                        value={registrationForm.name}
                        onChange={(e) => setRegistrationForm(prev => ({ ...prev, name: e.target.value }))}
                        required
                      />
                    </div>
                    
                    <div className="space-y-2">
                      <Label htmlFor="phone">Phone Number *</Label>
                      <Input
                        id="phone"
                        type="tel"
                        placeholder="10-digit mobile number"
                        value={registrationForm.phone}
                        onChange={(e) => setRegistrationForm(prev => ({ ...prev, phone: e.target.value }))}
                        pattern="[6-9][0-9]{9}"
                        required
                      />
                    </div>
                    
                    <div className="space-y-2">
                      <Label htmlFor="email">Email (Optional)</Label>
                      <Input
                        id="email"
                        type="email"
                        placeholder="your.email@example.com"
                        value={registrationForm.email}
                        onChange={(e) => setRegistrationForm(prev => ({ ...prev, email: e.target.value }))}
                      />
                    </div>
                    
                    <div className="space-y-2">
                      <Label htmlFor="age">Age</Label>
                      <Input
                        id="age"
                        type="number"
                        placeholder="Your age"
                        value={registrationForm.age}
                        onChange={(e) => setRegistrationForm(prev => ({ ...prev, age: e.target.value }))}
                        min="18"
                        max="100"
                      />
                    </div>
                    
                    <div className="space-y-2">
                      <Label htmlFor="gender">Gender</Label>
                      <Select value={registrationForm.gender} onValueChange={(value) => setRegistrationForm(prev => ({ ...prev, gender: value }))}>
                        <SelectTrigger>
                          <SelectValue placeholder="Select gender" />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="male">Male</SelectItem>
                          <SelectItem value="female">Female</SelectItem>
                          <SelectItem value="other">Other</SelectItem>
                        </SelectContent>
                      </Select>
                    </div>
                    
                    <div className="space-y-2">
                      <Label htmlFor="experience">Farming Experience (Years)</Label>
                      <Input
                        id="experience"
                        type="number"
                        placeholder="Years of farming experience"
                        value={registrationForm.experience}
                        onChange={(e) => setRegistrationForm(prev => ({ ...prev, experience: e.target.value }))}
                        min="0"
                      />
                    </div>
                  </div>
                </div>
                
                {/* Location Information */}
                <div className="space-y-4">
                  <h4 className="font-semibold text-lg flex items-center gap-2">
                    <MapPin className="h-5 w-5" />
                    Location Information
                  </h4>
                  
                  <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                    <div className="space-y-2">
                      <Label htmlFor="state">State *</Label>
                      <Select value={registrationForm.state} onValueChange={(value) => setRegistrationForm(prev => ({ ...prev, state: value }))}>
                        <SelectTrigger>
                          <SelectValue placeholder="Select state" />
                        </SelectTrigger>
                        <SelectContent>
                          {indianStates.map(state => (
                            <SelectItem key={state} value={state}>{state}</SelectItem>
                          ))}
                        </SelectContent>
                      </Select>
                    </div>
                    
                    <div className="space-y-2">
                      <Label htmlFor="district">District *</Label>
                      <Input
                        id="district"
                        placeholder="Enter district"
                        value={registrationForm.district}
                        onChange={(e) => setRegistrationForm(prev => ({ ...prev, district: e.target.value }))}
                        required
                      />
                    </div>
                    
                    <div className="space-y-2">
                      <Label htmlFor="village">Village *</Label>
                      <Input
                        id="village"
                        placeholder="Enter village/town"
                        value={registrationForm.village}
                        onChange={(e) => setRegistrationForm(prev => ({ ...prev, village: e.target.value }))}
                        required
                      />
                    </div>
                  </div>
                  
                  <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                    <div className="space-y-2">
                      <Label htmlFor="latitude">Latitude</Label>
                      <Input
                        id="latitude"
                        placeholder="Latitude"
                        value={registrationForm.latitude}
                        onChange={(e) => setRegistrationForm(prev => ({ ...prev, latitude: e.target.value }))}
                      />
                    </div>
                    
                    <div className="space-y-2">
                      <Label htmlFor="longitude">Longitude</Label>
                      <Input
                        id="longitude"
                        placeholder="Longitude"
                        value={registrationForm.longitude}
                        onChange={(e) => setRegistrationForm(prev => ({ ...prev, longitude: e.target.value }))}
                      />
                    </div>
                    
                    <div className="space-y-2">
                      <Label>&nbsp;</Label>
                      <Button type="button" variant="outline" onClick={handleGetLocation} className="w-full">
                        Get My Location
                      </Button>
                    </div>
                  </div>
                </div>
                
                {/* Farm Information */}
                <div className="space-y-4">
                  <h4 className="font-semibold text-lg flex items-center gap-2">
                    <Wheat className="h-5 w-5" />
                    Farm Information
                  </h4>
                  
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div className="space-y-2">
                      <Label htmlFor="totalArea">Total Farm Area (Hectares) *</Label>
                      <Input
                        id="totalArea"
                        type="number"
                        step="0.1"
                        placeholder="e.g., 2.5"
                        value={registrationForm.totalArea}
                        onChange={(e) => setRegistrationForm(prev => ({ ...prev, totalArea: e.target.value }))}
                        required
                      />
                    </div>
                    
                    <div className="space-y-2">
                      <Label htmlFor="croppingPattern">Crops Grown</Label>
                      <Input
                        id="croppingPattern"
                        placeholder="e.g., Rice, Wheat, Sugarcane"
                        value={registrationForm.croppingPattern}
                        onChange={(e) => setRegistrationForm(prev => ({ ...prev, croppingPattern: e.target.value }))}
                      />
                    </div>
                    
                    <div className="space-y-2">
                      <Label htmlFor="soilType">Soil Type</Label>
                      <Select value={registrationForm.soilType} onValueChange={(value) => setRegistrationForm(prev => ({ ...prev, soilType: value }))}>
                        <SelectTrigger>
                          <SelectValue placeholder="Select soil type" />
                        </SelectTrigger>
                        <SelectContent>
                          {soilTypes.map(soil => (
                            <SelectItem key={soil} value={soil}>{soil}</SelectItem>
                          ))}
                        </SelectContent>
                      </Select>
                    </div>
                    
                    <div className="space-y-2">
                      <Label htmlFor="irrigationType">Irrigation Type</Label>
                      <Select value={registrationForm.irrigationType} onValueChange={(value) => setRegistrationForm(prev => ({ ...prev, irrigationType: value }))}>
                        <SelectTrigger>
                          <SelectValue placeholder="Select irrigation type" />
                        </SelectTrigger>
                        <SelectContent>
                          {irrigationTypes.map(irrigation => (
                            <SelectItem key={irrigation} value={irrigation}>{irrigation}</SelectItem>
                          ))}
                        </SelectContent>
                      </Select>
                    </div>
                  </div>
                </div>
                
                {/* Documents & Banking */}
                <div className="space-y-4">
                  <h4 className="font-semibold text-lg flex items-center gap-2">
                    <FileText className="h-5 w-5" />
                    Documents & Banking
                  </h4>
                  
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div className="space-y-2">
                      <Label htmlFor="aadharNumber">Aadhar Number</Label>
                      <Input
                        id="aadharNumber"
                        placeholder="12-digit Aadhar number"
                        value={registrationForm.aadharNumber}
                        onChange={(e) => setRegistrationForm(prev => ({ ...prev, aadharNumber: e.target.value }))}
                        pattern="[0-9]{12}"
                      />
                    </div>
                    
                    <div className="space-y-2">
                      <Label htmlFor="bankName">Bank Name</Label>
                      <Input
                        id="bankName"
                        placeholder="Name of your bank"
                        value={registrationForm.bankName}
                        onChange={(e) => setRegistrationForm(prev => ({ ...prev, bankName: e.target.value }))}
                      />
                    </div>
                    
                    <div className="space-y-2">
                      <Label htmlFor="accountNumber">Account Number</Label>
                      <Input
                        id="accountNumber"
                        placeholder="Bank account number"
                        value={registrationForm.accountNumber}
                        onChange={(e) => setRegistrationForm(prev => ({ ...prev, accountNumber: e.target.value }))}
                      />
                    </div>
                    
                    <div className="space-y-2">
                      <Label htmlFor="ifscCode">IFSC Code</Label>
                      <Input
                        id="ifscCode"
                        placeholder="IFSC Code"
                        value={registrationForm.ifscCode}
                        onChange={(e) => setRegistrationForm(prev => ({ ...prev, ifscCode: e.target.value.toUpperCase() }))}
                      />
                    </div>
                  </div>
                </div>
                
                <Button 
                  type="submit" 
                  className="w-full bg-gradient-to-r from-green-600 via-emerald-600 to-amber-500 hover:from-green-700 hover:via-emerald-700 hover:to-amber-600 font-semibold"
                  disabled={isLoading}
                >
                  {isLoading ? "Registering..." : "Register as Farmer"}
                </Button>
              </form>
            </TabsContent>
          </Tabs>
        </CardContent>
      </Card>
    </div>
  );
}
