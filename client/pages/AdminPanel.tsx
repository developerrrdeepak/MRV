import React, { useState, useEffect } from "react";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Textarea } from "@/components/ui/textarea";
import {
  Users,
  Shield,
  Award,
  DollarSign,
  BarChart3,
  CheckCircle,
  XCircle,
  Clock,
  Search,
  Filter,
  Download,
  Eye,
  UserCheck,
  TreePine,
  Wheat,
  MapPin,
  Calendar,
  TrendingUp,
  AlertTriangle,
  RefreshCw,
} from "lucide-react";

interface AdminStats {
  totalFarmers: number;
  verifiedFarmers: number;
  pendingVerification: number;
  totalFields: number;
  totalMeasurements: number;
  pendingMeasurements: number;
  totalCredits: number;
  verifiedCredits: number;
  totalPayments: number;
  pendingPayments: number;
}

export default function AdminPanel() {
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [stats, setStats] = useState<AdminStats | null>(null);
  const [farmers, setFarmers] = useState([]);
  const [measurements, setMeasurements] = useState([]);
  const [credits, setCredits] = useState([]);
  const [payments, setPayments] = useState([]);
  const [activeTab, setActiveTab] = useState("overview");

  // Filters
  const [searchTerm, setSearchTerm] = useState("");
  const [statusFilter, setStatusFilter] = useState("all");
  const [stateFilter, setStateFilter] = useState("all");

  useEffect(() => {
    fetchData();
  }, []);

  const fetchData = async () => {
    try {
      const token = localStorage.getItem("token");
      if (!token) {
        setError("Please login to access admin panel");
        return;
      }

      // In a real implementation, you would have separate admin authentication
      // For demo purposes, we'll simulate admin data

      setStats({
        totalFarmers: 156,
        verifiedFarmers: 134,
        pendingVerification: 22,
        totalFields: 287,
        totalMeasurements: 1543,
        pendingMeasurements: 89,
        totalCredits: 2847.5,
        verifiedCredits: 2156.3,
        totalPayments: 98,
        pendingPayments: 12,
      });

      // Simulate farmers data
      setFarmers([
        {
          _id: "1",
          name: "Ramesh Kumar",
          farmerId: "MRV240001",
          phone: "+91-9876543210",
          verificationStatus: "pending",
          address: { state: "Punjab", district: "Ludhiana" },
          registrationDate: "2024-01-15",
          totalCarbonCredits: 45.2,
          totalEarnings: 36160,
        },
        {
          _id: "2",
          name: "Priya Sharma",
          farmerId: "MRV240002",
          phone: "+91-9876543211",
          verificationStatus: "verified",
          address: { state: "Maharashtra", district: "Pune" },
          registrationDate: "2024-01-10",
          totalCarbonCredits: 78.5,
          totalEarnings: 62800,
        },
      ]);

      // Simulate measurements data
      setMeasurements([
        {
          _id: "1",
          measurementId: "MES24010001",
          farmerId: { name: "Ramesh Kumar", farmerId: "MRV240001" },
          fieldId: { fieldName: "North Field", cropType: "agroforestry" },
          measurementType: "biomass",
          measurementDate: "2024-01-20",
          verificationStatus: "pending",
          dataQuality: { overallScore: 85 },
        },
      ]);
    } catch (error) {
      setError("Failed to load admin data");
    } finally {
      setLoading(false);
    }
  };

  const handleVerifyFarmer = async (
    farmerId: string,
    status: "verified" | "rejected",
    notes?: string,
  ) => {
    try {
      // Simulate API call
      console.log("Updating farmer verification:", { farmerId, status, notes });
      // Update local state
      setFarmers((prev) =>
        prev.map((farmer) =>
          farmer._id === farmerId
            ? { ...farmer, verificationStatus: status }
            : farmer,
        ),
      );
    } catch (error) {
      setError("Failed to update verification status");
    }
  };

  const handleVerifyMeasurement = async (
    measurementId: string,
    status: "verified" | "rejected",
    notes?: string,
  ) => {
    try {
      // Simulate API call
      console.log("Updating measurement verification:", {
        measurementId,
        status,
        notes,
      });
      // Update local state
      setMeasurements((prev) =>
        prev.map((measurement) =>
          measurement._id === measurementId
            ? { ...measurement, verificationStatus: status }
            : measurement,
        ),
      );
    } catch (error) {
      setError("Failed to update measurement verification");
    }
  };

  const getStatusBadge = (status: string) => {
    switch (status) {
      case "verified":
        return <Badge className="bg-green-100 text-green-700">Verified</Badge>;
      case "pending":
        return <Badge className="bg-yellow-100 text-yellow-700">Pending</Badge>;
      case "rejected":
        return <Badge className="bg-red-100 text-red-700">Rejected</Badge>;
      default:
        return <Badge variant="outline">Unknown</Badge>;
    }
  };

  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat("en-IN", {
      style: "currency",
      currency: "INR",
    }).format(amount);
  };

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString("en-IN");
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-slate-50 via-white to-blue-50 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-16 w-16 border-b-2 border-blue-600 mx-auto mb-4"></div>
          <p className="text-gray-600 font-medium">Loading admin panel...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-white to-blue-50">
      {/* Header */}
      <div className="bg-white/80 backdrop-blur-md border-b border-blue-100 sticky top-0 z-50">
        <div className="max-w-7xl mx-auto px-4 py-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-3">
              <div className="bg-gradient-to-r from-blue-600 via-indigo-600 to-purple-600 p-2 rounded-xl shadow-lg">
                <Shield className="h-6 w-6 text-white" />
              </div>
              <div>
                <h1 className="text-xl font-display font-black text-gray-900">
                  MRV Admin Panel
                </h1>
                <p className="text-blue-600 font-semibold text-sm">
                  System Oversight & Management
                </p>
              </div>
            </div>

            <div className="flex items-center space-x-4">
              <Button variant="outline" size="sm" onClick={fetchData}>
                <RefreshCw className="h-4 w-4 mr-2" />
                Refresh
              </Button>
              <Button variant="outline" size="sm">
                <Download className="h-4 w-4 mr-2" />
                Export Data
              </Button>
            </div>
          </div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto p-4 sm:p-6 lg:p-8">
        {error && (
          <Alert className="mb-6 border-red-200 bg-red-50">
            <AlertTriangle className="h-4 w-4" />
            <AlertDescription className="text-red-700 font-medium">
              {error}
            </AlertDescription>
          </Alert>
        )}

        {/* Overview Statistics */}
        {stats && (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
            <Card className="shadow-lg hover:shadow-xl transition-all duration-300">
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">
                  Total Farmers
                </CardTitle>
                <Users className="h-5 w-5 text-blue-600" />
              </CardHeader>
              <CardContent>
                <div className="text-3xl font-bold text-blue-600">
                  {stats.totalFarmers}
                </div>
                <p className="text-sm text-gray-600">
                  {stats.verifiedFarmers} verified • {stats.pendingVerification}{" "}
                  pending
                </p>
              </CardContent>
            </Card>

            <Card className="shadow-lg hover:shadow-xl transition-all duration-300">
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">
                  Measurements
                </CardTitle>
                <BarChart3 className="h-5 w-5 text-green-600" />
              </CardHeader>
              <CardContent>
                <div className="text-3xl font-bold text-green-600">
                  {stats.totalMeasurements}
                </div>
                <p className="text-sm text-gray-600">
                  {stats.pendingMeasurements} pending verification
                </p>
              </CardContent>
            </Card>

            <Card className="shadow-lg hover:shadow-xl transition-all duration-300">
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">
                  Carbon Credits
                </CardTitle>
                <Award className="h-5 w-5 text-emerald-600" />
              </CardHeader>
              <CardContent>
                <div className="text-3xl font-bold text-emerald-600">
                  {stats.totalCredits}
                </div>
                <p className="text-sm text-gray-600">
                  {stats.verifiedCredits} verified credits
                </p>
              </CardContent>
            </Card>

            <Card className="shadow-lg hover:shadow-xl transition-all duration-300">
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">Payments</CardTitle>
                <DollarSign className="h-5 w-5 text-amber-600" />
              </CardHeader>
              <CardContent>
                <div className="text-3xl font-bold text-amber-600">
                  {stats.totalPayments}
                </div>
                <p className="text-sm text-gray-600">
                  {stats.pendingPayments} pending approval
                </p>
              </CardContent>
            </Card>
          </div>
        )}

        {/* Main Content Tabs */}
        <Tabs
          value={activeTab}
          onValueChange={setActiveTab}
          className="space-y-6"
        >
          <TabsList className="grid w-full grid-cols-4">
            <TabsTrigger value="overview">Overview</TabsTrigger>
            <TabsTrigger value="farmers">Farmers</TabsTrigger>
            <TabsTrigger value="measurements">Measurements</TabsTrigger>
            <TabsTrigger value="payments">Payments</TabsTrigger>
          </TabsList>

          <TabsContent value="overview" className="space-y-6">
            <div className="grid lg:grid-cols-2 gap-6">
              <Card className="shadow-lg">
                <CardHeader>
                  <CardTitle>Recent Activity</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="space-y-4">
                    <div className="flex items-center justify-between p-3 bg-blue-50 rounded-lg">
                      <div className="flex items-center space-x-3">
                        <UserCheck className="h-5 w-5 text-blue-600" />
                        <div>
                          <p className="font-medium">New farmer registration</p>
                          <p className="text-sm text-gray-600">
                            Suresh Patel - Maharashtra
                          </p>
                        </div>
                      </div>
                      <span className="text-sm text-gray-500">2 hours ago</span>
                    </div>

                    <div className="flex items-center justify-between p-3 bg-green-50 rounded-lg">
                      <div className="flex items-center space-x-3">
                        <TreePine className="h-5 w-5 text-green-600" />
                        <div>
                          <p className="font-medium">Measurement submitted</p>
                          <p className="text-sm text-gray-600">
                            Agroforestry biomass data
                          </p>
                        </div>
                      </div>
                      <span className="text-sm text-gray-500">4 hours ago</span>
                    </div>

                    <div className="flex items-center justify-between p-3 bg-amber-50 rounded-lg">
                      <div className="flex items-center space-x-3">
                        <Award className="h-5 w-5 text-amber-600" />
                        <div>
                          <p className="font-medium">Carbon credits verified</p>
                          <p className="text-sm text-gray-600">
                            45.2 credits approved
                          </p>
                        </div>
                      </div>
                      <span className="text-sm text-gray-500">6 hours ago</span>
                    </div>
                  </div>
                </CardContent>
              </Card>

              <Card className="shadow-lg">
                <CardHeader>
                  <CardTitle>Verification Queue</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="space-y-4">
                    <div className="flex items-center justify-between">
                      <span className="text-sm font-medium">
                        Farmer Verifications
                      </span>
                      <Badge className="bg-yellow-100 text-yellow-700">
                        {stats?.pendingVerification} pending
                      </Badge>
                    </div>

                    <div className="flex items-center justify-between">
                      <span className="text-sm font-medium">
                        Measurement Reviews
                      </span>
                      <Badge className="bg-blue-100 text-blue-700">
                        {stats?.pendingMeasurements} pending
                      </Badge>
                    </div>

                    <div className="flex items-center justify-between">
                      <span className="text-sm font-medium">
                        Payment Approvals
                      </span>
                      <Badge className="bg-green-100 text-green-700">
                        {stats?.pendingPayments} pending
                      </Badge>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </div>
          </TabsContent>

          <TabsContent value="farmers" className="space-y-6">
            {/* Filters */}
            <Card className="shadow-lg">
              <CardHeader>
                <CardTitle>Farmer Management</CardTitle>
                <CardDescription>
                  Manage farmer registrations and verifications
                </CardDescription>
              </CardHeader>
              <CardContent>
                <div className="flex flex-wrap gap-4 mb-6">
                  <div className="flex-1 min-w-[200px]">
                    <Label htmlFor="search">Search Farmers</Label>
                    <div className="relative">
                      <Search className="absolute left-3 top-3 h-4 w-4 text-gray-400" />
                      <Input
                        id="search"
                        placeholder="Search by name, ID, or phone..."
                        className="pl-10"
                        value={searchTerm}
                        onChange={(e) => setSearchTerm(e.target.value)}
                      />
                    </div>
                  </div>

                  <div>
                    <Label htmlFor="status">Status</Label>
                    <Select
                      value={statusFilter}
                      onValueChange={setStatusFilter}
                    >
                      <SelectTrigger className="w-40">
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="all">All Status</SelectItem>
                        <SelectItem value="pending">Pending</SelectItem>
                        <SelectItem value="verified">Verified</SelectItem>
                        <SelectItem value="rejected">Rejected</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>

                  <div>
                    <Label htmlFor="state">State</Label>
                    <Select value={stateFilter} onValueChange={setStateFilter}>
                      <SelectTrigger className="w-40">
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="all">All States</SelectItem>
                        <SelectItem value="Punjab">Punjab</SelectItem>
                        <SelectItem value="Maharashtra">Maharashtra</SelectItem>
                        <SelectItem value="Karnataka">Karnataka</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                </div>

                {/* Farmers List */}
                <div className="space-y-4">
                  {farmers.map((farmer) => (
                    <div
                      key={farmer._id}
                      className="flex items-center justify-between p-4 border rounded-lg hover:bg-gray-50"
                    >
                      <div className="flex items-center space-x-4">
                        <div className="bg-blue-100 p-2 rounded-lg">
                          <Users className="h-5 w-5 text-blue-600" />
                        </div>
                        <div>
                          <p className="font-medium">{farmer.name}</p>
                          <p className="text-sm text-gray-600">
                            ID: {farmer.farmerId} • {farmer.phone}
                          </p>
                          <p className="text-sm text-gray-600">
                            {farmer.address.district}, {farmer.address.state}
                          </p>
                        </div>
                      </div>

                      <div className="flex items-center space-x-4">
                        <div className="text-right">
                          <p className="text-sm font-medium">
                            {farmer.totalCarbonCredits} credits
                          </p>
                          <p className="text-sm text-gray-600">
                            {formatCurrency(farmer.totalEarnings)}
                          </p>
                        </div>

                        {getStatusBadge(farmer.verificationStatus)}

                        {farmer.verificationStatus === "pending" && (
                          <div className="flex space-x-2">
                            <Button
                              size="sm"
                              onClick={() =>
                                handleVerifyFarmer(farmer._id, "verified")
                              }
                              className="bg-green-600 hover:bg-green-700"
                            >
                              <CheckCircle className="h-4 w-4" />
                            </Button>
                            <Button
                              size="sm"
                              variant="outline"
                              onClick={() =>
                                handleVerifyFarmer(farmer._id, "rejected")
                              }
                              className="border-red-600 text-red-600 hover:bg-red-50"
                            >
                              <XCircle className="h-4 w-4" />
                            </Button>
                          </div>
                        )}

                        <Button variant="outline" size="sm">
                          <Eye className="h-4 w-4" />
                        </Button>
                      </div>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="measurements" className="space-y-6">
            <Card className="shadow-lg">
              <CardHeader>
                <CardTitle>Measurement Verification</CardTitle>
                <CardDescription>
                  Review and verify farmer measurements
                </CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  {measurements.map((measurement) => (
                    <div
                      key={measurement._id}
                      className="flex items-center justify-between p-4 border rounded-lg"
                    >
                      <div className="flex items-center space-x-4">
                        <div className="bg-green-100 p-2 rounded-lg">
                          {measurement.fieldId.cropType === "agroforestry" ? (
                            <TreePine className="h-5 w-5 text-green-600" />
                          ) : (
                            <Wheat className="h-5 w-5 text-amber-600" />
                          )}
                        </div>
                        <div>
                          <p className="font-medium">
                            {measurement.measurementType}
                          </p>
                          <p className="text-sm text-gray-600">
                            {measurement.farmerId.name} •{" "}
                            {measurement.fieldId.fieldName}
                          </p>
                          <p className="text-sm text-gray-600">
                            {formatDate(measurement.measurementDate)} • Quality:{" "}
                            {measurement.dataQuality.overallScore}%
                          </p>
                        </div>
                      </div>

                      <div className="flex items-center space-x-4">
                        {getStatusBadge(measurement.verificationStatus)}

                        {measurement.verificationStatus === "pending" && (
                          <div className="flex space-x-2">
                            <Button
                              size="sm"
                              onClick={() =>
                                handleVerifyMeasurement(
                                  measurement._id,
                                  "verified",
                                )
                              }
                              className="bg-green-600 hover:bg-green-700"
                            >
                              <CheckCircle className="h-4 w-4" />
                            </Button>
                            <Button
                              size="sm"
                              variant="outline"
                              onClick={() =>
                                handleVerifyMeasurement(
                                  measurement._id,
                                  "rejected",
                                )
                              }
                              className="border-red-600 text-red-600 hover:bg-red-50"
                            >
                              <XCircle className="h-4 w-4" />
                            </Button>
                          </div>
                        )}

                        <Button variant="outline" size="sm">
                          <Eye className="h-4 w-4" />
                        </Button>
                      </div>
                    </div>
                  ))}

                  {measurements.length === 0 && (
                    <div className="text-center py-8 text-gray-500">
                      <BarChart3 className="h-12 w-12 mx-auto mb-4 text-gray-300" />
                      <p>No measurements pending verification</p>
                    </div>
                  )}
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="payments" className="space-y-6">
            <Card className="shadow-lg">
              <CardHeader>
                <CardTitle>Payment Management</CardTitle>
                <CardDescription>
                  Review and approve farmer payments
                </CardDescription>
              </CardHeader>
              <CardContent>
                <div className="text-center py-8 text-gray-500">
                  <DollarSign className="h-12 w-12 mx-auto mb-4 text-gray-300" />
                  <p>Payment management interface</p>
                  <p className="text-sm">
                    Review pending payments and transaction history
                  </p>
                </div>
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>
      </div>
    </div>
  );
}
