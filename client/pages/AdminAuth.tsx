import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Shield, Mail, Lock, AlertCircle } from "lucide-react";
import { useNavigate } from "react-router-dom";

export default function AdminAuth() {
  const navigate = useNavigate();
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState("");

  const [loginForm, setLoginForm] = useState({
    email: "",
    password: "",
  });

  const handleAdminLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    setError("");

    try {
      // Check admin credentials
      const adminEmail = "developerrdeepak@gmail.com";
      const adminPassword = "IITdelhi2023@";

      if (
        loginForm.email === adminEmail &&
        loginForm.password === adminPassword
      ) {
        // Create admin session
        const adminData = {
          email: adminEmail,
          name: "Deepak (Admin)",
          role: "admin",
          loginTime: new Date().toISOString(),
        };

        localStorage.setItem("admin", JSON.stringify(adminData));

        // Redirect to admin dashboard
        navigate("/admin-dashboard");
      } else {
        setError("Invalid email or password. Please check your credentials.");
      }
    } catch (error) {
      console.error("Admin login error:", error);
      setError("Login failed. Please try again.");
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-white to-blue-50 flex items-center justify-center p-4">
      <Card className="w-full max-w-md shadow-xl">
        <CardHeader className="text-center">
          <div className="flex items-center justify-center space-x-2 mb-4">
            <div className="bg-gradient-to-r from-blue-600 via-indigo-600 to-purple-600 p-3 rounded-xl">
              <Shield className="h-8 w-8 text-white" />
            </div>
          </div>
          <CardTitle className="text-3xl font-display bg-gradient-to-r from-blue-600 via-indigo-600 to-purple-600 bg-clip-text text-transparent">
            Admin Portal
          </CardTitle>
          <CardDescription className="text-lg">
            Carbon MRV System Administration
          </CardDescription>
        </CardHeader>

        <CardContent>
          <form onSubmit={handleAdminLogin} className="space-y-6">
            {error && (
              <div className="flex items-center space-x-2 p-3 bg-red-50 border border-red-200 rounded-lg">
                <AlertCircle className="h-4 w-4 text-red-600" />
                <p className="text-sm text-red-700">{error}</p>
              </div>
            )}

            <div className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="email">Admin Email</Label>
                <div className="relative">
                  <Mail className="absolute left-3 top-3 h-4 w-4 text-gray-400" />
                  <Input
                    id="email"
                    type="email"
                    placeholder="Enter admin email"
                    value={loginForm.email}
                    onChange={(e) =>
                      setLoginForm((prev) => ({
                        ...prev,
                        email: e.target.value,
                      }))
                    }
                    className="pl-10"
                    required
                  />
                </div>
              </div>

              <div className="space-y-2">
                <Label htmlFor="password">Password</Label>
                <div className="relative">
                  <Lock className="absolute left-3 top-3 h-4 w-4 text-gray-400" />
                  <Input
                    id="password"
                    type="password"
                    placeholder="Enter admin password"
                    value={loginForm.password}
                    onChange={(e) =>
                      setLoginForm((prev) => ({
                        ...prev,
                        password: e.target.value,
                      }))
                    }
                    className="pl-10"
                    required
                  />
                </div>
              </div>
            </div>

            <Button
              type="submit"
              className="w-full bg-gradient-to-r from-blue-600 via-indigo-600 to-purple-600 hover:from-blue-700 hover:via-indigo-700 hover:to-purple-700 font-semibold text-lg py-6"
              disabled={isLoading}
            >
              {isLoading ? (
                <>
                  <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white mr-2"></div>
                  Signing In...
                </>
              ) : (
                <>
                  <Shield className="h-5 w-5 mr-2" />
                  Sign In to Admin
                </>
              )}
            </Button>
          </form>

          <div className="mt-8 pt-6 border-t border-gray-200">
            <div className="text-center space-y-2">
              <p className="text-sm text-gray-600">Authorized Personnel Only</p>
              <p className="text-xs text-gray-500">
                This portal is for system administrators to manage the Carbon
                MRV platform. Unauthorized access is prohibited.
              </p>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
