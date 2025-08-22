import React, { useState, useEffect } from "react";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Progress } from "@/components/ui/progress";
import { Badge } from "@/components/ui/badge";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Alert, AlertDescription } from "@/components/ui/alert";
import {
  TreePine,
  Wheat,
  DollarSign,
  MapPin,
  Calendar,
  TrendingUp,
  Award,
  Camera,
  Plus,
  Eye,
  BarChart3,
  Leaf,
  CircleDollarSign,
  Clock,
  CheckCircle,
  AlertCircle,
  RefreshCw,
} from "lucide-react";
import { useNavigate } from "react-router-dom";

interface DashboardData {
  farmer: {
    name: string;
    farmerId: string;
    phone: string;
    verificationStatus: string;
    registrationDate: string;
    totalCarbonCredits: number;
    totalEarnings: number;
  };
  statistics: {
    totalFields: number;
    totalArea: number;
    totalCredits: number;
    totalEarnings: number;
    pendingMeasurements: number;
    verifiedCredits: number;
    pendingPayments: number;
  };
  recentMeasurements: Array<any>;
  carbonCredits: Array<any>;
  recentPayments: Array<any>;
  monthlyEarnings: Array<any>;
}

export default function FarmerDashboard() {
  const navigate = useNavigate();
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [dashboardData, setDashboardData] = useState<DashboardData | null>(
    null,
  );
  const [refreshing, setRefreshing] = useState(false);

  useEffect(() => {
    fetchDashboardData();
  }, []);

  const fetchDashboardData = async () => {
    try {
      const token = localStorage.getItem("token");
      if (!token) {
        navigate("/farmer/auth");
        return;
      }

      const response = await fetch("/api/farmers/dashboard", {
        headers: {
          Authorization: `Bearer ${token}`,
          "Content-Type": "application/json",
        },
      });

      const data = await response.json();

      if (data.success) {
        setDashboardData(data.data);
      } else {
        if (response.status === 401) {
          localStorage.removeItem("token");
          localStorage.removeItem("farmer");
          navigate("/farmer/auth");
        } else {
          setError(data.message || "Failed to fetch dashboard data");
        }
      }
    } catch (error) {
      setError("Failed to load dashboard. Please check your connection.");
    } finally {
      setLoading(false);
    }
  };

  const handleRefresh = async () => {
    setRefreshing(true);
    await fetchDashboardData();
    setRefreshing(false);
  };

  const handleLogout = () => {
    localStorage.removeItem("token");
    localStorage.removeItem("farmer");
    navigate("/");
  };

  const getVerificationStatusBadge = (status: string) => {
    switch (status) {
      case "verified":
        return (
          <Badge className="bg-green-100 text-green-700 hover:bg-green-200">
            Verified ✓
          </Badge>
        );
      case "pending":
        return (
          <Badge className="bg-yellow-100 text-yellow-700 hover:bg-yellow-200">
            Pending Review
          </Badge>
        );
      case "rejected":
        return (
          <Badge className="bg-red-100 text-red-700 hover:bg-red-200">
            Rejected
          </Badge>
        );
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
      <div className="min-h-screen bg-gradient-to-br from-emerald-50 via-white to-teal-50 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-16 w-16 border-b-2 border-emerald-600 mx-auto mb-4"></div>
          <p className="text-gray-600 font-medium">Loading your dashboard...</p>
        </div>
      </div>
    );
  }

  if (error || !dashboardData) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-emerald-50 via-white to-teal-50 flex items-center justify-center p-4">
        <Alert className="max-w-md">
          <AlertCircle className="h-4 w-4" />
          <AlertDescription>
            {error || "Failed to load dashboard data"}
          </AlertDescription>
        </Alert>
      </div>
    );
  }

  const {
    farmer,
    statistics,
    recentMeasurements,
    carbonCredits,
    recentPayments,
  } = dashboardData;

  return (
    <div className="min-h-screen bg-gradient-to-br from-emerald-50 via-white to-teal-50">
      {/* Header */}
      <div className="bg-white/80 backdrop-blur-md border-b border-emerald-100 sticky top-0 z-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between py-4">
            <div className="flex items-center space-x-4">
              <div className="bg-gradient-to-r from-green-600 via-emerald-600 to-amber-500 p-2 rounded-xl shadow-lg">
                <TreePine className="h-6 w-6 text-white" />
              </div>
              <div>
                <h1 className="text-xl font-display font-black text-gray-900">
                  Farmer Dashboard
                </h1>
                <p className="text-emerald-600 font-semibold text-sm">
                  Welcome, {farmer.name}
                </p>
              </div>
            </div>

            <div className="flex items-center space-x-4">
              <Button
                variant="outline"
                size="sm"
                onClick={handleRefresh}
                disabled={refreshing}
              >
                <RefreshCw
                  className={`h-4 w-4 mr-2 ${refreshing ? "animate-spin" : ""}`}
                />
                Refresh
              </Button>
              <Button variant="outline" size="sm" onClick={handleLogout}>
                Logout
              </Button>
            </div>
          </div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto p-4 sm:p-6 lg:p-8">
        {/* Farmer Info Card */}
        <Card className="mb-8 shadow-xl border-0">
          <CardHeader className="bg-gradient-to-r from-emerald-50 to-green-50">
            <div className="flex items-center justify-between">
              <div>
                <CardTitle className="text-2xl font-bold text-gray-900">
                  {farmer.name}
                </CardTitle>
                <CardDescription className="text-lg">
                  Farmer ID: {farmer.farmerId} | Phone: {farmer.phone}
                </CardDescription>
              </div>
              <div className="text-right">
                {getVerificationStatusBadge(farmer.verificationStatus)}
                <p className="text-sm text-gray-600 mt-2">
                  Member since {formatDate(farmer.registrationDate)}
                </p>
              </div>
            </div>
          </CardHeader>
        </Card>

        {/* Statistics Cards */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
          <Card className="shadow-lg hover:shadow-xl transition-all duration-300">
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">
                Total Fields
              </CardTitle>
              <MapPin className="h-5 w-5 text-emerald-600" />
            </CardHeader>
            <CardContent>
              <div className="text-3xl font-bold text-emerald-600">
                {statistics.totalFields}
              </div>
              <p className="text-sm text-gray-600">
                {statistics.totalArea.toFixed(1)} acres total
              </p>
            </CardContent>
          </Card>

          <Card className="shadow-lg hover:shadow-xl transition-all duration-300">
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">
                Carbon Credits
              </CardTitle>
              <Leaf className="h-5 w-5 text-green-600" />
            </CardHeader>
            <CardContent>
              <div className="text-3xl font-bold text-green-600">
                {statistics.totalCredits.toFixed(2)}
              </div>
              <p className="text-sm text-gray-600">
                {statistics.verifiedCredits} verified
              </p>
            </CardContent>
          </Card>

          <Card className="shadow-lg hover:shadow-xl transition-all duration-300">
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">
                Total Earnings
              </CardTitle>
              <CircleDollarSign className="h-5 w-5 text-amber-600" />
            </CardHeader>
            <CardContent>
              <div className="text-3xl font-bold text-amber-600">
                {formatCurrency(statistics.totalEarnings)}
              </div>
              <p className="text-sm text-gray-600">
                {statistics.pendingPayments} pending payments
              </p>
            </CardContent>
          </Card>

          <Card className="shadow-lg hover:shadow-xl transition-all duration-300">
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">
                Pending Tasks
              </CardTitle>
              <Clock className="h-5 w-5 text-orange-600" />
            </CardHeader>
            <CardContent>
              <div className="text-3xl font-bold text-orange-600">
                {statistics.pendingMeasurements}
              </div>
              <p className="text-sm text-gray-600">measurements to verify</p>
            </CardContent>
          </Card>
        </div>

        {/* Action Buttons */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-8">
          <Button
            className="bg-gradient-to-r from-green-600 to-emerald-600 hover:from-green-700 hover:to-emerald-700 h-16 text-lg font-semibold"
            onClick={() => navigate("/farmer/fields/add")}
          >
            <Plus className="h-6 w-6 mr-2" />
            Add New Field
          </Button>

          <Button
            className="bg-gradient-to-r from-blue-600 to-cyan-600 hover:from-blue-700 hover:to-cyan-700 h-16 text-lg font-semibold"
            onClick={() => navigate("/farmer/measurements/add")}
          >
            <Camera className="h-6 w-6 mr-2" />
            Record Data
          </Button>

          <Button
            variant="outline"
            className="border-emerald-600 text-emerald-600 hover:bg-emerald-50 h-16 text-lg font-semibold"
            onClick={() => navigate("/farmer/reports")}
          >
            <BarChart3 className="h-6 w-6 mr-2" />
            View Reports
          </Button>
        </div>

        {/* Main Content Tabs */}
        <Tabs defaultValue="overview" className="space-y-6">
          <TabsList className="grid w-full grid-cols-4">
            <TabsTrigger value="overview">Overview</TabsTrigger>
            <TabsTrigger value="measurements">Measurements</TabsTrigger>
            <TabsTrigger value="credits">Carbon Credits</TabsTrigger>
            <TabsTrigger value="payments">Payments</TabsTrigger>
          </TabsList>

          <TabsContent value="overview" className="space-y-6">
            <div className="grid lg:grid-cols-2 gap-6">
              {/* Recent Activity */}
              <Card className="shadow-lg">
                <CardHeader>
                  <CardTitle className="flex items-center">
                    <TrendingUp className="h-5 w-5 mr-2 text-emerald-600" />
                    Recent Activity
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="space-y-4">
                    {recentMeasurements
                      .slice(0, 3)
                      .map((measurement, index) => (
                        <div
                          key={index}
                          className="flex items-center justify-between p-3 bg-gray-50 rounded-lg"
                        >
                          <div>
                            <p className="font-medium text-gray-900">
                              {measurement.measurementType} measurement
                            </p>
                            <p className="text-sm text-gray-600">
                              {measurement.fieldId?.fieldName ||
                                "Unknown Field"}
                            </p>
                          </div>
                          <div className="text-right">
                            <Badge
                              variant={
                                measurement.verificationStatus === "verified"
                                  ? "default"
                                  : "secondary"
                              }
                            >
                              {measurement.verificationStatus}
                            </Badge>
                            <p className="text-xs text-gray-500 mt-1">
                              {formatDate(measurement.measurementDate)}
                            </p>
                          </div>
                        </div>
                      ))}

                    {recentMeasurements.length === 0 && (
                      <div className="text-center py-8 text-gray-500">
                        <Camera className="h-12 w-12 mx-auto mb-4 text-gray-300" />
                        <p>No measurements recorded yet</p>
                        <Button
                          variant="outline"
                          className="mt-4"
                          onClick={() => navigate("/farmer/measurements/add")}
                        >
                          Record First Measurement
                        </Button>
                      </div>
                    )}
                  </div>
                </CardContent>
              </Card>

              {/* Monthly Progress */}
              <Card className="shadow-lg">
                <CardHeader>
                  <CardTitle className="flex items-center">
                    <Award className="h-5 w-5 mr-2 text-amber-600" />
                    This Month's Progress
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="space-y-4">
                    <div>
                      <div className="flex justify-between text-sm mb-2">
                        <span>Data Collection</span>
                        <span>75%</span>
                      </div>
                      <Progress value={75} className="h-2" />
                    </div>

                    <div>
                      <div className="flex justify-between text-sm mb-2">
                        <span>Credit Verification</span>
                        <span>60%</span>
                      </div>
                      <Progress value={60} className="h-2" />
                    </div>

                    <div>
                      <div className="flex justify-between text-sm mb-2">
                        <span>Earnings Target</span>
                        <span>45%</span>
                      </div>
                      <Progress value={45} className="h-2" />
                    </div>
                  </div>
                </CardContent>
              </Card>
            </div>
          </TabsContent>

          <TabsContent value="measurements" className="space-y-6">
            <Card className="shadow-lg">
              <CardHeader>
                <CardTitle>Recent Measurements</CardTitle>
                <CardDescription>
                  Track your field data collection and verification status
                </CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  {recentMeasurements.map((measurement, index) => (
                    <div
                      key={index}
                      className="flex items-center justify-between p-4 border rounded-lg"
                    >
                      <div className="flex items-center space-x-4">
                        <div className="bg-emerald-100 p-2 rounded-lg">
                          {measurement.measurementType === "biomass" && (
                            <TreePine className="h-5 w-5 text-emerald-600" />
                          )}
                          {measurement.measurementType === "soil-carbon" && (
                            <Leaf className="h-5 w-5 text-green-600" />
                          )}
                          {measurement.measurementType ===
                            "methane-emission" && (
                            <Wheat className="h-5 w-5 text-amber-600" />
                          )}
                        </div>
                        <div>
                          <p className="font-medium">
                            {measurement.measurementType}
                          </p>
                          <p className="text-sm text-gray-600">
                            {measurement.fieldId?.fieldName} •{" "}
                            {formatDate(measurement.measurementDate)}
                          </p>
                        </div>
                      </div>

                      <div className="flex items-center space-x-4">
                        <div className="text-right">
                          <Badge
                            variant={
                              measurement.verificationStatus === "verified"
                                ? "default"
                                : "secondary"
                            }
                          >
                            {measurement.verificationStatus}
                          </Badge>
                          <p className="text-xs text-gray-500 mt-1">
                            Quality:{" "}
                            {measurement.dataQuality?.overallScore || 0}%
                          </p>
                        </div>
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

          <TabsContent value="credits" className="space-y-6">
            <Card className="shadow-lg">
              <CardHeader>
                <CardTitle>Carbon Credits</CardTitle>
                <CardDescription>
                  Your verified carbon sequestration and emission reduction
                  credits
                </CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  {carbonCredits.map((credit, index) => (
                    <div
                      key={index}
                      className="flex items-center justify-between p-4 border rounded-lg"
                    >
                      <div className="flex items-center space-x-4">
                        <div className="bg-green-100 p-2 rounded-lg">
                          <Award className="h-5 w-5 text-green-600" />
                        </div>
                        <div>
                          <p className="font-medium">
                            {credit.creditDetails?.creditsIssued || 0} Credits
                          </p>
                          <p className="text-sm text-gray-600">
                            {credit.fieldId?.fieldName} • Vintage{" "}
                            {credit.creditDetails?.vintage}
                          </p>
                        </div>
                      </div>

                      <div className="text-right">
                        <p className="font-semibold text-green-600">
                          {formatCurrency(credit.market?.totalValue || 0)}
                        </p>
                        <Badge
                          variant={
                            credit.verification?.status === "verified"
                              ? "default"
                              : "secondary"
                          }
                        >
                          {credit.verification?.status}
                        </Badge>
                      </div>
                    </div>
                  ))}

                  {carbonCredits.length === 0 && (
                    <div className="text-center py-8 text-gray-500">
                      <Award className="h-12 w-12 mx-auto mb-4 text-gray-300" />
                      <p>No carbon credits generated yet</p>
                      <p className="text-sm">
                        Complete field measurements to generate credits
                      </p>
                    </div>
                  )}
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="payments" className="space-y-6">
            <Card className="shadow-lg">
              <CardHeader>
                <CardTitle>Payment History</CardTitle>
                <CardDescription>
                  Track your earnings from carbon credit sales
                </CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  {recentPayments.map((payment, index) => (
                    <div
                      key={index}
                      className="flex items-center justify-between p-4 border rounded-lg"
                    >
                      <div className="flex items-center space-x-4">
                        <div className="bg-amber-100 p-2 rounded-lg">
                          <DollarSign className="h-5 w-5 text-amber-600" />
                        </div>
                        <div>
                          <p className="font-medium">
                            {payment.paymentDetails?.description}
                          </p>
                          <p className="text-sm text-gray-600">
                            {formatDate(payment.dates?.initiatedDate)}
                          </p>
                        </div>
                      </div>

                      <div className="text-right">
                        <p className="font-semibold text-amber-600">
                          {formatCurrency(payment.paymentDetails?.amount || 0)}
                        </p>
                        <Badge
                          variant={
                            payment.transaction?.status === "completed"
                              ? "default"
                              : "secondary"
                          }
                        >
                          {payment.transaction?.status}
                        </Badge>
                      </div>
                    </div>
                  ))}

                  {recentPayments.length === 0 && (
                    <div className="text-center py-8 text-gray-500">
                      <DollarSign className="h-12 w-12 mx-auto mb-4 text-gray-300" />
                      <p>No payments yet</p>
                      <p className="text-sm">
                        Generate and sell carbon credits to receive payments
                      </p>
                    </div>
                  )}
                </div>
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>
      </div>
    </div>
  );
}
