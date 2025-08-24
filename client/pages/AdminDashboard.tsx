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
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { Input } from "@/components/ui/input";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  Users,
  TreePine,
  BarChart3,
  Shield,
  LogOut,
  Search,
  Filter,
  Download,
  Plus,
  Edit,
  Trash2,
  CheckCircle,
  AlertTriangle,
  TrendingUp,
  IndianRupee,
  MapPin,
  Calendar,
  Activity,
  Settings,
  FileText,
  Award,
  Target,
  Database,
} from "lucide-react";

interface Admin {
  email: string;
  name: string;
  role: string;
  loginTime: string;
}

export default function AdminDashboard() {
  const navigate = useNavigate();
  const [admin, setAdmin] = useState<Admin | null>(null);
  const [loading, setLoading] = useState(true);
  const [farmers, setFarmers] = useState<any[]>([]);
  const [projects, setProjects] = useState<any[]>([]);
  const [measurements, setMeasurements] = useState<any[]>([]);
  const [stats, setStats] = useState({
    totalFarmers: 0,
    activeFarmers: 0,
    totalProjects: 0,
    totalCarbon: 0,
    totalEarnings: 0,
    recentRegistrations: 0,
  });

  useEffect(() => {
    // Check admin authentication
    const adminData = localStorage.getItem("admin");
    if (!adminData) {
      navigate("/admin-auth");
      return;
    }

    try {
      const parsedAdmin = JSON.parse(adminData);
      setAdmin(parsedAdmin);

      // Fetch admin dashboard data
      fetchDashboardData();
    } catch (error) {
      console.error("Error parsing admin data:", error);
      navigate("/admin-auth");
    }
  }, [navigate]);

  const fetchDashboardData = async () => {
    try {
      // Fetch farmers
      const farmersResponse = await fetch("/api/farmers");
      if (farmersResponse.ok) {
        const farmersData = await farmersResponse.json();
        setFarmers(farmersData.farmers || []);
      }

      // Fetch projects
      const projectsResponse = await fetch("/api/projects");
      if (projectsResponse.ok) {
        const projectsData = await projectsResponse.json();
        setProjects(projectsData.projects || []);
      }

      // Fetch stats
      const farmersStatsResponse = await fetch("/api/farmers/stats");
      if (farmersStatsResponse.ok) {
        const farmersStats = await farmersStatsResponse.json();

        const projectsStatsResponse = await fetch("/api/projects/stats");
        if (projectsStatsResponse.ok) {
          const projectsStats = await projectsStatsResponse.json();

          setStats({
            totalFarmers: farmersStats.totalFarmers || 0,
            activeFarmers: farmersStats.activeFarmers || 0,
            totalProjects: projectsStats.totalProjects || 0,
            totalCarbon: projectsStats.totalProjectedReductions || 0,
            totalEarnings: projectsStats.totalBudget || 0,
            recentRegistrations: farmersStats.recentRegistrations || 0,
          });
        }
      }

      // Mock measurements data
      setMeasurements([
        {
          _id: "1",
          farmer: { name: "Rajesh Kumar", farmerId: "FMR000001" },
          type: "Tree Count",
          date: "2024-01-15",
          carbonStored: 12.5,
          status: "verified",
        },
        {
          _id: "2",
          farmer: { name: "Priya Sharma", farmerId: "FMR000002" },
          type: "Soil Carbon",
          date: "2024-01-14",
          carbonStored: 8.3,
          status: "pending",
        },
      ]);
    } catch (error) {
      console.error("Error fetching dashboard data:", error);
    } finally {
      setLoading(false);
    }
  };

  const handleLogout = () => {
    localStorage.removeItem("admin");
    navigate("/");
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-slate-50 via-white to-blue-50 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto mb-4"></div>
          <p className="text-gray-600">Loading admin dashboard...</p>
        </div>
      </div>
    );
  }

  if (!admin) {
    return null;
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-white to-blue-50">
      {/* Admin Header */}
      <header className="bg-white/80 backdrop-blur-md border-b border-blue-100 shadow-sm">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-4">
              <div className="bg-gradient-to-r from-blue-600 via-indigo-600 to-purple-600 p-2 rounded-xl">
                <Shield className="h-8 w-8 text-white" />
              </div>
              <div>
                <h1 className="text-2xl font-bold text-gray-900">
                  Admin Dashboard
                </h1>
                <p className="text-sm text-gray-600">
                  Carbon MRV System Management
                </p>
              </div>
            </div>

            <div className="flex items-center space-x-4">
              <div className="text-right">
                <p className="text-sm font-medium text-gray-900">
                  {admin.name}
                </p>
                <p className="text-xs text-gray-600">{admin.email}</p>
              </div>
              <Avatar className="h-10 w-10">
                <AvatarFallback className="bg-gradient-to-r from-blue-600 to-indigo-600 text-white">
                  DA
                </AvatarFallback>
              </Avatar>
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
        </div>
      </header>

      {/* Dashboard Content */}
      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Stats Overview */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
          <Card>
            <CardContent className="p-6">
              <div className="flex items-center space-x-2">
                <Users className="h-8 w-8 text-blue-600" />
                <div>
                  <p className="text-sm font-medium text-gray-600">
                    Total Farmers
                  </p>
                  <p className="text-3xl font-bold text-gray-900">
                    {stats.totalFarmers}
                  </p>
                  <p className="text-xs text-green-600">
                    +{stats.recentRegistrations} this month
                  </p>
                </div>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardContent className="p-6">
              <div className="flex items-center space-x-2">
                <TreePine className="h-8 w-8 text-green-600" />
                <div>
                  <p className="text-sm font-medium text-gray-600">
                    Active Projects
                  </p>
                  <p className="text-3xl font-bold text-gray-900">
                    {stats.totalProjects}
                  </p>
                  <p className="text-xs text-blue-600">Carbon initiatives</p>
                </div>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardContent className="p-6">
              <div className="flex items-center space-x-2">
                <Target className="h-8 w-8 text-amber-600" />
                <div>
                  <p className="text-sm font-medium text-gray-600">
                    Total Carbon
                  </p>
                  <p className="text-3xl font-bold text-gray-900">
                    {stats.totalCarbon}
                  </p>
                  <p className="text-xs text-green-600">tCO₂e projected</p>
                </div>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardContent className="p-6">
              <div className="flex items-center space-x-2">
                <IndianRupee className="h-8 w-8 text-purple-600" />
                <div>
                  <p className="text-sm font-medium text-gray-600">
                    Total Budget
                  </p>
                  <p className="text-3xl font-bold text-gray-900">
                    ₹{(stats.totalEarnings / 100000).toFixed(1)}L
                  </p>
                  <p className="text-xs text-purple-600">Project investments</p>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Admin Dashboard Tabs */}
        <Tabs defaultValue="farmers" className="space-y-6">
          <TabsList className="grid w-full grid-cols-6">
            <TabsTrigger value="farmers">Farmers</TabsTrigger>
            <TabsTrigger value="projects">Projects</TabsTrigger>
            <TabsTrigger value="measurements">Measurements</TabsTrigger>
            <TabsTrigger value="analytics">Analytics</TabsTrigger>
            <TabsTrigger value="reports">Reports</TabsTrigger>
            <TabsTrigger value="settings">Settings</TabsTrigger>
          </TabsList>

          {/* Farmers Management */}
          <TabsContent value="farmers" className="space-y-6">
            <Card>
              <CardHeader>
                <div className="flex items-center justify-between">
                  <div>
                    <CardTitle className="flex items-center gap-2">
                      <Users className="h-5 w-5" />
                      Farmer Management
                    </CardTitle>
                    <CardDescription>
                      Manage farmer registrations and profiles
                    </CardDescription>
                  </div>
                  <div className="flex items-center gap-2">
                    <div className="flex items-center gap-2">
                      <Search className="h-4 w-4 text-gray-400" />
                      <Input placeholder="Search farmers..." className="w-64" />
                    </div>
                    <Button className="bg-gradient-to-r from-green-600 to-emerald-600">
                      <Plus className="h-4 w-4 mr-2" />
                      Add Farmer
                    </Button>
                  </div>
                </div>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  {farmers.length > 0 ? (
                    farmers.slice(0, 10).map((farmer) => (
                      <div
                        key={farmer._id}
                        className="flex items-center justify-between p-4 border rounded-lg hover:bg-gray-50"
                      >
                        <div className="flex items-center space-x-4">
                          <Avatar>
                            <AvatarFallback className="bg-green-100 text-green-600">
                              {farmer.name
                                ?.split(" ")
                                .map((n: string) => n[0])
                                .join("")
                                .substring(0, 2)}
                            </AvatarFallback>
                          </Avatar>
                          <div>
                            <p className="font-semibold">{farmer.name}</p>
                            <p className="text-sm text-gray-600">
                              ID: {farmer.farmerId}
                            </p>
                            <p className="text-sm text-gray-600">
                              {farmer.phone}
                            </p>
                          </div>
                        </div>

                        <div className="flex items-center space-x-4">
                          <div className="text-right">
                            <p className="text-sm font-medium">
                              {farmer.location?.state},{" "}
                              {farmer.location?.district}
                            </p>
                            <p className="text-sm text-gray-600">
                              {farmer.farmDetails?.totalArea} ha
                            </p>
                          </div>

                          <Badge
                            variant={farmer.isActive ? "default" : "secondary"}
                          >
                            {farmer.isActive ? "Active" : "Inactive"}
                          </Badge>

                          <div className="flex items-center gap-1">
                            <Button size="sm" variant="outline">
                              <Edit className="h-4 w-4" />
                            </Button>
                            <Button size="sm" variant="outline">
                              <FileText className="h-4 w-4" />
                            </Button>
                          </div>
                        </div>
                      </div>
                    ))
                  ) : (
                    <div className="text-center py-8">
                      <Users className="h-12 w-12 text-gray-400 mx-auto mb-4" />
                      <p className="text-gray-600">No farmers found</p>
                    </div>
                  )}
                </div>

                {farmers.length > 10 && (
                  <div className="flex justify-center mt-6">
                    <Button variant="outline">Load More Farmers</Button>
                  </div>
                )}
              </CardContent>
            </Card>
          </TabsContent>

          {/* Projects Management */}
          <TabsContent value="projects" className="space-y-6">
            <Card>
              <CardHeader>
                <div className="flex items-center justify-between">
                  <div>
                    <CardTitle className="flex items-center gap-2">
                      <TreePine className="h-5 w-5" />
                      Carbon Project Management
                    </CardTitle>
                    <CardDescription>
                      Manage carbon offset projects and participants
                    </CardDescription>
                  </div>
                  <Button className="bg-gradient-to-r from-blue-600 to-indigo-600">
                    <Plus className="h-4 w-4 mr-2" />
                    Create Project
                  </Button>
                </div>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  {projects.length > 0 ? (
                    projects.slice(0, 5).map((project) => (
                      <div
                        key={project._id}
                        className="border rounded-lg p-6 hover:bg-gray-50"
                      >
                        <div className="flex items-center justify-between mb-4">
                          <div>
                            <h4 className="text-lg font-semibold">
                              {project.name}
                            </h4>
                            <p className="text-sm text-gray-600">
                              ID: {project.projectId}
                            </p>
                          </div>
                          <div className="flex items-center gap-2">
                            <Badge variant="outline">
                              {project.projectType}
                            </Badge>
                            <Badge
                              variant={
                                project.status === "implementation"
                                  ? "default"
                                  : "secondary"
                              }
                            >
                              {project.status}
                            </Badge>
                          </div>
                        </div>

                        <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-4">
                          <div>
                            <p className="text-sm text-gray-600">Location</p>
                            <p className="font-medium">
                              {project.location?.state},{" "}
                              {project.location?.district}
                            </p>
                          </div>
                          <div>
                            <p className="text-sm text-gray-600">
                              Participants
                            </p>
                            <p className="font-medium">
                              {project.participants?.farmers?.length || 0}{" "}
                              farmers
                            </p>
                          </div>
                          <div>
                            <p className="text-sm text-gray-600">
                              Carbon Target
                            </p>
                            <p className="font-medium">
                              {project.carbonMetrics?.projectedReductions} tCO₂e
                            </p>
                          </div>
                          <div>
                            <p className="text-sm text-gray-600">Budget</p>
                            <p className="font-medium">
                              ₹
                              {(
                                project.financials?.totalBudget / 100000
                              ).toFixed(1)}
                              L
                            </p>
                          </div>
                        </div>

                        <div className="flex items-center justify-between">
                          <div className="flex items-center gap-2 text-sm text-gray-600">
                            <Calendar className="h-4 w-4" />
                            <span>
                              {new Date(
                                project.timeline?.startDate,
                              ).toLocaleDateString()}{" "}
                              -{" "}
                              {new Date(
                                project.timeline?.endDate,
                              ).toLocaleDateString()}
                            </span>
                          </div>

                          <div className="flex items-center gap-1">
                            <Button size="sm" variant="outline">
                              <Edit className="h-4 w-4" />
                            </Button>
                            <Button size="sm" variant="outline">
                              <BarChart3 className="h-4 w-4" />
                            </Button>
                            <Button size="sm" variant="outline">
                              <FileText className="h-4 w-4" />
                            </Button>
                          </div>
                        </div>
                      </div>
                    ))
                  ) : (
                    <div className="text-center py-8">
                      <TreePine className="h-12 w-12 text-gray-400 mx-auto mb-4" />
                      <p className="text-gray-600">No projects found</p>
                    </div>
                  )}
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          {/* Measurements Management */}
          <TabsContent value="measurements" className="space-y-6">
            <Card>
              <CardHeader>
                <div className="flex items-center justify-between">
                  <div>
                    <CardTitle className="flex items-center gap-2">
                      <Database className="h-5 w-5" />
                      Measurement Verification
                    </CardTitle>
                    <CardDescription>
                      Review and verify farmer measurements
                    </CardDescription>
                  </div>
                  <div className="flex items-center gap-2">
                    <Select defaultValue="pending">
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
                </div>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  {measurements.map((measurement) => (
                    <div
                      key={measurement._id}
                      className="flex items-center justify-between p-4 border rounded-lg hover:bg-gray-50"
                    >
                      <div className="flex items-center space-x-4">
                        <div
                          className={`w-3 h-3 rounded-full ${
                            measurement.status === "verified"
                              ? "bg-green-500"
                              : measurement.status === "pending"
                                ? "bg-amber-500"
                                : "bg-red-500"
                          }`}
                        ></div>
                        <div>
                          <p className="font-semibold">{measurement.type}</p>
                          <p className="text-sm text-gray-600">
                            {measurement.farmer.name} (
                            {measurement.farmer.farmerId})
                          </p>
                          <p className="text-sm text-gray-600">
                            {new Date(measurement.date).toLocaleDateString()}
                          </p>
                        </div>
                      </div>

                      <div className="flex items-center space-x-4">
                        <div className="text-right">
                          <p className="font-medium text-green-600">
                            {measurement.carbonStored} tCO₂e
                          </p>
                          <Badge
                            variant={
                              measurement.status === "verified"
                                ? "default"
                                : "secondary"
                            }
                          >
                            {measurement.status}
                          </Badge>
                        </div>

                        <div className="flex items-center gap-1">
                          {measurement.status === "pending" && (
                            <>
                              <Button
                                size="sm"
                                className="bg-green-600 hover:bg-green-700"
                              >
                                <CheckCircle className="h-4 w-4" />
                              </Button>
                              <Button size="sm" variant="destructive">
                                <Trash2 className="h-4 w-4" />
                              </Button>
                            </>
                          )}
                          <Button size="sm" variant="outline">
                            <FileText className="h-4 w-4" />
                          </Button>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          {/* Analytics Tab */}
          <TabsContent value="analytics" className="space-y-6">
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <TrendingUp className="h-5 w-5" />
                    Carbon Sequestration Trends
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="h-64 flex items-center justify-center border-2 border-dashed border-gray-300 rounded-lg">
                    <div className="text-center">
                      <BarChart3 className="h-12 w-12 text-gray-400 mx-auto mb-2" />
                      <p className="text-gray-600">
                        Chart visualization would go here
                      </p>
                    </div>
                  </div>
                </CardContent>
              </Card>

              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <MapPin className="h-5 w-5" />
                    Geographic Distribution
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="h-64 flex items-center justify-center border-2 border-dashed border-gray-300 rounded-lg">
                    <div className="text-center">
                      <MapPin className="h-12 w-12 text-gray-400 mx-auto mb-2" />
                      <p className="text-gray-600">
                        Map visualization would go here
                      </p>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </div>
          </TabsContent>

          {/* Reports Tab */}
          <TabsContent value="reports" className="space-y-6">
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <FileText className="h-5 w-5" />
                  System Reports
                </CardTitle>
                <CardDescription>
                  Generate and download system reports
                </CardDescription>
              </CardHeader>
              <CardContent>
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                  <Button variant="outline" className="h-24 flex-col space-y-2">
                    <Users className="h-6 w-6" />
                    <span>Farmer Report</span>
                  </Button>

                  <Button variant="outline" className="h-24 flex-col space-y-2">
                    <TreePine className="h-6 w-6" />
                    <span>Project Report</span>
                  </Button>

                  <Button variant="outline" className="h-24 flex-col space-y-2">
                    <Target className="h-6 w-6" />
                    <span>Carbon Report</span>
                  </Button>

                  <Button variant="outline" className="h-24 flex-col space-y-2">
                    <IndianRupee className="h-6 w-6" />
                    <span>Financial Report</span>
                  </Button>

                  <Button variant="outline" className="h-24 flex-col space-y-2">
                    <Award className="h-6 w-6" />
                    <span>Verification Report</span>
                  </Button>

                  <Button variant="outline" className="h-24 flex-col space-y-2">
                    <Download className="h-6 w-6" />
                    <span>Export All Data</span>
                  </Button>
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          {/* Settings Tab */}
          <TabsContent value="settings" className="space-y-6">
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Settings className="h-5 w-5" />
                  System Settings
                </CardTitle>
                <CardDescription>
                  Configure system parameters and settings
                </CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-6">
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div className="space-y-4">
                      <h4 className="font-semibold">Carbon Credit Settings</h4>
                      <div className="space-y-2">
                        <label className="text-sm font-medium">
                          Carbon Price (₹ per tCO₂e)
                        </label>
                        <Input type="number" defaultValue="15" />
                      </div>
                      <div className="space-y-2">
                        <label className="text-sm font-medium">
                          Verification Threshold
                        </label>
                        <Select defaultValue="80">
                          <SelectTrigger>
                            <SelectValue />
                          </SelectTrigger>
                          <SelectContent>
                            <SelectItem value="70">70%</SelectItem>
                            <SelectItem value="80">80%</SelectItem>
                            <SelectItem value="90">90%</SelectItem>
                          </SelectContent>
                        </Select>
                      </div>
                    </div>

                    <div className="space-y-4">
                      <h4 className="font-semibold">Notification Settings</h4>
                      <div className="space-y-3">
                        <label className="flex items-center space-x-2">
                          <input type="checkbox" defaultChecked />
                          <span className="text-sm">Email notifications</span>
                        </label>
                        <label className="flex items-center space-x-2">
                          <input type="checkbox" defaultChecked />
                          <span className="text-sm">SMS notifications</span>
                        </label>
                        <label className="flex items-center space-x-2">
                          <input type="checkbox" />
                          <span className="text-sm">Push notifications</span>
                        </label>
                      </div>
                    </div>
                  </div>

                  <div className="pt-6 border-t">
                    <Button className="bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-700 hover:to-indigo-700">
                      Save Settings
                    </Button>
                  </div>
                </div>
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>
      </main>
    </div>
  );
}
