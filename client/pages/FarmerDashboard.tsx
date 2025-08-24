import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Progress } from "@/components/ui/progress";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { useFarmerAuth } from "@/hooks/use-farmer-auth";
import DataCollection from "./DataCollection";
import {
  User,
  MapPin,
  Wheat,
  TreePine,
  TrendingUp,
  IndianRupee,
  Phone,
  Mail,
  Calendar,
  BarChart3,
  Award,
  LogOut,
  Camera,
  Upload,
  Activity,
  Target,
  CheckCircle,
  Bell,
  CreditCard,
  FileText,
  HelpCircle,
  Settings,
  Download,
} from "lucide-react";

interface Farmer {
  _id: string;
  name: string;
  phone: string;
  email?: string;
  farmerId: string;
  location: {
    state: string;
    district: string;
    village: string;
    coordinates?: {
      latitude: number;
      longitude: number;
    };
  };
  farmDetails: {
    totalArea: number;
    croppingPattern: string[];
    soilType: string;
    irrigationType: string;
  };
  profile: {
    age?: number;
    gender?: string;
    education?: string;
    experience?: number;
  };
  carbonProjects: any[];
  isActive: boolean;
  registrationDate: string;
  lastUpdated: string;
}

export default function FarmerDashboard() {
  const navigate = useNavigate();
  const {
    farmer,
    signOutFarmer,
    isLoading: authLoading,
    isAuthenticated,
  } = useFarmerAuth();
  const [projects, setProjects] = useState<any[]>([]);
  const [measurements, setMeasurements] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!isAuthenticated) {
      navigate("/farmer-auth");
      return;
    }

    if (farmer) {
      // Fetch farmer's projects and measurements
      fetchFarmerData(farmer._id);
    }
  }, [farmer, isAuthenticated, navigate]);

  const fetchFarmerData = async (farmerId: string) => {
    try {
      // This would typically fetch farmer's carbon projects
      // For now, we'll use mock data since the relationships are complex
      setProjects([
        {
          _id: "1",
          name: "Punjab Agroforestry Project",
          status: "implementation",
          carbonCredits: 150,
          nextMeasurement: "2024-02-15",
        },
      ]);

      setMeasurements([
        {
          _id: "1",
          date: "2024-01-15",
          type: "Tree Count",
          value: 50,
          carbonStored: 12.5,
        },
      ]);
    } catch (error) {
      console.error("Error fetching farmer data:", error);
    } finally {
      setLoading(false);
    }
  };

  const handleLogout = () => {
    signOutFarmer();
    navigate("/");
  };

  const calculateTotalCarbon = () => {
    return measurements.reduce(
      (total, measurement) => total + (measurement.carbonStored || 0),
      0,
    );
  };

  const calculateEstimatedEarnings = () => {
    const totalCarbon = calculateTotalCarbon();
    const carbonPrice = 15; // ₹15 per tCO2e
    return totalCarbon * carbonPrice;
  };

  if (authLoading || loading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-emerald-50 via-white to-teal-50 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-emerald-600 mx-auto mb-4"></div>
          <p className="text-gray-600">Loading farmer dashboard...</p>
        </div>
      </div>
    );
  }

  if (!farmer) {
    return null;
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-emerald-50 via-white to-teal-50">
      {/* Header */}
      <header className="bg-white/80 backdrop-blur-md border-b border-emerald-100">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-4">
              <Avatar className="h-12 w-12">
                <AvatarFallback className="bg-gradient-to-r from-green-600 to-emerald-600 text-white">
                  {farmer.name
                    .split(" ")
                    .map((n) => n[0])
                    .join("")
                    .substring(0, 2)}
                </AvatarFallback>
              </Avatar>
              <div>
                <h1 className="text-xl font-bold text-gray-900">
                  Welcome, {farmer.name}
                </h1>
                <p className="text-sm text-gray-600">
                  Farmer ID: {farmer.farmerId}
                </p>
              </div>
            </div>

            <Button
              variant="outline"
              onClick={handleLogout}
              className="flex items-center gap-2"
            >
              <LogOut className="h-4 w-4" />
              Logout
            </Button>
          </div>
        </div>
      </header>

      {/* Dashboard Content */}
      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Stats Overview */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
          <Card>
            <CardContent className="p-6">
              <div className="flex items-center space-x-2">
                <TreePine className="h-8 w-8 text-green-600" />
                <div>
                  <p className="text-sm font-medium text-gray-600">
                    Carbon Stored
                  </p>
                  <p className="text-2xl font-bold text-gray-900">
                    {calculateTotalCarbon().toFixed(1)} tCO₂e
                  </p>
                </div>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardContent className="p-6">
              <div className="flex items-center space-x-2">
                <IndianRupee className="h-8 w-8 text-amber-600" />
                <div>
                  <p className="text-sm font-medium text-gray-600">
                    Est. Earnings
                  </p>
                  <p className="text-2xl font-bold text-gray-900">
                    ₹{calculateEstimatedEarnings().toLocaleString()}
                  </p>
                </div>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardContent className="p-6">
              <div className="flex items-center space-x-2">
                <Wheat className="h-8 w-8 text-yellow-600" />
                <div>
                  <p className="text-sm font-medium text-gray-600">Farm Area</p>
                  <p className="text-2xl font-bold text-gray-900">
                    {farmer.farmDetails.totalArea} ha
                  </p>
                </div>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardContent className="p-6">
              <div className="flex items-center space-x-2">
                <Award className="h-8 w-8 text-blue-600" />
                <div>
                  <p className="text-sm font-medium text-gray-600">
                    Active Projects
                  </p>
                  <p className="text-2xl font-bold text-gray-900">
                    {projects.length}
                  </p>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Main Dashboard Tabs */}
        <Tabs defaultValue="overview" className="space-y-6">
          <TabsList className="grid w-full grid-cols-7">
            <TabsTrigger value="overview">Overview</TabsTrigger>
            <TabsTrigger value="projects">Projects</TabsTrigger>
            <TabsTrigger value="measurements">Data Collection</TabsTrigger>
            <TabsTrigger value="earnings">Earnings</TabsTrigger>
            <TabsTrigger value="documents">Documents</TabsTrigger>
            <TabsTrigger value="profile">Profile</TabsTrigger>
            <TabsTrigger value="help">Help</TabsTrigger>
          </TabsList>

          {/* Overview Tab */}
          <TabsContent value="overview" className="space-y-6">
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              {/* Recent Activity */}
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <Activity className="h-5 w-5" />
                    Recent Activity
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="space-y-4">
                    <div className="flex items-center space-x-3">
                      <div className="w-2 h-2 bg-green-500 rounded-full"></div>
                      <div className="flex-1">
                        <p className="text-sm font-medium">
                          Tree measurement completed
                        </p>
                        <p className="text-xs text-gray-500">2 days ago</p>
                      </div>
                    </div>
                    <div className="flex items-center space-x-3">
                      <div className="w-2 h-2 bg-blue-500 rounded-full"></div>
                      <div className="flex-1">
                        <p className="text-sm font-medium">
                          Joined agroforestry project
                        </p>
                        <p className="text-xs text-gray-500">1 week ago</p>
                      </div>
                    </div>
                    <div className="flex items-center space-x-3">
                      <div className="w-2 h-2 bg-purple-500 rounded-full"></div>
                      <div className="flex-1">
                        <p className="text-sm font-medium">
                          Profile registered
                        </p>
                        <p className="text-xs text-gray-500">2 weeks ago</p>
                      </div>
                    </div>
                  </div>
                </CardContent>
              </Card>

              {/* Next Actions */}
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <Target className="h-5 w-5" />
                    Action Items
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="space-y-4">
                    <div className="flex items-center justify-between p-3 bg-amber-50 rounded-lg">
                      <div>
                        <p className="font-medium text-amber-900">
                          Monthly Tree Count Due
                        </p>
                        <p className="text-sm text-amber-700">
                          Due: Feb 15, 2024
                        </p>
                      </div>
                      <Button
                        size="sm"
                        variant="outline"
                        className="border-amber-300"
                      >
                        Start
                      </Button>
                    </div>

                    <div className="flex items-center justify-between p-3 bg-blue-50 rounded-lg">
                      <div>
                        <p className="font-medium text-blue-900">
                          Upload Farm Photos
                        </p>
                        <p className="text-sm text-blue-700">
                          Show your progress
                        </p>
                      </div>
                      <Button
                        size="sm"
                        variant="outline"
                        className="border-blue-300"
                      >
                        <Camera className="h-4 w-4 mr-2" />
                        Upload
                      </Button>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </div>
          </TabsContent>

          {/* Projects Tab */}
          <TabsContent value="projects" className="space-y-6">
            <Card>
              <CardHeader>
                <CardTitle>My Carbon Projects</CardTitle>
                <CardDescription>
                  Track your participation in carbon offset projects
                </CardDescription>
              </CardHeader>
              <CardContent>
                {projects.length > 0 ? (
                  <div className="space-y-4">
                    {projects.map((project) => (
                      <div key={project._id} className="border rounded-lg p-4">
                        <div className="flex items-center justify-between">
                          <div>
                            <h4 className="font-semibold">{project.name}</h4>
                            <p className="text-sm text-gray-600">
                              Status:
                              <Badge variant="secondary" className="ml-2">
                                {project.status}
                              </Badge>
                            </p>
                          </div>
                          <div className="text-right">
                            <p className="text-sm text-gray-600">
                              Carbon Credits
                            </p>
                            <p className="text-lg font-bold text-green-600">
                              {project.carbonCredits} tCO₂e
                            </p>
                          </div>
                        </div>
                        <div className="mt-4">
                          <div className="flex justify-between text-sm text-gray-600 mb-2">
                            <span>Project Progress</span>
                            <span>75%</span>
                          </div>
                          <Progress value={75} className="h-2" />
                        </div>
                      </div>
                    ))}
                  </div>
                ) : (
                  <div className="text-center py-8">
                    <TreePine className="h-12 w-12 text-gray-400 mx-auto mb-4" />
                    <p className="text-gray-600">
                      No projects yet. Contact your coordinator to join a carbon
                      project.
                    </p>
                  </div>
                )}
              </CardContent>
            </Card>
          </TabsContent>

          {/* Measurements Tab */}
          <TabsContent value="measurements" className="space-y-6">
            <DataCollection farmerId={farmer._id} projects={projects} />
          </TabsContent>

          {/* Earnings Tab */}
          <TabsContent value="earnings" className="space-y-6">
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              {/* Carbon Credits Overview */}
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <IndianRupee className="h-5 w-5" />
                    Carbon Credit Earnings
                  </CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="grid grid-cols-2 gap-4">
                    <div className="text-center p-4 bg-green-50 rounded-lg">
                      <p className="text-sm text-green-600 font-medium">
                        Total Credits
                      </p>
                      <p className="text-2xl font-bold text-green-700">
                        {calculateTotalCarbon().toFixed(1)}
                      </p>
                      <p className="text-xs text-green-600">tCO₂e</p>
                    </div>
                    <div className="text-center p-4 bg-amber-50 rounded-lg">
                      <p className="text-sm text-amber-600 font-medium">
                        Verified Credits
                      </p>
                      <p className="text-2xl font-bold text-amber-700">
                        {(calculateTotalCarbon() * 0.8).toFixed(1)}
                      </p>
                      <p className="text-xs text-amber-600">tCO₂e</p>
                    </div>
                  </div>

                  <div className="border-t pt-4">
                    <div className="flex justify-between items-center mb-2">
                      <span className="text-sm text-gray-600">
                        Carbon Price
                      </span>
                      <span className="font-medium">₹15 per tCO₂e</span>
                    </div>
                    <div className="flex justify-between items-center mb-2">
                      <span className="text-sm text-gray-600">
                        Total Earnings
                      </span>
                      <span className="font-bold text-green-600">
                        ₹{calculateEstimatedEarnings().toLocaleString()}
                      </span>
                    </div>
                    <div className="flex justify-between items-center">
                      <span className="text-sm text-gray-600">
                        Pending Verification
                      </span>
                      <span className="text-amber-600">
                        ₹{(calculateTotalCarbon() * 0.2 * 15).toLocaleString()}
                      </span>
                    </div>
                  </div>
                </CardContent>
              </Card>

              {/* Payment History */}
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <CreditCard className="h-5 w-5" />
                    Payment History
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="space-y-3">
                    <div className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
                      <div>
                        <p className="font-medium">Carbon Credit Payment</p>
                        <p className="text-sm text-gray-600">
                          Project: Agroforestry Phase 1
                        </p>
                        <p className="text-xs text-gray-500">Jan 15, 2024</p>
                      </div>
                      <div className="text-right">
                        <p className="font-bold text-green-600">₹2,250</p>
                        <Badge variant="secondary" className="text-xs">
                          Paid
                        </Badge>
                      </div>
                    </div>

                    <div className="flex items-center justify-between p-3 bg-amber-50 rounded-lg">
                      <div>
                        <p className="font-medium">Verification Bonus</p>
                        <p className="text-sm text-gray-600">
                          Q4 2023 Measurements
                        </p>
                        <p className="text-xs text-gray-500">Dec 30, 2023</p>
                      </div>
                      <div className="text-right">
                        <p className="font-bold text-green-600">₹500</p>
                        <Badge variant="secondary" className="text-xs">
                          Paid
                        </Badge>
                      </div>
                    </div>

                    <div className="flex items-center justify-between p-3 bg-blue-50 rounded-lg">
                      <div>
                        <p className="font-medium">Upcoming Payment</p>
                        <p className="text-sm text-gray-600">
                          Q1 2024 Carbon Credits
                        </p>
                        <p className="text-xs text-gray-500">
                          Expected: Mar 31, 2024
                        </p>
                      </div>
                      <div className="text-right">
                        <p className="font-bold text-blue-600">₹1,875</p>
                        <Badge variant="outline" className="text-xs">
                          Pending
                        </Badge>
                      </div>
                    </div>
                  </div>

                  <Button variant="outline" className="w-full mt-4">
                    <Download className="h-4 w-4 mr-2" />
                    Download Payment Report
                  </Button>
                </CardContent>
              </Card>
            </div>
          </TabsContent>

          {/* Documents Tab */}
          <TabsContent value="documents" className="space-y-6">
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <FileText className="h-5 w-5" />
                  Documents & Certificates
                </CardTitle>
                <CardDescription>
                  Manage your documents, certificates, and verification reports
                </CardDescription>
              </CardHeader>
              <CardContent>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  {/* Personal Documents */}
                  <div className="space-y-4">
                    <h4 className="font-semibold">Personal Documents</h4>

                    <div className="space-y-3">
                      <div className="flex items-center justify-between p-3 border rounded-lg">
                        <div className="flex items-center gap-3">
                          <FileText className="h-5 w-5 text-blue-600" />
                          <div>
                            <p className="font-medium">Aadhar Card</p>
                            <p className="text-sm text-gray-600">
                              Identity Verification
                            </p>
                          </div>
                        </div>
                        <Badge variant="secondary">Verified</Badge>
                      </div>

                      <div className="flex items-center justify-between p-3 border rounded-lg">
                        <div className="flex items-center gap-3">
                          <FileText className="h-5 w-5 text-green-600" />
                          <div>
                            <p className="font-medium">Land Records</p>
                            <p className="text-sm text-gray-600">
                              Farm Ownership Proof
                            </p>
                          </div>
                        </div>
                        <Badge variant="secondary">Verified</Badge>
                      </div>

                      <div className="flex items-center justify-between p-3 border rounded-lg">
                        <div className="flex items-center gap-3">
                          <FileText className="h-5 w-5 text-purple-600" />
                          <div>
                            <p className="font-medium">Bank Details</p>
                            <p className="text-sm text-gray-600">
                              Payment Information
                            </p>
                          </div>
                        </div>
                        <Badge variant="secondary">Verified</Badge>
                      </div>
                    </div>

                    <Button variant="outline" className="w-full">
                      <Upload className="h-4 w-4 mr-2" />
                      Upload New Document
                    </Button>
                  </div>

                  {/* Carbon Project Documents */}
                  <div className="space-y-4">
                    <h4 className="font-semibold">Carbon Project Documents</h4>

                    <div className="space-y-3">
                      <div className="flex items-center justify-between p-3 border rounded-lg">
                        <div className="flex items-center gap-3">
                          <Award className="h-5 w-5 text-green-600" />
                          <div>
                            <p className="font-medium">Carbon Certificate</p>
                            <p className="text-sm text-gray-600">
                              Q4 2023 - 12.5 tCO₂e
                            </p>
                          </div>
                        </div>
                        <Button size="sm" variant="outline">
                          <Download className="h-4 w-4" />
                        </Button>
                      </div>

                      <div className="flex items-center justify-between p-3 border rounded-lg">
                        <div className="flex items-center gap-3">
                          <FileText className="h-5 w-5 text-blue-600" />
                          <div>
                            <p className="font-medium">Verification Report</p>
                            <p className="text-sm text-gray-600">
                              Third-party verification
                            </p>
                          </div>
                        </div>
                        <Button size="sm" variant="outline">
                          <Download className="h-4 w-4" />
                        </Button>
                      </div>

                      <div className="flex items-center justify-between p-3 border rounded-lg">
                        <div className="flex items-center gap-3">
                          <FileText className="h-5 w-5 text-amber-600" />
                          <div>
                            <p className="font-medium">Training Certificate</p>
                            <p className="text-sm text-gray-600">
                              MRV Training Completed
                            </p>
                          </div>
                        </div>
                        <Button size="sm" variant="outline">
                          <Download className="h-4 w-4" />
                        </Button>
                      </div>
                    </div>

                    <Button className="w-full bg-gradient-to-r from-green-600 to-emerald-600 hover:from-green-700 hover:to-emerald-700">
                      <Award className="h-4 w-4 mr-2" />
                      Request New Certificate
                    </Button>
                  </div>
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          {/* Help Tab */}
          <TabsContent value="help" className="space-y-6">
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              {/* FAQ Section */}
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <HelpCircle className="h-5 w-5" />
                    Frequently Asked Questions
                  </CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="space-y-4">
                    <div className="border-b pb-3">
                      <h4 className="font-medium mb-1">
                        How do I earn carbon credits?
                      </h4>
                      <p className="text-sm text-gray-600">
                        You earn carbon credits by implementing sustainable
                        farming practices like tree planting, organic farming,
                        and soil carbon management. Regular measurements and
                        verification are required.
                      </p>
                    </div>

                    <div className="border-b pb-3">
                      <h4 className="font-medium mb-1">
                        When will I receive payments?
                      </h4>
                      <p className="text-sm text-gray-600">
                        Payments are made quarterly after verification of your
                        carbon sequestration activities. The payment amount
                        depends on verified carbon credits.
                      </p>
                    </div>

                    <div className="border-b pb-3">
                      <h4 className="font-medium mb-1">
                        How do I record measurements?
                      </h4>
                      <p className="text-sm text-gray-600">
                        Use the Data Collection tab to record field
                        measurements. Take photos, enter GPS coordinates, and
                        submit your data regularly for carbon credit
                        calculation.
                      </p>
                    </div>

                    <div>
                      <h4 className="font-medium mb-1">
                        What documents do I need?
                      </h4>
                      <p className="text-sm text-gray-600">
                        You need Aadhar card, land ownership documents, and bank
                        details for payments. All documents should be uploaded
                        in the Documents section.
                      </p>
                    </div>
                  </div>
                </CardContent>
              </Card>

              {/* Contact Support */}
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <Phone className="h-5 w-5" />
                    Contact Support
                  </CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="space-y-4">
                    <div className="flex items-center gap-3 p-3 bg-blue-50 rounded-lg">
                      <Phone className="h-5 w-5 text-blue-600" />
                      <div>
                        <p className="font-medium">Phone Support</p>
                        <p className="text-sm text-gray-600">+91 98765 43210</p>
                        <p className="text-xs text-gray-500">
                          Mon-Fri, 9 AM - 6 PM
                        </p>
                      </div>
                    </div>

                    <div className="flex items-center gap-3 p-3 bg-green-50 rounded-lg">
                      <Mail className="h-5 w-5 text-green-600" />
                      <div>
                        <p className="font-medium">Email Support</p>
                        <p className="text-sm text-gray-600">
                          support@carbonmrv.com
                        </p>
                        <p className="text-xs text-gray-500">
                          Response within 24 hours
                        </p>
                      </div>
                    </div>

                    <div className="flex items-center gap-3 p-3 bg-purple-50 rounded-lg">
                      <HelpCircle className="h-5 w-5 text-purple-600" />
                      <div>
                        <p className="font-medium">Field Coordinator</p>
                        <p className="text-sm text-gray-600">Rajesh Kumar</p>
                        <p className="text-xs text-gray-500">
                          Local area support
                        </p>
                      </div>
                    </div>
                  </div>

                  <div className="space-y-2">
                    <Button className="w-full bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-700 hover:to-indigo-700">
                      <Phone className="h-4 w-4 mr-2" />
                      Request Callback
                    </Button>

                    <Button variant="outline" className="w-full">
                      <Mail className="h-4 w-4 mr-2" />
                      Send Email
                    </Button>
                  </div>

                  <div className="pt-4 border-t">
                    <h4 className="font-medium mb-2">Video Tutorials</h4>
                    <div className="space-y-2">
                      <Button
                        variant="outline"
                        size="sm"
                        className="w-full justify-start"
                      >
                        📹 How to Record Measurements
                      </Button>
                      <Button
                        variant="outline"
                        size="sm"
                        className="w-full justify-start"
                      >
                        📹 Understanding Carbon Credits
                      </Button>
                      <Button
                        variant="outline"
                        size="sm"
                        className="w-full justify-start"
                      >
                        📹 Using the Mobile App
                      </Button>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </div>
          </TabsContent>

          {/* Profile Tab */}
          <TabsContent value="profile" className="space-y-6">
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              {/* Personal Information */}
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <User className="h-5 w-5" />
                    Personal Information
                  </CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="flex items-center gap-3">
                    <Phone className="h-4 w-4 text-gray-500" />
                    <span>{farmer.phone}</span>
                  </div>
                  {farmer.email && (
                    <div className="flex items-center gap-3">
                      <Mail className="h-4 w-4 text-gray-500" />
                      <span>{farmer.email}</span>
                    </div>
                  )}
                  {farmer.profile.age && (
                    <div className="flex items-center gap-3">
                      <Calendar className="h-4 w-4 text-gray-500" />
                      <span>{farmer.profile.age} years old</span>
                    </div>
                  )}
                  {farmer.profile.experience && (
                    <div className="flex items-center gap-3">
                      <Wheat className="h-4 w-4 text-gray-500" />
                      <span>
                        {farmer.profile.experience} years farming experience
                      </span>
                    </div>
                  )}
                </CardContent>
              </Card>

              {/* Location & Farm Details */}
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <MapPin className="h-5 w-5" />
                    Farm Information
                  </CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div>
                    <p className="font-medium">Location</p>
                    <p className="text-sm text-gray-600">
                      {farmer.location.village}, {farmer.location.district},{" "}
                      {farmer.location.state}
                    </p>
                  </div>
                  <div>
                    <p className="font-medium">Farm Size</p>
                    <p className="text-sm text-gray-600">
                      {farmer.farmDetails.totalArea} hectares
                    </p>
                  </div>
                  <div>
                    <p className="font-medium">Crops</p>
                    <p className="text-sm text-gray-600">
                      {farmer.farmDetails.croppingPattern.join(", ")}
                    </p>
                  </div>
                  <div>
                    <p className="font-medium">Soil Type</p>
                    <p className="text-sm text-gray-600">
                      {farmer.farmDetails.soilType}
                    </p>
                  </div>
                  <div>
                    <p className="font-medium">Irrigation</p>
                    <p className="text-sm text-gray-600">
                      {farmer.farmDetails.irrigationType}
                    </p>
                  </div>
                </CardContent>
              </Card>
            </div>
          </TabsContent>
        </Tabs>
      </main>
    </div>
  );
}
